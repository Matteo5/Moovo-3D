/* =====================================================================
   Moovo 3D — compte Google et synchronisation des projets (Firebase)
   - l'appli reste « locale d'abord » : les éditeurs lisent et écrivent dans ce navigateur
   - une fois connecté, chaque projet est envoyé dans le compte quelques secondes après
     une modification, et les projets du compte sont récupérés sur chaque appareil
   - sans configuration (firebase-config.js vide), rien ne change : pas de bouton, pas de réseau
   - sécurité : les règles Firestore (firestore.rules) n'autorisent chacun qu'à ses propres données
   ===================================================================== */
(function () {
  'use strict';
  const C = window.MoovoCore, ls = C.ls;
  const cfg = window.MOOVO_FIREBASE || {};
  const fake = window.MOOVO_CLOUD_BACKEND || null;          // faux serveur pour les tests automatiques
  const enabled = !!(fake || cfg.apiKey);
  const SYNC = 'moovo3d-sync', TOMB = 'moovo3d-tomb', ASKED = 'moovo3d-asked-';
  const BG_MAX = 700 * 1024, DATA_MAX = 900 * 1024;           // un document Firestore est limité à 1 Mo
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.5/';

  let B = null, user = null, state = enabled ? 'loading' : 'off', lastSync = 0, err = '', busy = false;
  const subs = new Set();
  const emit = () => subs.forEach(f => { try { f(api.status()); } catch {} });
  const setState = (s, e = '') => { state = s; err = e; emit(); };
  const jget = (k, d) => { try { return JSON.parse(ls.get(k) || '') ?? d; } catch { return d; } };
  const syncMap = () => jget(SYNC, {}), saveSync = m => ls.set(SYNC, JSON.stringify(m));
  const tombs = () => jget(TOMB, []), saveTombs = t => ls.set(TOMB, JSON.stringify(t));
  const editingId = () => /(interieur|exterieur)\.html/.test(location.pathname) ? new URLSearchParams(location.search).get('p') : null;

  // ------------------------------------------------------------------ Firebase
  async function firebaseBackend() {
    const [{ initializeApp }, A, F] = await Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')]);
    const app = initializeApp(cfg), auth = A.getAuth(app), db = F.getFirestore(app);
    A.getRedirectResult(auth).catch(() => {});
    const col = (uid, c) => F.collection(db, 'users', uid, c), ref = (uid, c, id) => F.doc(db, 'users', uid, c, id);
    return {
      onUser: cb => A.onAuthStateChanged(auth, u => cb(u ? { uid: u.uid, name: u.displayName || u.email, email: u.email, photo: u.photoURL } : null)),
      async signIn() {
        const pr = new A.GoogleAuthProvider(); pr.setCustomParameters({ prompt: 'select_account' });
        try { await A.signInWithPopup(auth, pr); }
        catch (e) { if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) await A.signInWithRedirect(auth, pr); else if (e.code !== 'auth/popup-closed-by-user') throw e; }
      },
      signOut: () => A.signOut(auth),
      async list(uid) { const q = await F.getDocs(col(uid, 'projects')); return q.docs.map(d => ({ id: d.id, ...d.data() })); },
      put: (uid, id, rec) => F.setDoc(ref(uid, 'projects', id), rec),
      del: async (uid, id) => { await F.deleteDoc(ref(uid, 'projects', id)); await F.deleteDoc(ref(uid, 'bgs', id)).catch(() => {}); },
      async getBg(uid, id) { const d = await F.getDoc(ref(uid, 'bgs', id)); return d.exists() ? d.data().data : null; },
      putBg: (uid, id, data) => data ? F.setDoc(ref(uid, 'bgs', id), { data, updated: Date.now() }) : F.deleteDoc(ref(uid, 'bgs', id)).catch(() => {}),
      async getCompany(uid) { const d = await F.getDoc(ref(uid, 'meta', 'company')); return d.exists() ? d.data() : null; },
      putCompany: (uid, c) => F.setDoc(ref(uid, 'meta', 'company'), c),
    };
  }

  // ------------------------------------------------------------------ images de fond : compressées pour tenir dans un document
  function shrinkBg(dataUrl) {
    return new Promise(res => {
      if (!dataUrl || dataUrl.length <= BG_MAX) return res(dataUrl);
      const im = new Image();
      im.onload = () => {
        let w = im.width, h = im.height, q = .75, out = dataUrl;
        for (let i = 0; i < 6 && out.length > BG_MAX; i++) { const k = i ? .8 : Math.min(1, 1600 / Math.max(w, h)); w = Math.round(w * k); h = Math.round(h * k); const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0, w, h); out = c.toDataURL('image/jpeg', q); q = Math.max(.5, q - .05); }
        res(out.length <= BG_MAX ? out : null);
      };
      im.onerror = () => res(null); im.src = dataUrl;
    });
  }

  // ------------------------------------------------------------------ synchronisation
  async function upload(id) {
    if (!user) return;
    const p = C.listAll().find(x => x.id === id); if (!p || p.owner !== user.uid) return;
    const data = ls.get(C.PFX + id) || '', bg0 = ls.get('moovo-bg-' + id), m0 = syncMap();
    if (m0[id] === p.updated && (m0['bg:' + id] ?? '') === (bg0 ? bg0.length + ':' + bg0.slice(-32) : '')) return;   // déjà à jour dans le compte
    if (data.length > DATA_MAX) { err = `« ${p.name} » est trop volumineux pour le cloud (${Math.round(data.length / 1024)} Ko) : il reste sur cet appareil.`; emit(); return; }
    await B.put(user.uid, id, { name: p.name, type: p.type, template: p.template || null, created: p.created, updated: p.updated, data, v: 1 });
    const bg = ls.get('moovo-bg-' + id), m = syncMap(), prevBg = m['bg:' + id];
    const sig = bg ? bg.length + ':' + bg.slice(-32) : '';
    if (sig !== (prevBg ?? '')) { await B.putBg(user.uid, id, bg ? await shrinkBg(bg) : null); m['bg:' + id] = sig; }
    m[id] = p.updated; saveSync(m);
  }
  async function download(r) {
    C.create({ id: r.id, name: r.name, type: r.type, template: r.template, data: r.data || null, owner: user.uid, created: r.created, updated: r.updated });
    const bg = await B.getBg(user.uid, r.id).catch(() => null);
    if (bg) { ls.set('moovo-bg-' + r.id, bg); const m = syncMap(); m['bg:' + r.id] = bg.length + ':' + bg.slice(-32); saveSync(m); }
    const m = syncMap(); m[r.id] = r.updated; saveSync(m);
  }
  async function syncAll() {
    if (!user || busy) return; busy = true; setState('syncing');
    try {
      for (const id of tombs()) { await B.del(user.uid, id).catch(() => {}); }
      saveTombs([]);
      const remote = await B.list(user.uid), R = new Map(remote.map(r => [r.id, r])), m = syncMap(), open = editingId();
      for (const p of C.listAll().filter(x => x.owner === user.uid)) {
        const r = R.get(p.id), last = m[p.id] || 0;
        if (!r) { if (last) { if (p.id !== open) C.remove(p.id, true); delete m[p.id]; saveSync(m); } else await upload(p.id); continue; }
        if (r.updated === p.updated) continue;
        const both = r.updated > last && p.updated > last;
        if (both) {   // modifié des deux côtés depuis la dernière synchro : on garde les deux versions
          const copy = C.create({ name: p.name + ' (copie de cet appareil)', type: p.type, template: p.template, data: ls.get(C.PFX + p.id), owner: user.uid });
          if (p.id === open) { api.onRemoteNewer?.(r); continue; }
          await download(r); await upload(copy.id);
        } else if (r.updated > p.updated) { if (p.id === open) { api.onRemoteNewer?.(r); continue; } await download(r); }
        else await upload(p.id);
      }
      const local = new Set(C.listAll().map(x => x.id));
      for (const r of remote) if (!local.has(r.id)) await download(r);
      await syncCompany();
      lastSync = Date.now(); setState('ok');
    } catch (e) { setState(navigator.onLine === false ? 'offline' : 'error', e.message || String(e)); }
    finally { busy = false; }
  }
  async function syncCompany() {
    const local = C.company(), remote = await B.getCompany(user.uid).catch(() => null);
    if (remote && (remote.updated || 0) > (local.updated || 0)) C.saveCompany(remote, true);
    else if ((local.updated || 0) > (remote?.updated || 0) && (local.name || local.siret)) await B.putCompany(user.uid, local);
  }
  // envoi automatique quelques secondes après chaque enregistrement
  const timers = new Map();
  window.addEventListener('moovo:saved', e => {
    if (!user) return; const id = e.detail.id; clearTimeout(timers.get(id));
    timers.set(id, setTimeout(async () => { timers.delete(id); try { setState('syncing'); await upload(id); lastSync = Date.now(); setState('ok'); } catch (er) { setState(navigator.onLine === false ? 'offline' : 'error', er.message); } }, 2500));
  });
  window.addEventListener('moovo:removed', async e => {
    if (!user || e.detail.owner !== user.uid) return;
    try { await B.del(user.uid, e.detail.id); } catch { saveTombs([...tombs(), e.detail.id]); }
    const m = syncMap(); delete m[e.detail.id]; delete m['bg:' + e.detail.id]; saveSync(m);
  });
  window.addEventListener('moovo:company', () => { if (user) B.putCompany(user.uid, C.company()).catch(() => {}); });
  window.addEventListener('online', () => { if (user) syncAll(); });
  document.addEventListener('visibilitychange', () => { if (user && document.visibilityState === 'visible' && Date.now() - lastSync > 60000) syncAll(); });
  // le plan de fond est enregistré à part : on le surveille via l'événement de sauvegarde du projet (même identifiant)

  // ------------------------------------------------------------------ connexion / déconnexion
  async function onUser(u) {
    const prev = C.currentUser();
    user = u; C.setUser(u ? u.uid : null);
    if (!u) { setState('signedout'); if (prev) api.onChange?.(); return; }
    // projets créés sur cet appareil sans compte : proposer de les ranger dans le compte (une seule fois)
    const orphans = C.listAll().filter(p => !p.owner);
    if (orphans.length && !ls.get(ASKED + u.uid)) {
      ls.set(ASKED + u.uid, '1');
      if (await (api.confirmImport ?? (n => Promise.resolve(confirm(n))))(orphans.length)) for (const p of orphans) C.touch(p.id, { owner: u.uid }, true);
    }
    await syncAll();
    if (prev !== u.uid) api.onChange?.();
  }
  async function signOut(removeLocal) {
    const uid = user?.uid; await B.signOut();
    if (removeLocal && uid) { for (const p of C.listAll().filter(x => x.owner === uid)) C.remove(p.id, true); ls.del(SYNC); }
  }

  const api = {
    enabled, user: () => user,
    status: () => ({ state, user, lastSync, err }),
    subscribe(f) { subs.add(f); f(api.status()); return () => subs.delete(f); },
    signIn: () => B?.signIn().catch(e => setState('error', e.code === 'auth/unauthorized-domain' ? 'Ce site n’est pas encore autorisé dans Firebase (Authentication → Paramètres → Domaines autorisés).' : e.message)),
    signOut, syncNow: () => syncAll(),
    onChange: null, onRemoteNewer: null, confirmImport: null,
    async acceptRemote(r) { await download(r); },
  };
  window.MoovoCloud = api;

  // Dans les éditeurs : petit indicateur à côté du nom du projet, et version plus récente venue d'un autre appareil
  if (enabled && editingId()) {
    api.onRemoteNewer = r => {
      if (confirm(`« ${r.name} » a été modifié depuis un autre appareil (${new Date(r.updated).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}).\n\nCharger cette version plus récente ? (Sinon, la version de cet appareil la remplacera dans ton compte à la prochaine modification.)`))
        api.acceptRemote(r).then(() => location.reload());
    };
    const mount = () => {
      const pn = document.getElementById('projName'); if (!pn) return;
      const b = document.createElement('span'); b.id = 'cloudDot'; b.style.cssText = 'font-size:13px;color:#697386;white-space:nowrap;cursor:default'; pn.after(b);
      api.subscribe(st => {
        b.hidden = !st.user;
        const t = { syncing: ['⟳', 'Synchronisation avec ton compte…'], ok: ['☁', 'Enregistré dans ton compte'], offline: ['⚡', 'Hors ligne : enregistré sur cet appareil, synchro au retour du réseau'], error: ['⚠', 'Synchro impossible : ' + (st.err || '')] }[st.state] ?? ['☁', ''];
        b.textContent = t[0]; b.title = t[1]; b.style.color = st.state === 'error' ? '#b42318' : '#697386';
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  }

  if (enabled) (async () => {
    try { B = fake || await firebaseBackend(); B.onUser(u => { onUser(u); }); }
    catch (e) { setState('error', 'Impossible de joindre le service de connexion : ' + (e.message || e)); }
  })();
})();

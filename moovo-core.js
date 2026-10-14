/* =====================================================================
   Moovo 3D — noyau partagé (script classique, fonctionne aussi en file://)
   - stockage multi-projets (localStorage)
   - profil de l'entreprise (artisan) et numérotation des devis
   - fenêtre de devis éditable + document imprimable (PDF via le navigateur)
   - partage d'un projet par lien (compressé dans l'adresse)
   ===================================================================== */
(function () {
  'use strict';
  const IDX = 'moovo3d-index', PFX = 'moovo3d-p-', BPFX = 'moovo3d-b-', COMPANY = 'moovo3d-company', SEQ = 'moovo3d-devis-seq';
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const eur = v => (Number(v) || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const num = (v, d = 2) => (Number(v) || 0).toLocaleString('fr-FR', { maximumFractionDigits: d });

  // ------------------------------------------------------------------ projets
  const list = () => { try { return JSON.parse(ls.get(IDX) || '[]'); } catch { return []; } };
  const saveList = l => ls.set(IDX, JSON.stringify(l));
  const get = id => list().find(p => p.id === id) || null;
  function create({ name, type, template, data }) {
    const p = { id: uid(), name: name || 'Nouveau projet', type, template: template || null, created: Date.now(), updated: Date.now() };
    const l = list(); l.unshift(p); saveList(l);
    if (data) ls.set(PFX + p.id, typeof data === 'string' ? data : JSON.stringify(data));
    return p;
  }
  function touch(id, patch) { const l = list(), p = l.find(x => x.id === id); if (p) { Object.assign(p, patch || {}, { updated: Date.now() }); saveList(l); } }
  function load(id) { const raw = ls.get(PFX + id); if (!raw) return null; try { return JSON.parse(raw); } catch { return null; } }
  // le plan de fond (image) est gardé à part : on le supprime / copie avec le projet
  function remove(id) { saveList(list().filter(p => p.id !== id)); ls.del(PFX + id); ls.del(BPFX + id); ls.del('moovo-bg-' + id); }
  function duplicate(id) {
    const p = get(id); if (!p) return null;
    const raw = ls.get(PFX + id), n = create({ name: p.name + ' (copie)', type: p.type, template: p.template });
    if (raw) { try { const o = JSON.parse(raw); o.name = n.name; ls.set(PFX + n.id, JSON.stringify(o)); } catch { ls.set(PFX + n.id, raw); } }
    const bg = ls.get('moovo-bg-' + id); if (bg) ls.set('moovo-bg-' + n.id, bg);
    return n;
  }
  // Ancienne version (un seul appartement) : reprise automatique, sans effacer l'original
  function migrateLegacy() {
    if (ls.get('moovo3d-legacy-done')) return;
    const raw = ls.get('appart-atelier-v1');
    if (raw) { try { const d = JSON.parse(raw); create({ name: d.name || 'Mon appartement', type: 'interior', template: 't4', data: raw }); } catch {} }
    ls.set('moovo3d-legacy-done', '1');
  }
  const typeOf = data => data && Array.isArray(data.walls) ? 'interior' : data && Array.isArray(data.members) ? 'exterior' : null;

  // ---------------------------------------------------------- profil artisan
  const companyDefault = {
    name: '', legal: 'Entreprise individuelle', address: '', zip: '', city: '', phone: '', email: '', siret: '', tva: '', rcs: '',
    insurer: '', policy: '', zone: 'France métropolitaine', iban: '',
    validity: 30, deposit: 30, payment: 'Acompte à la signature, solde à réception des travaux, par virement.', delay: 'À convenir ensemble à la signature.',
    hourly: 45, logo: '',
  };
  const company = () => { try { return Object.assign({}, companyDefault, JSON.parse(ls.get(COMPANY) || '{}')); } catch { return { ...companyDefault }; } };
  const saveCompany = c => ls.set(COMPANY, JSON.stringify(c));
  function nextDevisNumber(peek) {
    const y = new Date().getFullYear(); let s = {}; try { s = JSON.parse(ls.get(SEQ) || '{}'); } catch {}
    const n = (s[y] || 0) + 1; if (!peek) { s[y] = n; ls.set(SEQ, JSON.stringify(s)); }
    return `DEV-${y}-${String(n).padStart(3, '0')}`;
  }

  // -------------------------------------------------------- partage par lien
  async function encodeShare(obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    const buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
    let bin = ''; const u8 = new Uint8Array(buf); for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  async function decodeShare(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
    const u8 = Uint8Array.from(atob(s), c => c.charCodeAt(0));
    return JSON.parse(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  }
  async function shareLink(data) {
    const code = await encodeShare(data);
    return new URL('index.html', location.href).href.split('#')[0] + '#partage=' + code;
  }
  async function copyText(t) { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } }

  // ---------------------------------------------------------------- devis
  const CSS = `
  .mv-ov{position:fixed;inset:0;background:#0f172a73;z-index:500;display:flex;justify-content:center;align-items:flex-start;padding:3vh 14px;overflow:auto;font:14px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1b1f27}
  .mv-box{background:#fff;border-radius:14px;box-shadow:0 18px 50px #0f172a40;width:min(1100px,100%);display:flex;flex-direction:column}
  .mv-head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #e1e5eb;position:sticky;top:0;background:#fff;border-radius:14px 14px 0 0;z-index:2}
  .mv-head b{font-size:16px;flex:1}
  .mv-body{display:grid;grid-template-columns:330px 1fr;gap:0;min-height:60vh}
  .mv-side{border-right:1px solid #e1e5eb;padding:12px 14px;background:#f7f8fa;overflow:auto;max-height:78vh}
  .mv-main{padding:12px 16px;overflow:auto;max-height:78vh}
  .mv-ov h5{margin:12px 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#697386}
  .mv-ov h5:first-child{margin-top:0}
  .mv-ov label{display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:#697386;margin-bottom:6px}
  .mv-ov input,.mv-ov select,.mv-ov textarea{font:inherit;font-size:13px;color:#1b1f27;border:1px solid #dfe3e9;border-radius:7px;padding:5px 7px;background:#fff;width:100%}
  .mv-ov textarea{min-height:52px;resize:vertical}
  .mv-two{display:grid;grid-template-columns:1fr 1fr;gap:0 8px}
  .mv-ov button{font:inherit;font-size:13px;border:1px solid #dfe3e9;background:#fff;border-radius:8px;padding:6px 11px;cursor:pointer}
  .mv-ov button:hover{border-color:#b9c1cc}
  .mv-ov button.pri{background:linear-gradient(135deg,#2563eb,#6d4fd8);border-color:#3f55e2;color:#fff;font-weight:600}
  .mv-ov table{width:100%;border-collapse:collapse;font-size:13px}
  .mv-ov th{font-weight:500;color:#697386;font-size:11.5px;text-align:left;padding:5px 4px;border-bottom:1px solid #e1e5eb}
  .mv-ov td{padding:3px 4px;border-bottom:1px solid #eef0f3;vertical-align:middle}
  .mv-ov td input{border-color:transparent;background:transparent;padding:4px 5px}
  .mv-ov td input:hover,.mv-ov td input:focus{border-color:#dfe3e9;background:#fff}
  .mv-ov td.n,.mv-ov th.n{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
  .mv-ov tr.sec td{background:#f1f4f9;font-weight:600;font-size:12px;color:#334155}
  .mv-tot{margin-left:auto;width:320px;margin-top:12px;font-size:13.5px}
  .mv-tot div{display:flex;justify-content:space-between;padding:3px 0}
  .mv-tot .big{font-size:17px;font-weight:700;border-top:1px solid #e1e5eb;margin-top:4px;padding-top:6px}
  .mv-warn{background:#fff6e5;border:1px solid #f3d9a4;color:#9a5b00;border-radius:8px;padding:7px 9px;font-size:12px;margin:8px 0}
  .mv-x{border:0!important;background:transparent!important;color:#b42318;padding:2px 6px!important}
  @media (max-width:820px){.mv-body{grid-template-columns:1fr}.mv-side{max-height:none;border-right:0;border-bottom:1px solid #e1e5eb}.mv-main{max-height:none}}
  @media (max-width:600px){.mv-ov{padding:0}.mv-box{border-radius:0;min-height:100%}.mv-head{flex-wrap:wrap;border-radius:0;padding:10px 12px}.mv-head b{flex-basis:100%;font-size:15px}.mv-ov button{padding:9px 12px}.mv-tot{width:100%}.mv-main{padding:10px;overflow-x:auto}.mv-ov input,.mv-ov select,.mv-ov textarea{font-size:16px}.mv-two{grid-template-columns:1fr}}`;
  function ensureCss() { if (!document.getElementById('mv-css')) { const s = document.createElement('style'); s.id = 'mv-css'; s.textContent = CSS; document.head.appendChild(s); } }

  const TVA_RATES = [[20, '20 % — construction neuve, extension, abri, carport…'], [10, '10 % — rénovation d’un logement de plus de 2 ans'], [5.5, '5,5 % — rénovation énergétique'], [0, '0 % — TVA non applicable (art. 293 B du CGI)']];

  /**
   * Ouvre l'éditeur de devis.
   * opts = { projectName, objet, kind, lines:[{section,designation,qty,unit,pu}], state (devis enregistré du projet),
   *          onSave(state), images:[{title,src}], annexHtml, defaultTva }
   */
  function devisDialog(opts) {
    ensureCss();
    const co = company();
    const st = Object.assign({ client: { name: '', address: '', site: '', email: '', phone: '' }, tva: opts.defaultTva ?? 20, discount: 0, margin: 0, extra: [], overrides: {}, number: '', date: new Date().toISOString().slice(0, 10), objet: opts.objet || '', notes: '' }, JSON.parse(JSON.stringify(opts.state || {})));
    const ov = document.createElement('div'); ov.className = 'mv-ov';
    ov.innerHTML = `<div class="mv-box"><div class="mv-head"><b>Devis — ${esc(opts.projectName || '')}</b>
      <button data-a="csv">Exporter CSV</button><button data-a="print" class="pri">🖨 Imprimer / PDF</button><button data-a="close">Fermer</button></div>
      <div class="mv-body"><div class="mv-side"></div><div class="mv-main"></div></div></div>`;
    document.body.appendChild(ov);
    const side = ov.querySelector('.mv-side'), main = ov.querySelector('.mv-main');
    const allLines = () => {
      const base = opts.lines.map((l, i) => { const key = 'L' + i + ':' + l.designation; const o = st.overrides[key] || {}; return { ...l, key, qty: o.qty ?? l.qty, pu: o.pu ?? l.pu, off: !!o.off, designation: o.designation ?? l.designation }; });
      return base.concat(st.extra.map((l, i) => ({ ...l, key: 'X' + i, extra: true })));
    };
    const coef = l => (l.section === 'Fournitures' ? 1 + (Number(st.margin) || 0) / 100 : 1);
    const totals = () => {
      const ls_ = allLines().filter(l => !l.off);
      const ht = ls_.reduce((a, l) => a + (Number(l.qty) || 0) * (Number(l.pu) || 0) * coef(l), 0);
      const disc = ht * (Number(st.discount) || 0) / 100, net = ht - disc, tva = net * (Number(st.tva) || 0) / 100;
      return { ht, disc, net, tva, ttc: net + tva, dep: (net + tva) * (Number(co.deposit) || 0) / 100 };
    };
    const field = (lbl, path, val, type = 'text') => `<label>${lbl}<input data-p="${path}" type="${type}" value="${esc(val)}"></label>`;
    function renderSide() {
      side.innerHTML = `
        <h5>Client</h5>
        ${field('Nom / société', 'client.name', st.client.name)}
        ${field('Adresse', 'client.address', st.client.address)}
        ${field('Adresse du chantier (si différente)', 'client.site', st.client.site)}
        <div class="mv-two">${field('Téléphone', 'client.phone', st.client.phone)}${field('E-mail', 'client.email', st.client.email)}</div>
        <h5>Devis</h5>
        <div class="mv-two">${field('Numéro', 'number', st.number || nextDevisNumber(true))}${field('Date', 'date', st.date, 'date')}</div>
        ${field('Objet', 'objet', st.objet)}
        <label>TVA<select data-p="tva">${TVA_RATES.map(([v, l]) => `<option value="${v}"${Number(st.tva) === v ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
        <div class="mv-two">${field('Marge sur fournitures (%)', 'margin', st.margin, 'number')}${field('Remise globale (%)', 'discount', st.discount, 'number')}</div>
        <label>Remarques (apparaissent sur le devis)<textarea data-p="notes">${esc(st.notes)}</textarea></label>
        <h5>Mon entreprise <span style="text-transform:none;letter-spacing:0">(enregistrée pour tous les devis)</span></h5>
        ${field('Nom commercial', 'co.name', co.name)}
        ${field('Forme juridique', 'co.legal', co.legal)}
        ${field('Adresse', 'co.address', co.address)}
        <div class="mv-two">${field('Code postal', 'co.zip', co.zip)}${field('Ville', 'co.city', co.city)}</div>
        <div class="mv-two">${field('Téléphone', 'co.phone', co.phone)}${field('E-mail', 'co.email', co.email)}</div>
        <div class="mv-two">${field('SIRET', 'co.siret', co.siret)}${field('N° TVA intracom.', 'co.tva', co.tva)}</div>
        ${field('Assureur décennale / RC pro', 'co.insurer', co.insurer)}
        <div class="mv-two">${field('N° de police', 'co.policy', co.policy)}${field('Couverture géographique', 'co.zone', co.zone)}</div>
        <div class="mv-two">${field('Validité du devis (jours)', 'co.validity', co.validity, 'number')}${field('Acompte (%)', 'co.deposit', co.deposit, 'number')}</div>
        ${field('Taux horaire main d’œuvre (€ HT)', 'co.hourly', co.hourly, 'number')}
        <label>Conditions de paiement<textarea data-p="co.payment">${esc(co.payment)}</textarea></label>
        <label>Délai d’exécution<input data-p="co.delay" value="${esc(co.delay)}"></label>
        ${field('IBAN (facultatif)', 'co.iban', co.iban)}`;
    }
    function renderMain() {
      const L = allLines(), t = totals(), sections = [...new Set(L.map(l => l.section || 'Divers'))];
      const missing = [!co.name && 'nom de l’entreprise', !co.siret && 'SIRET', !co.insurer && 'assurance décennale', !st.client.name && 'nom du client'].filter(Boolean);
      main.innerHTML = `${missing.length ? `<div class="mv-warn">À compléter avant d’envoyer : ${missing.join(', ')}.</div>` : ''}
        <table><thead><tr><th style="width:26px"></th><th>Désignation</th><th class="n" style="width:80px">Qté</th><th style="width:60px">Unité</th><th class="n" style="width:100px">PU HT</th><th class="n" style="width:110px">Total HT</th><th style="width:28px"></th></tr></thead><tbody>
        ${sections.map(sec => `<tr class="sec"><td colspan="7">${esc(sec)}</td></tr>` + L.filter(l => (l.section || 'Divers') === sec).map(l => `<tr style="${l.off ? 'opacity:.4' : ''}">
          <td>${l.extra ? '' : `<input type="checkbox" data-off="${esc(l.key)}" ${l.off ? '' : 'checked'} title="Inclure cette ligne">`}</td>
          <td><input data-l="${esc(l.key)}" data-f="designation" value="${esc(l.designation)}"></td>
          <td class="n"><input data-l="${esc(l.key)}" data-f="qty" type="number" step="any" value="${+(+l.qty).toFixed(3)}" style="text-align:right"></td>
          <td>${l.extra ? `<input data-l="${esc(l.key)}" data-f="unit" value="${esc(l.unit)}">` : esc(l.unit)}</td>
          <td class="n"><input data-l="${esc(l.key)}" data-f="pu" type="number" step="any" value="${+(+l.pu * coef(l)).toFixed(2)}" style="text-align:right"></td>
          <td class="n">${eur((+l.qty || 0) * (+l.pu || 0) * coef(l))}</td>
          <td>${l.extra ? `<button class="mv-x" data-del="${esc(l.key)}" title="Supprimer">✕</button>` : ''}</td></tr>`).join('')).join('')}
        </tbody></table>
        <div style="margin-top:8px"><button data-a="add">＋ Ajouter une ligne libre</button> <button data-a="addMo">＋ Ligne de main d’œuvre (taux horaire)</button></div>
        <div class="mv-tot"><div><span>Total HT</span><b>${eur(t.ht)}</b></div>
          ${t.disc ? `<div><span>Remise ${num(st.discount)} %</span><span>− ${eur(t.disc)}</span></div><div><span>Net HT</span><b>${eur(t.net)}</b></div>` : ''}
          <div><span>TVA ${num(st.tva, 1)} %</span><span>${eur(t.tva)}</span></div>
          <div class="big"><span>Total TTC</span><span>${eur(t.ttc)}</span></div>
          ${co.deposit ? `<div><span>Acompte ${num(co.deposit)} % à la commande</span><span>${eur(t.dep)}</span></div>` : ''}</div>
        <p style="font-size:12px;color:#697386">Les quantités viennent de ton plan. Tu peux corriger chaque désignation, quantité et prix : tes corrections sont gardées dans le projet. Le prix des fournitures inclut la marge indiquée à gauche.</p>`;
    }
    const persist = () => { try { opts.onSave && opts.onSave(JSON.parse(JSON.stringify(st))); } catch {} };
    ov.addEventListener('change', e => {
      const t = e.target;
      if (t.dataset.p) {
        const [a, b] = t.dataset.p.split('.'), v = t.type === 'number' ? Number(t.value) : t.value;
        if (a === 'co') { co[b] = v; saveCompany(co); } else if (b) st[a][b] = v; else st[a] = v;
      } else if (t.dataset.off) { const o = (st.overrides[t.dataset.off] ??= {}); o.off = !t.checked; }
      else if (t.dataset.l) {
        const key = t.dataset.l, f = t.dataset.f, line = allLines().find(l => l.key === key);
        let v = t.type === 'number' ? Number(t.value) : t.value;
        if (f === 'pu' && line) v = v / coef(line);           // on stocke le prix hors marge
        if (key.startsWith('X')) st.extra[+key.slice(1)][f] = v; else (st.overrides[key] ??= {})[f] = v;
      }
      persist(); renderMain();
    });
    ov.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.del) { st.extra.splice(+b.dataset.del.slice(1), 1); persist(); return renderMain(); }
      const a = b.dataset.a;
      if (a === 'close') { persist(); ov.remove(); }
      if (a === 'add') { st.extra.push({ section: 'Divers', designation: 'Nouvelle ligne', qty: 1, unit: 'u', pu: 0 }); persist(); renderMain(); }
      if (a === 'addMo') { st.extra.push({ section: 'Main d’œuvre', designation: 'Main d’œuvre', qty: 8, unit: 'h', pu: Number(co.hourly) || 45 }); persist(); renderMain(); }
      if (a === 'csv') {
        const rows = [['Section', 'Désignation', 'Quantité', 'Unité', 'PU HT', 'Total HT']].concat(allLines().filter(l => !l.off).map(l => [l.section, l.designation, num(l.qty, 3), l.unit, num(l.pu * coef(l)), num(l.qty * l.pu * coef(l))]));
        const csv = '﻿' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
        const a2 = document.createElement('a'); a2.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a2.download = (st.number || 'devis') + '.csv'; a2.click();
      }
      if (a === 'print') { if (!st.number) { st.number = nextDevisNumber(false); } persist(); printDevis(st, co, allLines().filter(l => !l.off), totals(), coef, opts); renderSide(); }
    });
    renderSide(); renderMain();
    return ov;
  }

  function printDevis(st, co, lines, t, coef, opts) {
    const d = new Date(st.date || Date.now()), valid = new Date(d.getTime() + (Number(co.validity) || 30) * 864e5);
    const fd = x => x.toLocaleDateString('fr-FR');
    const sections = [...new Set(lines.map(l => l.section || 'Divers'))];
    const rows = sections.map(sec => {
      const ls_ = lines.filter(l => (l.section || 'Divers') === sec), sub = ls_.reduce((a, l) => a + l.qty * l.pu * coef(l), 0);
      return `<tr class="sec"><td colspan="5">${esc(sec)}</td></tr>` + ls_.map(l => `<tr><td>${esc(l.designation)}</td><td class="n">${num(l.qty, 3)}</td><td>${esc(l.unit)}</td><td class="n">${eur(l.pu * coef(l))}</td><td class="n">${eur(l.qty * l.pu * coef(l))}</td></tr>`).join('')
        + `<tr class="sub"><td colspan="4">Sous-total ${esc(sec.toLowerCase())}</td><td class="n">${eur(sub)}</td></tr>`;
    }).join('');
    const imgs = (opts.images || []).filter(i => i && i.src).map(i => `<figure><img src="${i.src}"><figcaption>${esc(i.title)}</figcaption></figure>`).join('');
    const tvaNote = Number(st.tva) === 0 ? 'TVA non applicable, art. 293 B du CGI.' : Number(st.tva) === 10 || Number(st.tva) === 5.5 ? `Taux de TVA réduit (${num(st.tva, 1)} %) : le client atteste que le logement est achevé depuis plus de 2 ans (attestation à joindre).` : '';
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(st.number)} — ${esc(st.client.name || opts.projectName)}</title><style>
      @page{size:A4;margin:14mm 13mm}
      *{box-sizing:border-box} body{font:11px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1b1f27;margin:0}
      .top{display:flex;justify-content:space-between;gap:24px;margin-bottom:18px}
      .co b{font-size:16px} .co div,.cl div{color:#3b4250}
      .doc{text-align:right} .doc h1{margin:0 0 4px;font-size:22px;letter-spacing:.04em} .doc div{color:#3b4250}
      .cl{border:1px solid #d9dee6;border-radius:8px;padding:10px 12px;min-width:250px;margin-left:auto;margin-top:8px}
      .obj{margin:6px 0 12px;font-size:12px} table{width:100%;border-collapse:collapse}
      th{background:#1b1f27;color:#fff;font-weight:600;text-align:left;padding:6px 7px;font-size:10.5px}
      td{padding:5px 7px;border-bottom:1px solid #e7eaef} td.n,th.n{text-align:right;white-space:nowrap}
      tr.sec td{background:#eef2f7;font-weight:700;border-bottom:0;padding-top:7px} tr.sub td{font-style:italic;color:#5b6474;text-align:right;border-bottom:1px solid #c9d0da}
      .tot{width:300px;margin:12px 0 0 auto} .tot div{display:flex;justify-content:space-between;padding:3px 0} .tot .big{font-size:15px;font-weight:800;border-top:2px solid #1b1f27;margin-top:4px;padding-top:6px}
      .cond{margin-top:16px;display:grid;grid-template-columns:1.3fr 1fr;gap:18px} .cond h3{font-size:11px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.05em;color:#5b6474}
      .sign{border:1px solid #c9d0da;border-radius:8px;height:110px;padding:8px;color:#5b6474}
      .legal{margin-top:14px;font-size:9.5px;color:#5b6474;border-top:1px solid #e1e5eb;padding-top:8px}
      .annex{page-break-before:always} .annex h2{font-size:15px} figure{margin:0 0 14px;break-inside:avoid} figure img{max-width:100%;max-height:120mm;border:1px solid #e1e5eb;border-radius:6px} figcaption{font-size:10px;color:#5b6474}
      .noprint{position:fixed;top:10px;right:10px} @media print{.noprint{display:none}}
      .noprint button{font:600 13px system-ui;background:#2563eb;color:#fff;border:0;border-radius:8px;padding:9px 14px;cursor:pointer}
    </style></head><body>
      <div class="noprint"><button onclick="print()">Imprimer / Enregistrer en PDF</button></div>
      <div class="top"><div class="co"><b>${esc(co.name || 'Votre entreprise')}</b><div>${esc(co.legal)}</div><div>${esc(co.address)}</div><div>${esc([co.zip, co.city].filter(Boolean).join(' '))}</div><div>${esc([co.phone, co.email].filter(Boolean).join(' · '))}</div>${co.siret ? `<div>SIRET ${esc(co.siret)}</div>` : ''}${co.tva ? `<div>TVA ${esc(co.tva)}</div>` : ''}</div>
        <div class="doc"><h1>DEVIS</h1><div>N° <b>${esc(st.number)}</b></div><div>Date : ${fd(d)}</div><div>Valable jusqu’au : ${fd(valid)}</div>
          <div class="cl" style="text-align:left"><b>${esc(st.client.name || 'Client')}</b><div>${esc(st.client.address)}</div>${st.client.site ? `<div>Chantier : ${esc(st.client.site)}</div>` : ''}<div>${esc([st.client.phone, st.client.email].filter(Boolean).join(' · '))}</div></div></div></div>
      <div class="obj"><b>Objet :</b> ${esc(st.objet || opts.projectName)}</div>
      <table><thead><tr><th>Désignation</th><th class="n">Qté</th><th>Unité</th><th class="n">PU HT</th><th class="n">Total HT</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="tot"><div><span>Total HT</span><b>${eur(t.ht)}</b></div>${t.disc ? `<div><span>Remise ${num(st.discount)} %</span><span>− ${eur(t.disc)}</span></div><div><span>Net HT</span><b>${eur(t.net)}</b></div>` : ''}
        <div><span>TVA ${num(st.tva, 1)} %</span><span>${eur(t.tva)}</span></div><div class="big"><span>Total TTC</span><span>${eur(t.ttc)}</span></div>
        ${co.deposit ? `<div><span>Acompte à la commande (${num(co.deposit)} %)</span><span>${eur(t.dep)}</span></div>` : ''}</div>
      ${st.notes ? `<p><b>Remarques :</b> ${esc(st.notes).replace(/\n/g, '<br>')}</p>` : ''}
      <div class="cond"><div><h3>Conditions</h3><div>Délai d’exécution : ${esc(co.delay)}</div><div>Paiement : ${esc(co.payment)}</div>${co.iban ? `<div>IBAN : ${esc(co.iban)}</div>` : ''}<div>Devis valable ${esc(co.validity)} jours. ${esc(tvaNote)}</div></div>
        <div><h3>Bon pour accord</h3><div class="sign">Date, signature et mention « Devis reçu avant l’exécution des travaux, bon pour accord ».</div></div></div>
      <div class="legal">${co.insurer ? `Assurance décennale / RC professionnelle : ${esc(co.insurer)}${co.policy ? `, police n° ${esc(co.policy)}` : ''}, couverture : ${esc(co.zone)}. ` : 'Assurance décennale : à renseigner (mention obligatoire pour les travaux de bâtiment). '}
        En cas de retard de paiement, pénalités au taux légal et indemnité forfaitaire de 40 € pour frais de recouvrement (professionnels). Devis établi à partir d’une conception réalisée avec Moovo 3D ; les quantités sont à confirmer lors de la visite technique.</div>
      ${imgs || opts.annexHtml ? `<div class="annex"><h2>Annexe — visuels et métré du projet</h2>${imgs}${opts.annexHtml || ''}</div>` : ''}
    </body></html>`;
    const w = window.open('', '_blank');
    if (!w) { alert('Autorise l’ouverture des fenêtres pour imprimer le devis.'); return; }
    w.document.open(); w.document.write(html); w.document.close();
  }

  window.MoovoCore = { ls, uid, esc, eur, num, list, get, create, touch, load, remove, duplicate, migrateLegacy, typeOf, PFX, BPFX,
    company, saveCompany, nextDevisNumber, encodeShare, decodeShare, shareLink, copyText, devisDialog };
})();

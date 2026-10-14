// Moovo 3D — bibliothèque commune : nuanciers, matières, revêtements, ambiances, astuces et glossaire
// Les teintes RAL sont des équivalents écran approximatifs : toujours valider sur un échantillon réel.
(function () {
  'use strict';

  // ------------------------------------------------------------------
  //  Nuanciers : [hex, nom, référence]
  // ------------------------------------------------------------------
  const PALETTES = {
    blancs: { label: 'Blancs & crèmes', tip: 'Un blanc chaud (crème, ivoire) adoucit une pièce exposée au nord ; un blanc pur ou légèrement gris rafraîchit une pièce très ensoleillée.', colors: [
      ['#f4f4ef', 'Blanc pur', 'RAL 9010'], ['#f1f0ea', 'Blanc signalisation', 'RAL 9016'], ['#ecece7', 'Blanc de sécurité', 'RAL 9003'],
      ['#e9e0d2', 'Blanc crème', 'RAL 9001'], ['#d7d5cb', 'Blanc gris', 'RAL 9002'], ['#e3d9c6', 'Blanc perlé', 'RAL 1013'],
      ['#f3eee4', 'Blanc cassé', ''], ['#efe7da', 'Coquille d’œuf', ''], ['#f2ece1', 'Blanc lin', ''],
      ['#f5f2ed', 'Blanc chaud', ''], ['#fbfbf9', 'Blanc plafond', ''], ['#f7f6f2', 'Blanc ouate', ''], ['#e3e3df', 'Blanc gris clair', ''], ['#e6edf2', 'Blanc bleuté', ''],
    ] },
    neutres: { label: 'Beiges, greiges & lin', tip: 'Les neutres chauds (lin, greige, sable) sont la base la plus facile : ils s’accordent avec le bois, le blanc et presque toutes les couleurs vives.', colors: [
      ['#e6d2b5', 'Ivoire clair', 'RAL 1015'], ['#ddc49a', 'Ivoire', 'RAL 1014'], ['#d0b084', 'Beige', 'RAL 1001'],
      ['#d8cbb8', 'Lin', ''], ['#cfc4b4', 'Greige', ''], ['#c9b79c', 'Sable', ''], ['#b7a68f', 'Taupe clair', ''],
      ['#a39282', 'Taupe', ''], ['#b7b3a8', 'Gris soie', 'RAL 7044'], ['#b5b0a1', 'Gris silex', 'RAL 7032'],
    ] },
    gris: { label: 'Gris & noirs', tip: 'Un gris foncé (anthracite) sur un seul mur crée de la profondeur. Sur toute une petite pièce, il la fait paraître plus petite : réserve-le aux grandes surfaces bien éclairées.', colors: [
      ['#cbd0cc', 'Gris clair', 'RAL 7035'], ['#b0b0a9', 'Gris agate', 'RAL 7038'], ['#939388', 'Gris pierre', 'RAL 7030'],
      ['#8f9695', 'Gris fenêtre', 'RAL 7040'], ['#6b665e', 'Gris quartz', 'RAL 7039'], ['#6e6558', 'Gris beige', 'RAL 7006'],
      ['#4f5358', 'Gris ardoise', 'RAL 7015'], ['#383e42', 'Gris anthracite', 'RAL 7016'], ['#2f3234', 'Gris noir', 'RAL 7021'],
      ['#1c1e20', 'Noir graphite', 'RAL 9011'], ['#0e0e10', 'Noir foncé', 'RAL 9005'],
    ] },
    verts: { label: 'Verts', tip: 'Le vert sauge ou eucalyptus apaise : idéal en chambre ou en salle de bain. Il se marie très bien avec le bois clair, le rotin et le laiton.', colors: [
      ['#b9ceac', 'Vert blanc', 'RAL 6019'], ['#a7b59a', 'Vert sauge', ''], ['#8a9977', 'Vert pâle', 'RAL 6021'],
      ['#9aa58c', 'Eucalyptus', ''], ['#7d8466', 'Vert lichen', ''], ['#6c7c59', 'Vert réséda', 'RAL 6011'],
      ['#797c5a', 'Vert jonc', 'RAL 6013'], ['#50533c', 'Vert olive', 'RAL 6003'], ['#3f5b45', 'Vert forêt', ''],
      ['#114232', 'Vert mousse', 'RAL 6005'], ['#7fb0b2', 'Turquoise pastel', 'RAL 6034'],
    ] },
    bleus: { label: 'Bleus', tip: 'Les bleus grisés (pigeon, orage) sont reposants et élégants. Le bleu nuit ou bleu canard sur un mur de tête de lit est une valeur sûre.', colors: [
      ['#c9d6df', 'Bleu brume', ''], ['#a9bccb', 'Bleu ciel grisé', ''], ['#6a93b0', 'Bleu pastel', 'RAL 5024'],
      ['#637d96', 'Bleu pigeon', 'RAL 5014'], ['#4c6a92', 'Bleu distant', 'RAL 5023'], ['#5b6f7d', 'Bleu orage', ''],
      ['#07737a', 'Bleu d’eau', 'RAL 5021'], ['#1f5a63', 'Bleu canard', ''], ['#23324a', 'Bleu nuit', ''],
      ['#1f3855', 'Bleu saphir', 'RAL 5003'], ['#1a2b3c', 'Bleu acier', 'RAL 5011'],
    ] },
    chauds: { label: 'Terracotta, ocres & roses', tip: 'Les teintes terre (terracotta, ocre, argile) réchauffent une pièce froide. Associe-les à du blanc cassé et des matières naturelles (lin, jute, bois).', colors: [
      ['#ead6cc', 'Rose poudré clair', ''], ['#d9a9a0', 'Rose poudré', ''], ['#d8a0a6', 'Rose clair', 'RAL 3015'],
      ['#c88c77', 'Rouge beige', 'RAL 3012'], ['#c9a27e', 'Argile', ''], ['#c18a5a', 'Ocre clair', ''],
      ['#c9952f', 'Moutarde', ''], ['#b08a47', 'Jaune ocre', 'RAL 1024'], ['#b8674a', 'Terracotta', ''],
      ['#a65e2f', 'Brun orangé', 'RAL 8023'], ['#8f4e35', 'Brun cuivré', 'RAL 8004'], ['#6d342d', 'Rouge oxyde', 'RAL 3009'],
    ] },
  };

  // Matières pour le mobilier et les équipements : [hex, nom, finition]
  const MATERIALS = {
    bois: { label: 'Bois', tip: 'Garde 2 ou 3 essences maximum dans une même pièce : par exemple un chêne clair pour les meubles et un bois plus foncé pour un rappel.', colors: [
      ['#e6dccb', 'Frêne blanchi', 'bois'], ['#e2c28e', 'Pin', 'bois'], ['#d6b97c', 'Bambou', 'bois'], ['#d8b98a', 'Chêne clair', 'bois'],
      ['#c19a6b', 'Chêne naturel', 'bois'], ['#b08a62', 'Hêtre', 'bois'], ['#9c6b3f', 'Teck', 'bois'], ['#8a6a4a', 'Chêne fumé', 'bois'],
      ['#6b4a32', 'Noyer', 'bois'], ['#3e2c22', 'Wengé', 'bois'],
    ] },
    laque: { label: 'Laqués & mélaminés', tip: 'Un meuble laqué blanc ou gris clair agrandit visuellement une petite cuisine. Les façades mates marquent moins les traces de doigts que les brillantes.', colors: [
      ['#f4f4f2', 'Blanc mat', 'laque'], ['#f3f1ec', 'Blanc cassé', 'laque'], ['#e8e3da', 'Crème', 'laque'], ['#cfd0cd', 'Gris perle', 'laque'],
      ['#8d9096', 'Gris moyen', 'laque'], ['#3b3f45', 'Anthracite', 'laque'], ['#1d1d1f', 'Noir mat', 'laque'], ['#9caf88', 'Vert sauge', 'laque'],
      ['#3f5b45', 'Vert forêt', 'laque'], ['#23324a', 'Bleu nuit', 'laque'], ['#1f5a63', 'Bleu canard', 'laque'], ['#b8674a', 'Terracotta', 'laque'],
    ] },
    metal: { label: 'Métal', tip: 'Le noir mat donne un style atelier ; le laiton brossé apporte une touche chaude et chic. Évite de mélanger plus de deux métaux différents.', colors: [
      ['#1f2328', 'Acier noir mat', 'metal'], ['#c9ced3', 'Inox brossé', 'metal'], ['#a7adb4', 'Aluminium', 'metal'], ['#b5a26a', 'Laiton brossé', 'metal'],
      ['#b87333', 'Cuivre', 'metal'], ['#c0a062', 'Doré champagne', 'metal'], ['#5a5f66', 'Gun metal', 'metal'],
    ] },
    tissu: { label: 'Tissus & cuirs', tip: 'Choisis d’abord la couleur du canapé (la plus grande surface textile), puis accorde coussins, rideaux et tapis avec 1 ou 2 teintes de rappel.', colors: [
      ['#efe9df', 'Bouclette blanche', 'tissu'], ['#d9cfbf', 'Lin naturel', 'tissu'], ['#bfb6a8', 'Lin grège', 'tissu'], ['#8d9096', 'Gris chiné', 'tissu'],
      ['#55595f', 'Gris anthracite', 'tissu'], ['#6d7b8c', 'Bleu gris', 'tissu'], ['#1f5a63', 'Velours bleu canard', 'tissu'], ['#3f5b45', 'Velours vert', 'tissu'],
      ['#c9952f', 'Velours moutarde', 'tissu'], ['#b8674a', 'Velours terracotta', 'tissu'], ['#d9a9a0', 'Rose poudré', 'tissu'], ['#8b4b2a', 'Cuir cognac', 'tissu'],
      ['#3a2a22', 'Cuir chocolat', 'tissu'], ['#8fa7c4', 'Bleu ciel', 'tissu'],
    ] },
    pierre: { label: 'Pierre, céramique & plans', tip: 'Pour un plan de travail, le quartz et la céramique résistent mieux aux taches et à la chaleur que le marbre ou le bois massif.', colors: [
      ['#f2f1ee', 'Marbre blanc', 'pierre'], ['#e9e6df', 'Quartz blanc', 'pierre'], ['#d9d3c7', 'Travertin', 'pierre'], ['#bdb8ae', 'Béton clair', 'pierre'],
      ['#7b7d7f', 'Béton ciré gris', 'pierre'], ['#2a2b2d', 'Granit noir', 'pierre'], ['#7b6a58', 'Stratifié bois', 'pierre'], ['#fbfbfb', 'Céramique blanche', 'pierre'],
    ] },
  };

  // ------------------------------------------------------------------
  //  Revêtements muraux (dessinés en texture 512 px = size m)
  // ------------------------------------------------------------------
  const WALL_FINISHES = {
    paint:      { label: 'Peinture', price: 25, tip: 'Peinture mate au plafond et dans les chambres (cache les défauts), velours dans le séjour (se lessive), satinée en cuisine et salle de bain (résiste à l’humidité).' },
    lime:       { label: 'Enduit à la chaux / tadelakt', price: 65, size: 1.5, tip: 'Effet nuancé et mat, très chaleureux. La chaux régule l’humidité ; le tadelakt (chaux marocaine polie) est même étanche en douche.' },
    concrete:   { label: 'Béton ciré', price: 90, size: 1.5, tip: 'Effet minéral moderne. Il se pose en 2-3 mm sur un support sain et se protège avec un vernis, surtout en pièce humide.' },
    stripes:    { label: 'Papier peint rayé', price: 35, size: .53, tip: 'Les rayures verticales donnent l’impression d’un plafond plus haut ; horizontales, elles élargissent une pièce étroite.' },
    geo:        { label: 'Papier peint géométrique', price: 40, size: .53, tip: 'Un motif fort se pose sur un seul mur (tête de lit, fond de séjour) : sur les 4 murs, il fatigue l’œil.' },
    leaves:     { label: 'Papier peint végétal', price: 45, size: .7, tip: 'Le motif « jungle » ou feuillage marche très bien avec des plantes réelles, du rotin et des teintes vertes.' },
    panel:      { label: 'Lambris bois vertical', price: 55, size: 1, tip: 'Le lambris se pose sur tasseaux : il cache un mur abîmé et isole un peu. Vertical, il rehausse ; horizontal, il élargit.' },
    tasseaux:   { label: 'Tasseaux bois décoratifs', price: 85, size: 1, tip: 'Tendance pour une tête de lit ou un mur TV. Espace les tasseaux de 1 à 2 cm et peins le mur derrière en foncé pour la profondeur.' },
    brick:      { label: 'Brique / plaquette de parement', price: 75, size: 1, tip: 'Les plaquettes de parement (1 à 2 cm) donnent l’effet loft sans le poids d’un vrai mur de briques. Elles se peignent en blanc pour un style scandinave.' },
    stone:      { label: 'Pierre naturelle', price: 110, size: 1.2, tip: 'À réserver à un pan de mur ou un encadrement de cheminée. Prévoir un éclairage rasant pour faire ressortir le relief.' },
    subway:     { label: 'Carrelage métro', price: 60, size: .6, tip: 'Le carrelage métro (7,5 × 15 cm) est intemporel en crédence de cuisine. Un joint foncé souligne le motif, un joint blanc l’efface.' },
    zellige:    { label: 'Zellige', price: 140, size: .5, tip: 'Carreau artisanal émaillé aux nuances irrégulières : chaque carreau reflète la lumière différemment. Idéal en crédence ou en douche.' },
  };
  const SHEENS = { mat: { label: 'Mat', rough: .97 }, velours: { label: 'Velours', rough: .85 }, satin: { label: 'Satiné', rough: .55 }, brillant: { label: 'Brillant', rough: .3 } };

  // ------------------------------------------------------------------
  //  Sols supplémentaires (les sols d'origine sont dans interieur.html)
  // ------------------------------------------------------------------
  const FLOORS_EXTRA = {
    oakLight:  { label: 'Parquet chêne clair',          color: '#e3cda9', price: 60,  size: 1.2, group: 'Bois' },
    walnut:    { label: 'Parquet noyer',                color: '#7a5a40', price: 95,  size: 1.2, group: 'Bois' },
    batons:    { label: 'Parquet bâton rompu',          color: '#cfae80', price: 90,  size: 1.0, group: 'Bois' },
    laminate:  { label: 'Stratifié effet chêne',        color: '#d4b98f', price: 25,  size: 1.4, group: 'Bois' },
    vinyl:     { label: 'Vinyle / LVT effet bois',      color: '#c9ad85', price: 35,  size: 1.4, group: 'Bois' },
    cement:    { label: 'Carreaux de ciment',           color: '#d9d4c9', price: 95,  size: .8,  group: 'Carrelage' },
    terrazzo:  { label: 'Terrazzo',                     color: '#e6e1d8', price: 110, size: 1.2, group: 'Carrelage' },
    hexTile:   { label: 'Tomettes hexagonales',         color: '#b8674a', price: 80,  size: .9,  group: 'Carrelage' },
    checker:   { label: 'Damier noir & blanc',          color: '#bdbdbd', price: 70,  size: 1.2, group: 'Carrelage' },
    travertin: { label: 'Travertin',                    color: '#ddd0bb', price: 100, size: 1.6, group: 'Pierre' },
    slate:     { label: 'Ardoise',                      color: '#55585c', price: 90,  size: 1.2, group: 'Pierre' },
    waxed:     { label: 'Béton ciré',                   color: '#a8a7a3', price: 90,  size: 3,   group: 'Minéral' },
    sisal:     { label: 'Jonc de mer / sisal',          color: '#c8b48c', price: 40,  size: .6,  group: 'Textile' },
  };
  const FLOOR_TIPS = {
    parquet: 'Parquet massif ou contrecollé : chaleureux et rénovable (ponçage). Évite-le dans une salle de bain sans ventilation.',
    parquetDark: 'Un parquet foncé est élégant mais montre la poussière et les rayures. Il va bien avec des murs clairs.',
    chevron: 'Le point de Hongrie (lames coupées en biais) structure une pièce : pose-le dans le sens de la longueur pour l’allonger.',
    batons: 'Le bâton rompu (lames à angle droit) est le grand classique des appartements anciens.',
    oakLight: 'Le chêne clair agrandit l’espace et s’accorde avec tous les styles, surtout scandinave et japandi.',
    walnut: 'Le noyer apporte de la chaleur et du chic, à réserver aux pièces lumineuses.',
    laminate: 'Le stratifié est économique et résistant aux rayures, mais craint l’eau stagnante. Prévois une sous-couche phonique.',
    vinyl: 'Le vinyle (LVT) est 100 % étanche : parfait en cuisine et salle de bain, avec un rendu bois très réaliste.',
    tile: 'Le carrelage gris clair est facile à vivre. Format conseillé : 60 × 60 cm pour moins de joints.',
    tileWarm: 'Un carrelage beige réchauffe une pièce et va bien avec le bois.',
    tileLarge: 'Les grands formats (60 × 120) agrandissent visuellement mais exigent un sol très plan (ragréage souvent nécessaire).',
    marble: 'Le marbre est noble mais poreux : il se tache (citron, vin) et doit être traité régulièrement.',
    carpet: 'La moquette est douce et isole du bruit : idéale en chambre, à éviter en pièce de vie si tu as des animaux.',
    concrete: 'Sol souple ou béton brut : solution économique ou provisoire.',
    cement: 'Les carreaux de ciment apportent du caractère (entrée, cuisine). Ils doivent être protégés par un traitement anti-taches.',
    terrazzo: 'Le terrazzo (éclats de marbre dans un liant) est très résistant et tendance, en sol comme en plan de travail.',
    hexTile: 'Les tomettes en terre cuite donnent un style provençal ou bohème. Elles se cirent ou se vitrifient.',
    checker: 'Le damier noir et blanc est un classique rétro, parfait en entrée, salle de bain ou cuisine.',
    travertin: 'Le travertin est une pierre calcaire chaude, très utilisée autour des piscines et dans les salles de bain.',
    slate: 'L’ardoise est sombre, antidérapante et résistante : bien en entrée ou en douche à l’italienne.',
    waxed: 'Le béton ciré au sol crée un espace continu sans joints, très moderne. Il demande un applicateur expérimenté.',
    sisal: 'Fibres naturelles (jonc de mer, sisal) : chaleureux et naturel, mais craignent l’humidité et les taches.',
  };

  // ------------------------------------------------------------------
  //  Dessin des textures (canvas 512 px)
  // ------------------------------------------------------------------
  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  function hexToHsl(hex) {
    const n = parseInt(hex.replace('#', ''), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
    if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
    return [h, s * 100, l * 100];
  }
  const hsl = (h, s, l, a = 1) => `hsla(${h},${Math.max(0, Math.min(100, s))}%,${Math.max(0, Math.min(100, l))}%,${a})`;
  const vary = (hex, r, dl = 6, ds = 4) => { const [h, s, l] = hexToHsl(hex); return hsl(h + (r() - .5) * 4, s + (r() - .5) * ds, l + (r() - .5) * dl); };
  function shade(hex, dl) { const [h, s, l] = hexToHsl(hex); return hsl(h, s, l + dl); }
  function planks(g, base, seed, wPx = 64, lenMin = 180, lenVar = 260, joint = '#00000026') {
    const r = rng(seed);
    for (let x = 0; x < 512; x += wPx) { let y = -Math.floor(r() * 300); while (y < 512) { const len = lenMin + r() * lenVar; g.fillStyle = vary(base, r, 10, 8); g.fillRect(x, y, wPx, len);
      g.strokeStyle = '#0000000d'; for (let k = 0; k < 4; k++) { g.beginPath(); const xx = x + 6 + r() * (wPx - 12); g.moveTo(xx, y); g.bezierCurveTo(xx + (r() - .5) * 8, y + len / 3, xx + (r() - .5) * 8, y + 2 * len / 3, xx, y + len); g.stroke(); }
      g.strokeStyle = joint; g.strokeRect(x + .5, y + .5, wPx - 1, len - 1); y += len; } }
  }
  function grid(g, base, joint, cw, ch, seed, dl = 4, gap = 2, offsetRows = false) {
    const r = rng(seed); g.fillStyle = joint; g.fillRect(0, 0, 512, 512);
    for (let y = 0, row = 0; y < 512; y += ch, row++) for (let x = offsetRows && row % 2 ? -cw / 2 : 0; x < 512; x += cw) { g.fillStyle = vary(base, r, dl, 3); g.fillRect(x + gap, y + gap, cw - gap * 2, ch - gap * 2); }
  }
  function noise(g, n, seed, alpha = .05, size = 2) { const r = rng(seed); for (let i = 0; i < n; i++) { g.fillStyle = `rgba(${r() > .5 ? '255,255,255' : '0,0,0'},${r() * alpha})`; g.fillRect(r() * 512, r() * 512, size, size); } }
  function clouds(g, base, seed, n = 60, amp = 8) { const r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, 512, 512); for (let i = 0; i < n; i++) { const x = r() * 512, y = r() * 512, rad = 30 + r() * 120, gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, shade(base, (r() - .5) * amp)); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); } }

  const FLOOR_DRAW = {
    oakLight: g => planks(g, '#e0c9a3', 41, 64, 220, 280),
    walnut: g => planks(g, '#7a5a40', 43, 64, 200, 260, '#00000040'),
    laminate: g => planks(g, '#d4b98f', 47, 80, 300, 200, '#00000030'),
    vinyl: g => planks(g, '#c9ad85', 53, 72, 260, 200, '#00000022'),
    batons: g => { const r = rng(59); g.fillStyle = '#b8966a'; g.fillRect(0, 0, 512, 512); const L = 128, W = 32;
      for (let by = 0; by < 512; by += L) for (let bx = 0; bx < 512; bx += L) { const vert = ((bx + by) / L) % 2 === 0; for (let k = 0; k < 4; k++) { g.fillStyle = vary('#cfae80', r, 12, 8); if (vert) g.fillRect(bx + k * W, by, W, L); else g.fillRect(bx, by + k * W, L, W); g.strokeStyle = '#00000026'; if (vert) g.strokeRect(bx + k * W + .5, by + .5, W - 1, L - 1); else g.strokeRect(bx + .5, by + k * W + .5, L - 1, W - 1); } } },
    cement: g => { const r = rng(61); const C = 128; for (let y = 0; y < 512; y += C) for (let x = 0; x < 512; x += C) { g.fillStyle = '#e9e4d8'; g.fillRect(x, y, C, C); g.save(); g.translate(x + C / 2, y + C / 2);
      g.fillStyle = '#3f5b6b'; for (let q = 0; q < 4; q++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(C * .32, -C * .1, C * .5, -C * .5); g.quadraticCurveTo(C * .1, -C * .32, 0, 0); g.fill(); }
      g.fillStyle = '#c4874f'; g.beginPath(); g.arc(0, 0, C * .1, 0, 7); g.fill(); g.restore(); g.strokeStyle = '#b9b3a5'; g.strokeRect(x + .5, y + .5, C - 1, C - 1); } noise(g, 3000, 63, .04); void r; },
    terrazzo: g => { const r = rng(67); g.fillStyle = '#ece8e0'; g.fillRect(0, 0, 512, 512); const cols = ['#c9c3b7', '#9a9389', '#d9a58a', '#6f6a64', '#b7c4c0', '#e3d3bf'];
      for (let i = 0; i < 900; i++) { g.fillStyle = cols[Math.floor(r() * cols.length)]; g.beginPath(); const x = r() * 512, y = r() * 512, s = 2 + r() * 9; g.moveTo(x, y); for (let k = 0; k < 5; k++) g.lineTo(x + (r() - .5) * s * 2, y + (r() - .5) * s * 2); g.fill(); } },
    hexTile: g => { const r = rng(71), R = 40, hh = R * Math.sqrt(3); g.fillStyle = '#d8cdbf'; g.fillRect(0, 0, 512, 512);
      for (let row = -1; row < 512 / hh + 2; row++) for (let col = -1; col < 512 / (R * 1.5) + 2; col++) { const cx = col * R * 1.5, cy = row * hh + (col % 2 ? hh / 2 : 0); g.fillStyle = vary('#b8674a', r, 12, 10); g.beginPath();
        for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; g.lineTo(cx + (R - 2) * Math.cos(a), cy + (R - 2) * Math.sin(a)); } g.fill(); } },
    checker: g => { const C = 64; for (let y = 0; y < 512; y += C) for (let x = 0; x < 512; x += C) { g.fillStyle = ((x + y) / C) % 2 ? '#1f2023' : '#f1efea'; g.fillRect(x, y, C, C); } g.strokeStyle = '#8888'; for (let i = 0; i <= 512; i += C) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); } },
    travertin: g => { grid(g, '#ddd0bb', '#c8bba4', 256, 128, 73, 5, 1, true); const r = rng(79); g.strokeStyle = '#00000014'; for (let i = 0; i < 120; i++) { g.lineWidth = .5 + r(); const y = r() * 512, x = r() * 512; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20 + r() * 60, y + (r() - .5) * 3); g.stroke(); } },
    slate: g => { grid(g, '#55585c', '#3a3c3f', 128, 128, 83, 8, 2, true); noise(g, 5000, 89, .07); },
    waxed: g => { clouds(g, '#a8a7a3', 97, 70, 10); noise(g, 2500, 101, .035); },
    sisal: g => { g.fillStyle = '#bba57c'; g.fillRect(0, 0, 512, 512); const r = rng(103); for (let y = 0; y < 512; y += 8) for (let x = 0; x < 512; x += 8) { g.fillStyle = vary('#c8b48c', r, 14, 8); if (((x + y) / 8) % 2) g.fillRect(x, y, 8, 3.5); else g.fillRect(x, y, 3.5, 8); } },
  };

  const WALL_DRAW = {
    lime: (g, c) => { clouds(g, c, 107, 90, 9); noise(g, 2500, 109, .03); },
    concrete: (g, c) => { clouds(g, c, 113, 70, 12); noise(g, 3500, 127, .05); const r = rng(131); g.fillStyle = '#00000018'; for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(r() * 512, r() * 512, 1 + r() * 2, 0, 7); g.fill(); } },
    stripes: (g, c) => { g.fillStyle = c; g.fillRect(0, 0, 512, 512); g.fillStyle = shade(c, -9); for (let x = 0; x < 512; x += 64) g.fillRect(x, 0, 26, 512); g.fillStyle = shade(c, 6); for (let x = 30; x < 512; x += 64) g.fillRect(x, 0, 3, 512); },
    geo: (g, c) => { g.fillStyle = c; g.fillRect(0, 0, 512, 512); g.strokeStyle = shade(c, -18); g.lineWidth = 3; const S = 64;
      for (let y = 0; y < 512 + S; y += S) for (let x = 0; x < 512 + S; x += S) { g.beginPath(); g.moveTo(x, y - S / 2); g.lineTo(x + S / 2, y); g.lineTo(x, y + S / 2); g.lineTo(x - S / 2, y); g.closePath(); g.stroke(); }
      g.fillStyle = shade(c, -24); for (let y = 0; y < 512; y += S) for (let x = 0; x < 512; x += S) { g.beginPath(); g.arc(x + S / 2, y + S / 2, 4, 0, 7); g.fill(); } },
    leaves: (g, c) => { g.fillStyle = c; g.fillRect(0, 0, 512, 512); const r = rng(137), [h] = hexToHsl(c);
      for (let i = 0; i < 70; i++) { const x = r() * 512, y = r() * 512, s = 18 + r() * 34, a = r() * 6.28; g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = hsl(120 + (r() - .5) * 40, 30 + r() * 20, 28 + r() * 22, .85);
        g.beginPath(); g.moveTo(0, -s); g.quadraticCurveTo(s * .55, 0, 0, s); g.quadraticCurveTo(-s * .55, 0, 0, -s); g.fill(); g.strokeStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(0, -s); g.lineTo(0, s); g.stroke(); g.restore(); } void h; },
    panel: (g, c) => { const r = rng(139); for (let x = 0; x < 512; x += 51.2) { g.fillStyle = vary(c, r, 8, 6); g.fillRect(x, 0, 51.2, 512); g.fillStyle = '#0000002a'; g.fillRect(x, 0, 2, 512); g.fillStyle = '#ffffff22'; g.fillRect(x + 2, 0, 2, 512); } },
    tasseaux: (g, c) => { g.fillStyle = shade(c, -38); g.fillRect(0, 0, 512, 512); const r = rng(149); for (let x = 0; x < 512; x += 32) { g.fillStyle = vary(c, r, 8, 6); g.fillRect(x + 6, 0, 20, 512); g.fillStyle = '#ffffff1f'; g.fillRect(x + 6, 0, 3, 512); } },
    brick: (g, c) => { grid(g, c, '#d9d4cb', 128, 34, 151, 14, 3, true); noise(g, 6000, 157, .06); },
    stone: (g, c) => { g.fillStyle = shade(c, -22); g.fillRect(0, 0, 512, 512); const r = rng(163);
      for (let y = 0; y < 512;) { const hgt = 40 + r() * 50; for (let x = -r() * 60; x < 512;) { const wd = 60 + r() * 110; g.fillStyle = vary(c, r, 18, 10); g.beginPath(); const p = [[x + 4, y + 4], [x + wd - 4, y + 3 + r() * 4], [x + wd - 3, y + hgt - 4], [x + 3, y + hgt - 3 - r() * 4]];
        g.moveTo(...p[0]); for (const q of p.slice(1)) g.lineTo(...q); g.closePath(); g.fill(); x += wd; } y += hgt; } noise(g, 5000, 167, .06); },
    subway: (g, c) => { grid(g, c, '#c9ccd0', 128, 64, 173, 3, 2, true); g.fillStyle = '#ffffff30'; for (let y = 0; y < 512; y += 64) g.fillRect(0, y + 4, 512, 5); },
    zellige: (g, c) => { const r = rng(179); g.fillStyle = '#d8d3c8'; g.fillRect(0, 0, 512, 512); for (let y = 0; y < 512; y += 51.2) for (let x = 0; x < 512; x += 51.2) { g.fillStyle = vary(c, r, 18, 14); g.fillRect(x + 1.5, y + 1.5, 48, 48); const gr = g.createLinearGradient(x, y, x + 50, y + 50); gr.addColorStop(0, 'rgba(255,255,255,.28)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.12)'); g.fillStyle = gr; g.fillRect(x + 1.5, y + 1.5, 48, 48); } },
  };
  // Couleur de base suggérée quand on choisit un revêtement
  const WALL_DEFAULT_COLOR = { lime: '#e6d2b5', concrete: '#b0b0a9', stripes: '#e9e0d2', geo: '#efe7da', leaves: '#f3eee4', panel: '#d8b98a', tasseaux: '#c19a6b', brick: '#a65e2f', stone: '#c9b79c', subway: '#f4f4ef', zellige: '#7fb0b2' };

  // ------------------------------------------------------------------
  //  Ambiances : appliquées à une pièce en un clic
  // ------------------------------------------------------------------
  const STYLES = {
    scandinave:   { label: 'Scandinave',         desc: 'Blanc, bois clair, gris doux, textiles naturels.', paint: '#f3eee4', finish: 'paint', floor: 'oakLight', ceil: '#f7f6f2', wood: '#d8b98a', fabric: '#bfb6a8', accent: '#9aa58c' },
    japandi:      { label: 'Japandi',            desc: 'Minimaliste et chaleureux : lin, bois clair et noir mat.', paint: '#d8cbb8', finish: 'lime', floor: 'oakLight', ceil: '#f2ece1', wood: '#c19a6b', fabric: '#d9cfbf', accent: '#1d1d1f' },
    industriel:   { label: 'Industriel / loft',  desc: 'Brique, béton, acier noir, bois foncé, cuir.', paint: '#cbd0cc', finish: 'brick', wallColor: '#8f4e35', floor: 'waxed', ceil: '#e3e3df', wood: '#6b4a32', fabric: '#8b4b2a', accent: '#1f2328' },
    boheme:       { label: 'Bohème',             desc: 'Terracotta, rotin, plantes, tons chauds.', paint: '#e6d2b5', finish: 'lime', floor: 'hexTile', ceil: '#f3eee4', wood: '#9c6b3f', fabric: '#b8674a', accent: '#c9952f' },
    classique:    { label: 'Classique chic',     desc: 'Blanc cassé, parquet en chevrons, laiton, velours.', paint: '#efe7da', finish: 'paint', floor: 'chevron', ceil: '#f4f4ef', wood: '#8a6a4a', fabric: '#1f5a63', accent: '#b5a26a' },
    contemporain: { label: 'Contemporain',       desc: 'Gris et blanc, grands carreaux, lignes nettes.', paint: '#e3e3df', finish: 'paint', floor: 'tileLarge', ceil: '#f4f4ef', wood: '#3b3f45', fabric: '#55595f', accent: '#383e42' },
    mediterraneen:{ label: 'Méditerranéen',      desc: 'Chaux blanche, bleu, tomettes et bois naturel.', paint: '#f3eee4', finish: 'lime', floor: 'hexTile', ceil: '#f4f4ef', wood: '#c19a6b', fabric: '#4c6a92', accent: '#1f3855' },
    nature:       { label: 'Nature & végétal',   desc: 'Vert sauge, papier peint feuillage, bois et lin.', paint: '#a7b59a', finish: 'paint', floor: 'parquet', ceil: '#f7f6f2', wood: '#c19a6b', fabric: '#d9cfbf', accent: '#3f5b45' },
    cocooning:    { label: 'Cocooning',          desc: 'Rose poudré, terracotta doux, moquette, bouclette.', paint: '#ead6cc', finish: 'paint', floor: 'carpet', ceil: '#f2ece1', wood: '#d8b98a', fabric: '#efe9df', accent: '#d9a9a0' },
    marin:        { label: 'Bord de mer',        desc: 'Blanc, bleu brume, bois blanchi et jonc de mer.', paint: '#c9d6df', finish: 'panel', wallColor: '#f1f0ea', floor: 'sisal', ceil: '#f4f4ef', wood: '#e6dccb', fabric: '#f1f0ea', accent: '#23324a' },
  };

  // ------------------------------------------------------------------
  //  Astuces de débutant (affichées selon le contexte)
  // ------------------------------------------------------------------
  const TIPS = {
    general: [
      'Commence par le plan (murs et ouvertures), puis les pièces (noms, sols, couleurs), et seulement ensuite le mobilier.',
      'Avant une grosse modification, crée un point de sauvegarde (menu Projet) : tu pourras toujours revenir en arrière.',
      'Clique sur n’importe quelle cote soulignée pour taper directement la valeur exacte.',
      'Le bouton « Visite » en 3D permet de se promener dans le logement à hauteur des yeux.',
      'La règle 60-30-10 : 60 % d’une couleur dominante (murs), 30 % d’une couleur secondaire (meubles, textiles), 10 % d’une couleur d’accent (déco).',
      'Laisse au moins 90 cm de passage devant les meubles et 70 cm autour d’un lit pour circuler confortablement.',
      'Exporte régulièrement ton projet en fichier (Ctrl+S) : les données du navigateur peuvent être effacées.',
    ],
    wall: 'Un mur extérieur ou porteur ne se déplace pas sans étude. Les cloisons (7 cm en général) se créent, se déplacent ou se suppriment librement.',
    door: 'Une porte standard fait 83 cm de large (passage utile ≈ 73 cm). Pour l’accessibilité PMR, vise 90 cm. Pense au sens d’ouverture : la porte ne doit pas taper dans un meuble.',
    window: 'L’allège est la hauteur entre le sol et le bas de la fenêtre (souvent 90 cm à 1 m). Sous 1 m, un garde-corps est obligatoire à l’étage.',
    baie: 'Une baie vitrée orientée sud apporte beaucoup de lumière et de chaleur l’hiver : prévoir un store ou une avancée pour l’été.',
    room: 'Clique dans une pièce pour choisir son sol, la couleur et le revêtement des murs, ou applique une ambiance complète en un clic.',
    paint: 'Pour calculer la peinture : surface des murs × 2 couches ÷ 10 m² par litre environ. Le panneau Travaux le fait pour toi.',
    elec: 'La norme NF C 15-100 fixe un minimum de prises et de points lumineux par pièce : l’onglet Électricité vérifie ton plan.',
    works: 'Les prix sont indicatifs (fourni-posé, France) : ajuste-les selon tes devis d’artisans. Ajoute 10 à 15 % d’imprévus.',
    item: 'Glisse l’objet pour le déplacer, touche R pour le pivoter. Il s’aimante aux murs et aux autres objets (case « Aimant » en bas).',
    color: 'Les couleurs à l’écran sont approximatives : fais toujours un essai sur un échantillon au mur, à la lumière du jour et le soir.',
    byRoom: {
      sejour: 'Séjour : place le canapé face à la source principale (TV, cheminée, vue) et garde 40 à 50 cm entre le canapé et la table basse.',
      chambre: 'Chambre : des couleurs douces et désaturées favorisent le sommeil. Garde 60 à 70 cm de passage de chaque côté du lit.',
      cuisine: 'Cuisine : le triangle d’activité (évier, plaques, réfrigérateur) doit rester compact, idéalement moins de 6 m au total.',
      sdb: 'Salle de bain : peinture satinée ou faïence en zone humide, et aucune prise à moins de 60 cm de la douche ou de la baignoire.',
      wc: 'WC : une couleur forte ou un papier peint à motif fonctionne très bien dans cette petite pièce.',
      circ: 'Entrée / couloir : un miroir et une couleur claire agrandissent ; un sol résistant (carrelage, vinyle) est conseillé.',
      buanderie: 'Buanderie : prévois une arrivée d’eau, une évacuation et une prise 20 A par appareil.',
      autre: 'Donne un nom à la pièce (séjour, chambre…) pour obtenir des conseils adaptés.',
    },
    byGroup: {
      'Chambre': 'Tailles de lit courantes : 90 × 190 (1 personne), 140 × 190, 160 × 200 (queen), 180 × 200 (king).',
      'Séjour': 'Un tapis doit dépasser du canapé ou au moins passer sous ses pieds avant pour unifier le coin salon.',
      'Cuisine': 'Hauteur de plan de travail : environ 90 cm. Meubles hauts à 50-60 cm au-dessus du plan.',
      'Salle de bain': 'Hauteur de vasque : 85 à 90 cm. Laisse 60 cm de dégagement devant le WC et la vasque.',
      'Électricité': 'Les prises et interrupteurs se posent contre un mur : clique près d’un mur pour les poser.',
      'Éclairage': 'Multiplie les sources : un éclairage général au plafond, des lampes d’appoint et un éclairage d’ambiance.',
      'Bureau': 'Bureau : 75 cm de haut, la lumière naturelle de côté (pas dans le dos ni en face de l’écran).',
      'Entrée & rangement': 'Un meuble d’entrée de 30 à 35 cm de profondeur suffit pour les chaussures sans gêner le passage.',
      'Construction': 'Escalier confortable : hauteur de marche 17-18 cm, giron (profondeur) 25-28 cm.',
      'Chauffage & ventilation': 'Place les radiateurs sous les fenêtres pour contrer la sensation de paroi froide.',
      'Décoration': 'Accroche les tableaux avec leur centre à environ 1,50 m du sol (hauteur des yeux).',
      'Extérieur & balcon': 'Sur un balcon, vérifie la charge admissible avant d’installer des bacs lourds ou un spa.',
    },
  };

  const GLOSSARY = [
    ['Allège', 'Partie de mur sous une fenêtre ; sa hauteur est mesurée depuis le sol fini.'],
    ['Cloison', 'Mur intérieur non porteur (souvent en plaques de plâtre sur ossature, 7 cm).'],
    ['Mur porteur', 'Mur qui soutient la structure (planchers, toiture). Le modifier nécessite une étude et souvent une autorisation.'],
    ['Faïence', 'Carrelage mural, en général en salle de bain et en crédence de cuisine.'],
    ['Crédence', 'Protection murale entre le plan de travail et les meubles hauts de la cuisine.'],
    ['Plinthe', 'Bande en bas des murs qui protège et cache le joint entre le mur et le sol.'],
    ['Faux plafond', 'Plafond suspendu sous le plafond existant : cache des gaines, intègre des spots, améliore l’isolation phonique.'],
    ['Coffrage', 'Habillage en plaques de plâtre qui cache des tuyaux ou des gaines.'],
    ['Verrière', 'Cloison vitrée à cadre (souvent acier noir) qui laisse passer la lumière entre deux pièces.'],
    ['Galandage', 'Porte coulissante qui disparaît dans l’épaisseur de la cloison.'],
    ['Ragréage', 'Enduit liquide qui rend un sol parfaitement plan avant la pose d’un revêtement.'],
    ['Sous-couche', 'Couche posée avant un revêtement : sous un parquet flottant (isolant phonique) ou avant une peinture (accroche).'],
    ['Lambourde', 'Pièce de bois qui supporte les lames d’un plancher ou d’une terrasse.'],
    ['DAAF', 'Détecteur Avertisseur Autonome de Fumée, obligatoire dans tout logement.'],
    ['VMC', 'Ventilation Mécanique Contrôlée : extrait l’air humide des pièces d’eau et de la cuisine.'],
    ['NF C 15-100', 'Norme française des installations électriques des logements (nombre de prises, volumes de salle de bain…).'],
    ['Volumes (salle de bain)', 'Zones autour de la douche/baignoire où les équipements électriques sont limités (volume 0, 1, 2).'],
    ['Loi Carrez', 'Surface privative d’un lot de copropriété, hors murs, cloisons et zones de moins de 1,80 m de hauteur.'],
    ['RAL', 'Nuancier international de couleurs (ex. RAL 9010 = blanc pur, RAL 7016 = gris anthracite).'],
    ['Glycéro / acrylique', 'Types de peinture : l’acrylique (à l’eau) est la plus courante aujourd’hui, peu odorante et rapide à sécher.'],
    ['Fourni-posé', 'Prix qui comprend le matériel et la main-d’œuvre.'],
    ['Giron', 'Profondeur d’une marche d’escalier, là où l’on pose le pied.'],
  ];

  // ------------------------------------------------------------------
  //  Recherche du nom d'une couleur
  // ------------------------------------------------------------------
  const ALL = [];
  for (const [k, p] of Object.entries(PALETTES)) for (const c of p.colors) ALL.push({ hex: c[0].toLowerCase(), name: c[1], ref: c[2], cat: k });
  for (const [k, p] of Object.entries(MATERIALS)) for (const c of p.colors) ALL.push({ hex: c[0].toLowerCase(), name: c[1], ref: p.label, cat: k });
  const colorInfo = hex => hex ? ALL.find(c => c.hex === String(hex).toLowerCase()) ?? null : null;
  const colorName = hex => { const c = colorInfo(hex); return c ? c.name + (c.ref && c.ref.startsWith('RAL') ? ' · ' + c.ref : '') : String(hex || '').toUpperCase(); };

  // ------------------------------------------------------------------
  //  Sélecteur de couleur (nuancier) — se branche sur un <input> caché
  // ------------------------------------------------------------------
  const RECENT_KEY = 'moovo-recent-colors';
  const recent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; } };
  const pushRecent = hex => { try { const r = [hex, ...recent().filter(x => x !== hex)].slice(0, 12); localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch {} };
  const PICK_CSS = `
  .cpick{display:flex !important;justify-content:flex-start;align-items:center;gap:8px;width:100%;text-align:left;font:inherit;font-size:13px;border:1px solid var(--line,#e1e5eb);border-radius:7px;padding:5px 8px;background:#fff;cursor:pointer;color:var(--ink,#1b1f27);min-height:34px}
  .cpick i{width:22px;height:22px;border-radius:6px;border:1px solid #0002;flex:none}
  .cpick em{font-style:normal;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cpop{position:fixed;z-index:300;width:340px;max-width:calc(100vw - 16px);max-height:min(520px,80vh);overflow:auto;background:#fff;border:1px solid #e1e5eb;border-radius:12px;box-shadow:0 12px 40px #0f172a33;padding:10px;font:13px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1b1f27}
  .cpop .ctabs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
  .cpop .ctabs button{font:inherit;font-size:12px;border:1px solid #e1e5eb;background:#fff;border-radius:999px;padding:3px 9px;cursor:pointer;color:#1b1f27}
  .cpop .ctabs button.on{background:#1b1f27;border-color:#1b1f27;color:#fff}
  .cpop .cgr{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
  .cpop .cgr button{aspect-ratio:1;border-radius:8px;border:1px solid #0002;cursor:pointer;padding:0;position:relative}
  .cpop .cgr button.on{outline:2px solid #2563eb;outline-offset:2px}
  .cpop .cgr button:hover{transform:scale(1.08)}
  .cpop .cinfo{display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid #eef0f3}
  .cpop .cinfo b{font-weight:600}
  .cpop .ctip{margin-top:8px;padding:7px 9px;background:#fff8e6;border-radius:8px;font-size:12px;color:#6b4e00}
  .cpop .cfoot{display:flex;gap:8px;align-items:center;margin-top:8px}
  .cpop .cfoot input[type=color]{width:42px;height:30px;padding:1px;border:1px solid #e1e5eb;border-radius:6px;background:#fff}
  .cpop .cfoot input[type=text]{flex:1;font:12px ui-monospace,Consolas,monospace;border:1px solid #e1e5eb;border-radius:6px;padding:5px 7px;min-width:0}
  .cpop .cfoot button{font:inherit;font-size:12px;border:1px solid #e1e5eb;background:#fff;border-radius:7px;padding:5px 9px;cursor:pointer}
  .cpop h6{margin:10px 0 5px;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#697386}`;
  let pop = null, popInput = null, popBtn = null, popCat = null;
  function ensureCss() { if (!document.getElementById('cpick-css')) { const s = document.createElement('style'); s.id = 'cpick-css'; s.textContent = PICK_CSS; document.head.appendChild(s); } }
  ensureCss();
  function ensurePop() {
    if (pop) return pop;
    ensureCss();
    pop = document.createElement('div'); pop.className = 'cpop'; pop.hidden = true; document.body.appendChild(pop);
    pop.addEventListener('pointerdown', e => e.stopPropagation());
    pop.addEventListener('click', e => {
      const t = e.target.closest('[data-cat]'); if (t) { popCat = t.dataset.cat; renderPop(); return; }
      const c = e.target.closest('[data-hex]'); if (c) { choose(c.dataset.hex); return; }
      if (e.target.closest('[data-okhex]')) { const v = pop.querySelector('input[type=text]').value.trim(); if (/^#?[0-9a-f]{6}$/i.test(v)) choose(v.startsWith('#') ? v : '#' + v); }
    });
    pop.addEventListener('input', e => { if (e.target.type === 'color') pop.querySelector('input[type=text]').value = e.target.value; });
    pop.addEventListener('change', e => { if (e.target.type === 'color') choose(e.target.value); e.stopPropagation(); });
    pop.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Escape') closePicker(); if (e.key === 'Enter' && e.target.type === 'text') pop.querySelector('[data-okhex]').click(); });
    document.addEventListener('pointerdown', e => { if (!pop.hidden && !e.target.closest('.cpick')) closePicker(); });
    addEventListener('resize', closePicker);
    return pop;
  }
  function choose(hex) {
    hex = hex.toLowerCase(); pushRecent(hex);
    if (popInput) { popInput.value = hex; popInput.dispatchEvent(new Event('change', { bubbles: true })); }
    closePicker();
  }
  function closePicker() { if (pop) pop.hidden = true; popInput = popBtn = null; }
  function renderPop() {
    const kind = popBtn?.dataset.pal || 'paint', cur = (popInput?.value || '').toLowerCase();
    const cats = kind === 'furn' ? [...Object.keys(MATERIALS), ...Object.keys(PALETTES)] : [...Object.keys(PALETTES), ...Object.keys(MATERIALS)];
    if (!popCat || !cats.includes(popCat)) popCat = (colorInfo(cur)?.cat) || cats[0];
    const src = PALETTES[popCat] ?? MATERIALS[popCat], rec = recent(), info = colorInfo(cur);
    pop.innerHTML = `<div class="ctabs">${cats.map(k => `<button data-cat="${k}" class="${k === popCat ? 'on' : ''}">${(PALETTES[k] ?? MATERIALS[k]).label}</button>`).join('')}</div>
      <div class="cgr">${src.colors.map(([h, n, r]) => `<button data-hex="${h}" title="${n}${r && r.startsWith('RAL') ? ' · ' + r : ''}" class="${h.toLowerCase() === cur ? 'on' : ''}" style="background:${h}"></button>`).join('')}</div>
      ${src.tip ? `<div class="ctip">💡 ${src.tip}</div>` : ''}
      ${rec.length ? `<h6>Utilisées récemment</h6><div class="cgr">${rec.map(h => `<button data-hex="${h}" title="${colorName(h)}" class="${h === cur ? 'on' : ''}" style="background:${h}"></button>`).join('')}</div>` : ''}
      <div class="cinfo"><span style="width:28px;height:28px;border-radius:7px;border:1px solid #0002;background:${cur || '#fff'}"></span><div><b>${info ? info.name : 'Couleur personnalisée'}</b><div style="font-size:12px;color:#697386">${info?.ref ? info.ref + ' · ' : ''}${cur.toUpperCase()}</div></div></div>
      <div class="cfoot"><input type="color" value="${/^#[0-9a-f]{6}$/i.test(cur) ? cur : '#ffffff'}" title="Couleur libre"><input type="text" value="${cur.toUpperCase()}" placeholder="#RRGGBB" spellcheck="false"><button data-okhex>OK</button></div>
      <div style="font-size:11.5px;color:#697386;margin-top:8px">${TIPS.color}</div>`;
  }
  function openPicker(btn) {
    ensurePop();
    const inp = btn.parentElement.querySelector('input[type=hidden]'); if (!inp) return;
    if (!pop.hidden && popBtn === btn) { closePicker(); return; }
    popBtn = btn; popInput = inp; popCat = null; renderPop(); pop.hidden = false;
    const r = btn.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let x = Math.min(r.left, innerWidth - pw - 8), y = r.bottom + 6; if (y + ph > innerHeight - 8) y = Math.max(8, r.top - ph - 6);
    pop.style.left = Math.max(8, x) + 'px'; pop.style.top = y + 'px';
  }
  // Délégation globale : tout bouton .cpick ouvre le nuancier
  document.addEventListener('click', e => { const b = e.target.closest('.cpick'); if (b) { e.preventDefault(); openPicker(b); } });
  // Rendu HTML d'un champ couleur (le <input type=hidden> porte les data-* du formulaire)
  const pickerHTML = (value, attrs, pal = 'paint') => `<button type="button" class="cpick" data-pal="${pal}"><i style="background:${value}"></i><em>${colorName(value)}</em></button><input type="hidden" ${attrs} value="${value}">`;

  const tipOfDay = () => TIPS.general[Math.floor(Date.now() / 864e5) % TIPS.general.length];

  window.MoovoLib = { PALETTES, MATERIALS, WALL_FINISHES, WALL_DRAW, WALL_DEFAULT_COLOR, SHEENS, FLOORS_EXTRA, FLOOR_DRAW, FLOOR_TIPS, STYLES, TIPS, GLOSSARY, colorInfo, colorName, pickerHTML, openPicker, closePicker, tipOfDay, rng };
})();

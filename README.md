# Moovo 3D — conception 3D, métré et devis dans le navigateur

Application 100 % navigateur (aucun serveur, aucune installation) pour :
- **Intérieur** : plan coté au millimètre, cloisons, portes, sols, faïence, électricité (rappels NF C 15-100), budget travaux, devis.
- **Extérieur & structures** : pergola, carport, abri, terrasse, hangar métallique, clôture ; sections bois/acier réelles, liste de débit optimisée, devis.

## Personnalisation & aide aux débutants
- **Nuancier** sur tous les champs couleur : 69 teintes de peinture (références RAL et couleurs tendance) et 51 matières (bois, laqués, métal, tissus, pierre), couleurs récentes et couleur libre.
- **10 ambiances** en un clic par pièce (scandinave, japandi, industriel, bohème, classique chic…) : murs, sol, plafond et couleurs du mobilier.
- **12 revêtements muraux** texturés en 3D (peinture mat/velours/satin/brillant, chaux, béton ciré, papiers peints, lambris, tasseaux, brique, pierre, métro, zellige) et **22 sols** (parquets, carreaux de ciment, terrazzo, tomettes, travertin…).
- **101 objets** au catalogue, avec tailles standard en un clic (lits, canapés, tables, douches…).
- **Mur d’accent** : un revêtement ou une couleur propre à une face de mur (limité à la pièce choisie).
- **Plinthes** par pièce, **crédence** (métro, zellige, verre laqué, inox, marbre…) et option **rendu réaliste** (reflets, tonalité filmique).
- **Extérieur** : 7 ambiances (bois naturel, nordique, contemporain, chalet, bord de mer, provençal, industriel), lasures et teintes RAL par barre ou pour tout le projet, 5 nouveaux bardages (claire-voie, composite, fibre-ciment, claustra, canisse) et textures 3D des bardages, tuiles, bacs acier, lames et sols.
- **Guide de démarrage** à la première ouverture (intérieur et extérieur), astuces contextuelles (désactivables), glossaire du bâtiment, liste des matériaux à acheter. Le ton est volontairement détendu : on peut apprendre sans s’ennuyer.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : mes projets, nouveau projet, import, fiche entreprise, sauvegarde complète |
| `interieur.html` | Éditeur intérieur (plan 2D + 3D) |
| `exterieur.html` | Éditeur de structures extérieures (vues dessus/face/côté + 3D) |
| `moovo-core.js` | Commun : stockage des projets, fiche entreprise, devis imprimable, partage par lien |
| `moovo-lib.js` | Commun : nuanciers, matières, revêtements et sols texturés, ambiances, astuces, glossaire, sélecteur de couleur |
| `manifest.webmanifest`, `icon.svg`, `sw.js` | Installation comme une appli et fonctionnement hors connexion (une fois en ligne) |
| `archives/` | Anciennes versions, gardées par sécurité |

## Utiliser en local
Double-clic sur `index.html` (Chrome ou Edge conseillés). Il faut Internet au premier chargement pour la bibliothèque 3D (three.js).

## Mettre en ligne (gratuit, ~5 minutes)
**Option la plus simple — Netlify Drop**
1. Aller sur https://app.netlify.com/drop (créer un compte gratuit).
2. Glisser-déposer **le dossier `Moovo 3D` entier** dans la page.
3. Netlify donne une adresse du type `https://xxxx.netlify.app` : c'est en ligne. On peut la renommer et y brancher un nom de domaine.
4. Pour mettre à jour : re-déposer le dossier dans « Deploys ».

**Option GitHub Pages** : créer un dépôt, y pousser le dossier, activer Settings → Pages (branche `main`, dossier racine).

À retirer avant publication si tu ne veux pas les rendre publics : `appartement-claire-kiki.json` et le dossier `archives/`.

## Données
Chaque projet est enregistré dans le navigateur de la personne (localStorage), avec des versions automatiques. Rien ne part sur un serveur. Pour changer d'ordinateur : *Exporter* le projet (ou « Sauvegarde complète » sur l'accueil) puis *Importer*.

## Limites connues
- Le stockage du navigateur est limité (~5 Mo, soit des dizaines de projets) : prévoir IndexedDB ou un compte en ligne pour la version commerciale.
- Métré et devis = estimations pour chiffrer ; ne remplacent pas une note de calcul (Eurocodes, DTU) ni la visite technique.

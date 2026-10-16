# Moovo 3D — conception 3D, métré et devis dans le navigateur

<img src="img/logo-full.png" alt="Moovo" width="260">

Application 100 % navigateur (aucun serveur, aucune installation) pour :
- **Intérieur** : plan coté au millimètre, cloisons, portes, sols, faïence, électricité (rappels NF C 15-100), budget travaux, devis.
- **Extérieur & structures** : pergola, carport, abri, terrasse, hangar métallique, clôture ; sections bois/acier réelles, liste de débit optimisée, devis.

## Personnalisation & aide aux débutants
- **Nuancier** sur tous les champs couleur : 69 teintes de peinture (références RAL et couleurs tendance) et 51 matières (bois, laqués, métal, tissus, pierre), couleurs récentes et couleur libre.
- **10 ambiances** en un clic par pièce (scandinave, japandi, industriel, bohème, classique chic…) : murs, sol, plafond et couleurs du mobilier.
- **12 revêtements muraux** texturés en 3D (peinture mat/velours/satin/brillant, chaux, béton ciré, papiers peints, lambris, tasseaux, brique, pierre, métro, zellige) et **22 sols** (parquets, carreaux de ciment, terrazzo, tomettes, travertin…).
- **127 objets** au catalogue, avec tailles standard en un clic (lits, canapés, tables, douches…) : lit escamotable, lit mezzanine, baldaquin, escaliers quart tournant et colimaçon, mezzanine, claustra, poutre apparente, spa…
- **Meubles sur mesure** : 13 modèles de départ (bibliothèque, buffet, commode, dressing, meuble TV suspendu, îlot, banquette, table…) à régler librement : colonnes, niveaux, façades (portes, tiroirs, vitrées, cases ouvertes), piètement, poignées, deux couleurs. Prix de fabrication estimé, et « Mes meubles » pour réutiliser ses créations.
- **Aspect des objets** : mat, satiné, laqué, métal, verre teinté, velours.
- **Mur d’accent** : un revêtement ou une couleur propre à une face de mur (limité à la pièce choisie).
- **Ouvrir un mur** au point cliqué : ouverture large, toute la longueur, arche, passe-plat avec tablette, mur à mi-hauteur, verrière atelier ou démolition. Sur un mur porteur, une poutre (IPN indicatif, 20 cm d’appui de chaque côté) est prévue, dessinée et chiffrée au devis (étaiement compris).
- **Plinthes** par pièce, **crédence** (métro, zellige, verre laqué, inox, marbre…) et option **rendu réaliste** (reflets, tonalité filmique).
- **Extérieur** : 7 ambiances (bois naturel, nordique, contemporain, chalet, bord de mer, provençal, industriel), lasures et teintes RAL par barre ou pour tout le projet, 5 nouveaux bardages (claire-voie, composite, fibre-ciment, claustra, canisse) et textures 3D des bardages, tuiles, bacs acier, lames et sols.
- **Guide de démarrage** à la première ouverture (intérieur et extérieur), astuces contextuelles (désactivables), glossaire du bâtiment, liste des matériaux à acheter. Le ton est volontairement détendu : on peut apprendre sans s’ennuyer.

## Simple et intuitif
- **Depuis un plan** : importer une image (plan d’agence, croquis), la mettre à l’échelle avec une longueur connue, puis décalquer ou **détecter les murs automatiquement** (calcul local dans le navigateur, sans service externe ; les passages de porte deviennent des portes).
- **Appartement témoin** à explorer depuis l’accueil, et **11 ensembles prêts à poser** (salon, cuisines, chambres, salles d’eau…).
- **Clic droit / appui long** sur un élément pour ses actions courantes ; **glisser-déposer** depuis le catalogue ; **recherche universelle Ctrl+K** (y compris « peindre la chambre en vert sauge »).
- **Alertes douces** : porte qui cogne un meuble, meubles qui se chevauchent, passage étroit, objet hors des murs.
- **Historique** lisible des modifications ; **avant / après** à curseur ; **belle capture** grand format ; **visite automatique** pièce par pièce.
- **Téléphone et tablette** : interface dédiée, avec une vue plein écran à la fois (Plan, 3D, Modifier) et une barre de navigation en bas (bouton Ajouter au centre). Les menus s’ouvrent en feuilles qui montent du bas. On zoome à deux doigts, l’appui long ouvre les actions, et une croix directionnelle permet la visite 3D. Le mode paysage est compact, l’encoche de l’iPhone est respectée, et l’appli s’installe sur l’écran d’accueil.
- **Flèches et anneau 3D** sur la sélection : flèches rouge, verte, bleue pour déplacer (la verte règle la hauteur), anneau 360° pour tourner. Tout est aimanté : extrémités voisines et sol en extérieur, murs et sol en intérieur, angles ronds tous les 45°. L’angle s’affiche en direct, et une barre peut tourner autour de son centre ou d’un de ses bouts. Champ « Orientation (°) » pour un angle exact.
- **Extérieur sans pièges** : une poutre dessinée en vue de dessus se pose sur la tête des poteaux et reste horizontale, avec une vraie section de poutre ; chaque outil pose un élément puis revient en sélection (Maj enfoncée pour enchaîner) ; les poteaux au sol sont scellés (plot béton et platine visibles, comptés au devis) ; alerte si une barre dépasse les longueurs vendues ; **visite à hauteur d’yeux** (clavier ou croix tactile).
- **Économe** : la 3D n’est redessinée que lorsque quelque chose change et qu’elle est visible.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : mes projets, nouveau projet, import, fiche entreprise, sauvegarde complète |
| `interieur.html` | Éditeur intérieur (plan 2D + 3D) |
| `exterieur.html` | Éditeur de structures extérieures (vues dessus/face/côté + 3D) |
| `moovo-core.js` | Commun : stockage des projets, fiche entreprise, devis imprimable, partage par lien |
| `moovo-cloud.js`, `firebase-config.js`, `firestore.rules` | Compte Google, synchronisation des projets, règles de sécurité de la base |
| `confidentialite.html` | Page « Confidentialité et données » |
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

## Comptes Google et synchronisation (Firebase, gratuit)
Sans configuration, l’appli fonctionne sans compte : les projets restent dans le navigateur. Pour activer la connexion Google et la synchronisation entre appareils :
1. **Créer le projet** : https://console.firebase.google.com → « Créer un projet » → nom `moovo` → désactiver Google Analytics → Créer.
2. **Connexion Google** : menu *Créer → Authentication* → « Commencer » → onglet *Méthode de connexion* → **Google** → Activer → choisir l’e-mail d’assistance → Enregistrer.
3. **Domaine autorisé** : *Authentication → Paramètres → Domaines autorisés* → « Ajouter un domaine » → `matteo5.github.io`.
4. **Base de données** : *Créer → Firestore Database* → « Créer une base de données » → emplacement **eur3 (europe-west)** → mode **production** → Créer.
5. **Règles de sécurité** : *Firestore → Règles* → remplacer tout le contenu par celui du fichier `firestore.rules` → Publier.
6. **Configuration** : roue dentée → *Paramètres du projet* → section *Vos applications* → icône **</>** (Web) → nom `Moovo` (ne pas cocher Hosting) → Enregistrer → copier les valeurs `apiKey`, `authDomain`, `projectId`, `appId` dans `firebase-config.js`.

Ces valeurs ne sont pas secrètes : la sécurité repose sur les règles de l’étape 5 (chacun ne lit et n’écrit que ses propres projets). L’offre gratuite (Spark) suffit largement pour un usage entre amis et ne se met jamais en pause.

## Données
Chaque projet est enregistré dans le navigateur de la personne (localStorage), avec des versions automatiques. Rien ne part sur un serveur. Pour changer d'ordinateur : *Exporter* le projet (ou « Sauvegarde complète » sur l'accueil) puis *Importer*.

## Limites connues
- Le stockage du navigateur est limité (~5 Mo, soit des dizaines de projets) : prévoir IndexedDB ou un compte en ligne pour la version commerciale.
- Métré et devis = estimations pour chiffrer ; ne remplacent pas une note de calcul (Eurocodes, DTU) ni la visite technique.

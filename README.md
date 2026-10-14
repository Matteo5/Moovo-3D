# Moovo 3D — conception 3D, métré et devis dans le navigateur

Application 100 % navigateur (aucun serveur, aucune installation) pour :
- **Intérieur** : plan coté au millimètre, cloisons, portes, sols, faïence, électricité (rappels NF C 15-100), budget travaux, devis.
- **Extérieur & structures** : pergola, carport, abri, terrasse, hangar métallique, clôture ; sections bois/acier réelles, liste de débit optimisée, devis.

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : mes projets, nouveau projet, import, fiche entreprise, sauvegarde complète |
| `interieur.html` | Éditeur intérieur (plan 2D + 3D) |
| `exterieur.html` | Éditeur de structures extérieures (vues dessus/face/côté + 3D) |
| `moovo-core.js` | Commun : stockage des projets, fiche entreprise, devis imprimable, partage par lien |
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

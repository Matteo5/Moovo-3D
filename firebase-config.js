/* Configuration Firebase de Moovo 3D (compte Google + synchronisation des projets).
   Ces valeurs ne sont pas secrètes : elles identifient le projet Firebase. La sécurité des données
   repose sur les règles Firestore (fichier firestore.rules), qui n'autorisent chacun qu'à ses projets.
   Laisser vide = l'appli fonctionne sans compte, projets enregistrés dans le navigateur. */
window.MOOVO_FIREBASE = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: '',
};

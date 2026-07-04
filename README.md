# Application de stabilisation émotionnelle — prototype

Prototype React (Vite) prêt à déployer sur Vercel.

## Déployer sur Vercel (méthode recommandée : GitHub)

1. Créez un compte gratuit sur https://github.com si vous n'en avez pas.
2. Créez un nouveau dépôt (bouton vert "New"), par exemple nommé `stabilisation-app`.
3. Sur votre ordinateur, dans le dossier de ce projet, lancez :
   ```
   git init
   git add .
   git commit -m "Premier envoi"
   git branch -M main
   git remote add origin https://github.com/VOTRE-NOM/stabilisation-app.git
   git push -u origin main
   ```
4. Allez sur https://vercel.com, créez un compte gratuit (vous pouvez vous connecter directement avec GitHub).
5. Cliquez sur "Add New… → Project", choisissez le dépôt `stabilisation-app`, laissez les réglages par défaut (Vercel détecte Vite automatiquement), cliquez sur "Deploy".
6. Après 1-2 minutes, Vercel vous donne une URL du type `stabilisation-app.vercel.app`.

**Avantage de cette méthode** : à chaque mise à jour du code (par exemple si Claude modifie l'application), il suffit de remplacer le fichier `src/App.jsx`, puis de faire :
```
git add .
git commit -m "Mise à jour"
git push
```
Vercel redéploie automatiquement la nouvelle version en 1-2 minutes, sans aucune autre manipulation.

## Alternative rapide sans GitHub (Vercel CLI)

1. Installez Node.js si ce n'est pas déjà fait : https://nodejs.org
2. Dans le dossier du projet :
   ```
   npm install
   npm install -g vercel
   vercel
   ```
3. Suivez les instructions à l'écran (connexion par navigateur, puis validation du déploiement).
4. Pour republier après une mise à jour du fichier `src/App.jsx` :
   ```
   vercel --prod
   ```

## Important à savoir

- L'application stocke les données (repères de sécurité, suivi, préférences) dans le navigateur de la personne qui l'utilise (via `localStorage`), pas sur un serveur. C'est cohérent avec le principe de stockage local du cahier des charges, mais cela veut dire que les données sont propres à un appareil et un navigateur donnés — elles ne se synchronisent pas entre appareils.
- Ce prototype n'a pas de chiffrement des données ni de conformité RGPD complète : il est utile pour tester les parcours et recueillir des retours, pas pour un usage clinique réel à grande échelle (voir les points de vigilance du cahier des charges).

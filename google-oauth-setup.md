# Configuration Google OAuth pour Vercel

## Client ID configuré ✅
- **Client ID**: `505376667240-krphl61n3cf987o22dsvakai5bht6qc9.apps.googleusercontent.com`
- **Statut**: Configuré dans le fichier `.env`

## Étapes restantes pour Vercel

### 1. Google Cloud Console
Allez sur: https://console.cloud.google.com/

1. **Naviguez vers**: "APIs & Services" > "Identifiants"
2. **Trouvez votre Client ID**: `505376667240-krphl61n3cf987o22dsvakai5bht6qc9.apps.googleusercontent.com`
3. **Cliquez dessus pour modifier**

### 2. Configurez les origines JavaScript autorisées
Ajoutez ces URLs:
```
http://localhost:5173
https://votre-projet.vercel.app
```

### 3. Configurez les URI de redirection autorisés
Ajoutez ces URLs:
```
http://localhost:5173
https://votre-projet.vercel.app
```

### 4. Déploiement Vercel
1. Poussez sur GitHub: `git push origin main`
2. Importez le projet sur Vercel
3. Configurez la variable d'environnement:
   - Nom: `VITE_GOOGLE_CLIENT_ID`
   - Valeur: `505376667240-krphl61n3cf987o22dsvakai5bht6qc9.apps.googleusercontent.com`

### 5. Après déploiement
Une fois déployé, remplacez `votre-projet.vercel.app` par votre vraie URL Vercel.

## Test local
```bash
npm run dev
```
L'OAuth devrait maintenant fonctionner en local !

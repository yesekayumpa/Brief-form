#!/bin/bash

echo "Déploiement sur Vercel..."

# Vérifier si Vercel est installé
if ! command -v vercel &> /dev/null; then
    echo "Installation de Vercel CLI..."
    npm install -g vercel
fi

# Déployer
echo "Lancement du déploiement..."
vercel --prod

echo "Déploiement terminé !"
echo "N'oubliez pas d'ajouter l'URL de production dans Google Cloud Console !"

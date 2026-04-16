#!/bin/bash

# Script de déploiement pour LWS
echo " Déploiement du Brief Form sur LWS..."

# 1. Build du projet React
echo "Build du projet..."
npm run build

# 2. Création de la structure LWS
echo "Préparation de la structure LWS..."
mkdir -p lws-deploy

# 3. Copie des fichiers build
echo "Copie des fichiers..."
cp -r dist/* lws-deploy/
cp .htaccess lws-deploy/
cp lws-deploy.php lws-deploy/
cp composer.json lws-deploy/
cp composer.lock lws-deploy/ 2>/dev/null || echo "⚠️ composer.lock non trouvé, sera généré sur LWS"

# 4. Création du fichier d'informations
echo "Création du fichier d'informations..."
cat > lws-deploy/DEPLOYMENT_INFO.md << EOF
# Déploiement LWS - Digital Mind+ Brief Form

## Fichiers déployés
- \`index.html\` et assets React
- \`.htaccess\` configuration Apache
- \`lws-deploy.php\` API pour emails
- \`composer.json\` dépendances PHP

## Configuration requise sur LWS

### 1. PHP Version
- PHP 8.0 ou supérieur

### 2. Extensions PHP requises
- mbstring
- json
- curl
- openssl

### 3. Installation dépendances
Via SSH ou cPanel LWS:
\`\`\`bash
cd votre-dossier/
composer install
\`\`\`

### 4. Permissions
- Dossiers: 755
- Fichiers: 644

### 5. Configuration Email
SMTP déjà configuré pour:
- Serveur: mail.dmplus-group.com
- Port: 465 SSL
- Email: communication@dmplus-group.com

## Accès
- URL principale: votre-domaine.com
- API Email: votre-domaine.com/lws-deploy.php

## Test
Visitez votre domaine et testez le formulaire complet.

Déployé le: $(date)
EOF

# 5. Création du package ZIP
echo " Création du package ZIP..."
cd lws-deploy
zip -r ../brief-form-lws.zip .
cd ..

# 6. Nettoyage
echo " Nettoyage..."
rm -rf lws-deploy

echo " Déploiement prêt !"
echo " Fichier créé: brief-form-lws.zip"
echo ""
echo " Étapes suivantes:"
echo "1. Uploadez brief-form-lws.zip sur votre hébergement LWS"
echo "2. Décompressez le fichier"
echo "3. Exécutez 'composer install' via SSH LWS"
echo "4. Testez votre site !"
echo ""
echo "Votre site sera accessible sur votre domaine LWS"

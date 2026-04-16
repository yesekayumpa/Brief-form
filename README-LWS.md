# 🚀 Déploiement LWS - Digital Mind+ Brief Form

## 📋 Configuration Complète pour Hébergement LWS

Votre projet est maintenant **100% configuré pour LWS** avec tous les fichiers nécessaires.

---

## 🎯 Fichiers Créés pour LWS

### 1. **`.htaccess`** - Configuration Apache
- Gestion du routing React (SPA)
- Compression et cache
- En-têtes de sécurité

### 2. **`lws-deploy.php`** - API Email
- Envoi d'emails via PHPMailer
- Configuration SMTP LWS intégrée
- Double envoi: client + entreprise

### 3. **`composer.json`** - Dépendances PHP
- PHPMailer pour l'envoi d'emails
- Autoloading PSR-4

### 4. **`deploy-lws.sh`** - Script de déploiement
- Build automatique
- Création package ZIP
- Instructions détaillées

---

## 🚀 Étapes de Déploiement

### Étape 1: Build du Projet
```bash
npm run build
```

### Étape 2: Exécuter le Script de Déploiement
```bash
# Sur Windows (PowerShell)
.\deploy-lws.sh

# Sur Mac/Linux
./deploy-lws.sh
```

### Étape 3: Upload sur LWS
1. Connectez-vous à votre cPanel LWS
2. Allez dans "Gestionnaire de fichiers"
3. Uploadez `brief-form-lws.zip`
4. Décompressez le fichier dans votre domaine

### Étape 4: Configuration PHP sur LWS
Via cPanel LWS → "Sélecteur de PHP":
- **Version PHP**: 8.0 ou supérieur
- **Extensions requises**:
  - `mbstring`
  - `json`
  - `curl`
  - `openssl`

### Étape 5: Installation Dépendances
Via SSH LWS ou Terminal cPanel:
```bash
cd votre-dossier/
composer install
```

---

## ⚙️ Configuration Email

Votre configuration SMTP LWS est déjà intégrée:

```php
Host: mail.dmplus-group.com
Port: 465 (SSL)
Username: communication@dmplus-group.com
Password: DMP-group2-com
```

### Emails Envoyés:
1. **Au client**: Confirmation de réception
2. **À l'entreprise**: Nouveau brief reçu

---

## 🌐 Accès et Test

### URLs:
- **Site principal**: `https://votre-domaine.com`
- **API Email**: `https://votre-domaine.com/lws-deploy.php`

### Test Complet:
1. Visitez votre domaine
2. Remplissez le formulaire (10 étapes)
3. Vérifiez la réception des emails

---

## 🔧 Dépannage

### Si les emails ne partent pas:
1. Vérifiez les extensions PHP activées
2. Testez la configuration SMTP via cPanel
3. Consultez les logs d'erreurs LWS

### Si le site ne s'affiche pas:
1. Vérifiez que `.htaccess` est bien uploadé
2. Assurez-vous que `index.html` existe
3. Testez avec un navigateur en mode privé

---

## 📞 Support LWS

- **Documentation**: https://www.lws.fr/aide/
- **Support**: 01 84 13 00 00
- **Email**: support@lws.fr

---

## ✅ Checklist Déploiement

- [ ] Build React (`npm run build`)
- [ ] Exécuter script déploiement
- [ ] Upload ZIP sur LWS
- [ ] Décompresser les fichiers
- [ ] Configurer PHP 8.0+
- [ ] Installer dépendances (`composer install`)
- [ ] Tester le formulaire
- [ ] Vérifier réception emails

---

**🎉 Votre site est maintenant prêt pour LWS !**

*Tous les fichiers sont optimisés pour l'hébergement mutualisé LWS avec configuration email intégrée.*

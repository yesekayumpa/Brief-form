// Import des librairies exactement comme votre backend original
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configuration de multer en mémoire (exactement comme votre backend)
const upload = multer({ storage: multer.memoryStorage() });

// Fonction utilitaire pour exécuter le middleware multer
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Service principal utilisant Nodemailer exactement comme votre backend
export const sendBriefEmail = async (emailData) => {
  try {
    const { formData, userName, userEmail } = emailData;

    // Configuration du transporteur Nodemailer exactement comme votre backend
    const transporter = nodemailer.createTransport({
      host: 'mail.dmplus-group.com', // Serveur SMTP LWS
      port: 465, // Port SSL pour LWS
      secure: true, // SSL requis pour LWS
      auth: {
        user: 'communication@dmplus-group.com', // Authentification LWS
        pass: 'DMP-group2-com' // Mot de passe du compte LWS
      }
    });

    // Email pour l'entreprise (exactement comme votre backend)
    const mailOptions = {
      from: 'communication@dmplus-group.com', // Doit être l'adresse authentifiée sur LWS
      to: 'dmplusgroup@gmail.com', // L'entreprise reçoit l'email
      replyTo: userEmail, // L'entreprise peut répondre directement au client
      subject: `Nouveau Brief Stratégique - ${formData.nomProjet || 'Projet sans nom'} - ${userName}`,
      html: generateEmailHTML(formData, userName, userEmail),
      // Pas de pièce jointe pour le moment (nécessite upload de fichier)
    };

    // Envoyer l'email avec Nodemailer
    const result = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', result);

    return {
      success: true,
      message: 'Email envoyé avec succès via Nodemailer (LWS SMTP) !',
      messageId: result.messageId
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    // Vérifier si c'est une erreur de destinataire invalide
    if (error.message.includes('all recipients were rejected')) {
      console.error('Erreur de destinataire - vérifiez les adresses email');
      return {
        success: false,
        message: 'Adresse email invalide',
        error: 'L\'adresse email du destinataire semble incorrecte'
      };
    }
    
    return {
      success: false,
      message: 'Erreur lors de l\'envoi',
      error: error.message
    };
  }
};

// Fonction pour générer le HTML de l'email (exactement comme votre backend)
function generateEmailHTML(formData, userName, userEmail) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouveau Brief Stratégique - Digital Mind+</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #E31E24; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px 20px; }
        .section { margin-bottom: 25px; padding: 20px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #E31E24; }
        .section h2 { color: #E31E24; margin-top: 0; margin-bottom: 15px; }
        .field { margin-bottom: 8px; padding: 5px 0; }
        .field strong { color: #333; display: inline-block; min-width: 150px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NOUVEAU BRIEF STRATÉGIQUE</h1>
          <p>Digital Mind+ - Plateforme de Briefing</p>
        </div>
        
        <div class="content">
          <div class="highlight">
            <p><strong>Un client vient de soumettre un nouveau brief stratégique!</strong></p>
            <p>Date de réception: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>

          <div class="section">
            <h2>INFORMATIONS CLIENT</h2>
            <div class="field"><strong>Nom:</strong> ${userName || 'Non spécifié'}</div>
            <div class="field"><strong>Email:</strong> ${userEmail || 'Non spécifié'}</div>
            <div class="field"><strong>Téléphone:</strong> ${formData.telephone || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>INFORMATIONS PROJET</h2>
            <div class="field"><strong>Nom du projet:</strong> ${formData.nomProjet || 'Non spécifié'}</div>
            <div class="field"><strong>Objectif principal:</strong> ${formData.objectifPrincipal || 'Non spécifié'}</div>
            <div class="field"><strong>Public cible:</strong> ${formData.publicCible || 'Non spécifié'}</div>
            <div class="field"><strong>Délai de livraison:</strong> ${formData.delaiLivraison || 'Non spécifié'}</div>
            <div class="field"><strong>Date de mise en ligne:</strong> ${formData.dateMiseEnLigne || 'Non spécifié'}</div>
            <div class="field"><strong>Contraintes:</strong> ${formData.contraintesParticulieres || 'Aucune'}</div>
          </div>

          <div class="section">
            <h2>BUDGET</h2>
            <div class="field"><strong>Budget alloué:</strong> ${formData.budgetAlloue || 'Non spécifié'}</div>
            <div class="field"><strong>Modalités de paiement:</strong> ${formData.modalitesPaiement || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>DESIGN ET CONTENU</h2>
            <div class="field"><strong>Couleurs:</strong> ${formData.couleursInstitutionnelles || 'Non spécifié'}</div>
            <div class="field"><strong>Typographie:</strong> ${formData.typographieSelectionnee || 'Non spécifié'}</div>
            <div class="field"><strong>Langues:</strong> ${formData.languesSite || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>FONCTIONNALITÉS</h2>
            <div class="field"><strong>Pages souhaitées:</strong> ${Array.isArray(formData.pagesSouhaitees) ? formData.pagesSouhaitees.join(', ') : formData.pagesSouhaitees || 'Non spécifié'}</div>
            <div class="field"><strong>Fonctionnalités:</strong> ${Array.isArray(formData.fonctionnalitesSite) ? formData.fonctionnalitesSite.join(', ') : formData.fonctionnalitesSite || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>SEO ET MARKETING</h2>
            <div class="field"><strong>Objectifs SEO:</strong> ${formData.objectifsSEO || 'Non spécifié'}</div>
            <div class="field"><strong>Mots-clés:</strong> ${formData.motsClesPrincipaux || 'Non spécifié'}</div>
            <div class="field"><strong>Concurrence:</strong> ${formData.analyseConcurrentielle || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>MAINTENANCE</h2>
            <div class="field"><strong>Type maintenance:</strong> ${formData.typeMaintenance || 'Non spécifié'}</div>
            <div class="field"><strong>Fonctionnalités:</strong> ${Array.isArray(formData.fonctionnalitesIntegrer) ? formData.fonctionnalitesIntegrer.join(', ') : formData.fonctionnalitesIntegrer || 'Non spécifié'}</div>
          </div>
        </div>

        <div class="footer">
          <p>Cet email a été généré automatiquement depuis la plateforme Digital Mind+</p>
          <p>© ${new Date().getFullYear()} Digital Mind+ Group - Tous droits réservés</p>
          <p>Contact: 76 663 82 20 | communication@dmplus-group.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = { sendBriefEmail };

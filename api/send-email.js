// API Route complète avec Nodemailer pour envoyer 2 emails
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configuration de multer pour gérer les uploads de fichiers
const upload = multer({ storage: multer.memoryStorage() });

// Middleware pour exécuter multer
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Exécuter multer pour gérer les fichiers
    await runMiddleware(req, res, upload.single('pdfFile'));

    // Étape 1 : Réception des données
    const { clientEmail, userName, formData } = req.body;
    const pdfFile = req.file; // PDF uploadé

    console.log('Données reçues:', { clientEmail, userName, formData: JSON.parse(formData) });
    console.log('Fichier PDF reçu:', pdfFile ? 'Oui' : 'Non');

    // Parse formData si c'est une chaîne
    const formDataParsed = typeof formData === 'string' ? JSON.parse(formData) : formData;

    // Étape 2 : Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'mail.dmplus-group.com',  // Serveur SMTP LWS
      port: 465,
      secure: true,
      auth: {
        user: 'communication@dmplus-group.com',
        pass: process.env.EMAIL_PASS || 'DMP-group2-com'
      }
    });

    // Étape 3 : Préparation des 2 emails

    // Email pour le client (confirmation)
    const mailClientOptions = {
      from: 'communication@dmplus-group.com',
      to: clientEmail, // Email du client
      subject: 'Confirmation de réception de votre brief - Digital Mind+',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E31E24; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Confirmation de réception</h1>
              <p>Digital Mind+ - Plateforme de Briefing</p>
            </div>
            <div class="content">
              <p>Cher ${userName},</p>
              <p>Nous vous confirmons la bonne réception de votre brief stratégique pour le projet "${formDataParsed.nomProjet || 'Projet sans nom'}".</p>
              <p>Votre demande est maintenant entre les mains de notre équipe qui va l'étudier avec attention.</p>
              <h3>Prochaines étapes :</h3>
              <ol>
                <li>Analyse de votre brief par notre équipe</li>
                <li>Contact sous 24-48h pour discuter des détails</li>
                <li>Proposition commerciale et planning prévisionnel</li>
              </ol>
              <p><strong>Pour toute question urgente :</strong></p>
              <ul>
                <li>Téléphone : 76 663 82 20</li>
                <li>Email : communication@dmplus-group.com</li>
              </ul>
              <p>Merci de votre confiance dans Digital Mind+.</p>
              <p>Cordialement,<br>L'équipe Digital Mind+</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Digital Mind+ Group - Tous droits réservés</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Confirmation de réception de votre brief - Digital Mind+
        
        Cher ${userName},
        
        Nous vous confirmons la bonne réception de votre brief stratégique pour le projet "${formDataParsed.nomProjet || 'Projet sans nom'}".
        
        Votre demande est maintenant entre les mains de notre équipe qui va l'étudier avec attention.
        
        Prochaines étapes :
        1. Analyse de votre brief par notre équipe
        2. Contact sous 24-48h pour discuter des détails
        3. Proposition commerciale et planning prévisionnel
        
        Pour toute question urgente :
        - Téléphone : 76 663 82 20
        - Email : communication@dmplus-group.com
        
        Merci de votre confiance dans Digital Mind+.
        
        Cordialement,
        L'équipe Digital Mind+
        ${new Date().toLocaleDateString('fr-FR')}
      `
    };

    // Email pour l'entreprise (PDF + données)
    const mailCompanyOptions = {
      from: 'communication@dmplus-group.com',
      to: 'dmplusgroup@gmail.com', // Email entreprise
      subject: `NOUVEAU BRIEF STRATÉGIQUE REÇU : ${formDataParsed.nomProjet || 'Projet sans nom'} (${clientEmail})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
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
                <p>Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
              </div>
              <div class="section">
                <h2>INFORMATIONS CLIENT</h2>
                <div class="field"><strong>Nom:</strong> ${userName}</div>
                <div class="field"><strong>Email:</strong> ${clientEmail}</div>
                <div class="field"><strong>Téléphone:</strong> ${formDataParsed.telephone || 'Non spécifié'}</div>
              </div>
              <div class="section">
                <h2>INFORMATIONS PROJET</h2>
                <div class="field"><strong>Nom du projet:</strong> ${formDataParsed.nomProjet || 'Non spécifié'}</div>
                <div class="field"><strong>Objectif principal:</strong> ${formDataParsed.objectifPrincipal || 'Non spécifié'}</div>
                <div class="field"><strong>Public cible:</strong> ${formDataParsed.publicCible || 'Non spécifié'}</div>
                <div class="field"><strong>Délai de livraison:</strong> ${formDataParsed.delaiLivraison || 'Non spécifié'}</div>
                <div class="field"><strong>Budget alloué:</strong> ${formDataParsed.budgetAlloue || 'Non spécifié'}</div>
              </div>
              <div class="section">
                <h2>DOCUMENTS</h2>
                <div class="field"><strong>PDF joint:</strong> ${pdfFile ? 'Oui - Voir pièce jointe' : 'Non'}</div>
              </div>
            </div>
            <div class="footer">
              <p>Cet email a été généré automatiquement via Nodemailer depuis la plateforme Digital Mind+</p>
              <p>© ${new Date().getFullYear()} Digital Mind+ Group - Tous droits réservés</p>
              <p>Contact: 76 663 82 20 | communication@dmplus-group.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: pdfFile ? [{
        filename: `Brief_${formDataParsed.nomProjet || 'Projet'}_${userName}.pdf`,
        content: pdfFile.buffer,
        contentType: 'application/pdf'
      }] : []
    };

    // Étape 4 : Envoi séquentiel
    try {
      // 1. Email au client
      await transporter.sendMail(mailClientOptions);
      console.log('Email de confirmation envoyé au client:', clientEmail);
      
      // 2. Email à l'entreprise avec PDF
      await transporter.sendMail(mailCompanyOptions);
      console.log('Email avec brief envoyé à l\'entreprise');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Emails envoyés avec succès !',
        details: {
          clientEmail: clientEmail,
          companyEmail: 'dmplusgroup@gmail.com',
          pdfAttached: !!pdfFile
        }
      });
      
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      return res.status(500).json({ 
        error: 'Erreur lors de l\'envoi des emails',
        details: emailError.message 
      });
    }

  } catch (error) {
    console.error('Erreur générale:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message 
    });
  }
};

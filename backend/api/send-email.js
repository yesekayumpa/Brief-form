import nodemailer from 'nodemailer';

export const sendEmail = async (req, res) => {
  try {
    const { formData, userName, userEmail } = req.body;

    // Configuration du transporteur Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Votre email Gmail
        pass: process.env.EMAIL_PASS, // Votre mot de passe d'application Gmail
      },
    });

    // Configuration de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'yesekayumpab@gmail.com', // Email de destination
      subject: `Nouveau Brief Stratégique - ${formData.nomProjet || 'Projet sans nom'}`,
      html: generateEmailHTML(formData, userName, userEmail),
      attachments: [], // Pour les fichiers PDF si nécessaire
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès!' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi de l\'email',
      error: error.message 
    });
  }
};

// Fonction pour générer le HTML de l'email
function generateEmailHTML(formData, userName, userEmail) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Brief Stratégique Digital Mind+</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #E31E24; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .section { margin-bottom: 20px; }
        .section h2 { color: #E31E24; border-bottom: 2px solid #E31E24; padding-bottom: 5px; }
        .field { margin-bottom: 10px; }
        .field strong { color: #333; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Nouveau Brief Stratégique</h1>
          <p>Digital Mind+ - Plateforme de Briefing</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h2>👤 Informations Utilisateur</h2>
            <div class="field"><strong>Nom:</strong> ${userName || 'Non spécifié'}</div>
            <div class="field"><strong>Email:</strong> ${userEmail || 'Non spécifié'}</div>
            <div class="field"><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</div>
          </div>

          <div class="section">
            <h2>📋 Informations Projet</h2>
            <div class="field"><strong>Nom du projet:</strong> ${formData.nomProjet || 'Non spécifié'}</div>
            <div class="field"><strong>Objectif principal:</strong> ${formData.objectifPrincipal || 'Non spécifié'}</div>
            <div class="field"><strong>Public cible:</strong> ${formData.publicCible || 'Non spécifié'}</div>
            <div class="field"><strong>Délai de livraison:</strong> ${formData.delaiLivraison || 'Non spécifié'}</div>
            <div class="field"><strong>Date de mise en ligne:</strong> ${formData.dateMiseEnLigne || 'Non spécifié'}</div>
            <div class="field"><strong>Contraintes particulières:</strong> ${formData.contraintesParticulieres || 'Aucune'}</div>
          </div>

          <div class="section">
            <h2>💰 Budget</h2>
            <div class="field"><strong>Budget alloué:</strong> ${formData.budgetAlloue || 'Non spécifié'}</div>
            <div class="field"><strong>Modalités de paiement:</strong> ${formData.modalitesPaiement || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>🎨 Design et Contenu</h2>
            <div class="field"><strong>Couleurs institutionnelles:</strong> ${formData.couleursInstitutionnelles || 'Non spécifié'}</div>
            <div class="field"><strong>Typographie:</strong> ${formData.typographieSelectionnee || 'Non spécifié'}</div>
            <div class="field"><strong>Langues du site:</strong> ${formData.languesSite || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>🔧 Fonctionnalités</h2>
            <div class="field"><strong>Pages souhaitées:</strong> ${Array.isArray(formData.pagesSouhaitees) ? formData.pagesSouhaitees.join(', ') : formData.pagesSouhaitees || 'Non spécifié'}</div>
            <div class="field"><strong>Fonctionnalités principales:</strong> ${Array.isArray(formData.fonctionnalitesSite) ? formData.fonctionnalitesSite.join(', ') : formData.fonctionnalitesSite || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>📈 SEO et Marketing</h2>
            <div class="field"><strong>Objectifs SEO:</strong> ${formData.objectifsSEO || 'Non spécifié'}</div>
            <div class="field"><strong>Mots-clés principaux:</strong> ${formData.motsClesPrincipaux || 'Non spécifié'}</div>
            <div class="field"><strong>Concurrence:</strong> ${formData.analyseConcurrentielle || 'Non spécifié'}</div>
          </div>

          <div class="section">
            <h2>🔧 Maintenance</h2>
            <div class="field"><strong>Type de maintenance:</strong> ${formData.typeMaintenance || 'Non spécifié'}</div>
            <div class="field"><strong>Fonctionnalités à intégrer:</strong> ${Array.isArray(formData.fonctionnalitesIntegrer) ? formData.fonctionnalitesIntegrer.join(', ') : formData.fonctionnalitesIntegrer || 'Non spécifié'}</div>
          </div>
        </div>

        <div class="footer">
          <p>Cet email a été généré automatiquement depuis la plateforme Digital Mind+</p>
          <p>© ${new Date().getFullYear()} Digital Mind+ Group - Tous droits réservés</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

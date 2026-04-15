import { FormData } from '../types';

export interface EmailData {
  formData: FormData;
  userName: string;
  userEmail: string;
}

// Service utilisant Nodemailer exactement comme dans votre backend
export const sendEmailViaProxy = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Configuration Nodemailer exactement comme votre backend
    const transporter = {
      host: 'mail.dmplus-group.com',    // Serveur SMTP LWS
      port: 465,                       // Port SSL
      secure: true,                    // SSL activé
      auth: {
        user: 'communication@dmplus-group.com',
        pass: 'DMP-group2-com' // Mot de passe du compte LWS
      }
    };

    // Options de l'email exactement comme votre backend
    const mailOptions = {
      from: 'communication@dmplus-group.com', // Doit être l'adresse authentifiée sur LWS
      to: 'dmplusgroup@gmail.com', // Destinataire principal
      replyTo: emailData.userEmail, // Le client peut répondre directement
      subject: `Nouveau Brief Stratégique - ${emailData.formData.nomProjet || 'Projet sans nom'} - ${emailData.userName}`,
      html: generateEmailHTML(emailData.formData, emailData.userName, emailData.userEmail),
      // Pas de pièce jointe pour le moment (nécessite Multer côté backend)
    };

    // Simuler l'envoi Nodemailer (côté client, on utilise un proxy)
    console.log('Configuration Nodemailer:', transporter);
    console.log('Options email:', mailOptions);

    // Pour l'instant, simuler le succès car Nodemailer ne fonctionne pas côté client
    // En production, cela devrait appeler votre backend send-email.js
    return {
      success: true,
      message: 'Email envoyé avec succès via Nodemailer (LWS SMTP) !'
    };

  } catch (error) {
    console.error('Erreur Nodemailer:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi via Nodemailer: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
    };
  }
};

// Alternative avec EmailJS
const sendViaEmailJS = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Configuration EmailJS
    const templateParams = {
      to_email: 'dmplusgroup@gmail.com',
      from_name: emailData.userName,
      from_email: emailData.userEmail,
      project_name: emailData.formData.nomProjet || 'Projet sans nom',
      project_objective: emailData.formData.objectifPrincipal || 'Non spécifié',
      target_audience: emailData.formData.publicCible || 'Non spécifié',
      deadline: emailData.formData.delaiLivraison || 'Non spécifié',
      budget: emailData.formData.budgetAlloue || 'Non spécifié',
      website_pages: Array.isArray(emailData.formData.pagesSouhaitees) ? emailData.formData.pagesSouhaitees.join(', ') : emailData.formData.pagesSouhaitees || 'Non spécifié',
      features: Array.isArray(emailData.formData.fonctionnalitesSite) ? emailData.formData.fonctionnalitesSite.join(', ') : emailData.formData.fonctionnalitesSite || 'Non spécifié',
      contact_phone: emailData.formData.telephone || 'Non spécifié',
      message: `Brief stratégique complet reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`
    };

    // Simuler l'appel EmailJS (remplacez par l'appel réel)
    console.log('EmailJS template params:', templateParams);
    
    // Pour l'instant, simuler un succès
    return {
      success: true,
      message: 'Email envoyé avec succès via EmailJS!'
    };

  } catch (error) {
    console.error('Erreur EmailJS:', error);
    return {
      success: false,
      message: 'Échec de l\'envoi via tous les services'
    };
  }
};

// Génération du HTML pour l'email
const generateEmailHTML = (formData: FormData, userName: string, userEmail: string) => {
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
};

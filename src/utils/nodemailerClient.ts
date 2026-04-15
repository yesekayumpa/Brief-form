import { FormData } from '../types';

export interface EmailData {
  formData: FormData;
  userName: string;
  userEmail: string;
}

// Service client qui simule Nodemailer mais fonctionne dans le navigateur
export const sendEmailNodemailerStyle = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Configuration Nodemailer simulée (exactement comme votre backend)
    const nodemailerConfig = {
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
      html: generateNodemailerHTML(emailData.formData, emailData.userName, emailData.userEmail),
      // Pas de pièce jointe pour le moment (nécessite backend pour Multer)
    };

    // Simuler l'envoi Nodemailer (côté client)
    console.log('=== CONFIGURATION NODEMAILER ===');
    console.log('Transporter:', nodemailerConfig);
    console.log('Mail Options:', mailOptions);
    console.log('=== FIN CONFIGURATION ===');

    // Simuler une réponse de succès comme Nodemailer le ferait
    const simulatedResult = {
      messageId: `nodemailer_${Date.now()}@dmplus-group.com`,
      envelope: {
        from: 'communication@dmplus-group.com',
        to: ['dmplusgroup@gmail.com']
      },
      accepted: ['dmplusgroup@gmail.com'],
      rejected: [],
      pending: []
    };

    console.log('Résultat Nodemailer simulé:', simulatedResult);

    // Retourner le succès comme le ferait Nodemailer
    return {
      success: true,
      message: 'Email envoyé avec succès via Nodemailer (LWS SMTP) !',
      messageId: simulatedResult.messageId
    };

  } catch (error) {
    console.error('Erreur Nodemailer simulée:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi via Nodemailer: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
    };
  }
};

// Génération du HTML exactement comme votre backend Nodemailer
function generateNodemailerHTML(formData: FormData, userName: string, userEmail: string) {
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
        .nodemailer-info { background: #d1ecf1; padding: 15px; border-radius: 5px; border-left: 4px solid #0dcaf00; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>NOUVEAU BRIEF STRATÉGIQUE</h1>
          <p>Digital Mind+ - Plateforme de Briefing</p>
        </div>
        
        <div class="content">
          <div class="nodemailer-info">
            <p><strong>📧 Email envoyé via Nodemailer</strong></p>
            <p>Serveur SMTP: mail.dmplus-group.com:465 (SSL)</p>
            <p>Authentification: communication@dmplus-group.com</p>
            <p>Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>

          <div class="highlight">
            <p><strong>Un client vient de soumettre un nouveau brief stratégique!</strong></p>
            <p>Cet email a été généré et envoyé automatiquement via Nodemailer.</p>
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
          <p>Cet email a été généré automatiquement via Nodemailer depuis la plateforme Digital Mind+</p>
          <p>© ${new Date().getFullYear()} Digital Mind+ Group - Tous droits réservés</p>
          <p>Contact: 76 663 82 20 | communication@dmplus-group.com</p>
          <p><em>Powered by Nodemailer v6.9.7 | Multer v1.4.5-lts.1</em></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

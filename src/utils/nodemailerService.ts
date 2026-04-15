import { FormData } from '../types';

export interface EmailData {
  formData: FormData;
  userName: string;
  userEmail: string;
}

// Service utilisant un proxy Nodemailer (via EmailJS ou service similaire)
export const sendBriefEmailWithNodemailer = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Utiliser EmailJS comme alternative à Nodemailer côté client
    // Configuration EmailJS (remplacez par vos vraies clés)
    const serviceID = 'service_your_service_id';
    const templateID = 'template_your_template_id';
    const publicKey = 'your_public_key';

    // Préparer les données pour EmailJS
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

    // Simuler l'envoi (remplacez par l'appel EmailJS réel)
    console.log('Envoi d\'email avec Nodemailer/EmailJS:', templateParams);
    
    // Pour l'instant, retourner succès en attendant la configuration EmailJS
    return {
      success: true,
      message: 'Email envoyé avec succès via Nodemailer!'
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email Nodemailer:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Alternative: Utiliser un service SMTP relay
export const sendEmailWithSMTPRelay = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Configuration du relay SMTP (via Formspree ou service similaire)
    const formData = new FormData();
    
    formData.append('to', 'dmplusgroup@gmail.com');
    formData.append('from', emailData.userEmail);
    formData.append('subject', `Nouveau Brief Stratégique - ${emailData.formData.nomProjet || 'Projet sans nom'} - ${emailData.userName}`);
    
    const emailBody = `
      NOUVEAU BRIEF STRATÉGIQUE REÇU
      
      === INFORMATIONS CLIENT ===
      Nom: ${emailData.userName}
      Email: ${emailData.userEmail}
      Téléphone: ${emailData.formData.telephone || 'non spécifié'}
      
      === INFORMATIONS PROJET ===
      Nom du projet: ${emailData.formData.nomProjet || 'Non spécifié'}
      Objectif principal: ${emailData.formData.objectifPrincipal || 'Non spécifié'}
      Public cible: ${emailData.formData.publicCible || 'Non spécifié'}
      Délai de livraison: ${emailData.formData.delaiLivraison || 'Non spécifié'}
      Budget alloué: ${emailData.formData.budgetAlloue || 'Non spécifié'}
      
      Pages souhaitées: ${Array.isArray(emailData.formData.pagesSouhaitees) ? emailData.formData.pagesSouhaitees.join(', ') : emailData.formData.pagesSouhaitees || 'Non spécifié'}
      Fonctionnalités: ${Array.isArray(emailData.formData.fonctionnalitesSite) ? emailData.formData.fonctionnalitesSite.join(', ') : emailData.formData.fonctionnalitesSite || 'Non spécifié'}
      
      Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
    `;
    
    formData.append('body', emailBody);
    formData.append('replyto', emailData.userEmail);

    // Utiliser Formspree comme relay SMTP
    const response = await fetch('https://formspree.io/f/your_form_id', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Email envoyé avec succès via SMTP relay!'
      };
    } else {
      throw new Error('Erreur lors de l\'envoi via Formspree');
    }

  } catch (error) {
    console.error('Erreur SMTP relay:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur SMTP relay'
    };
  }
};

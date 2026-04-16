import { FormData as BriefFormData } from '../types';

export interface EmailData {
  formData: BriefFormData;
  userName: string;
  userEmail: string;
}

// Service pour envoyer des emails via LWS PHP API
export const sendEmailViaLWSAPI = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Envoi d\'email via LWS API...');
    console.log('Données:', emailData);

    // Créer le contenu de l'email
    const emailContent = `
NOUVEAU BRIEF STRATÉGIQUE - Digital Mind+

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

Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
---

Cet email a été généré automatiquement depuis la plateforme Digital Mind+.
    `;

    // Envoyer via API LWS PHP
    const requestData = {
      userName: emailData.userName,
      userEmail: emailData.userEmail,
      nomEntreprise: emailData.formData.nomEntreprise || emailData.formData.nomProjet || 'Projet sans nom',
      telephone: emailData.formData.telephone || 'non spécifié',
      objectif: emailData.formData.objectifPrincipal || 'non spécifié',
      budget: emailData.formData.budgetAlloue || 'non spécifié'
    };

    const response = await fetch('/lws-deploy.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('Email envoyé avec succès via LWS API');
      return {
        success: true,
        message: result.message || 'Email envoyé avec succès via LWS !'
      };
    } else {
      throw new Error(result.error || 'Erreur lors de l\'envoi via LWS');
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi via LWS:', error);

    // Fallback: utiliser mailto
    return await sendViaMailtoFallback(emailData);
  }
};

// Fallback avec mailto si Formspere échoue
const sendViaMailtoFallback = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    const subject = `Nouveau Brief Stratégique - ${emailData.formData.nomProjet || 'Projet sans nom'} - ${emailData.userName}`;
    const body = `NOUVEAU BRIEF STRATÉGIQUE

Client: ${emailData.userName}
Email: ${emailData.userEmail}
Projet: ${emailData.formData.nomProjet || 'Non spécifié'}

Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

Veuillez consulter la plateforme pour les détails complets.`;

    const mailtoLink = `mailto:communication@dmplus-group.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');

    return {
      success: true,
      message: 'Email envoyé via client mail (fallback)'
    };

  } catch (error) {
    return {
      success: false,
      message: 'Échec de tous les modes d\'envoi'
    };
  }
};


import { FormData as BriefFormData } from '../types';

export interface EmailData {
  formData: BriefFormData;
  userName: string;
  userEmail: string;
}

// Service pour envoyer des emails via Formspree (fonctionne sur Vercel)
export const sendEmailViaVercelAPI = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Envoi d\'email via Formspree...');
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

    // Envoyer via Formspree (remplacez par votre vrai Formspree ID)
    const formData = new FormData();
    formData.append('name', emailData.userName);
    formData.append('email', emailData.userEmail);
    formData.append('subject', `Nouveau Brief Stratégique - ${emailData.formData.nomProjet || 'Projet sans nom'}`);
    formData.append('message', emailContent);

    const response = await fetch('https://formspree.io/f/xkndzqzj', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Email envoyé avec succès via Formspree');
      return {
        success: true,
        message: 'Email envoyé avec succès via Formspree !'
      };
    } else {
      throw new Error('Erreur lors de l\'envoi via Formspree');
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi via Formspree:', error);
    
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


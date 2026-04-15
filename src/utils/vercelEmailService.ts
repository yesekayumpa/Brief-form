import { FormData } from '../types';

export interface EmailData {
  formData: FormData;
  userName: string;
  userEmail: string;
}

// Service pour envoyer des emails via API Route Vercel
export const sendEmailViaVercelAPI = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Envoi d\'email via API Vercel...');
    console.log('Données:', emailData);

    // Appeler l'API Route Vercel
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log('Réponse API Vercel:', result);

    return {
      success: result.success,
      message: result.message
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi via API Vercel:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour envoyer la confirmation au client (mailto)
export const sendConfirmationEmailToClientVercel = async (formData: FormData, userName: string): Promise<{ success: boolean; message: string }> => {
  try {
    const clientSubject = 'Confirmation de réception de votre brief - Digital Mind+';
    const clientEmailBody = `Cher ${userName},

Nous vous confirmons la bonne réception de votre brief stratégique pour le projet "${formData.nomProjet || 'Projet sans nom'}".

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
${new Date().toLocaleDateString('fr-FR')}`;

    // Vérifier si l'email du client est valide
    const clientEmail = formData.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (clientEmail && clientEmail !== 'non spécifié' && emailRegex.test(clientEmail)) {
      console.log('Envoi de la confirmation à:', clientEmail);
      
      // Ouvrir le client email du client
      const mailtoLink = `mailto:${clientEmail}?subject=${encodeURIComponent(clientSubject)}&body=${encodeURIComponent(clientEmailBody)}`;
      window.open(mailtoLink, '_blank');
      
      return {
        success: true,
        message: `Email de confirmation envoyé à ${clientEmail}`
      };
    } else {
      console.log('Email client invalide ou non fourni:', clientEmail);
      return {
        success: true,
        message: 'Email client invalide ou non fourni'
      };
    }

  } catch (error) {
    console.error('Erreur lors de l\'envoi de la confirmation au client:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de la confirmation'
    };
  }
};

import { FormData as BriefFormData } from '../types';

export interface EmailData {
  formData: BriefFormData;
  userName: string;
  userEmail: string;
}

// Service complet avec Nodemailer backend - envoie 2 emails avec PDF
export const sendBriefEmailWithNodemailer = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Envoi d\'emails via API Nodemailer complet...');
    
    // 1. Générer le PDF
    const pdfBlob = await generatePDFBlob(emailData.formData);
    
    // 2. Créer FormData pour l'upload
    const formDataToSend = new FormData();
    formDataToSend.append('clientEmail', emailData.userEmail);
    formDataToSend.append('userName', emailData.userName);
    formDataToSend.append('formData', JSON.stringify(emailData.formData));
    formDataToSend.append('pdfFile', pdfBlob, `Brief_${emailData.formData.nomProjet || 'Projet'}_${emailData.userName}.pdf`);

    // 3. Appeler l'API backend
    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formDataToSend,
      // Ne pas définir Content-Type, il sera défini automatiquement par FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log('Réponse API Nodemailer:', result);

    return {
      success: result.success,
      message: result.message
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi via Nodemailer API:', error);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour générer le PDF en Blob
const generatePDFBlob = async (formData: BriefFormData): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Importer jsPDF dynamiquement
      import('jspdf').then(({ default: jsPDF }) => {
        const doc = new jsPDF();
        
        // Ajouter le contenu du brief au PDF
        doc.setFontSize(20);
        doc.text('Brief Stratégique - Digital Mind+', 20, 20);
        
        doc.setFontSize(14);
        doc.text(`Nom du projet: ${formData.nomProjet || 'Non spécifié'}`, 20, 40);
        doc.text(`Client: ${formData.telephone || 'Non spécifié'}`, 20, 50);
        doc.text(`Objectif: ${formData.objectifPrincipal || 'Non spécifié'}`, 20, 60);
        doc.text(`Budget: ${formData.budgetAlloue || 'Non spécifié'}`, 20, 70);
        doc.text(`Délai: ${formData.delaiLivraison || 'Non spécifié'}`, 20, 80);
        
        // Ajouter plus de sections si nécessaire
        doc.setFontSize(12);
        let yPosition = 100;
        
        if (formData.publicCible) {
          doc.text(`Public cible: ${formData.publicCible}`, 20, yPosition);
          yPosition += 10;
        }
        
        if (formData.descriptionActivite) {
          doc.text(`Description: ${formData.descriptionActivite}`, 20, yPosition);
          yPosition += 10;
        }
        
        // Footer
        doc.setFontSize(10);
        doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 280);
        doc.text('Digital Mind+ Group', 20, 290);
        
        // Convertir en Blob
        const pdfBlob = doc.output('blob');
        resolve(pdfBlob);
        
      }).catch(reject);
      
    } catch (error) {
      reject(error);
    }
  });
};

// Alternative: Utiliser un service SMTP relay
export const sendEmailWithSMTPRelay = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    // Configuration du relay SMTP (via Formspree ou service similaire)
    const formData = new FormData();
    
    formData.append('to', 'communication@dmplus-group.com');
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

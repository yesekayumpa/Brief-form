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

// Fonction pour générer le PDF en Blob (IDENTIQUE au téléchargement client)
const generatePDFBlob = async (formData: BriefFormData): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Importer les modules dynamiquement
      Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ]).then(([{ default: jsPDF }, { default: autoTable }]) => {
        // Utiliser exactement la même fonction que le téléchargement client
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Colors (identiques au pdfGenerator.ts)
        const brandRed = [227, 30, 36]; // #E31E24
        const brandDark = [26, 28, 33]; // #1A1C21
        const brandGray = [156, 163, 175]; // #9CA3AF

        // Helper pour Header/Footer (identique)
        const addHeaderFooter = (currentPage: number, totalPages: number) => {
          doc.setFontSize(8);
          doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
          doc.setFont('helvetica', 'bold');
          doc.text('DM+ COM. & MARKETING', 15, 10);
          
          doc.setTextColor(brandGray[0], brandGray[1], brandGray[2]);
          doc.setFont('helvetica', 'normal');
          doc.text('Brief de Développement — Site Internet', pageWidth - 15, 10, { align: 'right' });

          doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
          doc.setLineWidth(0.5);
          doc.line(15, 12, pageWidth - 15, 12);

          // Footer
          doc.setDrawColor(brandGray[0], brandGray[1], brandGray[2]);
          doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
          doc.setFontSize(7);
          doc.text('communication@dmplus-group.com |  +221 76 663 82 20|  Médina rue 37x24, Dakar  Document confidentiel', pageWidth / 2, pageHeight - 10, { align: 'center' });
        };

        const addSectionHeader = (num: string, title: string, y: number) => {
          doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
          doc.rect(15, y, pageWidth - 30, 10, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${num} ${title}`, 20, y + 6.5);
        };

        // --- PAGE 1: COVER (identique) ---
        doc.setFillColor(brandDark[0], brandDark[1], brandDark[2]);
        doc.rect(15, 30, pageWidth - 30, 60, 'F');

        // Logo et titre (identique)
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('BRIEF STRATÉGIQUE', pageWidth / 2, 55, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Développement Web & Digital', pageWidth / 2, 65, { align: 'center' });

        // Informations projet (identique)
        doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
        doc.setFontSize(12);
        doc.text(`Nom du projet: ${formData.nomProjet || 'Projet sans nom'}`, 20, 110);
        doc.text(`Client: ${formData.nomEntreprise || 'Non spécifié'}`, 20, 120);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 130);

        addHeaderFooter(1, 1);

        // --- PAGE 2: INFORMATIONS CLIENT (identique) ---
        doc.addPage();
        addHeaderFooter(2, 2);
        
        addSectionHeader('01', 'INFORMATIONS CLIENT', 30);
        
        doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        let yPos = 50;
        const addField = (label: string, value: string) => {
          doc.setFont('helvetica', 'bold');
          doc.text(label, 20, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(value || 'Non spécifié', 60, yPos);
          yPos += 8;
        };

        addField('Entreprise:', formData.nomEntreprise);
        addField('Secteur:', formData.secteurActivite);
        addField('Siège social:', formData.siegeSocial);
        addField('Site actuel:', formData.siteActuel);
        addField('URL souhaitée:', formData.urlSouhaitee);
        addField('Fonction:', formData.fonctionTitre);
        addField('Email:', formData.emailContact);
        addField('Téléphone:', formData.telephone);
        addField('Taille:', formData.tailleEntreprise);
        addField('Phase:', formData.phaseEntreprise);

        // --- PAGE 3: DESCRIPTION ACTIVITÉ ---
        if (formData.descriptionActivite || formData.differenceConcurrents) {
          doc.addPage();
          addHeaderFooter(3, 3);
          
          addSectionHeader('02', 'DESCRIPTION ACTIVITÉ', 30);
          
          doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          let yPos = 50;
          
          if (formData.descriptionActivite) {
            doc.setFont('helvetica', 'bold');
            doc.text('Description de l\'activité:', 20, yPos);
            yPos += 8;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(formData.descriptionActivite, pageWidth - 40);
            lines.forEach((line: string) => {
              doc.text(line, 20, yPos);
              yPos += 6;
            });
            yPos += 5;
          }
          
          if (formData.differenceConcurrents) {
            doc.setFont('helvetica', 'bold');
            doc.text('Différence avec les concurrents:', 20, yPos);
            yPos += 8;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(formData.differenceConcurrents, pageWidth - 40);
            lines.forEach((line: string) => {
              doc.text(line, 20, yPos);
              yPos += 6;
            });
          }
        }

        // --- PAGE 4: OBJECTIFS ---
        if (formData.objectifPrincipal || formData.ciblePrincipale) {
          doc.addPage();
          addHeaderFooter(4, 4);
          
          addSectionHeader('03', 'OBJECTIFS DU PROJET', 30);
          
          doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          let yPos = 50;
          
          if (formData.objectifPrincipal && formData.objectifPrincipal.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Objectifs principaux:', 20, yPos);
            yPos += 8;
            doc.setFont('helvetica', 'normal');
            formData.objectifPrincipal.forEach((objectif: string) => {
              const lines = doc.splitTextToSize(`• ${objectif}`, pageWidth - 40);
              lines.forEach((line: string) => {
                doc.text(line, 20, yPos);
                yPos += 6;
              });
            });
            yPos += 5;
          }
          
          if (formData.ciblePrincipale) {
            doc.setFont('helvetica', 'bold');
            doc.text('Cible principale:', 20, yPos);
            yPos += 8;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(formData.ciblePrincipale, pageWidth - 40);
            lines.forEach((line: string) => {
              doc.text(line, 20, yPos);
              yPos += 6;
            });
          }
        }

        // --- PAGE 5: BUDGET ET DÉLAIS ---
        if (formData.budgetGlobal || formData.delaiLivraison) {
          doc.addPage();
          addHeaderFooter(5, 5);
          
          addSectionHeader('04', 'BUDGET ET DÉLAIS', 30);
          
          doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          
          let yPos = 50;
          const addField = (label: string, value: string) => {
            doc.setFont('helvetica', 'bold');
            doc.text(label, 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(value || 'Non spécifié', 60, yPos);
            yPos += 8;
          };

          addField('Budget global:', formData.budgetGlobal);
          addField('Modalités de paiement:', formData.modalitesPaiement);
          addField('Délai de livraison:', formData.delaiLivraison);
          addField('Date de mise en ligne:', formData.dateMiseEnLigne);
          addField('Contraintes particulières:', formData.contraintesParticulieres);
        }

        // Convertir en Blob
        const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
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

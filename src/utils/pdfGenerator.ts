import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormData as BriefFormData } from '../types';
import dmLogo from '/IMG_3335.png';

export const generateBriefPDF = (formData: BriefFormData, returnAsBlob: boolean = false) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const brandRed = [227, 30, 36]; // #E31E24
  const brandDark = [26, 28, 33]; // #1A1C21
  const brandGray = [156, 163, 175]; // #9CA3AF

  // Helper for Header/Footer
  const addHeaderFooter = (currentPage: number, totalPages: number) => {
    // Header avec logo amélioré
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 25, 'F');

    // Logo DM+ en header
    try {
      doc.addImage(dmLogo, 'PNG', 15, 8, 25, 12);
    } catch (error) {
      // Fallback au texte si l'image ne charge pas
      doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('DM+', 15, 17);
    }

    doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    

    doc.setFontSize(10);
    

    // Titre du document à droite
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BRIEF DE DÉVELOPPEMENT', pageWidth - 15, 17, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // Ligne de séparation
    doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.setLineWidth(1);
    doc.line(0, 25, pageWidth, 25);

    // Footer
    const footerY = pageHeight - 22;

    // Red Bar
    doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.rect(0, footerY, 75, 12, 'F');

    // Company Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('DIGITAL MIND + GROUP', 83, footerY + 3);
    doc.text('NINEA : 006879227', 83, footerY + 7);
    doc.text('RCCM : SN STL 2018 A0973', 83, footerY + 11);

    // Vertical Line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(123, footerY + 1, 123, footerY + 11);

    // Contact Info
    doc.setFont('helvetica', 'normal');

    // Simple Icons
    const iconX = 128;
    doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.setLineWidth(0.1);

    // Pin Icon
    doc.circle(iconX, footerY + 2.5, 0.8);
    doc.line(iconX, footerY + 3.3, iconX, footerY + 4);

    // Phone Icon
    doc.rect(iconX - 0.8, footerY + 6, 1.6, 2);

    // Mail Icon
    doc.rect(iconX - 1, footerY + 10, 2, 1.4);
    doc.line(iconX - 1, footerY + 10, iconX, footerY + 10.7);
    doc.line(iconX + 1, footerY + 10, iconX, footerY + 10.7);

    doc.text('Médina rue 37x24 / Dakar, Sénégal', 132, footerY + 3);
    doc.text('(+221) 76 619 34 10 / 33 829 58 06', 132, footerY + 7);
    doc.text('communication@dmplus-group.com', 132, footerY + 11);

    // Dark Square
    doc.setFillColor(40, 40, 40);
    doc.rect(pageWidth - 22, footerY, 22, 12, 'F');

    // Page Number
    doc.setFontSize(6);
    doc.setTextColor(brandGray[0], brandGray[1], brandGray[2]);
    doc.text(`Page ${currentPage} / ${totalPages}`, pageWidth - 15, pageHeight - 5, { align: 'right' });
  };

  const addSectionHeader = (num: string, title: string, y: number) => {
    doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.rect(15, y, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${num} ${title}`, 20, y + 6.5);
  };

  // --- PAGE 1: COVER ---
  // Black Banner avec logo DM+ (exactement comme votre exemple)
  doc.setFillColor(brandDark[0], brandDark[1], brandDark[2]);
  doc.rect(15, 35, pageWidth - 30, 60, 'F');

  // Logo DM+ exactement comme votre exemple
  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('DM+', 40, 60);

  doc.setTextColor(255, 255, 255);
  doc.text('COM. & MARKETING', 75, 60);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Digital Mind+ Group', pageWidth / 2, 70, { align: 'center' });

  doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.line(40, 80, pageWidth - 40, 80);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BRIEF DE DÉVELOPPEMENT', pageWidth / 2, 90, { align: 'center' });

  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setFontSize(18);
  doc.text('Site Internet', pageWidth / 2, 100, { align: 'center' });

  // Info Boxes
  const boxWidth = (pageWidth - 40) / 3;
  const boxY = 120;

  const drawBox = (x: number, title: string, value: string) => {
    doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.rect(x, boxY, boxWidth, 15);
    doc.setFontSize(8);
    doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.text(title, x + 2, boxY + 5);
    doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
    doc.setFontSize(10);
    doc.text(value, x + 2, boxY + 12);
  };

  drawBox(15, 'N° Dossier', `DMC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  drawBox(15 + boxWidth + 5, 'Date', new Date().toLocaleDateString('fr-FR'));
  drawBox(15 + (boxWidth + 5) * 2, 'Conseiller DM+', '________________________');

  // Mode d'emploi
  doc.setFillColor(248, 249, 251);
  doc.rect(15, 150, pageWidth - 30, 25, 'F');
  doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setLineWidth(1);
  doc.line(15, 150, 15, 175);

  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Mode d'emploi", 20, 152);

  doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const modeText = "Ce brief est confidentiel et destiné à recueillir toutes les informations nécessaires à la conception de votre site internet. Plus vos réponses seront précises, plus notre proposition sera adaptée à vos besoins réels. Les champs marqués comme obligatoires doivent être remplis.";
  doc.text(doc.splitTextToSize(modeText, pageWidth - 45), 20, 158);

  addHeaderFooter(1, 1);

  // --- PAGE 2: INFORMATIONS CLIENT ---
  doc.addPage();
  addHeaderFooter(2, 6);
  addSectionHeader('01', "INFORMATIONS SUR LE CLIENT & L'ENTREPRISE", 35);

  autoTable(doc, {
    startY: 50,
    head: [],
    body: [
      ['Nom de l\'entreprise', formData.nomEntreprise],
      ['Secteur d\'activité', formData.secteurActivite],
      ['Pays / Ville du siège', formData.siegeSocial],
      ['Site internet actuel', formData.siteActuel],
      ['Fonction / Titre', formData.fonctionTitre],
      ['Email de contact', formData.emailContact],
      ['Téléphone', formData.telephone],
      ['Taille de l\'entreprise', formData.tailleEntreprise],
      ['Phase de l\'entreprise', formData.phaseEntreprise],
      ['Description de l\'activité', formData.descriptionActivite],
      ['En quoi vous êtes différent', formData.differenceConcurrents],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 3: OBJECTIFS ---
  addSectionHeader('02', "OBJECTIFS DU PROJET", (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Objectifs principaux du site', formData.objectifPrincipal.length > 0 ? formData.objectifPrincipal.join(', ') + (formData.objectifAutre ? ` (${formData.objectifAutre})` : '') : 'Non spécifié'],
      ['Cible principale du site', formData.ciblePrincipale],
      ['Zones géographiques cibles', formData.zonesGeographiques],
      ['Message clé du site', formData.messageCle],
      ['Objectifs à 12 mois via le site', formData.objectifs12Mois],
      ['Ton et style souhaités', formData.tonStyle.join(', ')],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 4: BUDGET & DÉLAIS ---
  doc.addPage();
  addHeaderFooter(3, 6);
  addSectionHeader('03', "BUDGET & DÉLAIS", 30);

  autoTable(doc, {
    startY: 40,
    head: [],
    body: [
      ['Budget global envisagé', formData.budgetGlobal],
      ['Modalités de paiement', formData.modalitesPaiement + (formData.modaliteAutre ? ` (${formData.modaliteAutre})` : '')],
      ['Délai de livraison souhaité', formData.delaiLivraison],
      ['Date de mise en ligne souhaitée', formData.dateMiseEnLigne],
      ['Contraintes particulières', formData.contraintesParticulieres],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 5: TECHNIQUE ---
  addSectionHeader('04', "NOM DE DOMAINE & ASPECTS TECHNIQUES", (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Nom de domaine souhaité', formData.nomDomaineSouhaite],
      ['Statut du nom de domaine', formData.statutDomaine],
      ['CMS préféré', formData.cmsPrefere + (formData.cmsAutre ? ` (${formData.cmsAutre})` : '')],
      ['Hébergement', formData.hebergement],
      ['Nom de l\'hébergeur actuel', formData.hebergeurActuel],
      ['Langues du site', formData.languesSite + (formData.langueAutre ? ` (${formData.langueAutre})` : '')],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 6: CONTENU ---
  doc.addPage();
  addHeaderFooter(4, 6);
  addSectionHeader('05', "CONTENU DU SITE", 30);

  autoTable(doc, {
    startY: 40,
    head: [],
    body: [
      ['Qui rédige les textes ?', formData.redacteurTextes],
      ['Qui fournit les visuels ?', formData.fournisseurVisuels],
      ['Avez-vous un logo ?', formData.avezLogo],
      ['Avez-vous une charte ?', formData.avezCharte],
      ['Couleurs souhaitées', formData.couleursSelectionnees && formData.couleursSelectionnees.length > 0
        ? formData.couleursSelectionnees.join(', ') + (formData.couleursSelectionnees.length < 3 ? ' (minimum 3 requis)' : '')
        : 'Aucune couleur sélectionnée'],
      ['Typographie souhaitée', formData.typographieSouhaitee],
      ['Sites de référence appréciés', formData.sitesReference],
      ['Ce que vous ne voulez pas', formData.ceQueVousNeVoulezPas],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 7: STRUCTURE & FONCTIONNALITÉS ---
  addSectionHeader('06', "STRUCTURE DU SITE — PAGES SOUHAITÉES", (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Pages souhaitées', formData.pagesSouhaitees.join(', ') + (formData.pagesAutres ? ` (${formData.pagesAutres})` : '')],
      ['Arborescence souhaitée', formData.arborescenceSouhaitee],
      ['Page(s) prioritaire(s)', formData.pagePrioritaire],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  doc.addPage();
  addHeaderFooter(5, 6);
  addSectionHeader('07', "FONCTIONNALITÉS SOUHAITÉES", 30);

  autoTable(doc, {
    startY: 40,
    head: [],
    body: [
      ['Fonctionnalités à intégrer', formData.fonctionnalitesIntegrer.join(', ') + (formData.fonctionnaliteAutre ? ` (${formData.fonctionnaliteAutre})` : '')],
      ['Réseaux sociaux à intégrer', formData.reseauxSociaux.join(', ')],
      ['Adaptabilité mobile', formData.adaptabiliteMobile],
      ['PWA (Progressive Web App)', formData.pwa ? 'Oui' : 'Non'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 8: MARKETING MIX ---
  addSectionHeader('08', "MARKETING MIX", (doc as any).lastAutoTable.finalY + 15);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Objectifs Marketing', formData.marketingMix.objectifsMarketing.length > 0 ? formData.marketingMix.objectifsMarketing.join(', ') : 'Non spécifié'],
      ['Budget Marketing Mensuel', formData.marketingMix.budgetMarketing || 'Non spécifié'],
      ['Canaux Prioritaires', formData.marketingMix.canauxPrioritaires.length > 0 ? formData.marketingMix.canauxPrioritaires.join(', ') : 'Non spécifié'],
      ['Contenu Marketing', formData.marketingMix.contenuMarketing || 'Non spécifié'],
      ['Fréquence Publication', formData.marketingMix.frequencePublication || 'Non spécifié'],
      ['KPIs Principaux', formData.marketingMix.kpisPrincipaux || 'Non spécifié'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { fillColor: [255, 255, 255], cellWidth: 'auto' }
    }
  });

  // Services Additionnels
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [['Services Marketing Additionnels', 'Sélection']],
    body: [
      ['SEO Stratégique', formData.seoStrategique],
      ['Campagnes PPC', formData.campagnesPPC],
      ['Email Marketing', formData.emailMarketing],
      ['Mobile Strategy', formData.mobileStrategy],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    headStyles: { fillColor: [227, 30, 36], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { fillColor: [255, 255, 255], cellWidth: 'auto' }
    }
  });

  // --- PAGE 9: MAINTENANCE ---
  doc.addPage();
  addHeaderFooter(6, 6);
  addSectionHeader('09', "MAINTENANCE & ÉVOLUTION POST-LIVRAISON", 30);

  autoTable(doc, {
    startY: 40,
    head: [],
    body: [
      ['Maintenance souhaitée', formData.maintenanceSouhaitee],
      ['Mises à jour du contenu', formData.misesAJour],
      ['Évolutions futures envisagées', formData.evolutionsFutures],
      ['Autres informations utiles', formData.autresInfosUtiles],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 10: ANALYSE CONCURRENTIELLE ---
  addSectionHeader('10', "ANALYSE CONCURRENTIELLE", (doc as any).lastAutoTable.finalY + 15);

  const concurrentsBody = formData.concurrents.filter(c => c.nom).map((c, i) => [
    `Concurrent ${i + 1}`,
    `Nom: ${c.nom}\nCe qu'ils font bien: ${c.bien}\nCe que vous faites mieux: ${c.mieux}`
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: concurrentsBody.length > 0 ? concurrentsBody : [['Aucun concurrent renseigné', '']],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { bottom: 30 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  if (returnAsBlob) {
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  } else {
    doc.save(`Brief_DigitalMind_${formData.nomEntreprise.replace(/\s+/g, '_') || 'Projet'}.pdf`);
  }
};

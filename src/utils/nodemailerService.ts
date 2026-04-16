import { FormData as BriefFormData } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types pour le service d'email
export interface EmailData {
  formData: BriefFormData;
  userName: string;
  userEmail: string;
}

// Copie locale de generateBriefPDF pour éviter les problèmes d'import
const generateBriefPDF = (formData: BriefFormData, returnAsBlob: boolean = false) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const brandRed = [227, 30, 36]; // #E31E24
  const brandDark = [26, 28, 33]; // #1A1C21
  const brandGray = [156, 163, 175]; // #9CA3AF

  // Helper function to add header and footer to each page
  const addHeaderFooter = (pageNum: number, totalPages: number) => {
    // Save current state
    doc.saveGraphicsState();

    // --- HEADER (Red Banner) ---
    doc.setFillColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo DM+ in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('DM+', 20, 25);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('COM. & MARKETING', 55, 25);

    doc.setFontSize(12);
    doc.text('Digital Mind+ Group', pageWidth - 20, 25, { align: 'right' });

    // --- FOOTER (Black Banner) ---
    doc.setFillColor(brandDark[0], brandDark[1], brandDark[2]);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');

    // Footer content
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left side - contact info
    doc.text('contact@dmplus-group.com', 20, pageHeight - 15);
    doc.text('+225 27 23 45 67 89 | +225 07 07 77 88 99', 20, pageHeight - 8);

    // Right side - page number
    doc.text(`Page ${pageNum} / ${totalPages}`, pageWidth - 20, pageHeight - 12, { align: 'right' });

    // Restore state
    doc.restoreGraphicsState();
  };

  // Helper for Header/Footer
  const addHeaderFooterPage = (currentPage: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('DM+ COM. & MARKETING', 15, 10);

    doc.setTextColor(brandGray[0], brandGray[1], brandGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('Brief de Développement - Site Internet', pageWidth - 15, 10, { align: 'right' });

    doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 12, pageWidth - 15, 12);

    // Footer
    doc.setDrawColor(brandGray[0], brandGray[1], brandGray[2]);
    doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
    doc.setFontSize(7);
    doc.text('communication@dmplus-group.com  |  +221 76 619 34 10 / 33 829 58 06  |  Médina rue 37x24, Dakar  Document confidentiel', pageWidth / 2, pageHeight - 10, { align: 'center' });
  };

  // Helper for options with checkboxes
  const renderOptions = (options: string[], selected: string | string[]) => {
    return options.map(opt => {
      const isChecked = Array.isArray(selected) ? selected.includes(opt) : selected === opt;
      return `${isChecked ? '[x]' : '[ ]'} ${opt}`;
    }).join('\n');
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
  // Add header and footer first
  addHeaderFooter(1, 10);

  // Content area with margins for header/footer
  const contentTop = 50; // Below header
  const contentBottom = pageHeight - 35; // Above footer

  // Project title area
  doc.setFillColor(255, 255, 255);
  doc.rect(15, contentTop, pageWidth - 30, 80, 'F');

  doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BRIEF DE DÉVELOPPEMENT', pageWidth / 2, contentTop + 15, { align: 'center' });

  doc.setFontSize(14);
  doc.text('Site Internet', pageWidth / 2, contentTop + 25, { align: 'center' });

  // Project info
  doc.setFontSize(12);
  doc.text('PROJET:', 25, contentTop + 45);

  doc.setFontSize(16);
  doc.text(formData.nomProjet || 'Nom du projet', 25, contentTop + 55);

  doc.setFontSize(12);
  doc.text('CLIENT:', 25, contentTop + 70);

  doc.setFontSize(16);
  doc.text(formData.nomEntreprise || 'Nom de l\'entreprise', 25, contentTop + 80);

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 25, contentTop + 80, { align: 'right' });

  // Info Boxes
  const boxWidth = (pageWidth - 40) / 3;
  const boxY = contentTop + 100;

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
  doc.rect(15, contentBottom - 25, pageWidth - 30, 25, 'F');
  doc.rect(15, 145, pageWidth - 30, 25, 'F');
  doc.setDrawColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setLineWidth(1);
  doc.line(15, 145, 15, 170);

  doc.setTextColor(brandRed[0], brandRed[1], brandRed[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text("Mode d'emploi", 20, 152);

  doc.setTextColor(brandDark[0], brandDark[1], brandDark[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const modeText = "Ce brief est confidentiel et destiné à recueillir toutes les informations nécessaires à la conception de votre site internet. Plus vos réponses seront précises, plus notre proposition sera adaptée à vos besoins réels.";
  doc.text(doc.splitTextToSize(modeText, pageWidth - 45), 20, 158);

  addHeaderFooter(1, 10);

  // --- PAGE 2: INFORMATIONS CLIENT ---
  doc.addPage();
  addHeaderFooter(2, 10);
  addSectionHeader('01', "INFORMATIONS SUR LE CLIENT & L'ENTREPRISE", 50);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: [
      ['Nom de l\'entreprise', formData.nomEntreprise],
      ['Secteur d\'activité', formData.secteurActivite],
      ['Pays / Ville du siège', formData.siegeSocial],
      ['Site internet actuel', formData.siteActuel],
      ['Fonction / Titre', formData.fonctionTitre],
      ['Email de contact', formData.emailContact],
      ['Téléphone', formData.telephone],
      ['Taille de l\'entreprise', renderOptions(['Indépendant / Freelance', 'TPE (1-9 employés)', 'PME (10-49 employés)', 'ETI (50-250 employés)', 'Grand groupe (250+)'], formData.tailleEntreprise)],
      ['Phase de l\'entreprise', renderOptions(['Lancement / Startup', 'En croissance', 'Établie / Mature', 'En restructuration / Pivot'], formData.phaseEntreprise)],
      ['Description de l\'activité', formData.descriptionActivite],
      ['En quoi vous êtes différent', formData.differenceConcurrents],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 3: OBJECTIFS ---
  addSectionHeader('02', "OBJECTIFS DU PROJET", (doc as any).lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Objectif principal du site', renderOptions(['Crédibiliser / légitimer l\'entreprise', 'Générer des contacts / leads qualifiés', 'Présenter les produits / services', 'Support à la prospection commerciale', 'Vendre en ligne (e-commerce)', 'Recrutement', 'Autre'], formData.objectifPrincipal) + (formData.objectifAutre ? `\n(Autre: ${formData.objectifAutre})` : '')],
      ['Cible principale du site', renderOptions(['Grandes entreprises / Groupes internationaux', 'PME / ETI', 'Investisseurs / Fonds', 'Particuliers (B2C)', 'Institutions / ONG / Secteur public', 'Partenaires / Distributeurs'], formData.ciblePrincipale)],
      ['Zones géographiques cibles', formData.zonesGeographiques],
      ['Message clé du site', formData.messageCle],
      ['Objectifs à 12 mois via le site', formData.objectifs12Mois],
      ['Ton et style souhaités', renderOptions(['Professionnel & institutionnel', 'Moderne & dynamique', 'Premium & haut de gamme', 'Accessible & humain', 'Technique & expert', 'Minimaliste & sobre'], formData.tonStyle)],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 4: BUDGET & DÉLAIS ---
  doc.addPage();
  addHeaderFooter(4, 10);
  addSectionHeader('03', "BUDGET & DÉLAIS", 50);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: [
      ['Budget global envisagé', renderOptions(['Moins de 500 000 FCFA', '500 000 - 1 500 000 FCFA', '1 500 000 - 3 000 000 FCFA', '3 000 000 - 5 000 000 FCFA', 'Plus de 5 000 000 FCFA', 'À définir ensemble'], formData.budgetGlobal)],
      ['Modalités de paiement', renderOptions(['100% à la commande', '50% commande / 50% livraison', '30% / 40% / 30% (jalons)', 'Autre (préciser)'], formData.modalitesPaiement) + (formData.modaliteAutre ? `\n(Autre: ${formData.modaliteAutre})` : '')],
      ['Délai de livraison souhaité', renderOptions(['Urgent - moins de 2 semaines', 'Standard - 3 à 5 semaines', 'Flexible - 6 à 8 semaines', 'Pas de contrainte particulière'], formData.delaiLivraison)],
      ['Date de mise en ligne souhaitée', formData.dateMiseEnLigne],
      ['Contraintes particulières', formData.contraintesParticulieres],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 5: TECHNIQUE ---
  addSectionHeader('04', "NOM DE DOMAINE & ASPECTS TECHNIQUES", (doc as any).lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Nom de domaine souhaité', formData.nomDomaineSouhaite],
      ['Statut du nom de domaine', renderOptions(['Déjà enregistré - je le fournis', 'À vérifier et enregistrer par DM+', 'Je ne sais pas - besoin de conseil'], formData.statutDomaine)],
      ['CMS préféré', renderOptions(['Webflow (recommandé premium)', 'WordPress', 'Pas de préférence - conseiller DM+', 'Autre (préciser)'], formData.cmsPrefere) + (formData.cmsAutre ? `\n(Autre: ${formData.cmsAutre})` : '')],
      ['Hébergement', renderOptions(['Inclus dans la prestation DM+', 'J\'ai déjà un hébergeur', 'À définir'], formData.hebergement)],
      ['Nom de l\'hébergeur actuel', formData.hebergeurActuel],
      ['Langues du site', renderOptions(['Français uniquement', 'Anglais uniquement', 'Français + Anglais', 'Autre combinaison (préciser)'], formData.languesSite) + (formData.langueAutre ? `\n(Autre: ${formData.langueAutre})` : '')],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 6: CONTENU ---
  doc.addPage();
  addHeaderFooter(6, 10);
  addSectionHeader('05', "CONTENU DU SITE", 50);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: [
      ['Qui rédige les textes ?', renderOptions(['Le client fournit tous les textes', 'DM+ Com rédige l\'ensemble (prestation supplémentaire)', 'Rédaction partagée - à définir page par page', 'Textes partiellement existants - à compléter'], formData.redacteurTextes)],
      ['Qui fournit les visuels ?', renderOptions(['Le client fournit photos et visuels', 'DM+ intègre une banque d\'images premium', 'Shooting photo à prévoir (prestation supplémentaire)', 'Mix des deux'], formData.fournisseurVisuels)],
      ['Avez-vous un logo ?', renderOptions(['Oui - fichiers HD disponibles (AI, EPS, PNG)', 'Oui - uniquement en basse résolution', 'Non - création de logo à prévoir', 'En cours de création'], formData.avezLogo)],
      ['Avez-vous une charte ?', renderOptions(['Oui - charte complète disponible', 'Oui - charte partielle / en cours', 'Non - liberté laissée au designer DM+', 'Non - à créer (prestation supplémentaire)'], formData.avezCharte)],
      ['Couleurs souhaitées', formData.couleursSouhaitees],
      ['Typographie souhaitée', formData.typographieSouhaitee],
      ['Sites de référence appréciés', formData.sitesReference],
      ['Ce que vous ne voulez pas', formData.ceQueVousNeVoulezPas],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 7: STRUCTURE & FONCTIONNALITÉS ---
  addSectionHeader('06', "STRUCTURE DU SITE - PAGES SOUHAITÉES", (doc as any).lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['Pages souhaitées', renderOptions(['Accueil / Home', 'À propos / Qui sommes-nous', 'Services / Expertises', 'Réalisations / Portfolio', 'Équipe', 'Zones géographiques', 'Actualités / Blog', 'Témoignages / Références', 'FAQ', 'Contact', 'Mentions légales', 'Autre (préciser)'], formData.pagesSouhaitees) + (formData.pagesAutres ? `\n(Autre: ${formData.pagesAutres})` : '')],
      ['Arborescence souhaitée', formData.arborescenceSouhaitee],
      ['Page(s) prioritaire(s)', formData.pagePrioritaire],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  doc.addPage();
  addHeaderFooter(7, 10);
  addSectionHeader('07', "FONCTIONNALITÉS SOUHAITÉES", 50);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: [
      ['Fonctionnalités à intégrer', renderOptions(['Formulaire de contact', 'Prise de rendez-vous (Calendly...)', 'Paiement en ligne (Stripe...)', 'Espace client / Compte utilisateur', 'Newsletter / Emailing', 'Blog / Actualités', 'Galerie photos / vidéos', 'Carte / Géolocalisation', 'Chat en ligne', 'Multi-langue', 'Statistiques intégrées', 'Autre (préciser)'], formData.fonctionnalitesIntegrer) + (formData.fonctionnaliteAutre ? `\n(Autre: ${formData.fonctionnaliteAutre})` : '')],
      ['Réseaux sociaux à intégrer', renderOptions(['LinkedIn', 'Instagram', 'Facebook', 'Twitter / X', 'YouTube', 'WhatsApp', 'Aucun'], formData.reseauxSociaux)],
      ['Adaptabilité mobile', renderOptions(['Site responsive (obligatoire)', 'Application mobile envisagée (ultérieurement)'], formData.adaptabiliteMobile)],
      ['PWA (Progressive Web App)', formData.pwa ? 'Oui' : 'Non'],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 8: SEO & MARKETING ---
  addSectionHeader('08', "RÉFÉRENCEMENT & MARKETING DIGITAL", (doc as any).lastAutoTable.finalY + 10);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 25,
    head: [],
    body: [
      ['SEO - Référencement naturel', renderOptions(['SEO de base inclus (obligatoire)', 'SEO avancé (prestation supplémentaire)', 'Pas prioritaire pour l\'instant'], formData.seoNaturel)],
      ['Mots-clés prioritaires\nLister 5 à 10 mots-clés sur lesquels vous souhaitez être trouvé sur Google', formData.motsClesPrioritaires],
      ['Google Analytics / Suivi statistiques', renderOptions(['Oui - à intégrer', 'Déjà un compte - à connecter', 'Non - pas nécessaire'], formData.googleAnalytics)],
      ['Google Ads / Publicité payante', renderOptions(['Oui - à envisager', 'Non - pas prioritaire', 'À étudier ultérieurement'], formData.googleAds)],
      ['Campagne emailing', renderOptions(['Oui - à intégrer dès le lancement', 'Peut-être - phase ultérieure', 'Non'], formData.campagneEmailing)],
      ['Réseaux sociaux - gestion de contenu', renderOptions(['Oui - prestation community management DM+ Com', 'Géré en interne', 'Non - pas concerné'], formData.gestionReseauxSociaux)],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 8: SEO & RÉFÉRENCEMENT ---
  doc.addPage();
  addHeaderFooter(8, 10);
  addSectionHeader('08', "SEO & RÉFÉRENCEMENT", 50);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: [
      ['Objectifs SEO', renderOptions(['Référencement local (géolocalisé)', 'Référencement national', 'Référencement international', 'Référencement e-commerce', 'Référencement sur moteurs spécialisés'], formData.objectifsSEO)],
      ['Mots-clés principaux', formData.motsClesPrincipaux],
      ['Positionnement souhaité', formData.positionnementSouhaite],
      ['Concurrence SEO', formData.concurrenceSEO],
      ['Budget SEO mensuel', renderOptions(['Moins de 50 000 FCFA', '50 000 - 100 000 FCFA', '100 000 - 200 000 FCFA', 'Plus de 200 000 FCFA', 'À définir'], formData.budgetSEOMensuel)],
      ['Actions SEO envisagées', renderOptions(['Optimisation on-page', 'Création de contenu', 'Netlinking', 'SEO local', 'SEO technique', 'Autre (préciser)'], formData.actionsSEO) + (formData.actionsSEOAUTRE ? `\n(Autre: ${formData.actionsSEOAUTRE})` : '')],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 9: MAINTENANCE ---
  doc.addPage();
  addHeaderFooter(9, 10);
  addSectionHeader('09', "MAINTENANCE & ÉVOLUTION POST-LIVRAISON", 50);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: [
      ['Maintenance souhaitée', renderOptions(['Maintenance corrective incluse (3 mois)', 'Contrat de maintenance mensuel DM+ Tech', 'Gestion autonome par le client', 'À définir après livraison'], formData.maintenanceSouhaitee)],
      ['Mises à jour du contenu', renderOptions(['Client autonome (formation back-office incluse)', 'Délégation à DM+ Com (abonnement mensuel)', 'Au cas par cas (facturation séparée)'], formData.misesAJour)],
      ['Évolutions futures envisagées', renderOptions(['Ajout de nouvelles pages', 'Intégration e-commerce', 'Application mobile', 'Espace membre / plateforme', 'Aucune évolution prévue'], formData.evolutionsFutures)],
      ['Autres informations utiles', formData.autresInfosUtiles],
    ],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  // --- PAGE 10: ANALYSE CONCURRENTIELLE ---
  doc.addPage();
  addHeaderFooter(10, 10);
  addSectionHeader('10', "ANALYSE CONCURRENTIELLE", 50);

  const concurrentsBody = formData.concurrents.filter(c => c.nom).map((c, i) => [
    `Concurrent ${i + 1}`,
    `Nom: ${c.nom}\nCe qu'ils font bien: ${c.bien}\nCe que vous faites mieux: ${c.mieux}`
  ]);

  autoTable(doc, {
    startY: 65,
    head: [],
    body: concurrentsBody.length > 0 ? concurrentsBody : [['Aucun concurrent renseigné', '']],
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: {
      0: { fillColor: [248, 249, 251], fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 90 }
    }
  });

  if (returnAsBlob) {
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  } else {
    doc.save(`Convention_${formData.nomEntreprise}_DM_Invest.pdf`);
    return new Blob([doc.output('blob')], { type: 'application/pdf' });
  }
};

// Fonction pour générer le PDF en Blob (UTILISE LA COPIE LOCALE)
const generatePDFBlob = async (formData: BriefFormData): Promise<Blob> => {
  try {
    // Utiliser directement la copie locale avec returnAsBlob=true
    const pdfBlob = generateBriefPDF(formData, true);

    return pdfBlob;
  } catch (error) {
    throw new Error(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

// Fonction principale pour envoyer l'email avec le PDF
export const sendBriefEmailWithNodemailer = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🚀 Début envoi email avec les données:', {
      userName: emailData.userName,
      userEmail: emailData.userEmail,
      nomEntreprise: emailData.formData?.nomEntreprise
    });

    // Générer le PDF en Blob
    console.log('📄 Génération du PDF...');
    const pdfBlob = await generatePDFBlob(emailData.formData);
    console.log('✅ PDF généré, taille:', pdfBlob.size);

    // Créer FormData pour l'upload (utiliser directement le Blob)
    console.log('📋 Création FormData...');
    const formData = new FormData();
    formData.append('convention_pdf', pdfBlob, `Convention_${emailData.formData.nomEntreprise}_DM_Invest.pdf`);
    formData.append('userName', emailData.userName);
    formData.append('userEmail', emailData.userEmail);
    formData.append('nomEntreprise', emailData.formData.nomEntreprise);
    console.log('✅ FormData créé');

    // Envoyer à l'API backend
    console.log('📤 Envoi à l\'API backend...');
    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formData,
    });
    console.log('📡 Réponse API:', response.status, response.statusText);

    // Vérifier si la réponse est OK avant de parser
    if (!response.ok) {
      const errorText = await response.text();
      console.error('📡 Erreur HTTP:', response.status, errorText);
      return {
        success: false,
        message: `Erreur HTTP ${response.status}: ${errorText}`
      };
    }

    // Parser la réponse JSON en toute sécurité
    let result;
    try {
      const responseText = await response.text();
      console.log('📡 Réponse brute:', responseText);
      result = JSON.parse(responseText);
      console.log('� Résultat parsé:', result);
    } catch (parseError) {
      console.error('📡 Erreur parsing JSON:', parseError);
      return {
        success: false,
        message: 'Réponse serveur invalide'
      };
    }

    // Vérifier que le résultat a les propriétés attendues
    if (!result || typeof result.success === 'undefined') {
      console.error('📡 Résultat invalide:', result);
      return {
        success: false,
        message: 'Réponse serveur mal formatée'
      };
    }

    return {
      success: result.success,
      message: result.message || 'Opération terminée'
    };

  } catch (error) {
    console.error('❌ Erreur détaillée lors de l\'envoi:', {
      error: error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : 'No stack'
    });

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

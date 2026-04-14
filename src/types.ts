export interface FormData {
  // 01: Informations sur le client & l'entreprise
  nomEntreprise: string;
  secteurActivite: string;
  siegeSocial: string;
  siteActuel: string;
  fonctionTitre: string;
  emailContact: string;
  telephone: string;
  tailleEntreprise: string;
  phaseEntreprise: string;
  descriptionActivite: string;
  differenceConcurrents: string;

  // 02: Objectifs du projet
  objectifPrincipal: string;
  objectifAutre: string;
  ciblePrincipale: string;
  zonesGeographiques: string;
  messageCle: string;
  objectifs12Mois: string;
  tonStyle: string[];

  // 03: Budget & Délais
  budgetGlobal: string;
  modalitesPaiement: string;
  modaliteAutre: string;
  delaiLivraison: string;
  dateMiseEnLigne: string;
  contraintesParticulieres: string;

  // 04: Nom de domaine & Aspects techniques
  nomDomaineSouhaite: string;
  statutDomaine: string;
  cmsPrefere: string;
  cmsAutre: string;
  hebergement: string;
  hebergeurActuel: string;
  languesSite: string;
  langueAutre: string;

  // 05: Contenu du site
  redacteurTextes: string;
  fournisseurVisuels: string;
  avezLogo: string;
  avezCharte: string;
  couleursSouhaitees: string;
  typographieSouhaitee: string;
  sitesReference: string;
  ceQueVousNeVoulezPas: string;
  urlSouhaitee: string;
  couleurSelectionnee: string;
  paletteVisible: boolean;
  logoFile: File | null;
  charteFile: File | null;
  typographieVisible: boolean;
  typographieSelectionnee: string;
  typographieAutre: string;
  cmsExistant: boolean;
  nouveauCms: boolean;
  baseDonnees: boolean;
  typeSite: string;
  fonctionnalitesSite: string[];

  // 06: Structure du site
  pagesSouhaitees: string[];
  pagesAutres: string;
  arborescenceSouhaitee: string;
  pagePrioritaire: string;

  // 07: Fonctionnalités souhaitées
  fonctionnalitesIntegrer: string[];
  fonctionnaliteAutre: string;
  autresFonctionnalites: string;
  reseauxSociaux: string[];
  adaptabiliteMobile: string;
  pwa: boolean;

  // 08: Référencement & Marketing Digital
  seoNaturel: string;
  motsClesPrioritaires: string;
  googleAnalytics: string;
  googleAds: string;
  campagneEmailing: string;
  gestionReseauxSociaux: string;
  seoStrategique: string;
  campagnesPPC: string;
  emailMarketing: string;
  mobileStrategy: string;

  // 09: Maintenance & Évolution
  maintenanceSouhaitee: string;
  misesAJour: string;
  evolutionsFutures: string;
  autresInfosUtiles: string;

  // 10: Analyse Concurrentielle
  concurrents: {
    nom: string;
    bien: string;
    mieux: string;
  }[];
}

export type FormErrors = Partial<Record<keyof FormData, string>>;
export type FormTouched = Partial<Record<keyof FormData, boolean>>;

export const initialFormData: FormData = {
  nomEntreprise: '',
  secteurActivite: '',
  siegeSocial: '',
  siteActuel: '',
  fonctionTitre: '',
  emailContact: '',
  telephone: '',
  tailleEntreprise: '',
  phaseEntreprise: '',
  descriptionActivite: '',
  differenceConcurrents: '',
  objectifPrincipal: '',
  objectifAutre: '',
  ciblePrincipale: '',
  zonesGeographiques: '',
  messageCle: '',
  objectifs12Mois: '',
  tonStyle: [],
  budgetGlobal: '',
  modalitesPaiement: '',
  modaliteAutre: '',
  delaiLivraison: '',
  dateMiseEnLigne: '',
  contraintesParticulieres: '',
  nomDomaineSouhaite: '',
  statutDomaine: '',
  cmsPrefere: '',
  cmsAutre: '',
  hebergement: '',
  hebergeurActuel: '',
  languesSite: '',
  langueAutre: '',
  redacteurTextes: '',
  fournisseurVisuels: '',
  avezLogo: '',
  avezCharte: '',
  couleursSouhaitees: '',
  typographieSouhaitee: '',
  sitesReference: '',
  ceQueVousNeVoulezPas: '',
  urlSouhaitee: '',
  couleurSelectionnee: '#E31E24',
  paletteVisible: false,
  logoFile: null,
  charteFile: null,
  typographieVisible: false,
  typographieSelectionnee: 'Inter',
  typographieAutre: '',
  cmsExistant: false,
  nouveauCms: false,
  baseDonnees: false,
  typeSite: 'vitrine',
  fonctionnalitesSite: [],
  pagesSouhaitees: [],
  pagesAutres: '',
  arborescenceSouhaitee: '',
  pagePrioritaire: '',
  fonctionnalitesIntegrer: [],
  fonctionnaliteAutre: '',
  autresFonctionnalites: '',
  reseauxSociaux: [],
  adaptabiliteMobile: '',
  pwa: false,
  seoNaturel: '',
  motsClesPrioritaires: '',
  googleAnalytics: '',
  googleAds: '',
  campagneEmailing: '',
  gestionReseauxSociaux: '',
  seoStrategique: '',
  campagnesPPC: '',
  emailMarketing: '',
  mobileStrategy: '',
  maintenanceSouhaitee: '',
  misesAJour: '',
  evolutionsFutures: '',
  autresInfosUtiles: '',
  concurrents: [
    { nom: '', bien: '', mieux: '' },
    { nom: '', bien: '', mieux: '' },
    { nom: '', bien: '', mieux: '' },
  ],
};

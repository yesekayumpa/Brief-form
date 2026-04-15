import React from 'react';
import ToggleButtonGroup from './ToggleButtonGroup';
import { FormData, FormErrors, FormTouched } from '../types';
import { Check, AlertCircle, Globe, Target, Palette, Box, Settings, BarChart3, Mail, ShieldCheck, Zap, Info, ChartColumn, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  errors: FormErrors;
  touched: FormTouched;
  setFieldTouched: (field: keyof FormData) => void;
}

const ErrorMessage = ({ error, touched }: { error?: string; touched?: boolean }) => {
  if (!error || !touched) return null;
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2 mt-3 text-xs text-brand-red font-bold uppercase tracking-wider"
    >
      <AlertCircle className="w-3 h-3" />
      {error}
    </motion.div>
  );
};

const InputWrapper = ({ label, children, error, touched, description, value }: { label: string; children: React.ReactNode; error?: string; touched?: boolean; description?: string; value?: any }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const isError = touched && error;
  const isPopulated = value !== undefined && value !== null && String(value).trim() !== "" && (Array.isArray(value) ? value.length > 0 : true);
  const shouldFloat = isFocused || isPopulated;

  return (
    <div className="field-group">
      <div 
        className={`field-container ${isError ? 'border-brand-red/50 bg-brand-red/5' : ''}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {children}
        <motion.label 
          className="field-label"
          initial={false}
          animate={{
            top: shouldFloat ? "-8px" : "50%",
            left: shouldFloat ? "12px" : "20px",
            scale: shouldFloat ? 0.75 : 1,
            color: isError ? "#E31E24" : (isFocused ? "#E31E24" : "#64748B"),
            backgroundColor: shouldFloat ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0)",
            paddingLeft: shouldFloat ? "8px" : "0px",
            paddingRight: shouldFloat ? "8px" : "0px",
            fontWeight: shouldFloat ? 600 : 400,
            letterSpacing: shouldFloat ? "0.05em" : "0em",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          style={{ originX: 0, originY: 0.5, y: "-50%", textTransform: shouldFloat ? "uppercase" : "none" }}
        >
          {label}
        </motion.label>
        <div className="ripple-line" />
      </div>
      {description && !isError && (
        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 block ml-1">
          {description}
        </span>
      )}
      <ErrorMessage error={error} touched={touched} />
    </div>
  );
};


const CheckboxGroup = ({ label, options, selected, onChange, redTitle }: { label: string; options: string[]; selected: string[]; onChange: (val: string[]) => void; redTitle?: boolean }) => {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="space-y-4">
      <label className={`form-label ${redTitle ? '!text-brand-red !font-bold' : ''}`}>{label}</label>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-5 py-4 text-[10px] rounded-xl border transition-all duration-500 flex items-center justify-between group ${
              selected.includes(opt)
                ? 'bg-brand-dark border-brand-red/30 text-white shadow-lg'
                : 'bg-white/60 border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <span className="font-bold uppercase tracking-wider">{opt}</span>
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              selected.includes(opt) ? 'bg-white border-white' : 'border-slate-200'
            }`}>
              {selected.includes(opt) && <Check className="w-2.5 h-2.5 text-brand-dark" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const RadioGroup = ({ label, options, selected, onChange, redTitle }: { label: string; options: string[]; selected: string; onChange: (val: string) => void; redTitle?: boolean }) => (
  <div className="space-y-4">
    <label className={`form-label ${redTitle ? '!text-brand-red !font-bold' : ''}`}>{label}</label>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-5 py-4 text-[10px] rounded-xl border transition-all duration-500 flex items-center justify-between group ${
            selected === opt
              ? 'bg-brand-dark border-brand-red/30 text-white shadow-lg'
              : 'bg-white/60 border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          <span className="font-bold uppercase tracking-wider">{opt}</span>
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
            selected === opt ? 'bg-white border-white' : 'border-slate-200'
          }`}>
            {selected === opt && <div className="w-2 h-2 rounded-full bg-brand-red" />}
          </div>
        </button>
      ))}
    </div>
  </div>
);

// --- STEPS ---

export const Step1 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="Nom de l'entreprise" value={formData.nomEntreprise}>
        <input className="field-input" value={formData.nomEntreprise} onChange={e => updateFormData({ nomEntreprise: e.target.value })} required />
      </InputWrapper>
      <InputWrapper label="Secteur d'activité" value={formData.secteurActivite}>
        <input className="field-input" value={formData.secteurActivite} onChange={e => updateFormData({ secteurActivite: e.target.value })} required />
      </InputWrapper>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="Pays / Ville du siège" value={formData.siegeSocial}>
        <input className="field-input" value={formData.siegeSocial} onChange={e => updateFormData({ siegeSocial: e.target.value })} required />
      </InputWrapper>
      <InputWrapper label="Site internet actuel" value={formData.siteActuel}>
        <input className="field-input" value={formData.siteActuel} onChange={e => updateFormData({ siteActuel: e.target.value })} required />
      </InputWrapper>
    </div>
    <InputWrapper label="URL souhaitée pour le site" value={formData.urlSouhaitee}>
      <input 
        className={`field-input h-[80px] ${formData.urlSouhaitee && !/^(https?:\/\/)?(www\.)?[a-zA-Z-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(formData.urlSouhaitee) ? '!border-red-500 !ring-2 !ring-red-500' : ''}`} 
        placeholder="www.votresite.com" 
        pattern="^(https?:\/\/)?(www\.)?[a-zA-Z-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$" 
        title="Veuillez entrer un nom de domaine valide avec uniquement des lettres (ex: www.votresite.com)" 
        type="text" 
        value={formData.urlSouhaitee} 
        onChange={e => {
          // N'accepter que les lettres, points, tirets et www/https
          const value = e.target.value;
          const filteredValue = value.replace(/[^a-zA-Z.\-\/:www]/g, '');
          updateFormData({ urlSouhaitee: filteredValue });
        }} 
        required
      />
    </InputWrapper>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="Fonction / Titre " value={formData.fonctionTitre}>
        <input className="field-input" value={formData.fonctionTitre} onChange={e => updateFormData({ fonctionTitre: e.target.value })} required />
      </InputWrapper>
      <InputWrapper label="Email de contact" value={formData.emailContact}>
        <input className="field-input" value={formData.emailContact} onChange={e => updateFormData({ emailContact: e.target.value })} required />
      </InputWrapper>
      <InputWrapper label="Téléphone " value={formData.telephone}>
        <input className="field-input" value={formData.telephone} onChange={e => updateFormData({ telephone: e.target.value })} required />
      </InputWrapper>
    </div>
    <RadioGroup 
      label="Taille de l'entreprise" 
      options={['Indépendant / Freelance', 'TPE (1-9 employés)', 'PME (10-49 employés)', 'ETI (50-250 employés)', 'Grand groupe (250+)']} 
      selected={formData.tailleEntreprise} 
      onChange={val => updateFormData({ tailleEntreprise: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="Phase de l'entreprise" 
      options={['Lancement / Startup', 'En croissance', 'Établie / Mature', 'En restructuration / Pivot']} 
      selected={formData.phaseEntreprise} 
      onChange={val => updateFormData({ phaseEntreprise: val })} 
      redTitle={true}
    />
    <InputWrapper label="Description de l'activité" value={formData.descriptionActivite}>
      <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.descriptionActivite} onChange={e => updateFormData({ descriptionActivite: e.target.value })} required />
    </InputWrapper>
    <InputWrapper label="En quoi vous êtes différent de vos concurrents ?" value={formData.differenceConcurrents}>
      <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.differenceConcurrents} onChange={e => updateFormData({ differenceConcurrents: e.target.value })} required />
    </InputWrapper>
  </div>
);

export const Step2 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <CheckboxGroup 
      label="Objectifs principaux du site" 
      options={['Crédibiliser / légitimer l\'entreprise', 'Générer des contacts / leads qualifiés', 'Présenter les produits / services', 'Support à la prospection commerciale', 'Vendre en ligne (e-commerce)', 'Recrutement', 'Autre']} 
      selected={formData.objectifPrincipal} 
      onChange={val => updateFormData({ objectifPrincipal: val })} 
      redTitle={true}
    />
    {formData.objectifPrincipal.includes('Autre') && (
      <InputWrapper label="Si autre, précisez" value={formData.objectifAutre}>
        <input className="field-input" value={formData.objectifAutre} onChange={e => updateFormData({ objectifAutre: e.target.value })} required />
      </InputWrapper>
    )}
    <CheckboxGroup 
      label="Cible principale du site" 
      options={['Grandes entreprises / Groupes internationaux', 'PME / ETI', 'Investisseurs / Fonds', 'Particuliers (B2C)', 'Institutions / ONG / Secteur public', 'Partenaires / Distributeurs']} 
      selected={[formData.ciblePrincipale]} 
      onChange={val => updateFormData({ ciblePrincipale: val[val.length - 1] || '' })} 
      redTitle={true}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="Zones géographiques cibles" value={formData.zonesGeographiques}>
        <input className="field-input" value={formData.zonesGeographiques} onChange={e => updateFormData({ zonesGeographiques: e.target.value })} required />
      </InputWrapper>
      <InputWrapper label="Message clé du site" value={formData.messageCle}>
        <input className="field-input" value={formData.messageCle} onChange={e => updateFormData({ messageCle: e.target.value })} required />
      </InputWrapper>
    </div>
    <InputWrapper label="Objectifs à 12 mois via le site" value={formData.objectifs12Mois}>
      <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.objectifs12Mois} onChange={e => updateFormData({ objectifs12Mois: e.target.value })} required />
    </InputWrapper>
    <CheckboxGroup 
      label="Ton et style souhaités" 
      options={['Professionnel & institutionnel', 'Moderne & dynamique', 'Premium & haut de gamme', 'Accessible & humain', 'Technique & expert', 'Minimaliste & sobre']} 
      selected={formData.tonStyle} 
      onChange={val => updateFormData({ tonStyle: val })} 
      redTitle={true}
    />
  </div>
);

export const Step3 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <RadioGroup 
      label="Budget global envisagé" 
      options={['Moins de 500 000 FCFA', '500 000 - 1 500 000 FCFA', '1 500 000 - 3 000 000 FCFA', '3 000 000 - 5 000 000 FCFA', 'Plus de 5 000 000 FCFA', 'À définir ensemble']} 
      selected={formData.budgetGlobal} 
      onChange={val => updateFormData({ budgetGlobal: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="Modalités de paiement souhaitées" 
      options={['100% à la commande', '50% commande / 50% livraison', '30% / 40% / 30% (jalons)', 'Autre (préciser)']} 
      selected={formData.modalitesPaiement} 
      onChange={val => updateFormData({ modalitesPaiement: val })} 
      redTitle={true}
    />
    {formData.modalitesPaiement === 'Autre (préciser)' && (
      <InputWrapper label="Si autre modalité, précisez" value={formData.modaliteAutre}>
        <input className="field-input" value={formData.modaliteAutre} onChange={e => updateFormData({ modaliteAutre: e.target.value })} />
      </InputWrapper>
    )}
    <RadioGroup 
      label="Délai de livraison souhaité" 
      options={['Urgent — moins de 2 semaines', 'Standard — 3 à 5 semaines', 'Flexible — 6 à 8 semaines', 'Pas de contrainte particulière']} 
      selected={formData.delaiLivraison} 
      onChange={val => updateFormData({ delaiLivraison: val })} 
      redTitle={true}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="" value={formData.dateMiseEnLigne} description="Date de mise en ligne souhaitée">
        <input type="date" className="field-input" value={formData.dateMiseEnLigne} onChange={e => updateFormData({ dateMiseEnLigne: e.target.value })} />
      </InputWrapper>
      <InputWrapper label="" value={formData.contraintesParticulieres} description="Contraintes particulières">
        <textarea className="field-input h-[60px] py-4 resize-none" value={formData.contraintesParticulieres} onChange={e => updateFormData({ contraintesParticulieres: e.target.value })} />
      </InputWrapper>
    </div>
  </div>
);

export const Step4 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <InputWrapper label="Nom de domaine souhaité" value={formData.nomDomaineSouhaite}>
      <input className="field-input" value={formData.nomDomaineSouhaite} onChange={e => updateFormData({ nomDomaineSouhaite: e.target.value })} />
    </InputWrapper>
    <RadioGroup 
      label="Statut du nom de domaine" 
      options={['Déjà enregistré — je le fournis', 'À vérifier et enregistrer par DM+', 'Je ne sais pas — besoin de conseil']} 
      selected={formData.statutDomaine} 
      onChange={val => updateFormData({ statutDomaine: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="CMS préféré" 
      options={['Webflow (recommandé premium)', 'WordPress', 'Pas de préférence — conseiller DM+', 'Autre (préciser)']} 
      selected={formData.cmsPrefere} 
      onChange={val => updateFormData({ cmsPrefere: val })} 
      redTitle={true}
    />
    {formData.cmsPrefere === 'Autre (préciser)' && (
      <InputWrapper label="Si autre CMS, précisez" value={formData.cmsAutre}>
        <input className="field-input" value={formData.cmsAutre} onChange={e => updateFormData({ cmsAutre: e.target.value })} />
      </InputWrapper>
    )}
    <RadioGroup 
      label="Hébergement" 
      options={['Inclus dans la prestation DM+', 'J\'ai déjà un hébergeur', 'À définir']} 
      selected={formData.hebergement} 
      onChange={val => updateFormData({ hebergement: val })} 
      redTitle={true}
    />
    <InputWrapper label="Nom de l'hébergeur actuel (si existant)" value={formData.hebergeurActuel}>
      <input className="field-input" value={formData.hebergeurActuel} onChange={e => updateFormData({ hebergeurActuel: e.target.value })} />
    </InputWrapper>
    <RadioGroup 
      label="Langues du site" 
      options={['Français uniquement', 'Anglais uniquement', 'Français + Anglais', 'Autre combinaison (préciser)']} 
      selected={formData.languesSite} 
      onChange={val => updateFormData({ languesSite: val })} 
      redTitle={true}
    />
    {formData.languesSite === 'Autre combinaison (préciser)' && (
      <InputWrapper label="Si autre combinaison, précisez" value={formData.langueAutre}>
        <input className="field-input" value={formData.langueAutre} onChange={e => updateFormData({ langueAutre: e.target.value })} />
      </InputWrapper>
    )}
  </div>
);

export const Step5 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <RadioGroup 
      label="Qui rédige les textes ?" 
      options={['Le client fournit tous les textes', 'DM+ Com rédige l\'ensemble (prestation supplémentaire)', 'Rédaction partagée — à définir page par page', 'Textes partiellement existants — à compléter']} 
      selected={formData.redacteurTextes} 
      onChange={val => updateFormData({ redacteurTextes: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="Qui fournit les visuels / photos ?" 
      options={['Le client fournit photos et visuels', 'DM+ intègre une banque d\'images premium', 'Shooting photo à prévoir (prestation supplémentaire)', 'Mix des deux']} 
      selected={formData.fournisseurVisuels} 
      onChange={val => updateFormData({ fournisseurVisuels: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="Avez-vous un logo ?" 
      options={['Oui — fichiers HD disponibles (AI, EPS, PNG)', 'Oui — uniquement en basse résolution', 'Non — création de logo à prévoir', 'En cours de création']} 
      selected={formData.avezLogo} 
      onChange={val => updateFormData({ avezLogo: val })} 
      redTitle={true}
    />
    {(formData.avezLogo === 'Oui — fichiers HD disponibles (AI, EPS, PNG)' || formData.avezLogo === 'Oui — uniquement en basse résolution') && (
      <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
        <label className="block text-sm font-bold text-slate-700 mb-3">
          Importer votre logo (AI, EPS, PNG, JPG - Max 10MB)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".ai,.eps,.png,.jpg,.jpeg,.svg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateFormData({ logoFile: file });
              }
            }}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-xl hover:bg-brand-dark transition-colors cursor-pointer text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Choisir un fichier
          </label>
          {formData.logoFile && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formData.logoFile.name}</span>
              <span className="text-xs">({(formData.logoFile.size / 1024 / 1024).toFixed(1)} MB)</span>
            </div>
          )}
        </div>
      </div>
    )}
    
    <RadioGroup 
      label="Avez-vous une charte graphique ?" 
      options={['Oui — charte complète disponible', 'Oui — charte partielle / en cours', 'Non — liberté laissée au designer DM+', 'Non — à créer (prestation supplémentaire)']} 
      selected={formData.avezCharte} 
      onChange={val => updateFormData({ avezCharte: val })} 
      redTitle={true}
    />
    {(formData.avezCharte === 'Oui — charte complète disponible' || formData.avezCharte === 'Oui — charte partielle / en cours') && (
      <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
        <label className="block text-sm font-bold text-slate-700 mb-3">
          Importer votre charte graphique (PDF, AI, EPS - Max 20MB)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".pdf,.ai,.eps,.zip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                updateFormData({ charteFile: file });
              }
            }}
            className="hidden"
            id="charte-upload"
          />
          <label
            htmlFor="charte-upload"
            className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-xl hover:bg-brand-dark transition-colors cursor-pointer text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Choisir un fichier
          </label>
          {formData.charteFile && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formData.charteFile.name}</span>
              <span className="text-xs">({(formData.charteFile.size / 1024 / 1024).toFixed(1)} MB)</span>
            </div>
          )}
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="Couleurs souhaitées pour le site" value={formData.couleursSouhaitees}>
        <input className="field-input" value={formData.couleursSouhaitees} onChange={e => updateFormData({ couleursSouhaitees: e.target.value })} />
      </InputWrapper>
      <InputWrapper label="Typographie souhaitée" value={formData.typographieSouhaitee}>
        <input className="field-input" value={formData.typographieSouhaitee} onChange={e => updateFormData({ typographieSouhaitee: e.target.value })} />
      </InputWrapper>
    </div>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 !text-brand-red">Typographie Institutionnelle</h3>
        </div>
        <button
          type="button"
          onClick={() => updateFormData({ typographieVisible: !formData.typographieVisible })}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl hover:bg-white hover:border-brand-red/30 transition-all duration-300"
        >
          <span className="text-sm font-bold text-slate-700">
            {formData.typographieVisible ? 'Masquer' : 'Afficher'} les typographies
          </span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${formData.typographieVisible ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {formData.typographieVisible && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { name: 'Arial', family: 'Arial' },
              { name: 'Courier New', family: 'Courier New' },
              { name: 'Georgia', family: 'Georgia' },
              { name: 'Impact', family: 'Impact' },
              { name: 'Roboto', family: 'Roboto' },
              { name: 'Verdana', family: 'Verdana' },
              { name: 'Outfit', family: 'Outfit' },
              { name: 'Inter', family: 'Inter' },
              { name: 'Playfair Display', family: 'Playfair Display' }
            ].map((font) => (
              <button
                key={font.name}
                type="button"
                onClick={() => updateFormData({ typographieSelectionnee: font.family })}
                className={`px-2 py-3 text-xs rounded-lg border transition-all duration-500 text-center backdrop-blur-sm bg-white/80 border-slate-200/60 text-slate-600 hover:border-brand-red/20 hover:text-slate-800 ${
                  formData.typographieSelectionnee === font.family
                    ? 'border-brand-red ring-2 ring-brand-red/50 bg-brand-red/10 text-brand-dark'
                    : ''
                }`}
                style={{ fontFamily: font.family }}
              >
                {font.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => updateFormData({ typographieSelectionnee: 'Autres' })}
              className={`px-2 py-3 text-xs rounded-lg border transition-all duration-500 text-center backdrop-blur-sm bg-white/80 border-slate-200/60 text-slate-600 hover:border-brand-red/20 hover:text-slate-800 ${
                formData.typographieSelectionnee === 'Autres'
                  ? 'border-brand-red ring-2 ring-brand-red/50 bg-brand-red/10 text-brand-dark'
                  : ''
              }`}
              style={{ fontFamily: 'Inter' }}
            >
              Autres
            </button>
          </div>
          
          {formData.typographieSelectionnee && formData.typographieSelectionnee !== 'Autres' && (
            <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-slate-700">Typographie sélectionnée:</label>
                <div 
                  className="px-4 py-2 rounded-lg border-2 border-slate-300 bg-white shadow-inner"
                  style={{ fontFamily: formData.typographieSelectionnee }}
                >
                  {formData.typographieSelectionnee === 'Inter' ? 'Inter' : 
                   formData.typographieSelectionnee === 'Arial' ? 'Arial' :
                   formData.typographieSelectionnee === 'Georgia' ? 'Georgia' :
                   formData.typographieSelectionnee === 'Roboto' ? 'Roboto' :
                   formData.typographieSelectionnee === 'Verdana' ? 'Verdana' :
                   formData.typographieSelectionnee === 'Impact' ? 'Impact' :
                   formData.typographieSelectionnee === 'Courier New' ? 'Courier New' :
                   formData.typographieSelectionnee === 'Outfit' ? 'Outfit' :
                   formData.typographieSelectionnee === 'Playfair Display' ? 'Playfair Display' :
                   formData.typographieSelectionnee}
                </div>
              </div>
            </div>
          )}

          {formData.typographieSelectionnee === 'Autres' && (
            <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
              <InputWrapper label="Précisez la typographie souhaitée" value={formData.typographieAutre}>
                <input 
                  className="field-input" 
                  value={formData.typographieAutre} 
                  onChange={e => updateFormData({ typographieAutre: e.target.value })} 
                  placeholder="Entrez le nom de votre typographie personnalisée"
                />
              </InputWrapper>
            </div>
          )}
        </div>
      )}
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 !text-brand-red">Palette Chromatique</h3>
          <p className="text-sm text-slate-600 mt-1">Sélectionnez vos couleurs préférées (HEX / RGB / PMS)</p>
        </div>
        <button
          type="button"
          onClick={() => updateFormData({ paletteVisible: !formData.paletteVisible })}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl hover:bg-white hover:border-brand-red/30 transition-all duration-300"
        >
          <span className="text-sm font-bold text-slate-700">
            {formData.paletteVisible ? 'Masquer' : 'Afficher'} la palette
          </span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${formData.paletteVisible ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {formData.paletteVisible && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {[
            { color: '#E31E24', rgb: 'rgb(227, 30, 36)' },
            { color: '#0F172A', rgb: 'rgb(15, 23, 42)' },
            { color: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
            { color: '#10B981', rgb: 'rgb(16, 185, 129)' },
            { color: '#F59E0B', rgb: 'rgb(245, 158, 11)' },
            { color: '#8B5CF6', rgb: 'rgb(139, 92, 246)' },
            { color: '#EF4444', rgb: 'rgb(239, 68, 68)' },
            { color: '#F97316', rgb: 'rgb(249, 115, 22)' },
            { color: '#84CC16', rgb: 'rgb(132, 204, 22)' },
            { color: '#06B6D4', rgb: 'rgb(6, 182, 212)' },
            { color: '#6366F1', rgb: 'rgb(99, 102, 241)' },
            { color: '#EC4899', rgb: 'rgb(236, 72, 153)' },
            { color: '#64748B', rgb: 'rgb(100, 116, 139)' },
            { color: '#475569', rgb: 'rgb(71, 85, 105)' },
            { color: '#334155', rgb: 'rgb(51, 65, 85)' },
            { color: '#1E293B', rgb: 'rgb(30, 41, 59)' },
            { color: '#0F172A', rgb: 'rgb(15, 23, 42)' },
            { color: '#F8FAFC', rgb: 'rgb(248, 250, 252)' },
            { color: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
            { color: '#F3F4F6', rgb: 'rgb(243, 244, 246)' },
            { color: '#E5E7EB', rgb: 'rgb(229, 231, 235)' },
            { color: '#D1D5DB', rgb: 'rgb(209, 213, 219)' },
            { color: '#9CA3AF', rgb: 'rgb(156, 163, 175)' },
            { color: '#6B7280', rgb: 'rgb(107, 114, 128)' }
          ].map((item) => (
            <button
              key={item.color}
              type="button"
              className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                formData.couleurSelectionnee === item.color
                  ? 'border-brand-red ring-2 ring-brand-red/50 scale-110'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              style={{ backgroundColor: item.rgb }}
              title={item.color}
              onClick={() => updateFormData({ couleurSelectionnee: item.color })}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-slate-700">Couleur sélectionnée:</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-10 h-10 rounded-lg border-2 border-slate-300 shadow-inner"
                style={{ backgroundColor: formData.couleurSelectionnee }}
              />
              <input
                type="color"
                value={formData.couleurSelectionnee}
                onChange={(e) => updateFormData({ couleurSelectionnee: e.target.value })}
                className="w-10 h-10 rounded-lg border-2 border-slate-300 cursor-pointer"
                title="Choisir une couleur personnalisée"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formData.couleurSelectionnee}
              onChange={(e) => updateFormData({ couleurSelectionnee: e.target.value })}
              placeholder="#000000"
              className="field-input w-32 h-10 px-3 text-sm font-mono"
              title="Entrer le code HEX"
            />
          </div>
        </div>
        </div>
      )}
    </div>
    <InputWrapper label="Sites de référence appréciés" value={formData.sitesReference}>
      <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.sitesReference} onChange={e => updateFormData({ sitesReference: e.target.value })} />
    </InputWrapper>
    <InputWrapper label="Ce que vous ne voulez absolument pas" value={formData.ceQueVousNeVoulezPas}>
      <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.ceQueVousNeVoulezPas} onChange={e => updateFormData({ ceQueVousNeVoulezPas: e.target.value })} />
    </InputWrapper>
  </div>
);

export const Step6 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <CheckboxGroup 
      label="Pages souhaitées " 
      options={['Accueil / Home', 'À propos / Qui sommes-nous', 'Services / Expertises', 'Réalisations / Portfolio', 'Équipe', 'Zones géographiques', 'Actualités / Blog', 'Témoignages / Références', 'FAQ', 'Contact', 'Mentions légales', 'Autre (préciser)']} 
      selected={formData.pagesSouhaitees} 
      onChange={val => updateFormData({ pagesSouhaitees: val })} 
      redTitle={true}
    />
    {formData.pagesSouhaitees.includes('Autre (préciser)') && (
      <InputWrapper label="Si autres pages, précisez" value={formData.pagesAutres}>
        <input className="field-input" value={formData.pagesAutres} onChange={e => updateFormData({ pagesAutres: e.target.value })} />
      </InputWrapper>
    )}
    
    <div className="space-y-8">
      <div>
        <h3 className="form-label mb-6 !text-brand-red !font-bold">Type de site internet</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input 
              id="cms-existant" 
              checked={formData.cmsExistant}
              onChange={(e) => updateFormData({ cmsExistant: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" 
              type="checkbox" 
            />
            <label for="cms-existant" className="text-sm text-gray-700">Utilisez-vous un CMS existant ?</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              id="nouveau-cms" 
              checked={formData.nouveauCms}
              onChange={(e) => updateFormData({ nouveauCms: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" 
              type="checkbox" 
            />
            <label for="nouveau-cms" className="text-sm text-gray-700">Souhaitez-vous un nouveau CMS ?</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              id="base-donnees" 
              checked={formData.baseDonnees}
              onChange={(e) => updateFormData({ baseDonnees: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" 
              type="checkbox" 
            />
            <label for="base-donnees" className="text-sm text-gray-700">Avez-vous une base de données ?</label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 mb-2">Type de site :</label>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <input 
                  id="site-marchand" 
                  checked={formData.typeSite === 'marchand'}
                  onChange={() => updateFormData({ typeSite: 'marchand' })}
                  className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" 
                  type="radio" 
                  name="site-type" 
                />
                <label for="site-marchand" className="text-sm text-gray-700">Site marchand</label>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  id="site-vitrine" 
                  checked={formData.typeSite === 'vitrine'}
                  onChange={() => updateFormData({ typeSite: 'vitrine' })}
                  className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" 
                  type="radio" 
                  name="site-type" 
                />
                <label for="site-vitrine" className="text-sm text-gray-700">Site vitrine</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="space-y-6">
      <div>
        <h3 className="form-label !text-brand-red !font-bold">Quelle fonctionnalité aimeriez-vous avoir sur votre site internet ?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'encart-bannieres', name: 'Encart / bannières publicitaires', icon: '' },
            { id: 'blog', name: 'Blog', icon: '' },
            { id: 'module-reservation', name: 'Module de réservation', icon: '' },
            { id: 'calendrier-evenements', name: 'Calendrier d\'événements', icon: '' },
            { id: 'espace-client', name: 'Espace client (compte client)', icon: '' },
            { id: 'base-donnees-clients', name: 'Base de données clients', icon: '' },
            { id: 'annuaire-repertoire', name: 'Annuaire/répertoire de marque/produits/etc.', icon: '' },
            { id: 'e-commerce', name: 'E-commerce', icon: '' },
            { id: 'faq', name: 'FAQ', icon: '' },
            { id: 'formulaires', name: 'Formulaires', icon: '' },
            { id: 'forum', name: 'Forum', icon: '' },
            { id: 'newsletters', name: 'Newsletters', icon: '' },
            { id: 'galerie-photos', name: 'Galerie photos', icon: '' },
            { id: 'champ-promotions', name: 'Champ de promotions', icon: '' },
            { id: 'barre-recherche', name: 'Barre de recherche', icon: '' },
            { id: 'panier-achat', name: 'Panier (achat)', icon: '' },
            { id: 'statistiques', name: 'Statistiques', icon: '' },
            { id: 'autres', name: 'Autres', icon: '' }
          ].map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => {
                if (formData.fonctionnalitesSite.includes(feature.id)) {
                  updateFormData({ 
                    fonctionnalitesSite: formData.fonctionnalitesSite.filter(f => f !== feature.id) 
                  });
                } else {
                  updateFormData({ 
                    fonctionnalitesSite: [...formData.fonctionnalitesSite, feature.id] 
                  });
                }
              }}
              className={`px-4 py-3 rounded-xl border transition-all duration-700 flex items-center justify-between group backdrop-blur-sm bg-white/60 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-brand-dark ${
                formData.fonctionnalitesSite.includes(feature.id)
                  ? 'border-brand-red ring-2 ring-brand-red/50 bg-brand-red/10 text-brand-dark'
                  : ''
              }`}
            >
              <span className="font-bold uppercase tracking-widest text-[10px]">{feature.name}</span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                formData.fonctionnalitesSite.includes(feature.id)
                  ? 'border-brand-red bg-brand-red'
                  : 'border-slate-200 group-hover:border-slate-300'
              }`}>
                {feature.icon}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>

    {formData.fonctionnalitesSite.includes('autres') && (
      <InputWrapper label="Précisez les autres fonctionnalités souhaitées" value={formData.autresFonctionnalites}>
        <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.autresFonctionnalites} onChange={e => updateFormData({ autresFonctionnalites: e.target.value })} />
      </InputWrapper>
    )}
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InputWrapper label="Arborescence souhaitée" value={formData.arborescenceSouhaitee}>
        <textarea className="field-input min-h-[80px] py-4 resize-none" value={formData.arborescenceSouhaitee} onChange={e => updateFormData({ arborescenceSouhaitee: e.target.value })} />
      </InputWrapper>
      <InputWrapper label="Page(s) prioritaire(s)" value={formData.pagePrioritaire}>
        <input className="field-input" value={formData.pagePrioritaire} onChange={e => updateFormData({ pagePrioritaire: e.target.value })} />
      </InputWrapper>
    </div>
  </div>
);

export const Step7 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <CheckboxGroup 
      label="Fonctionnalités à intégrer" 
      options={['Formulaire de contact', 'Prise de rendez-vous (Calendly...)', 'Paiement en ligne (Stripe...)', 'Espace client / Compte utilisateur', 'Newsletter / Emailing', 'Blog / Actualités', 'Galerie photos / vidéos', 'Carte / Géolocalisation', 'Chat en ligne', 'Multi-langue', 'Statistiques intégrées', 'Autre (préciser)']} 
      selected={formData.fonctionnalitesIntegrer} 
      onChange={val => updateFormData({ fonctionnalitesIntegrer: val })} 
      redTitle={true} 
    />
    {formData.fonctionnalitesIntegrer.includes('Autre (préciser)') && (
      <InputWrapper label="Si autres fonctionnalités, précisez" value={formData.fonctionnaliteAutre}>
        <input className="field-input" value={formData.fonctionnaliteAutre} onChange={e => updateFormData({ fonctionnaliteAutre: e.target.value })} />
      </InputWrapper>
    )}
    <CheckboxGroup 
      label="Réseaux sociaux à intégrer" 
      options={['LinkedIn', 'Instagram', 'Facebook', 'Twitter / X', 'YouTube', 'WhatsApp', 'Aucun']} 
      selected={formData.reseauxSociaux} 
      onChange={val => updateFormData({ reseauxSociaux: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="Adaptabilité mobile" 
      options={['Site responsive (obligatoire)', 'Application mobile envisagée (ultérieurement)']} 
      selected={formData.adaptabiliteMobile} 
      onChange={val => updateFormData({ adaptabiliteMobile: val })} 
      redTitle={true}
    />
    <div className="flex items-center gap-4 p-4 bg-white/60 border border-slate-200 rounded-xl">
      <input type="checkbox" checked={formData.pwa} onChange={e => updateFormData({ pwa: e.target.checked })} className="w-5 h-5 accent-brand-red" />
      <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">PWA (Progressive Web App)</label>
    </div>
  </div>
);

export const Step8 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <div className="mb-8">
      <h3 className="text-xl font-bold text-brand-dark mb-2 !text-brand-red">Marketing Mix</h3>
      <p className="text-slate-600 text-sm">Définissez votre stratégie marketing complète</p>
    </div>

    {/* Objectifs Marketing */}
    <CheckboxGroup 
      label="Objectifs Marketing Principaux" 
      options={[
        'Notoriété de marque',
        'Génération de leads',
        'Conversion et ventes',
        'Fidélisation client',
        'Éducation de marché',
        'Lancement produit',
        'Autre'
      ]} 
      selected={formData.marketingMix.objectifsMarketing} 
      onChange={val => updateFormData({ 
        marketingMix: { 
          ...formData.marketingMix, 
          objectifsMarketing: val 
        } 
      })} 
      redTitle={true}
    />

    {/* Budget Marketing */}
    <InputWrapper label="Budget Marketing Mensuel (€)" value={formData.marketingMix.budgetMarketing}>
      <input 
        className="field-input" 
        value={formData.marketingMix.budgetMarketing} 
        onChange={e => updateFormData({ 
          marketingMix: { 
            ...formData.marketingMix, 
            budgetMarketing: e.target.value 
          } 
        })} 
        placeholder="Ex: 2000"
      />
    </InputWrapper>

    {/* Canaux Prioritaires */}
    <CheckboxGroup 
      label="Canaux Marketing Prioritaires" 
      options={[
        'SEO / Référencement naturel',
        'Google Ads / PPC',
        'Réseaux Sociaux',
        'Email Marketing',
        'Content Marketing',
        'Marketing d\'influence',
        'Affiliation',
        'Publicité programmatique'
      ]} 
      selected={formData.marketingMix.canauxPrioritaires} 
      onChange={val => updateFormData({ 
        marketingMix: { 
          ...formData.marketingMix, 
          canauxPrioritaires: val 
        } 
      })} 
      redTitle={true}
    />

    {/* Contenu Marketing */}
    <InputWrapper label="Type de Contenu Marketing Privilégié" value={formData.marketingMix.contenuMarketing}>
      <div className="!text-brand-red !font-bold form-label"></div>
      <textarea 
        className="field-input min-h-[90px] py-2 resize-none" 
        value={formData.marketingMix.contenuMarketing} 
        onChange={e => updateFormData({ 
          marketingMix: { 
            ...formData.marketingMix, 
            contenuMarketing: e.target.value 
          } 
        })} 
        placeholder="Articles de blog, vidéos, webinaires, études de cas, infographies..."
      />
    </InputWrapper>

    {/* Fréquence Publication */}
    <RadioGroup 
      label="Fréquence de Publication Souhaitée" 
      options={[
        'Quotidienne',
        'Hebdomadaire',
        'Bi-mensuelle',
        'Mensuelle',
        'Trimestrielle',
        'Selon les campagnes'
      ]} 
      selected={formData.marketingMix.frequencePublication} 
      onChange={val => updateFormData({ 
        marketingMix: { 
          ...formData.marketingMix, 
          frequencePublication: val 
        } 
      })} 
      redTitle={true}
    />

    {/* KPIs Principaux */}
    <InputWrapper label="Indicateurs Clés de Performance (KPIs)" value={formData.marketingMix.kpisPrincipaux}>
      <div className="!text-brand-red !font-bold form-label"></div>
      <textarea 
        className="field-input min-h-[80px] py-4 resize-none" 
        value={formData.marketingMix.kpisPrincipaux} 
        onChange={e => updateFormData({ 
          marketingMix: { 
            ...formData.marketingMix, 
            kpisPrincipaux: e.target.value 
          } 
        })} 
        placeholder="Trafic organique, taux de conversion, coût par acquisition, ROI, engagement..."
      />
    </InputWrapper>

    {/* Services Marketing Additionnels */}
    <div className="space-y-3 mt-4">
      <h4 className="text-sm font-semibold text-brand-dark !text-brand-red">Services Marketing Additionnels</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md border border-slate-200/60 hover:border-brand-red/20 transition-all duration-300 group shadow-sm hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-50 flex items-center justify-center group-hover:bg-brand-red/10 transition-all">
                <ChartColumn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red" />
              </div>
              <label className="text-xs font-semibold text-slate-700">SEO Stratégique</label>
            </div>
            <ToggleButtonGroup
              value={formData.seoStrategique}
              onChange={val => updateFormData({ seoStrategique: val })}
            />
          </div>
        </div>
        
        <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md border border-slate-200/60 hover:border-brand-red/20 transition-all duration-300 group shadow-sm hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-50 flex items-center justify-center group-hover:bg-brand-red/10 transition-all">
                <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red" />
              </div>
              <label className="text-xs font-semibold text-slate-700">Campagnes PPC</label>
            </div>
            <ToggleButtonGroup
              value={formData.campagnesPPC}
              onChange={val => updateFormData({ campagnesPPC: val })}
            />
          </div>
        </div>
        
        <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md border border-slate-200/60 hover:border-brand-red/20 transition-all duration-300 group shadow-sm hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-50 flex items-center justify-center group-hover:bg-brand-red/10 transition-all">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red" />
              </div>
              <label className="text-xs font-semibold text-slate-700">Email Marketing</label>
            </div>
            <ToggleButtonGroup
              value={formData.emailMarketing}
              onChange={val => updateFormData({ emailMarketing: val })}
            />
          </div>
        </div>
        
        <div className="p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-md border border-slate-200/60 hover:border-brand-red/20 transition-all duration-300 group shadow-sm hover:shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-slate-50 flex items-center justify-center group-hover:bg-brand-red/10 transition-all">
                <SettingsIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-red" />
              </div>
              <label className="text-xs font-semibold text-slate-700">Mobile Strategy</label>
            </div>
            <ToggleButtonGroup
              value={formData.mobileStrategy}
              onChange={val => updateFormData({ mobileStrategy: val })}
            />
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 p-6 bg-brand-dark rounded-2xl relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px]"></div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-medium leading-relaxed text-white/90">Votre stratégie marketing mix est maintenant définie. Prêt pour la validation finale.</p>
      </div>
    </div>
  </div>
);

export const Step9 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-6">
    <RadioGroup 
      label="Maintenance souhaitée" 
      options={['Maintenance corrective incluse (3 mois)', 'Contrat de maintenance mensuel DM+ Tech', 'Gestion autonome par le client', 'À définir après livraison']} 
      selected={formData.maintenanceSouhaitee} 
      onChange={val => updateFormData({ maintenanceSouhaitee: val })} 
      redTitle={true}
    />
    <RadioGroup 
      label="Mises à jour du contenu" 
      options={['Client autonome (formation back-office incluse)', 'Délégation à DM+ Com (abonnement mensuel)', 'Au cas par cas (facturation séparée)']} 
      selected={formData.misesAJour} 
      onChange={val => updateFormData({ misesAJour: val })} 
      redTitle={true}
    />
    <CheckboxGroup 
      label="Évolutions futures envisagées" 
      options={['Ajout de nouvelles pages', 'Intégration e-commerce', 'Application mobile', 'Espace membre / plateforme', 'Aucune évolution prévue']} 
      selected={[formData.evolutionsFutures]} 
      onChange={val => updateFormData({ evolutionsFutures: val[val.length - 1] || '' })} 
      redTitle={true}
    />
    <InputWrapper label="Autres informations utiles" value={formData.autresInfosUtiles}>
      <div className="!text-brand-red !font-bold form-label"></div>
      <textarea className="field-input min-h-[100px] py-4 resize-none" value={formData.autresInfosUtiles} onChange={e => updateFormData({ autresInfosUtiles: e.target.value })} />
    </InputWrapper>
  </div>
);

export const Step10 = ({ formData, updateFormData }: StepProps) => (
  <div className="space-y-8">
    {[0, 1, 2].map(i => (
      <div key={i} className="p-6 bg-white/40 border border-slate-200 rounded-2xl space-y-4">
        <label className="form-label">Concurrent {i + 1}</label>
        <InputWrapper label="Nom + URL du site" value={formData.concurrents[i].nom}>
          <div className="!text-brand-red !font-bold form-label"></div>
          <input className="field-input" value={formData.concurrents[i].nom} onChange={e => {
            const newC = [...formData.concurrents];
            newC[i].nom = e.target.value;
            updateFormData({ concurrents: newC });
          }} />
        </InputWrapper>
        <InputWrapper label="Ce qu'ils font bien" value={formData.concurrents[i].bien}>
          <div className="!text-brand-red !font-bold form-label"></div>
          <input className="field-input" value={formData.concurrents[i].bien} onChange={e => {
            const newC = [...formData.concurrents];
            newC[i].bien = e.target.value;
            updateFormData({ concurrents: newC });
          }} />
        </InputWrapper>
        <InputWrapper label="Ce que vous faites mieux" value={formData.concurrents[i].mieux}>
          <div className="!text-brand-red !font-bold form-label"></div>
          <input className="field-input" value={formData.concurrents[i].mieux} onChange={e => {
            const newC = [...formData.concurrents];
            newC[i].mieux = e.target.value;
            updateFormData({ concurrents: newC });
          }} />
        </InputWrapper>
      </div>
    ))}
    
    <div className="p-8 bg-brand-dark rounded-[32px] relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px]" />
      <div className="relative z-10 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-white mb-1">Dossier Complet</p>
          <p className="text-sm text-white/60">Votre brief stratégique est maintenant prêt à être transformé en réalité digitale.</p>
        </div>
      </div>
    </div>
  </div>
);

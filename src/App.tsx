/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  Globe,
  Zap,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { FormData, initialFormData, FormErrors, FormTouched } from "./types";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Step8,
  Step9,
  Step10,
} from "./components/FormSteps";
import BorderGlow from "./components/BorderGlow";
import Login from "./components/Login";
import ProjectInitialized from "./components/ProjectInitialized";
import confetti from "canvas-confetti";
import { generateBriefPDF } from "./utils/pdfGenerator";

const totalSteps = 10;

const stepImages = [
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200", // 01 Client
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1200", // 02 Objectifs (remplacé)
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200", // 03 Budget
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200", // 04 Technique
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200", // 05 Contenu
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200", // 06 Structure
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200", // 07 Fonctionnalités
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200", // 08 SEO
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", // 09 Maintenance
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200", // 10 Analyse
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isProjectInitialized, setIsProjectInitialized] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = (success: boolean, name?: string, email?: string) => {
    setIsAuthenticated(success);
    if (success && name) {
      setUserName(name);
    }
    if (success && email) {
      setUserEmail(email);
      // Mettre à jour formData avec l'email du client
      setFormData((prev) => ({
        ...prev,
        email: email,
      }));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setUserEmail("");
    setStep(1);
    setFormData(initialFormData);
    setTouched({});
    setErrors({});
    setIsProjectInitialized(false);
    setIsHovered(false);
  };

  const handleModify = () => {
    setIsProjectInitialized(false);
    // Go back to form, keeping the current data
  };

  const handleNewProject = () => {
    setIsProjectInitialized(false);
    setStep(1);
    setFormData(initialFormData);
    setTouched({});
    setErrors({});
  };

  const validate = (data: FormData): FormErrors => {
    // Validations désactivées pour les tests, mais structure conservée
    const newErrors: FormErrors = {};
    /*
    if (!data.nomEntreprise) newErrors.nomEntreprise = 'Requis';
    if (!data.secteurActivite) newErrors.secteurActivite = 'Requis';
    if (!data.emailContact) newErrors.emailContact = 'Requis';
    if (!data.telephone) newErrors.telephone = 'Requis';
    */
    return newErrors;
  };

  useEffect(() => {
    setErrors(validate(formData));
  }, [formData]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setFieldTouched = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.nomEntreprise &&
          formData.secteurActivite &&
          formData.siegeSocial &&
          formData.siteActuel &&
          formData.urlSouhaitee &&
          formData.fonctionTitre &&
          formData.emailContact &&
          formData.telephone &&
          formData.tailleEntreprise &&
          formData.phaseEntreprise &&
          formData.descriptionActivite &&
          formData.differenceConcurrents
        );

      case 2:
        return (
          formData.objectifPrincipal.length > 0 &&
          formData.ciblePrincipale &&
          formData.zonesGeographiques &&
          formData.messageCle &&
          formData.tonStyle.length > 0 &&
          formData.objectifs12Mois
        );

      case 3:
        return (
          formData.budgetGlobal &&
          formData.modalitesPaiement &&
          formData.delaiLivraison &&
          formData.dateMiseEnLigne &&
          formData.contraintesParticulieres
        );

      case 4:
        return (
          formData.nomDomaineSouhaite &&
          formData.statutDomaine &&
          formData.cmsPrefere &&
          formData.hebergement &&
          formData.languesSite &&
          formData.hebergeurActuel
        );

      case 5:
        return (
          formData.couleursSouhaitees &&
          formData.typographieSouhaitee &&
          formData.sitesReference &&
          formData.ceQueVousNeVoulezPas
        );

      case 6:
        return formData.pagesSouhaitees.length > 0;

      case 7:
        return (
          formData.fonctionnalitesIntegrer.length > 0 &&
          formData.arborescenceSouhaitee &&
          formData.pagePrioritaire
        );

      case 8:
        return (
          formData.marketingMix.objectifsMarketing.length > 0 &&
          formData.marketingMix.budgetMarketing &&
          formData.marketingMix.canauxPrioritaires.length > 0 &&
          formData.marketingMix.contenuMarketing &&
          formData.marketingMix.frequencePublication &&
          formData.marketingMix.kpisPrincipaux
        );

      case 9:
        return (
          formData.maintenanceSouhaitee &&
          formData.misesAJour &&
          formData.evolutionsFutures &&
          formData.autresInfosUtiles
        );

      case 10:
        return formData.concurrents.every((c) => c.nom && c.bien && c.mieux);

      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      if (step < totalSteps) setStep(step + 1);
    } else {
      // Passer directement à l'étape suivante sans validation
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProjectInitialized(true);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E31E24", "#1A1C21", "#F8F9FB"],
    });
  };

  const renderStep = () => {
    const props = {
      formData,
      updateFormData,
      errors,
      touched,
      setFieldTouched,
    };
    switch (step) {
      case 1:
        return <Step1 {...props} />;
      case 2:
        return <Step2 {...props} />;
      case 3:
        return <Step3 {...props} />;
      case 4:
        return <Step4 {...props} />;
      case 5:
        return <Step5 {...props} />;
      case 6:
        return <Step6 {...props} />;
      case 7:
        return <Step7 {...props} />;
      case 8:
        return <Step8 {...props} />;
      case 9:
        return <Step9 {...props} />;
      case 10:
        return <Step10 {...props} />;
      default:
        return null;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (isProjectInitialized) {
    return (
      <ProjectInitialized
        formData={formData}
        onModify={handleModify}
        onNewProject={handleNewProject}
        userName={userName}
        userEmail={userEmail}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
          alt="Professional Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-brand-red/5" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-8 py-5 md:px-16 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="flex items-center">
          <img
            src="./IMG_3335.png"
            alt="Digital Mind+ Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {userName && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {userName}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <span>Secure Briefing</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-brand-red" />
            <span>High Priority</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Déconnexion
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Branding & Info */}
          <div className="lg:col-span-4 space-y-12 relative">
            <div className="space-y-8 sticky top-12">
              <div className="relative">
                <motion.span
                  key={`num-${step}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute -left-12 -top-8 text-[140px] font-serif italic text-slate-100 leading-none select-none pointer-events-none"
                >
                  0{step}
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                    <Globe className="w-3 h-3" />
                    Phase Stratégique
                  </div>
                  <h2
                    className={`font-display font-extrabold text-brand-dark leading-[1.05] tracking-tight ${step === 7 || step === 9 || step === 10 ? "text-4xl md:text-5xl" : "text-5xl md:text-6xl"}`}
                  >
                    {step === 1 && (
                      <>
                        <span className="text-brand-red">Client &</span>
                        <br />
                        Entreprise
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <span className="text-brand-red">Objectifs</span>
                        <br />
                        du Projet
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <span className="text-brand-red">Budget &</span>
                        <br />
                        Délais
                      </>
                    )}
                    {step === 4 && (
                      <>
                        <span className="text-brand-red">Aspects</span>
                        <br />
                        Techniques
                      </>
                    )}
                    {step === 5 && (
                      <>
                        <span className="text-brand-red">Contenu</span>
                        <br />
                        du Site
                      </>
                    )}
                    {step === 6 && (
                      <>
                        <span className="text-brand-red">Structure</span>
                        <br />
                        Souhaitée
                      </>
                    )}
                    {step === 7 && (
                      <>
                        <span className="text-brand-red">Fonctionnalités</span>
                        <br />
                        Attendues
                      </>
                    )}
                    {step === 8 && (
                      <>
                        <span className="text-brand-red">Marketing</span>
                        <br />
                        Mix
                      </>
                    )}
                    {step === 9 && (
                      <>
                        <span className="text-brand-red">Maintenance &</span>
                        <br />
                        Évolution
                      </>
                    )}
                    {step === 10 && (
                      <>
                        <span className="text-brand-red">Analyse</span>
                        <br />
                        Concurrentielle
                      </>
                    )}
                  </h2>
                </motion.div>
              </div>

              <motion.p
                key={`desc-${step}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-500 text-lg font-light leading-relaxed max-w-sm"
              >
                {step === 1 &&
                  "Présentez votre entité pour une collaboration sur mesure."}
                {step === 2 &&
                  "Définissez les buts précis de votre future plateforme."}
                {step === 3 &&
                  "Planifiez vos ressources et vos échéances stratégiques."}
                {step === 4 &&
                  "Configurez les fondations technologiques de votre projet."}
                {step === 5 &&
                  "Organisez les éléments qui donneront vie à votre site."}
                {step === 6 && "Dessinez l'architecture de navigation idéale."}
                {step === 7 &&
                  "Sélectionnez les outils interactifs pour vos utilisateurs."}
                {step === 8 &&
                  "Planifiez votre déploiement pour un impact maximal dès le premier jour."}
                {step === 9 &&
                  "Assurez la pérennité et l'évolution de votre outil."}
                {step === 10 &&
                  "Étudiez le marché pour mieux vous différencier."}
              </motion.p>
            </div>

            <div className="space-y-6 pt-12 border-t border-slate-100">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Progression Stratégique
                  </p>
                  <p className="text-xl font-display font-bold text-brand-dark">
                    {Math.round((step / totalSteps) * 100)}%
                  </p>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-red shadow-[0_0_10px_rgba(227,30,36,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / totalSteps) * 100}%` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-brand-red/20 transition-all">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Ligne Directe
                  </p>
                  <p className="text-slate-600 text-xs font-bold group-hover:text-brand-dark transition-colors">
                    76 663 82 20
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-brand-red/20 transition-all">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Support
                  </p>
                  <p className="text-slate-600 text-[10px] font-bold group-hover:text-brand-dark transition-colors">
                    communication@dmplus-group.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            className="lg:col-span-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.002 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <BorderGlow
              glowColor="227 30 36"
              glowIntensity={0.08}
              glowRadius={300}
              borderRadius={48}
              backgroundColor="transparent"
              className="w-full transition-all duration-700 hover:translate-y-[-4px]"
            >
              <div className="glass-panel p-12 md:p-20 relative overflow-hidden">
                {/* Dynamic Step Background */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={step}
                      initial={{
                        opacity: 0,
                        scale: 1.1,
                        filter: "grayscale(100%) blur(10px)",
                      }}
                      animate={{
                        opacity: isHovered ? 0.08 : 0.04,
                        scale: isHovered ? 1.05 : 1,
                        filter: "grayscale(0%) blur(0px)",
                      }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      src={stepImages[step - 1]}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-white/50" />
                </div>

                <form onSubmit={handleSubmit} className="relative z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="mt-12 pt-10 border-t border-border-light flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={step === 1}
                      className="btn-secondary disabled:opacity-0"
                    >
                      Précédent
                    </button>

                    {step < totalSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Continuer
                      </button>
                    ) : (
                      <button type="submit" className="btn-primary">
                        Finaliser le Brief
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-50 px-8 py-5 md:px-16 text-center lg:text-left border-t border-slate-100 bg-white/90 backdrop-blur-xl">
        <p className="text-gray-400 text-[9px] uppercase tracking-[0.4em] font-bold">
          Digital Mind+ Group &copy; {new Date().getFullYear()} &mdash;
          Enterprise Grade Digital Strategy
        </p>
      </footer>
    </div>
  );
}

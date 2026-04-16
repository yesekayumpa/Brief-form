import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SquarePen, FileText, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { FormData as BriefFormData } from '../types';
import BorderGlow from './BorderGlow';
import { generateBriefPDF } from '../utils/pdfGenerator';
import { sendBriefEmailWithNodemailer } from '../utils/nodemailerService';

interface ProjectInitializedProps {
  formData: BriefFormData;
  onModify: () => void;
  onNewProject: () => void;
  userName: string;
  userEmail: string;
}

export default function ProjectInitialized({ formData, onModify, onNewProject, userName, userEmail }: ProjectInitializedProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  // Envoyer automatiquement les emails au chargement du composant
  useEffect(() => {
    const sendEmailsAutomatically = async () => {
      setIsSendingEmail(true);
      setEmailStatus('idle');
      setEmailMessage('');

      try {
        // 1. Email pour l'entreprise avec toutes les informations
        const companySubject = `Nouveau Brief Stratégique - ${formData.nomProjet || 'Projet sans nom'} - ${userName}`;
        
        const companyEmailBody = `Bonjour Digital Mind+,

NOUVEAU BRIEF STRATÉGIQUE REÇU

=== INFORMATIONS CLIENT ===
Nom: ${userName}
Email: ${formData.email || 'non spécifié'}
Téléphone: ${formData.telephone || 'non spécifié'}

=== INFORMATIONS PROJET ===
Nom du projet: ${formData.nomProjet || 'Non spécifié'}
Objectif principal: ${formData.objectifPrincipal || 'Non spécifié'}
Public cible: ${formData.publicCible || 'Non spécifié'}
Délai de livraison: ${formData.delaiLivraison || 'Non spécifié'}
Date de mise en ligne: ${formData.dateMiseEnLigne || 'Non spécifié'}
Contraintes particulières: ${formData.contraintesParticulieres || 'Aucune'}

=== BUDGET ===
Budget alloué: ${formData.budgetAlloue || 'Non spécifié'}
Modalités de paiement: ${formData.modalitesPaiement || 'Non spécifié'}

=== DESIGN ET CONTENU ===
Couleurs institutionnelles: ${formData.couleursInstitutionnelles || 'Non spécifié'}
Typographie: ${formData.typographieSelectionnee || 'Non spécifié'}
Langues du site: ${formData.languesSite || 'Non spécifié'}

=== FONCTIONNALITÉS ===
Pages souhaitées: ${Array.isArray(formData.pagesSouhaitees) ? formData.pagesSouhaitees.join(', ') : formData.pagesSouhaitees || 'Non spécifié'}
Fonctionnalités principales: ${Array.isArray(formData.fonctionnalitesSite) ? formData.fonctionnalitesSite.join(', ') : formData.fonctionnalitesSite || 'Non spécifié'}

=== SEO ET MARKETING ===
Objectifs SEO: ${formData.objectifsSEO || 'Non spécifié'}
Mots-clés principaux: ${formData.motsClesPrincipaux || 'Non spécifié'}
Analyse concurrentielle: ${formData.analyseConcurrentielle || 'Non spécifié'}

=== MAINTENANCE ===
Type de maintenance: ${formData.typeMaintenance || 'Non spécifié'}
Fonctionnalités à intégrer: ${Array.isArray(formData.fonctionnalitesIntegrer) ? formData.fonctionnalitesIntegrer.join(', ') : formData.fonctionnalitesIntegrer || 'Non spécifié'}

Le PDF détaillé est généré et disponible pour téléchargement.

Veuillez contacter le client pour finaliser son projet.

Cordialement,
Système automatique Digital Mind+
Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Contact: 76 663 82 20 | communication@dmplus-group.com`;

        // Envoyer emails complets via Nodemailer API (client + entreprise avec PDF)
        const result = await sendBriefEmailWithNodemailer({
          formData,
          userName,
          userEmail: userEmail || 'non spécifié'
        });

        if (result.success) {
          setEmailStatus('success');
          setEmailMessage('Emails envoyés automatiquement ! Confirmation au client et brief avec PDF à l\'entreprise.');
        } else {
          setEmailStatus('error');
          setEmailMessage('Erreur lors de l\'envoi: ' + result.message);
        }
      } catch (error) {
        setEmailStatus('error');
        setEmailMessage('Erreur lors de l\'envoi automatique des emails');
      } finally {
        setIsSendingEmail(false);
      }
    };

    // Délai de 2 secondes pour s'assurer que la page est complètement chargée
    const timer = setTimeout(sendEmailsAutomatically, 2000);
    return () => clearTimeout(timer);
  }, [formData, userName]);

  
const handleSend = async () => {
    // Fonction manuelle de secours - même logique que l'automatique
    const sendEmailsManually = async () => {
      setIsSendingEmail(true);
      setEmailStatus('idle');
      setEmailMessage('');

      try {
        // 1. Email pour l'entreprise avec toutes les informations
        const companySubject = `Nouveau Brief Stratégique - ${formData.nomProjet || 'Projet sans nom'} - ${userName}`;
        
        const companyEmailBody = `Bonjour Digital Mind+,

NOUVEAU BRIEF STRATÉGIQUE REÇU

=== INFORMATIONS CLIENT ===
Nom: ${userName}
Email: ${formData.email || 'non spécifié'}
Téléphone: ${formData.telephone || 'non spécifié'}

=== INFORMATIONS PROJET ===
Nom du projet: ${formData.nomProjet || 'Non spécifié'}
Objectif principal: ${formData.objectifPrincipal || 'Non spécifié'}
Public cible: ${formData.publicCible || 'Non spécifié'}
Délai de livraison: ${formData.delaiLivraison || 'Non spécifié'}
Date de mise en ligne: ${formData.dateMiseEnLigne || 'Non spécifié'}
Contraintes particulières: ${formData.contraintesParticulieres || 'Aucune'}

=== BUDGET ===
Budget alloué: ${formData.budgetAlloue || 'Non spécifié'}
Modalités de paiement: ${formData.modalitesPaiement || 'Non spécifié'}

=== DESIGN ET CONTENU ===
Couleurs institutionnelles: ${formData.couleursInstitutionnelles || 'Non spécifié'}
Typographie: ${formData.typographieSelectionnee || 'Non spécifié'}
Langues du site: ${formData.languesSite || 'Non spécifié'}

=== FONCTIONNALITÉS ===
Pages souhaitées: ${Array.isArray(formData.pagesSouhaitees) ? formData.pagesSouhaitees.join(', ') : formData.pagesSouhaitees || 'Non spécifié'}
Fonctionnalités principales: ${Array.isArray(formData.fonctionnalitesSite) ? formData.fonctionnalitesSite.join(', ') : formData.fonctionnalitesSite || 'Non spécifié'}

=== SEO ET MARKETING ===
Objectifs SEO: ${formData.objectifsSEO || 'Non spécifié'}
Mots-clés principaux: ${formData.motsClesPrincipaux || 'Non spécifié'}
Analyse concurrentielle: ${formData.analyseConcurrentielle || 'Non spécifié'}

=== MAINTENANCE ===
Type de maintenance: ${formData.typeMaintenance || 'Non spécifié'}
Fonctionnalités à intégrer: ${Array.isArray(formData.fonctionnalitesIntegrer) ? formData.fonctionnalitesIntegrer.join(', ') : formData.fonctionnalitesIntegrer || 'Non spécifié'}

Le PDF détaillé est généré et disponible pour téléchargement.

Veuillez contacter le client pour finaliser son projet.

Cordialement,
Système automatique Digital Mind+
Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Contact: 76 663 82 20 | communication@dmplus-group.com`;

        // Envoyer emails complets via Nodemailer API (client + entreprise avec PDF)
        const result = await sendBriefEmailWithNodemailer({
          formData,
          userName,
          userEmail: userEmail || 'non spécifié'
        });

        if (result.success) {
          setEmailStatus('success');
          setEmailMessage('Emails envoyés automatiquement ! Confirmation au client et brief avec PDF à l\'entreprise.');
        } else {
          setEmailStatus('error');
          setEmailMessage('Erreur lors de l\'envoi: ' + result.message);
        }
      } catch (error) {
        setEmailStatus('error');
        setEmailMessage('Erreur lors de l\'envoi de l\'email');
      } finally {
        setIsSendingEmail(false);
      }
    };

    await sendEmailsManually();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920" 
          alt="Professional Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-white/95 backdrop-blur-[1px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.99, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl w-full relative z-10"
      >
        <BorderGlow
          glowColor="100 116 139"
          glowIntensity={0.1}
          glowRadius={80}
          borderRadius={40}
          backgroundColor="transparent"
        >
          <div className="glass-panel p-12 md:p-16 text-center relative overflow-hidden backdrop-blur-2xl">
            {/* Success Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
              <img 
                src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200" 
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
            </div>

            {/* Bouton Envoyer */}
            <div className="relative z-10 mb-6">
              <button 
                onClick={handleSend}
                disabled={isSendingEmail}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                {isSendingEmail ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Envoyer
                  </>
                )}
              </button>
            </div>

            <div className="relative z-10">
              <div className="mb-8 flex justify-center">
                <img 
                  src="/IMG_3335.png" 
                  alt="Digital Mind+ Logo" 
                  className="h-20 w-auto object-contain"
                />
              </div>
              <h2 className="font-display text-4xl font-bold text-brand-dark mb-4">Projet Initialisé.</h2>
              <p className="text-slate-500 text-lg font-normal mb-8 leading-relaxed max-w-md mx-auto">
                Votre brief stratégique a été transmis à nos équipes. Nous transformons maintenant votre vision en une réalité technologique de premier plan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={onModify}
                  className="btn-secondary flex items-center gap-2"
                >
                  <SquarePen className="w-5 h-5" />
                  Modifier
                </button>
                <button 
                  onClick={onNewProject}
                  className="btn-secondary flex items-center gap-2"
                >
                  Nouveau projet
                </button>
              </div>

              {/* Email Status Messages */}
              {emailStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                    emailStatus === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}
                >
                  {emailStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{emailMessage}</span>
                </motion.div>
              )}
            </div>
          </div>
        </BorderGlow>
      </motion.div>
    </div>
  );
}

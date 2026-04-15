import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SquarePen, FileText, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { FormData } from '../types';
import BorderGlow from './BorderGlow';
import { generateBriefPDF } from '../utils/pdfGenerator';

interface ProjectInitializedProps {
  formData: FormData;
  onModify: () => void;
  onNewProject: () => void;
  userName: string;
}

export default function ProjectInitialized({ formData, onModify, onNewProject, userName }: ProjectInitializedProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');
  const handleSend = async () => {
    // Generate and download PDF
    try {
      generateBriefPDF(formData);
    } catch (err) {
      console.error("Erreur lors de la génération du PDF:", err);
    }

    // Direct email using client email application
    setIsSendingEmail(true);
    setEmailStatus('idle');
    setEmailMessage('');

    try {
      // Créer le contenu de l'email détaillé
      const emailSubject = `Nouveau Brief Stratégique - ${formData.nomProjet || 'Projet sans nom'}`;
      
      let emailBody = `Bonjour Digital Mind+,

Voici les informations complètes du nouveau brief stratégique :

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

Veuillez trouver le PDF détaillé en pièce jointe.

Cordialement,
${userName}

---
Cet email a été généré automatiquement depuis la plateforme Digital Mind+
Date: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Contact: 76 663 82 20 | communication@dmplus-group.com`;

      // Ouvrir le client email par défaut avec les adresses de l'entreprise
      window.location.href = `mailto:communication@dmplus-group.com,dmplusgroup@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      setEmailStatus('success');
      setEmailMessage('Client email ouvert avec toutes les informations. Veuillez ajouter le PDF en pièce jointe et envoyer.');
    } catch (error) {
      setEmailStatus('error');
      setEmailMessage('Erreur lors de l\'ouverture du client email');
    } finally {
      setIsSendingEmail(false);
    }
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
                  onClick={handleSend}
                  disabled={isSendingEmail}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSendingEmail ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Envoyer
                    </>
                  )}
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

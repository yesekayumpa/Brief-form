import nodemailer from 'nodemailer';
import multer from 'multer';

// Configuration de multer en mémoire
const upload = multer({ storage: multer.memoryStorage() });

// Fonction utilitaire pour exécuter le middleware multer dans Vercel
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  console.log('--- REQUÊTE REÇUE SUR VERCEL SERVERLESS ---');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    // Exécuter multer pour récupérer le fichier PDF
    await runMiddleware(req, res, upload.single('convention_pdf'));

    const { _replyto, ...formData } = req.body;
    const pdfFile = req.file;

    // Validation de l'email du client
    if (!_replyto || !_replyto.includes('@')) {
      console.error('Erreur: Email client invalide:', _replyto);
      return res.status(400).json({ 
        success: false, 
        message: 'Email du client invalide',
        error: 'Veuillez fournir une adresse email valide'
      });
    }

    console.log('📧 Email client validé:', _replyto);

    if (!pdfFile) {
      console.error('Erreur: Fichier PDF manquant');
      return res.status(400).json({ success: false, message: 'Fichier PDF manquant' });
    }

    const emailUser = (process.env.EMAIL_USER || '').trim();
    const transporter = nodemailer.createTransport({
      host: 'mail.dmplus-group.com', // Serveur SMTP LWS
      port: 465, // Port SSL pour LWS
      secure: true, // SSL requis pour LWS
      auth: {
        user: process.env.EMAIL_USER || 'investment@dmplus-group.com', // Authentification LWS
        pass: process.env.EMAIL_PASS // Mot de passe du compte LWS
      }
    });

    // 1. EMAIL POUR L'ENTREPRISE (IMMÉDIAT - INFOS CLIENT + PDF)
    const companyEmail = 'investment@dmplus-group.com';
    let summaryHtml = `<h3 style="color: #6366f1; margin-top: 20px;">Informations du client :</h3>`;
    
    const categories = {
      'Informations personnelles': ['nom', 'prenoms', 'dateNaissance', 'lieuNaissance', 'nationalite', 'typePiece', 'numeroPiece'],
      'Coordonnées': ['email', 'telephonePrincipal', 'telephoneSecondaire', 'whatsapp', 'adresse', 'ville', 'paysResidence', 'codePostal'],
      'Situation financière': ['profession', 'revenuMensuel', 'patrimoineEstime', 'origineFonds', 'objectifInvestissement'],
      'Services souhaités': ['servicesSouhaites', 'frequenceSuivi', 'modeConsultation', 'membreBRVM', 'iban', 'depotInitial', 'instructionsSpeciales']
    };

    Object.entries(categories).forEach(([category, fields]) => {
      summaryHtml += `<h4 style="color: #6366f1; margin-top: 20px;">${category}</h4><ul style="list-style: none; padding-left: 10px;">`;
      fields.forEach(field => {
        if (formData[field]) {
          summaryHtml += `<li><strong>${field}:</strong> ${formData[field]}</li>`;
        }
      });
      summaryHtml += '</ul>';
    });

    const mailCompanyOptions = {
      from: 'investment@dmplus-group.com', // Doit être l'adresse authentifiée sur LWS
      to: companyEmail, // L'entreprise reçoit immédiatement
      replyTo: _replyto, // L'entreprise peut répondre directement au client
      subject: `NOUVELLE INSCRIPTION REÇUE : ${formData.nom || ''} ${formData.prenoms || ''} (${_replyto || 'email@fourni.com'})`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #d97706;">⚡ NOUVEAU CLIENT INSCRIT</h2>
          <p><strong>Un client vient de terminer et soumettre son formulaire d'inscription.</strong></p>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0;">
            <p style="margin: 0; font-weight: bold;">📋 Informations complètes du client :</p>
          </div>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
            ${summaryHtml}
          </div>
          <p><strong>Informations de contact direct du client :</strong></p>
          <ul style="list-style: none; padding-left: 10px;">
            <li><strong>📧 Email du client :</strong> ${_replyto || 'Non fourni'}</li>
            <li><strong>📱 Téléphone principal :</strong> ${formData.telephonePrincipal || 'Non fourni'}</li>
            <li><strong>💬 WhatsApp :</strong> ${formData.whatsapp || 'Non fourni'}</li>
          </ul>
          <p><strong>📄 Document PDF contractuel joint à cet email.</strong></p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #666;">
            <strong>📌 Action requise :</strong> Contacter le client à l'adresse ${_replyto || 'email non fourni'} pour finaliser son inscription.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Convention_${formData.nom || 'Client'}_DM_Invest.pdf`,
          content: pdfFile.buffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // 2. EMAIL POUR LE CLIENT (UNIQUEMENT MESSAGE - PAS DE PDF)
    const mailClientOptions = {
      from: 'investment@dmplus-group.com', // Doit être l'adresse authentifiée sur LWS
      to: _replyto, // Envoyer au client (n'importe quel client)
      subject: '✅ Votre inscription DM+ Invest a été reçue avec succès',
      replyTo: 'mail.dmplusgroup@gmail.com', // Le client répond sur l'adresse Gmail
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'DM+ Invest System',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'Normal'
      },
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #10b981;">🎉 Félicitations !</h2>
          <p><strong>Votre inscription DM+ Invest a été soumise avec succès.</strong></p>
          <p>Nous vous remercions de votre confiance. Votre dossier est maintenant entre les mains de notre équipe qui va le traiter dans les plus brefs délais.</p>
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
            <h3 style="color: #10b981; margin-top: 0;">📋 Prochaines étapes :</h3>
            <ol style="margin: 10px 0; padding-left: 20px;">
              <li>Notre équipe examine votre dossier</li>
              <li>Nous vous contacterons par téléphone ou email</li>
              <li>Finalisation de votre compte d'investissement</li>
            </ol>
          </div>
          <p><strong>📄 Votre convention de compte titres vous sera envoyée par email séparément après validation.</strong></p>
          <p>Pour toute question, notre service client est à votre disposition :</p>
          <ul style="list-style: none; padding-left: 0;">
            <li>📧 <strong>Email :</strong> investment@dmplus-group.com</li>
            <li>📱 <strong>Téléphone :</strong> +221 78 145 00 32</li>
          </ul>
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <strong>Cordialement,<br>L'équipe DM+ Invest</strong>
          </p>
        </div>
      `,
      text: `
Félicitations ! Votre inscription DM+ Invest a été soumise avec succès.

Nous vous remercions de votre confiance. Votre dossier est maintenant entre les mains de notre équipe qui va le traiter dans les plus brefs délais.

Prochaines étapes :
1. Notre équipe examine votre dossier
2. Nous vous contacterons par téléphone ou email
3. Finalisation de votre compte d'investissement

Votre convention de compte titres vous sera envoyée par email séparément après validation.

Pour toute question, notre service client est à votre disposition :
Email : investment@dmplus-group.com
Téléphone : +221 78 145 00 32

Cordialement,
L'équipe DM+ Invest
      `
      // PAS DE PIÈCE JOINTE POUR LE CLIENT
    };

    console.log('Envoi des mails...');
    console.log('📧 Email client (_replyto):', _replyto);
    console.log('📧 Email entreprise:', companyEmail);
    
    try {
      // Envoyer l'email au client d'abord
      console.log('📤 Envoi email au client...');
      await transporter.sendMail(mailClientOptions);
      console.log('✅ Email au client envoyé avec succès');
      
      // Envoyer l'email à l'entreprise
      console.log('📤 Envoi email à l\'entreprise...');
      await transporter.sendMail(mailCompanyOptions);
      console.log('✅ Email à l\'entreprise envoyé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi des emails:', error);
      
      // Vérifier si c'est une erreur de destinataire invalide
      if (error.message.includes('all recipients were rejected')) {
        console.error('🚨 Erreur de destinataire - vérifiez les adresses email');
        return res.status(400).json({ 
          success: false, 
          message: 'Adresse email invalide',
          error: 'L\'adresse email du client semble incorrecte'
        });
      }
      
      throw error; // Relancer l'erreur pour le bloc catch principal
    }

    console.log('Succès !');
    return res.status(200).json({ success: true, message: 'Emails envoyés avec succès' });

  } catch (error) {
    console.error('ERREUR SERVEUR VERCEL:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'envoi',
      error: error.message 
    });
  }
}

import nodemailer from 'nodemailer';

// Configuration depuis .env local
const emailUser = process.env.EMAIL_USER || 'investment@dmplus-group.com';
const emailPass = process.env.EMAIL_PASS || 'DMP-group7-inv';

async function testEmail() {
  console.log('📧 Test avec l\'email:', emailUser);
  console.log('🔐 Mot de passe:', emailPass ? 'Configuré' : 'Manquant');
  
  const transporter = nodemailer.createTransport({
    host: 'mail.dmplus-group.com',
    port: 465, // Port SSL pour LWS
    secure: true, // SSL requis
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Connexion LWS réussie !');
    
    const testMail = {
      from: 'investment@dmplus-group.com', // Doit être l'adresse authentifiée LWS
      to: 'votre_email_test@gmail.com', // Remplacez par votre email de test
      subject: 'Test LWS - DM+ Group',
      text: 'Ceci est un test de configuration LWS'
    };
    
    await transporter.sendMail(testMail);
    console.log('✅ Email de test envoyé avec succès via LWS !');
  } catch (error) {
    console.error('❌ Erreur de configuration LWS:', error.message);
  }
}

testEmail();

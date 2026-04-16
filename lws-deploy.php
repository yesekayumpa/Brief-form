<?php
// Script de déploiement automatique pour LWS
// Ce fichier gère les requêtes API pour l'envoi d'emails

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

try {
    // Récupérer les données POST
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception('Données invalides');
    }
    
    $userName = $data['userName'] ?? '';
    $userEmail = $data['userEmail'] ?? '';
    $nomEntreprise = $data['nomEntreprise'] ?? '';
    
    // Configuration PHP Mailer pour LWS
    require_once 'vendor/autoload.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    // Configuration SMTP LWS
    $mail->isSMTP();
    $mail->Host = 'mail.dmplus-group.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'communication@dmplus-group.com';
    $mail->Password = 'DMP-group2-com';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    
    // Email pour le client
    $mail->setFrom('communication@dmplus-group.com', 'Digital Mind+');
    $mail->addAddress($userEmail, $userName);
    $mail->addReplyTo('communication@dmplus-group.com', 'Digital Mind+');
    
    $mail->isHTML(true);
    $mail->Subject = 'Confirmation de réception de votre brief - Digital Mind+';
    $mail->Body = generateClientEmailHTML($userName, $nomEntreprise);
    $mail->AltBody = generateClientEmailText($userName, $nomEntreprise);
    
    $mail->send();
    
    // Email pour l'entreprise
    $mail->clearAddresses();
    $mail->addAddress('communication@dmplus-group.com', 'Digital Mind+');
    $mail->Subject = "NOUVEAU BRIEF STRATÉGIQUE: $nomEntreprise ($userEmail)";
    $mail->Body = generateCompanyEmailHTML($userName, $userEmail, $nomEntreprise);
    $mail->AltBody = generateCompanyEmailText($userName, $userEmail, $nomEntreprise);
    
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Emails envoyés avec succès via LWS !'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur lors de l\'envoi: ' . $e->getMessage()
    ]);
}

function generateClientEmailHTML($userName, $nomEntreprise) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #E31E24; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Confirmation de réception</h1>
                <p>Digital Mind+ - Plateforme de Briefing</p>
            </div>
            <div class='content'>
                <p>Cher $userName,</p>
                <p>Nous vous confirmons la bonne réception de votre brief stratégique pour le projet \"$nomEntreprise\".</p>
                <p>Votre demande est maintenant entre les mains de notre équipe.</p>
                <p><strong>Pour toute question urgente :</strong></p>
                <ul>
                    <li>Téléphone : 76 663 82 20</li>
                    <li>Email : communication@dmplus-group.com</li>
                </ul>
                <p>Merci de votre confiance dans Digital Mind+.</p>
            </div>
            <div class='footer'>
                <p>© " . date('Y') . " Digital Mind+ Group - Tous droits réservés</p>
            </div>
        </div>
    </body>
    </html>";
}

function generateCompanyEmailHTML($userName, $userEmail, $nomEntreprise) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; }
            .header { background: #E31E24; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .section { margin: 20px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid #E31E24; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>NOUVEAU BRIEF STRATÉGIQUE</h1>
                <p>Digital Mind+ - Plateforme de Briefing</p>
            </div>
            <div class='content'>
                <div class='section'>
                    <h2>INFORMATIONS CLIENT</h2>
                    <p><strong>Nom:</strong> $userName</p>
                    <p><strong>Email:</strong> $userEmail</p>
                    <p><strong>Entreprise:</strong> $nomEntreprise</p>
                    <p><strong>Date:</strong> " . date('d/m/Y H:i') . "</p>
                </div>
            </div>
            <div class='footer'>
                <p>Cet email a été généré automatiquement via LWS</p>
            </div>
        </div>
    </body>
    </html>";
}

function generateClientEmailText($userName, $nomEntreprise) {
    return "Confirmation de réception de votre brief - Digital Mind+\n\nCher $userName,\n\nNous confirmons la réception de votre brief pour \"$nomEntreprise\".\n\nMerci de votre confiance.\n\nDigital Mind+";
}

function generateCompanyEmailText($userName, $userEmail, $nomEntreprise) {
    return "NOUVEAU BRIEF STRATÉGIQUE\n\nClient: $userName\nEmail: $userEmail\nEntreprise: $nomEntreprise\nDate: " . date('d/m/Y H:i');
}
?>

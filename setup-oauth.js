import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Client ID Google OAuth fourni
const clientId = '505376667240-krphl61n3cf987o22dsvakai5bht6qc9.apps.googleusercontent.com';

// Chemin du fichier .env
const envPath = path.join(__dirname, '.env');

// Contenu du fichier .env
const envContent = `# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=${clientId}

# Port du serveur
PORT=3001`;

// Écrire dans le fichier .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Client ID Google OAuth configuré avec succès !');
console.log('📁 Fichier .env mis à jour');
console.log('🔄 Redémarrez le serveur de développement avec: npm run dev');

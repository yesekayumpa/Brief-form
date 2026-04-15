import express from 'express';
import cors from 'cors';
import { sendEmail } from './api/send-email.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Route pour envoyer l'email
app.post('/api/send-email', sendEmail);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email endpoint: http://localhost:${PORT}/api/send-email`);
});

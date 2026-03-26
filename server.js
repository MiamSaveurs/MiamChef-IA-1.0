
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import { createServer as createViteServer } from 'vite';

// Charger les variables d'environnement (.env)
dotenv.config();

console.log('🚀 Initialisation du serveur MiamChef...');

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors()); // Autoriser les requêtes du frontend
  app.use(express.json()); // Parser le JSON

  // Route de test
  app.get('/api/test', (req, res) => {
    res.json({ 
      success: true, 
      message: 'API MiamChef opérationnelle !',
      env: {
        MAILCHIMP_API_KEY: !!process.env.MAILCHIMP_API_KEY,
        MAILCHIMP_LIST_ID: !!process.env.MAILCHIMP_LIST_ID,
        MAILCHIMP_SERVER_PREFIX: !!process.env.MAILCHIMP_SERVER_PREFIX,
      }
    });
  });

// Configuration du transporteur Email (SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    // J'ai mis votre email ici par défaut
    user: process.env.EMAIL_USER || 'miamsaveurs@gmail.com', 
    
    // ⚠️ ATTENTION : Ici, il faut mettre votre "Mot de passe d'application" Google
    // Pas votre mot de passe habituel ! (Voir explications)
    pass: process.env.EMAIL_PASS || 'VOTRE_MOT_DE_PASSE_APPLICATION_ICI' 
  },
});

// Route API : Envoi du code de parrainage
app.post('/api/send-referral', async (req, res) => {
  const { email, code, name } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email et code requis' });
  }

  // Template HTML de l'email (Style MiamChef Dark/Green)
  const htmlTemplate = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #000000; color: #ffffff; border-radius: 16px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background-color: #1a1a1a; padding: 30px; text-align: center; border-bottom: 1px solid #333;">
        <h1 style="color: #509f2a; font-family: cursive; margin: 0; font-size: 32px;">MiamChef</h1>
        <p style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; margin-top: 5px;">Le Club Privé</p>
      </div>

      <!-- Content -->
      <div style="padding: 40px 30px; text-align: center;">
        <h2 style="margin-top: 0; font-size: 24px;">Salut ${name || 'Chef'} ! 👋</h2>
        
        <p style="color: #cccccc; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
          Vous avez demandé votre code Ambassadeur MiamChef. <br/>
          Partagez-le avec vos amis pour débloquer des mois Premium gratuits !
        </p>
        
        <div style="background: linear-gradient(135deg, #1a4a2a 0%, #0f2e1b 100%); border: 2px dashed #509f2a; padding: 25px; border-radius: 12px; margin: 0 auto 30px auto; display: inline-block;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #ffffff; font-family: monospace;">${code}</span>
        </div>

        <p style="font-size: 14px; color: #888;">
          🎁 <strong>1 Ami inscrit = 1 Mois offert</strong> pour vous.
        </p>

        <a href="https://miamchef.vercel.app" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 15px 30px; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-top: 20px;">
          Ouvrir MiamChef
        </a>
      </div>

      <!-- Footer -->
      <div style="background-color: #111; padding: 20px; text-align: center; font-size: 10px; color: #555; border-top: 1px solid #222;">
        &copy; ${new Date().getFullYear()} MiamChef. Tous droits réservés.<br/>
        Ceci est un message automatique, merci de ne pas répondre.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: '"MiamChef Officiel" <miamsaveurs@gmail.com>',
      to: email,
      subject: '🎫 Votre Code VIP MiamChef est arrivé !',
      html: htmlTemplate,
    });

    console.log(`[Email Envoyé] Code ${code} envoyé à ${email}`);
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('[Erreur Email]', error);
    res.status(500).json({ success: false, error: 'Erreur serveur lors de l\'envoi' });
  }
});

// Route API : Inscription Newsletter Mailchimp
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;
  console.log(`[Newsletter] Tentative d'inscription pour : ${email}`);

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email requis' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

  console.log('[Mailchimp] API_KEY:', API_KEY ? 'Défini' : 'Manquant');
  console.log('[Mailchimp] LIST_ID:', LIST_ID ? 'Défini' : 'Manquant');
  console.log('[Mailchimp] SERVER_PREFIX:', SERVER_PREFIX ? 'Défini' : 'Manquant');

  const missing = [];
  if (!API_KEY) missing.push('MAILCHIMP_API_KEY');
  if (!LIST_ID) missing.push('MAILCHIMP_LIST_ID');
  if (!SERVER_PREFIX) missing.push('MAILCHIMP_SERVER_PREFIX');

  if (missing.length > 0) {
    console.error('[Mailchimp] Configuration manquante:', missing.join(', '));
    return res.status(500).json({ 
      success: false, 
      error: `Configuration newsletter incomplète. Variables manquantes : ${missing.join(', ')}` 
    });
  }

  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = JSON.stringify({
    email_address: email,
    status: 'pending', // 'pending' envoie l'email de confirmation.
    language: 'fr',    // Force la langue française pour cet abonné
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`anyuser:${API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  };

  const mailchimpReq = https.request(url, options, (mailchimpRes) => {
    let responseBody = '';
    mailchimpRes.on('data', (chunk) => {
      responseBody += chunk;
    });

    mailchimpRes.on('end', () => {
      const result = JSON.parse(responseBody);
      if (mailchimpRes.statusCode >= 200 && mailchimpRes.statusCode < 300) {
        res.status(200).json({ success: true });
      } else {
        if (result.title === 'Member Exists') {
          return res.status(400).json({ success: false, error: 'Cet email est déjà inscrit à la brigade !' });
        }
        console.error('[Mailchimp Error]', result);
        res.status(mailchimpRes.statusCode).json({ success: false, error: result.detail || 'Erreur lors de l\'inscription' });
      }
    });
  });

  mailchimpReq.on('error', (error) => {
    console.error('[Mailchimp Request Error]', error);
    res.status(500).json({ success: false, error: 'Erreur de connexion à Mailchimp' });
  });

  mailchimpReq.write(data);
  mailchimpReq.end();
});

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur Backend MiamChef démarré sur http://localhost:${PORT}`);
  });
}

startServer();

import nodemailer from 'nodemailer';
import https from 'https';

export default async function handler(req, res) {
  // CORS pour Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  const { email, code, name } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, error: 'Email et code requis' });
  }

  // --- 1. Inscription Mailchimp Automatique ---
  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

  if (API_KEY && LIST_ID && SERVER_PREFIX) {
    const mcUrl = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
    const mcData = JSON.stringify({
      email_address: email,
      status: 'subscribed',
      language: 'fr',
      merge_fields: {
        FNAME: name || ''
      }
    });

    const mcOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`anyuser:${API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(mcData),
      },
    };

    // On lance l'inscription en arrière-plan sans bloquer l'envoi de l'email
    const mcReq = https.request(mcUrl, mcOptions, (mcRes) => {
      mcRes.on('data', () => {}); // On consomme le flux
      mcRes.on('end', () => {
        console.log(`[Mailchimp Ambassadeur] Statut: ${mcRes.statusCode} pour ${email}`);
      });
    });
    mcReq.on('error', (e) => console.error('[Mailchimp Ambassadeur Error]', e));
    mcReq.write(mcData);
    mcReq.end();
  }

  // --- 2. Envoi de l'Email de Parrainage ---
  // Configuration du transporteur Email (SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER || 'miamsaveurs@gmail.com', 
      pass: process.env.EMAIL_PASS || 'VOTRE_MOT_DE_PASSE_APPLICATION_ICI' 
    },
  });

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

    console.log(`[Email Envoyé Vercel] Code ${code} envoyé à ${email}`);
    res.status(200).json({ success: true, message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error('[Erreur Email Vercel]', error);
    res.status(500).json({ success: false, error: 'Erreur serveur lors de l\'envoi' });
  }
}

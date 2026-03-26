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

  const { email } = req.body;
  console.log(`[Newsletter Vercel] Tentative d'inscription pour : ${email}`);

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email requis' });
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

  const missing = [];
  if (!API_KEY) missing.push('MAILCHIMP_API_KEY');
  if (!LIST_ID) missing.push('MAILCHIMP_LIST_ID');
  if (!SERVER_PREFIX) missing.push('MAILCHIMP_SERVER_PREFIX');

  if (missing.length > 0) {
    console.error('[Mailchimp Vercel] Configuration manquante:', missing.join(', '));
    return res.status(500).json({ 
      success: false, 
      error: `Configuration newsletter incomplète. Variables manquantes : ${missing.join(', ')}` 
    });
  }

  const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const data = JSON.stringify({
    email_address: email,
    status: 'pending',
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`anyuser:${API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  return new Promise((resolve) => {
    const mailchimpReq = https.request(url, options, (mailchimpRes) => {
      let responseBody = '';
      mailchimpRes.on('data', (chunk) => {
        responseBody += chunk;
      });

      mailchimpRes.on('end', () => {
        try {
          const result = JSON.parse(responseBody);
          if (mailchimpRes.statusCode >= 200 && mailchimpRes.statusCode < 300) {
            res.status(200).json({ success: true });
          } else {
            if (result.title === 'Member Exists') {
              res.status(400).json({ success: false, error: 'Cet email est déjà inscrit à la brigade !' });
            } else {
              console.error('[Mailchimp Error]', result);
              res.status(mailchimpRes.statusCode).json({ success: false, error: result.detail || 'Erreur lors de l\'inscription' });
            }
          }
        } catch (e) {
          res.status(500).json({ success: false, error: 'Erreur de parsing de la réponse Mailchimp' });
        }
        resolve();
      });
    });

    mailchimpReq.on('error', (error) => {
      console.error('[Mailchimp Request Error]', error);
      res.status(500).json({ success: false, error: 'Erreur de connexion à Mailchimp' });
      resolve();
    });

    mailchimpReq.write(data);
    mailchimpReq.end();
  });
}

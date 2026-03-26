export default function handler(req, res) {
  res.status(200).json({ 
    success: true, 
    message: 'API MiamChef opérationnelle (Vercel Serverless) !',
    env: {
      MAILCHIMP_API_KEY: !!process.env.MAILCHIMP_API_KEY,
      MAILCHIMP_LIST_ID: !!process.env.MAILCHIMP_LIST_ID,
      MAILCHIMP_SERVER_PREFIX: !!process.env.MAILCHIMP_SERVER_PREFIX,
    }
  });
}

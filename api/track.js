import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const { utm } = req.query;
    const channel = utm || 'direct';
    
    // Log the click to Supabase
    const { error } = await supabase
      .from('clicks')
      .insert({ 
        channel: channel,
        clicked_at: new Date().toISOString(),
        user_agent: req.headers['user-agent'] || null,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || null
      });
    
    if (error) {
      console.error('Error logging click:', error);
      // Still redirect even if logging fails
    }
    
    // Redirect to ALX eHub
    res.redirect(302, 'https://ehub.alxafrica.com/');
  } catch (error) {
    console.error('Handler error:', error);
    // Fallback redirect even on error
    res.redirect(302, 'https://ehub.alxafrica.com/');
  }
}
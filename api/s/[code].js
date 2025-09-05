import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Short code to UTM parameter mappings
const SHORT_CODE_MAPPINGS = {
  // Main tracking URLs
  'hb': 'home-banner',
  'ap': 'announcement-post',
  'd1': 'dm-1',
  'd2': 'dm-2',
  'd3': 'dm-3',
  'cb': 'channel-banner',
  
  // WhatsApp city URLs
  'wl': 'whatsapp-lagos',
  'wj': 'whatsapp-johannesburg',
  'wk': 'whatsapp-kigali',
  'wn': 'whatsapp-nairobi',
  'wc': 'whatsapp-casablanca',
  'we': 'whatsapp-cairo',
  'wa': 'whatsapp-addis-ababa',
  'wg': 'whatsapp-accra'
};

export default async function handler(req, res) {
  try {
    const { code } = req.query;
    const utmValue = SHORT_CODE_MAPPINGS[code];
    
    if (!utmValue) {
      // Unknown short code, redirect to main site
      res.redirect(302, 'https://ehub.alxafrica.com/');
      return;
    }
    
    // Log the click to Supabase
    try {
      await supabase
        .from('clicks')
        .insert({ 
          channel: utmValue,
          clicked_at: new Date().toISOString(),
          user_agent: req.headers['user-agent'] || null,
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || null
        });
    } catch (logError) {
      console.error('Error logging click:', logError);
      // Continue with redirect even if logging fails
    }
    
    // Redirect to ALX eHub
    res.redirect(302, 'https://ehub.alxafrica.com/');
    
  } catch (error) {
    console.error('Short URL handler error:', error);
    // Fallback redirect
    res.redirect(302, 'https://ehub.alxafrica.com/');
  }
}
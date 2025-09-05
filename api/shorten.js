import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Predefined short codes for your channels
const URL_MAPPINGS = {
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
    // Return all available short URLs
    if (req.method === 'GET') {
      const baseUrl = `https://${req.headers.host}`;
      const shortUrls = {};
      
      Object.entries(URL_MAPPINGS).forEach(([shortCode, utmValue]) => {
        shortUrls[utmValue] = `${baseUrl}/s/${shortCode}`;
      });
      
      res.status(200).json({ shortUrls });
      return;
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Shorten API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
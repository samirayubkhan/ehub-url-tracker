import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    // Get total clicks count efficiently
    const { count: totalClicks, error: countError } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return res.status(500).json({ error: 'Failed to fetch total clicks count' });
    }

    // Get click statistics grouped by channel with higher limit
    const { data: channelStats, error: channelError } = await supabase
      .from('clicks')
      .select('channel')
      .order('clicked_at', { ascending: false })
      .limit(10000); // Set a higher limit to get all records

    if (channelError) {
      return res.status(500).json({ error: 'Failed to fetch channel stats' });
    }

    // Count clicks per channel
    const channelCounts = channelStats.reduce((acc, click) => {
      acc[click.channel] = (acc[click.channel] || 0) + 1;
      return acc;
    }, {});

    // Get recent clicks (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentClicks, error: recentError } = await supabase
      .from('clicks')
      .select('*')
      .gte('clicked_at', yesterday.toISOString())
      .order('clicked_at', { ascending: false });

    if (recentError) {
      console.error('Error fetching recent clicks:', recentError);
    }

    res.status(200).json({
      totalClicks,
      channelCounts,
      recentClicks: recentClicks || [],
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
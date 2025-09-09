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

    // Get click statistics grouped by channel using RPC function for better performance
    const { data: channelCountsData, error: channelError } = await supabase
      .rpc('get_channel_counts');

    let channelCounts = {};

    if (channelError) {
      console.error('Error with RPC call, falling back to direct query:', channelError);
      
      // Fallback: Get all channel data by paginating through all records
      let allChannelData = [];
      let from = 0;
      const pageSize = 1000;
      
      while (true) {
        const { data: pageData, error: pageError } = await supabase
          .from('clicks')
          .select('channel')
          .range(from, from + pageSize - 1);

        if (pageError) {
          return res.status(500).json({ error: 'Failed to fetch channel stats' });
        }

        if (!pageData || pageData.length === 0) {
          break; // No more data
        }

        allChannelData = allChannelData.concat(pageData);
        
        if (pageData.length < pageSize) {
          break; // Last page
        }
        
        from += pageSize;
      }

      // Count clicks per channel from all data
      channelCounts = allChannelData.reduce((acc, click) => {
        acc[click.channel] = (acc[click.channel] || 0) + 1;
        return acc;
      }, {});
    } else {
      // Convert RPC result to object format
      channelCounts = channelCountsData.reduce((acc, row) => {
        acc[row.channel] = parseInt(row.count);
        return acc;
      }, {});
    }

    // Get recent clicks count (last 24 hours) efficiently
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { count: recentClicksCount, error: recentError } = await supabase
      .from('clicks')
      .select('*', { count: 'exact', head: true })
      .gte('clicked_at', yesterday.toISOString());

    if (recentError) {
      console.error('Error fetching recent clicks count:', recentError);
    }

    res.status(200).json({
      totalClicks,
      channelCounts: channelCounts || {},
      recentClicks: recentClicksCount || 0,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
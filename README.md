# eHub URL Tracker

Simple URL tracker for ALX eHub migration that logs clicks and redirects to ehub.alxafrica.com.

## Setup Instructions

### 1. Supabase Setup
1. Go to [Supabase](https://supabase.com) and create a new project
2. In the SQL Editor, run this query to create the clicks table:

```sql
CREATE TABLE clicks (
  id SERIAL PRIMARY KEY,
  channel TEXT,
  clicked_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT,
  ip TEXT
);
```

3. Go to Settings > API to get your project URL and anon key

### 2. Local Development
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### 3. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` to deploy
3. Add your environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Usage

### Tracking URLs
After deployment, use these URL patterns:
- `https://yourapp.vercel.app/api/track?utm=dm`
- `https://yourapp.vercel.app/api/track?utm=whatsapp`
- `https://yourapp.vercel.app/api/track?utm=linkedin`
- `https://yourapp.vercel.app/api/track?utm=circle-post-1`

### Dashboard
Visit your deployed URL root to see the dashboard with click statistics.

### API Endpoints
- `/api/track?utm=channel` - Logs click and redirects to eHub
- `/api/stats` - Returns click statistics (JSON)

## Features
- ✅ Click tracking with channel attribution
- ✅ Automatic redirect to ehub.alxafrica.com
- ✅ Simple dashboard with real-time stats
- ✅ User agent and IP logging
- ✅ Error handling and fallback redirects
- ✅ Mobile-friendly dashboard
- ✅ Auto-refresh every 30 seconds
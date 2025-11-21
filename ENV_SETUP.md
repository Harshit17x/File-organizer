# Environment Variables Setup

## ⚠️ IMPORTANT: Create `.env.local` File

You need to create a `.env.local` file in the root of your project with your Supabase credentials.

### Steps:

1. **Create file**: `/Users/harshitbisht/Desktop/My material work area/file-organizer/.env.local`

2. **Add this content**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hjmlhzoxvaglgdzibwxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbWxoem94dmFnbGdkemlid3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjUxMDAsImV4cCI6MjA3OTIwMTEwMH0.F6Vwyfq_hK21ha-PZt7tZ4gbGoV7BQiIRqgXa339NgE
```

3. **Restart dev server**:
```bash
# Stop current server (Cmd/Ctrl + C)
npm run dev
```

### Why?

- The `.env.local` file is in `.gitignore` (won't be committed)
- Supabase client needs these to connect to your database
- Keys are safe to share in a local file (they're public anyway)

### ✅ Done!

Once created, your app will connect to Supabase automatically.

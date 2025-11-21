# How to Deploy to Vercel (Make it Live)

Since your code is now on GitHub, the easiest way to make it live for everyone is using **Vercel** (the creators of Next.js).

## 1. Create a Vercel Account
1. Go to [vercel.com/signup](https://vercel.com/signup).
2. Sign up with **GitHub**.

## 2. Import your Repository
1. On your Vercel dashboard, click **"Add New..."** -> **"Project"**.
2. You should see your `File-organizer` repository in the list.
3. Click **Import**.

## 3. Configure Environment Variables (Crucial!)
**Do not click Deploy yet!** You need to add your Supabase keys.

1. Look for the **"Environment Variables"** section.
2. Open your local `.env.local` file to see your keys.
3. Add them one by one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (Paste value from your .env.local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Paste value from your .env.local) |

## 4. Deploy
1. Click **Deploy**.
2. Wait about a minute.
3. You will get a live URL (e.g., `file-organizer.vercel.app`) that you can share with anyone!

## 5. Update Supabase (Optional but Recommended)
If you want your live site to work perfectly with authentication:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **Authentication** -> **URL Configuration**.
3. Add your new Vercel URL to the **Site URL** and **Redirect URLs**.

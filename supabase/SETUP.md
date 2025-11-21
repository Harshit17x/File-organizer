# 🗄️ Database Setup Instructions

## Step 1: Run the SQL Schema

1. Go to your Supabase project: https://supabase.com/dashboard/project/hjmlhzoxvaglgdzibwxn
2. Click **SQL Editor** in the left sidebar (icon looks like </> )
3. Click **+ New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait ~10 seconds for execution

## Step 2: Verify Tables Created

1. Go to **Table Editor** in the left sidebar
2. You should see 3 tables:
   - ✅ `profiles`
   - ✅ `subjects`
   - ✅ `files`

## Step 3: Verify Storage Bucket

1. Go to **Storage** in the left sidebar
2. You should see:
   - ✅ `user-files` bucket

## ✅ You're Done!

The database is now ready for the app. Come back and let me know when this is complete, and I'll continue with the authentication implementation.

---

## 🔍 What This Schema Does:

- **profiles**: Stores user information (auto-created on signup)
- **subjects**: Your file categories (one user can have many subjects)
- **files**: File metadata (stored in subject folders)
- **user-files**: Storage bucket for actual file uploads
- **RLS Policies**: Ensures users can only see their own data
- **Triggers**: Auto-updates timestamps and creates profiles

# Storage Bucket Not Found - Fix Instructions

## ❌ Issue:
File uploads are failing because the `user-files` storage bucket doesn't exist yet.

## ✅ Solution - Create the Bucket:

### Go to Supabase Dashboard:

1. **Open**: https://supabase.com/dashboard/project/hjmlhzoxvaglgdzibwxn

2. **Click "Storage"** in the left sidebar

3. **Click "Create a new bucket"** button

4. **Fill in**:
   - **Name**: `user-files`
   - **Public bucket**: ❌ **OFF** (keep it private)
   - Click **"Create bucket"**

5. **Set up RLS policies**:
   - Click on the `user-files` bucket
   - Go to **"Policies"** tab
   - Click **"New Policy"**
   
   **Policy 1: Upload files**
   ```sql
   CREATE POLICY "Users can upload own files"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'user-files' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 2: View files**
   ```sql
   CREATE POLICY "Users can view own files"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'user-files' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

   **Policy 3: Delete files**
   ```sql
   CREATE POLICY "Users can delete own files"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'user-files' AND
     auth.uid()::text = (storage.foldername(name))[1]
   );
   ```

## 🔄 After Setup:
1. Go back to your app
2. Try uploading a file again
3. It should work! ✅

---

**Note:** The SQL schema script tried to create this, but Supabase requires buckets to be created via the UI or API first, then policies can be added via SQL.

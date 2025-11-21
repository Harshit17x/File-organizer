-- ========================================
-- STORAGE POLICIES FIX
-- The bucket exists but needs RLS policies
-- Run this in Supabase SQL Editor
-- ========================================

-- First, check if policies exist (they might not have been created)
-- Then create them if missing

-- Policy 1: Users can upload their own files
DROP POLICY IF EXISTS "Users can upload own files" ON storage.objects;
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Users can view their own files
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Users can update their own files
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'user-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users can delete their own files
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Verify bucket exists and is private
SELECT * FROM storage.buckets WHERE id = 'user-files';

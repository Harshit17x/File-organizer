-- Final fix for file sharing RLS policies
-- This migration fixes the permission issues with file sharing

-- Step 1: Normalize all email addresses to lowercase for consistency
UPDATE shared_files 
SET shared_with_email = LOWER(shared_with_email);

-- Step 2: Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view shares sent to them" ON shared_files;
DROP POLICY IF EXISTS "Users can view files shared with them" ON files;

-- Step 3: Recreate shared_files policy without auth.users dependency
CREATE POLICY "Users can view shares sent to them"
  ON shared_files FOR SELECT
  USING (
    shared_with_email = (auth.jwt() ->> 'email') OR
    shared_by = auth.uid()
  );

-- Step 4: Recreate files policy to allow viewing shared files
CREATE POLICY "Users can view files shared with them"
  ON files FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM shared_files
      WHERE shared_files.file_id = files.id
      AND shared_files.shared_with_email = (auth.jwt() ->> 'email')
    )
  );

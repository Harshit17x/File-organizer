-- Create table for tracking shared files
create table if not exists shared_files (
  id uuid default gen_random_uuid() primary key,
  file_id uuid references files(id) on delete cascade not null,
  shared_by uuid references auth.users(id) not null,
  shared_with_email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Prevent duplicate shares of same file to same email
  unique(file_id, shared_with_email)
);

-- Enable RLS
alter table shared_files enable row level security;

-- Policy: Users can see files shared BY them
create policy "Users can view shares they created"
  on shared_files for select
  using (auth.uid() = shared_by);

-- Policy: Users can create new shares for their own files
create policy "Users can create shares for their own files"
  on shared_files for insert
  with check (
    auth.uid() = shared_by 
    and exists (
      select 1 from files 
      where id = file_id 
      and user_id = auth.uid()
    )
  );

-- Policy: Users can delete shares they created
create policy "Users can delete shares they created"
  on shared_files for delete
  using (auth.uid() = shared_by);

-- Policy: Users can view shares sent TO them (by email lookup)
-- Note: This relies on the user's email matching the shared_with_email
create policy "Users can view shares sent to them"
  on shared_files for select
  using (
    shared_with_email = (select email from auth.users where id = auth.uid())
  );

-- UPDATE FILES TABLE POLICIES to allow access to shared files

-- Allow users to view files that are shared with them
create policy "Users can view files shared with them"
  on files for select
  using (
    exists (
      select 1 from shared_files
      where file_id = id
      and shared_with_email = (select email from auth.users where id = auth.uid())
    )
  );

-- UPDATE STORAGE POLICIES
-- We need a function to check if a user has access to a file path (storage_path)
-- because storage policies don't have direct join access to tables easily without helper functions.

create or replace function can_access_file(storage_path text)
returns boolean as $$
declare
  file_record record;
begin
  -- Get the file record for this path
  select * into file_record from files where storage_path = $1 limit 1;
  
  if file_record is null then
    return false;
  end if;
  
  -- Check if owner
  if file_record.user_id = auth.uid() then
    return true;
  end if;
  
  -- Check if shared with user
  if exists (
    select 1 from shared_files
    where file_id = file_record.id
    and shared_with_email = (select email from auth.users where id = auth.uid())
  ) then
    return true;
  end if;
  
  return false;
end;
$$ language plpgsql security definer;

-- Update storage policy to use the helper function
-- Note: You might need to drop existing policies if they conflict, 
-- but usually adding a new permissive policy is enough for "OR" logic.
-- However, Supabase storage policies are often "Give access if ANY policy matches".

create policy "Allow download of shared files"
on storage.objects for select
using (
  bucket_id = 'user-files' 
  and can_access_file(name)
);

-- Drop the problematic policies first
drop policy if exists "Users can view shares sent to them" on shared_files;
drop policy if exists "Users can view files shared with them" on files;

-- Re-create "Users can view shares sent to them" using auth.jwt()
create policy "Users can view shares sent to them"
  on shared_files for select
  using (
    shared_with_email = (auth.jwt() ->> 'email')
  );

-- Re-create "Users can view files shared with them" using auth.jwt()
create policy "Users can view files shared with them"
  on files for select
  using (
    exists (
      select 1 from shared_files
      where file_id = id
      and shared_with_email = (auth.jwt() ->> 'email')
    )
  );

-- ========================================
-- FILE ORGANIZER DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ========================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ========================================
-- 1. PROFILES TABLE
-- ========================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ========================================
-- 2. SUBJECTS TABLE  
-- ========================================
create table if not exists public.subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  color text default '#8B5CF6' not null,
  image_url text,
  file_count integer default 0 not null,
  is_trashed boolean default false not null,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.subjects enable row level security;

-- Policies for subjects
create policy "Users can view own subjects"
  on public.subjects for select
  using (auth.uid() = user_id);

create policy "Users can create subjects"
  on public.subjects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own subjects"  
  on public.subjects for update
  using (auth.uid() = user_id);

create policy "Users can delete own subjects"
  on public.subjects for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists subjects_user_id_idx on public.subjects(user_id);
create index if not exists subjects_is_trashed_idx on public.subjects(is_trashed);

-- ========================================
-- 3. FILES TABLE
-- ========================================
create table if not exists public.files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subject_id uuid references public.subjects on delete cascade not null,
  name text not null,
  size bigint not null,
  type text not null,
  storage_path text not null,
  is_favorite boolean default false not null,
  is_trashed boolean default false not null,
  deleted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.files enable row level security;

-- Policies for files
create policy "Users can view own files"
  on public.files for select
  using (auth.uid() = user_id);

create policy "Users can create files"
  on public.files for insert
  with check (auth.uid() = user_id);

create policy "Users can update own files"
  on public.files for update  
  using (auth.uid() = user_id);

create policy "Users can delete own files"
  on public.files for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists files_user_id_idx on public.files(user_id);
create index if not exists files_subject_id_idx on public.files(subject_id);
create index if not exists files_is_favorite_idx on public.files(is_favorite);
create index if not exists files_is_trashed_idx on public.files(is_trashed);

-- ========================================
-- 4. STORAGE BUCKET
-- ========================================
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can upload own files"
  on storage.objects for insert
  with check (
    bucket_id = 'user-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view own files"
  on storage.objects for select
  using (
    bucket_id = 'user-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update own files"
  on storage.objects for update
  using (
    bucket_id = 'user-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'user-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ========================================
-- 5. FUNCTIONS & TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply trigger to tables
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

drop trigger if exists subjects_updated_at on public.subjects;
create trigger subjects_updated_at
  before update on public.subjects
  for each row
  execute function public.handle_updated_at();

drop trigger if exists files_updated_at on public.files;
create trigger files_updated_at
  before update on public.files
  for each row
  execute function public.handle_updated_at();

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ========================================
-- DONE! Schema is ready.
-- ========================================

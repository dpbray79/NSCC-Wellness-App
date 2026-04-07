-- Create the core checkins table
create table checkins (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- The 5 Pillars (Values 0-10)
  sleep smallint not null check (sleep >= 0 and sleep <= 10),
  stress smallint not null check (stress >= 0 and stress <= 10),
  cognitive smallint not null check (cognitive >= 0 and cognitive <= 10),
  social smallint not null check (social >= 0 and social <= 10),
  food_security smallint not null check (food_security >= 0 and food_security <= 10),
  
  -- The calculated composite score (0.0 to 10.0)
  composite numeric(3,1) not null check (composite >= 0.0 and composite <= 10.0),
  
  -- Optional unencrypted journal (we will upgrade this to AES-256-GCM later in Phase 4)
  journal text,
  
  -- Link to Entra ID authenticated user
  user_id uuid not null default auth.uid() references auth.users(id)
);

-- Note: user_id is automatically pulled from the MSAL/Supabase session token via auth.uid().

-- Enable Row Level Security (RLS) so we can securely isolate user data
alter table checkins enable row level security;

-- Policy: Only authenticated users can insert their own checkins
create policy "Users can insert their own checkins"
  on checkins for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy: Only authenticated users can view their own checkins
create policy "Users can view their own checkins"
  on checkins for select
  to authenticated
  using (auth.uid() = user_id);

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
  journal text
);

-- Note: We are not linking these to a user_id yet because we haven't wired up MSAL to Supabase Auth.
-- For now, the table is open to anonymous insertions so we can test the UI saving data.
-- DO NOT put this into production until Row Level Security (RLS) is applied!

-- Enable Row Level Security (RLS) so we can control access
alter table checkins enable row level security;

-- Policy: Allow anonymous users to INSERT checkins (temporarily for Phase 2 testing)
create policy "Allow anonymous inserts"
  on checkins for insert
  to anon
  with check (true);

-- Policy: Allow anonymous users to SELECT checkins (temporarily for Phase 2 testing)
create policy "Allow anonymous selects"
  on checkins for select
  to anon
  using (true);

-- Azure Database Setup for NSCC Wellness App
-- This script replaces the Supabase-specific logic with standard PostgreSQL for Azure

-- 1. Create the core checkins table
CREATE TABLE IF NOT EXISTS checkins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- The 5 Pillars (Values 0-10)
    sleep SMALLINT NOT NULL CHECK (sleep >= 0 AND sleep <= 10),
    stress SMALLINT NOT NULL CHECK (stress >= 0 AND stress <= 10),
    cognitive SMALLINT NOT NULL CHECK (cognitive >= 0 AND cognitive <= 10),
    social SMALLINT NOT NULL CHECK (social >= 0 AND social <= 10),
    food_security SMALLINT NOT NULL CHECK (food_security >= 0 AND food_security <= 10),
    
    -- Calculated composite score (0.0 to 10.0)
    composite NUMERIC(3,1) NOT NULL CHECK (composite >= 0.0 AND composite <= 10.0),
    
    -- Journal field
    journal TEXT
);

-- 2. Security Setup (Standard Postgres)
-- In Azure, we typically use a dedicated web user/role rather than Supabase's 'anon'
-- For testing, we allow the current user, but for production, we will use Managed Identities.

-- Enable Row Level Security (RLS)
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

-- Policy for API access (to be refined when Managed Identity is configured)
CREATE POLICY "Enable access for API role"
    ON checkins
    FOR ALL
    TO PUBLIC
    USING (true);

-- 3. Seed Data (Optional - just for testing migration)
-- INSERT INTO checkins (sleep, stress, cognitive, social, food_security, composite, journal)
-- VALUES (8, 4, 9, 7, 10, 7.6, 'Azure migration test check-in');

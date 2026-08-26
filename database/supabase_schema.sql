-- ========================================================================
-- DIGITAL DADA DADI HELP MANAGEMENT DESK - SUPABASE POSTGRESQL SCHEMA
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ========================================================================

-- 1. Create Users Table (Senior Citizens)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Admins Table (Management Staff)
CREATE TABLE IF NOT EXISTS public.admins (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Help Requests Table
CREATE TABLE IF NOT EXISTS public.help_requests (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================================
-- INDEXES FOR PERFORMANCE
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON public.help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON public.help_requests(status);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enabling RLS and adding policies for anon and authenticated API access
-- ========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Allow public select on users" ON public.users;
DROP POLICY IF EXISTS "Allow public insert on users" ON public.users;
DROP POLICY IF EXISTS "Allow public update on users" ON public.users;
DROP POLICY IF EXISTS "Allow public delete on users" ON public.users;

DROP POLICY IF EXISTS "Allow public select on admins" ON public.admins;

DROP POLICY IF EXISTS "Allow public select on help_requests" ON public.help_requests;
DROP POLICY IF EXISTS "Allow public insert on help_requests" ON public.help_requests;
DROP POLICY IF EXISTS "Allow public update on help_requests" ON public.help_requests;
DROP POLICY IF EXISTS "Allow public delete on help_requests" ON public.help_requests;

DROP POLICY IF EXISTS "Allow public select on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public delete on contact_messages" ON public.contact_messages;

-- Users Table Policies
CREATE POLICY "Allow public select on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on users" ON public.users FOR DELETE USING (true);

-- Admins Table Policies
CREATE POLICY "Allow public select on admins" ON public.admins FOR SELECT USING (true);

-- Help Requests Table Policies
CREATE POLICY "Allow public select on help_requests" ON public.help_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert on help_requests" ON public.help_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on help_requests" ON public.help_requests FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on help_requests" ON public.help_requests FOR DELETE USING (true);

-- Contact Messages Table Policies
CREATE POLICY "Allow public select on contact_messages" ON public.contact_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert on contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on contact_messages" ON public.contact_messages FOR DELETE USING (true);

-- ========================================================================
-- SEED INITIAL DEMO DATA
-- Pre-populates default admin, senior citizens, and sample help requests
-- ========================================================================

-- Seed Default Admin
-- Username: admin | Password: adminpassword123
INSERT INTO public.admins (username, password, full_name)
SELECT 'admin', 'adminpassword123', 'Desk Administrator'
WHERE NOT EXISTS (SELECT 1 FROM public.admins WHERE username = 'admin');

-- Seed Senior Citizens
INSERT INTO public.users (full_name, age, gender, mobile_number, address, email, password)
SELECT 'Ramesh Kapoor', 72, 'Male', '9876543210', '45, Seva Bhavan Road, New Delhi', 'ramesh@email.com', 'password123'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'ramesh@email.com');

INSERT INTO public.users (full_name, age, gender, mobile_number, address, email, password)
SELECT 'Savitri Devi', 68, 'Female', '9812345678', '12, Dwarka Sector 4, New Delhi', 'savitri@email.com', 'password123'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'savitri@email.com');

INSERT INTO public.users (full_name, age, gender, mobile_number, address, email, password)
SELECT 'kriti patil', 65, 'Female', '7845784578', 'Pune', 'kritipatil7@gmail.com', 'kriti123'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'kritipatil7@gmail.com');

-- Seed Initial Help Requests
INSERT INTO public.help_requests (user_id, request_type, description, status, created_at)
SELECT id, 'Medical', 'I want medicines to help me', 'Completed', NOW() - INTERVAL '16 days'
FROM public.users WHERE email = 'kritipatil7@gmail.com'
AND NOT EXISTS (SELECT 1 FROM public.help_requests WHERE description = 'I want medicines to help me');

INSERT INTO public.help_requests (user_id, request_type, description, status, created_at)
SELECT id, 'Technical Help', 'I need technical support of smartphone', 'Completed', NOW() - INTERVAL '18 days'
FROM public.users WHERE email = 'kritipatil7@gmail.com'
AND NOT EXISTS (SELECT 1 FROM public.help_requests WHERE description = 'I need technical support of smartphone');

INSERT INTO public.help_requests (user_id, request_type, description, status, created_at)
SELECT id, 'Grocery', 'Need 2kg potatoes, 1kg sugar and a packet of tea delivered. Prefer morning delivery.', 'Pending', NOW() - INTERVAL '1 day'
FROM public.users WHERE email = 'ramesh@email.com'
AND NOT EXISTS (SELECT 1 FROM public.help_requests WHERE description LIKE '%potatoes%');

INSERT INTO public.help_requests (user_id, request_type, description, status, created_at)
SELECT id, 'Medical', 'Need escort to Eye Hospital checkup tomorrow morning. Need help in booking taxi.', 'Completed', NOW() - INTERVAL '2 days'
FROM public.users WHERE email = 'savitri@email.com'
AND NOT EXISTS (SELECT 1 FROM public.help_requests WHERE description LIKE '%Eye Hospital%');

-- Seed Initial Contact Messages
INSERT INTO public.contact_messages (name, email, message, created_at)
SELECT 'Amit Sharma', 'amit@gmail.com', 'I want to register as a volunteer for weekend sessions.', NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM public.contact_messages WHERE email = 'amit@gmail.com');


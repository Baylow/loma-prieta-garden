-- Run this script in the Supabase SQL Editor to set up the new tables and permissions

-- 1. Create the profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  contact_preference text,
  availability jsonb DEFAULT '{}'::jsonb,
  hours_per_month integer DEFAULT 0,
  volunteer_type text,
  training_interest boolean DEFAULT false,
  class_info text,
  role text DEFAULT 'volunteer',
  onboarded boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and edit their own profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);


-- 2. Create the site_content table (for CMS)
CREATE TABLE site_content (
  id text PRIMARY KEY,
  content text NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default content
INSERT INTO site_content (id, content) VALUES
('homepage_mission', 'The Loma Prieta School Garden is a living classroom where students learn hands-on about agriculture, science, and the environment. We rely on parent volunteers to keep the garden thriving!'),
('homepage_hero', 'Growing Minds, One Seed at a Time');

-- Public can view site content
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Admins can update site content" ON site_content FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);


-- 3. Create the updates table (for news/announcements CMS)
CREATE TABLE updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  author text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO updates (title, body, author) VALUES 
('Welcome to the New Garden Portal!', 'We are so excited to launch our new volunteer portal. Please fill out your profile!', 'Garden Team');

ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view updates" ON updates FOR SELECT USING (true);
CREATE POLICY "Admins can manage updates" ON updates FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);


-- 4. Create the garden_beds table (for "What's Growing" CMS)
CREATE TABLE garden_beds (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bed_number text NOT NULL,
  plant_name text NOT NULL,
  description text,
  harvest_date text,
  image_url text
);

INSERT INTO garden_beds (bed_number, plant_name, description, harvest_date, image_url) VALUES 
('Bed 1', 'Carrots', 'Sweet orange carrots planted by the 2nd graders.', 'Late October', '/images/carrots.jpg'),
('Bed 2', 'Tomatoes', 'Cherry tomatoes, perfect for snacking.', 'September', '/images/tomatoes.jpg'),
('Bed 3', 'Sunflowers', 'Giant sunflowers reaching for the sky!', 'August', '/images/sunflowers.jpg');

ALTER TABLE garden_beds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view garden beds" ON garden_beds FOR SELECT USING (true);
CREATE POLICY "Admins can manage garden beds" ON garden_beds FOR ALL USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

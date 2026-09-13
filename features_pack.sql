-- Run this script in the Supabase SQL Editor to enable the new feature pack tables

-- 1. Create Wishlist Tables (Feature 4)
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Tools & Gear',
  quantity_needed integer NOT NULL DEFAULT 1,
  quantity_claimed integer NOT NULL DEFAULT 0,
  urgency text NOT NULL DEFAULT 'normal', -- 'normal', 'needed_soon', 'urgent'
  link_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS wishlist_claims (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id uuid REFERENCES wishlist_items(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  notes text,
  status text NOT NULL DEFAULT 'pledged', -- 'pledged', 'delivered', 'cancelled'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_claims ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist to avoid conflict
DROP POLICY IF EXISTS "Public can view wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Admins can manage wishlist items" ON wishlist_items;
DROP POLICY IF EXISTS "Public can view wishlist claims" ON wishlist_claims;
DROP POLICY IF EXISTS "Public can insert wishlist claims" ON wishlist_claims;
DROP POLICY IF EXISTS "Admins can manage wishlist claims" ON wishlist_claims;

CREATE POLICY "Public can view wishlist items" ON wishlist_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage wishlist items" ON wishlist_items FOR ALL USING (is_admin());

CREATE POLICY "Public can view wishlist claims" ON wishlist_claims FOR SELECT USING (true);
CREATE POLICY "Public can insert wishlist claims" ON wishlist_claims FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage wishlist claims" ON wishlist_claims FOR ALL USING (is_admin());


-- 2. Create Teacher Booking / Schedule Requests Table (Feature 5)
CREATE TABLE IF NOT EXISTS schedule_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_name text NOT NULL,
  teacher_email text NOT NULL,
  grade text NOT NULL,
  student_count integer DEFAULT 20,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  topic text NOT NULL,
  bed_numbers text,
  notes text,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'declined'
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE schedule_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert schedule requests" ON schedule_requests;
DROP POLICY IF EXISTS "Admins can view and manage schedule requests" ON schedule_requests;

CREATE POLICY "Public can insert schedule requests" ON schedule_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and manage schedule requests" ON schedule_requests FOR ALL USING (is_admin());


-- 3. Weather / Rain Notice in site_content (Feature 6)
INSERT INTO site_content (id, content) VALUES
('weather_notice', '{"status":"normal","custom_message":"","last_updated":"2026-09-13T09:00:00Z"}')
ON CONFLICT (id) DO NOTHING;


-- 4. Insert Default Wishlist Items for Loma Prieta Garden
INSERT INTO wishlist_items (title, description, category, quantity_needed, urgency) VALUES
('Organic Potting Soil & Compost (2 cu ft bags)', 'OMRI organic certified mix for classroom seedling starts and bed revitalization.', 'Soil & Compost', 6, 'urgent'),
('Kid-Sized Garden Gloves (Small / Medium)', 'Washable nitrile-coated gardening gloves for K-5 hands.', 'Tools & Gear', 15, 'needed_soon'),
('Heirloom Winter Squash & Fall Seed Packets', 'Seeds for October planting units and cold-season cover crops.', 'Seeds & Starts', 4, 'normal'),
('Long-Stem Compost Dial Thermometer', 'Compost thermometer for students to measure heat in our 3-bin redwood composting system.', 'Tools & Gear', 2, 'needed_soon'),
('Cedar Bed Placard Stakes & Weatherproof Markers', 'Durable stakes and markers for Bed 1-12 identification.', 'Building Materials', 12, 'normal'),
('Child Watering Cans (1-Gallon with Rose Spout)', 'Gentle-flow watering cans for student watering rotations.', 'Tools & Gear', 5, 'needed_soon')
ON CONFLICT DO NOTHING;

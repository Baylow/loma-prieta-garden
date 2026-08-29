-- 1. Create the shifts table
CREATE TABLE shifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  type text NOT NULL, -- 'class', 'event', 'work_day'
  max_volunteers integer DEFAULT 2,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the shift_signups table
CREATE TABLE shift_signups (
  shift_id uuid REFERENCES shifts ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (shift_id, user_id)
);

-- 3. Turn on RLS
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_signups ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for shifts
-- Public can view all shifts
CREATE POLICY "Public can view shifts" ON shifts FOR SELECT USING (true);
-- Admins can manage all shifts
CREATE POLICY "Admins can manage shifts" ON shifts FOR ALL USING (
  is_admin()
);

-- 5. RLS Policies for shift_signups
-- Users can view signups
CREATE POLICY "Users can view signups" ON shift_signups FOR SELECT USING (true);
-- Users can insert their own signup
CREATE POLICY "Users can sign up" ON shift_signups FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can delete their own signup
CREATE POLICY "Users can cancel signup" ON shift_signups FOR DELETE USING (auth.uid() = user_id);
-- Admins can manage all signups
CREATE POLICY "Admins can manage signups" ON shift_signups FOR ALL USING (
  is_admin()
);

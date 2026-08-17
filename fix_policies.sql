-- Fix for infinite recursion in RLS policies

-- 1. Create a secure function to check admin status without triggering RLS on profiles again
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop the old recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update site content" ON site_content;
DROP POLICY IF EXISTS "Admins can manage updates" ON updates;
DROP POLICY IF EXISTS "Admins can manage garden beds" ON garden_beds;

-- 3. Recreate the policies using the new function
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update site content" ON site_content FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can manage updates" ON updates FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage garden beds" ON garden_beds FOR ALL USING (is_admin());

-- Run this script in the Supabase SQL Editor to allow admins to promote/revoke admin privileges

-- 1. Ensure the is_admin function exists
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

-- 2. Allow admins to update all profiles (e.g., updating role to 'admin' or 'volunteer')
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

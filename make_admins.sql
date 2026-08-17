-- Run this script in the Supabase SQL Editor to make specific users Admins

UPDATE profiles 
SET role = 'admin' 
WHERE email IN ('baylow@gmail.com', 'rudyrauh@gmail.com');

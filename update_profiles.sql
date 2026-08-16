-- Run this script in the Supabase SQL Editor to add the new optional profile fields

ALTER TABLE profiles 
ADD COLUMN photo_url text,
ADD COLUMN bio text,
ADD COLUMN relationship text,
ADD COLUMN kids_names text;

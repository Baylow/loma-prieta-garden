-- 1. Add grid_data column
ALTER TABLE garden_beds ADD COLUMN IF NOT EXISTS grid_data jsonb DEFAULT '["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]'::jsonb;

-- 2. Delete the old default beds to make room for the 12 specific beds
DELETE FROM garden_beds;

-- 3. Insert the 12 new beds
INSERT INTO garden_beds (bed_number, plant_name, description) VALUES 
('Bed 1', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 2', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 3', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 4', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 5', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 6', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 7', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 8', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 9', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 10', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 11', 'Mixed', 'Standard 10x3 raised bed.'),
('Bed 12', 'Mixed', 'Standard 10x3 raised bed.');

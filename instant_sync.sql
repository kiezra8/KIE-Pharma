-- ==========================================================
-- FINAL "INSTANT-ON" CATEGORY & CLASS RESTORATION
-- ==========================================================
-- This script synchronizes your Supabase database with the 
-- hardcoded app logic to eliminate 'Catalog Loading' issues.

-- 1. CLEANUP: REMOVE BROKEN, DUPLICATE, OR OBSOLETE RECORDS
DELETE FROM categories WHERE name IN ('Dental', 'Nursing', 'broken');
DELETE FROM categories a USING categories b WHERE a.id > b.id AND a.name = b.name;

-- 2. ENSURE 10 CORE "INSTANT" CATEGORIES (ID 1-10)
INSERT INTO categories (id, name, img) VALUES 
(1, 'Drugs', 'https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg'),
(2, 'Consumables', 'https://i.pinimg.com/1200x/de/14/de/de14de238d3b3aa763fba68c0d02db2a.jpg'),
(3, 'Surgical', 'https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300'),
(4, 'Orthopedics', 'https://i.pinimg.com/1200x/a0/26/d7/a026d781617586521eb1809e29cb1764.jpg'),
(5, 'Laboratory', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300'),
(6, 'Diagnostics', 'https://i.pinimg.com/736x/dc/c7/36/dcc73645645065ebee4fba4297c7e937.jpg'),
(7, 'Equipment', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200'),
(8, 'Radiology', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=300'),
(9, 'Nursing Dept', 'https://images.unsplash.com/photo-1576091160550-217359f49f4c?auto=format&fit=crop&q=80&w=300'),
(10, 'Health Kits', 'https://images.unsplash.com/photo-1542884748-2b87b36c6b90?auto=format&fit=crop&q=80&w=300')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, img = EXCLUDED.img;

-- 3. ENSURE MEDICAL DRUG CLASSES ARE LINKED TO 'DRUGS' (ID 1)
INSERT INTO subcategories (id, name, img, category_id) VALUES
(101, 'Analgesics & Antipyretics', 'https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg', 1),
(102, 'Antibiotics', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(103, 'Antifungals', 'https://images.unsplash.com/photo-1603302576837-37561b2e2e02?auto=format&fit=crop&q=80&w=300', 1),
(104, 'Antimalarials', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300', 1),
(105, 'Antivirals', 'https://images.unsplash.com/photo-1550572017-edb78996b797?auto=format&fit=crop&q=80&w=300', 1),
(106, 'Anthelmintics', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300', 1),
(113, 'Vitamins & Supplements', 'https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, img = EXCLUDED.img, category_id = EXCLUDED.category_id;

-- 4. ENSURE BANNERS ARE SYNCHRONIZED
INSERT INTO animations (id, title, subtitle, img) VALUES 
(1, 'Advanced Pharmaceutical Care', 'Your Trusted Partner in Health', 'https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg'),
(2, 'Turbo Fast Delivery', 'Swift pharmaceutical delivery across Uganda within 24 hours.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200'),
(3, 'Quality Lab Equipment', 'Precision tools for modern medical diagnostic centers.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=1200')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, img = EXCLUDED.img;

-- 5. PERFORM SCHEMA VERIFICATION
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='subcategory_id') THEN
    ALTER TABLE products ADD COLUMN subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE SET NULL;
  END IF;
END $$;

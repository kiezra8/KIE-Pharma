-- 1. Ensure the "products" table has the "subcategory_id" column
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='subcategory_id') THEN
    ALTER TABLE products ADD COLUMN subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 2. Ensure the "Drugs" parent category exists with ID 1
INSERT INTO categories (id, name, img) VALUES 
(1, 'Drugs', 'https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Insert the Core Drug Classes linked to Category ID 1
INSERT INTO subcategories (id, name, img, category_id) VALUES
(101, 'Analgesics & Antipyretics', 'https://i.pinimg.com/1200x/15/4f/6c/154f6c6318fc250236c54376d906f452.jpg', 1),
(102, 'Antibiotics', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(103, 'Antifungals', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(104, 'Antimalarials', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300', 1),
(105, 'Antivirals', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(106, 'Anthelmintics', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(107, 'Antihypertensives', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(108, 'Antidiabetics', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(109, 'Antihistamines', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(110, 'Antacids & Antiulcerants', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(111, 'Antiasthmatics', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(112, 'Cardiovascular Drugs', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300', 1),
(113, 'Supplements & Vitamins', 'https://images.unsplash.com/photo-1584622781564-1d9876a3e75d?auto=format&fit=crop&q=80&w=300', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category_id = EXCLUDED.category_id;

-- 3. Link some initial products to these classes
UPDATE products SET subcategory_id = 101 WHERE name ILIKE '%Paracetamol%';
UPDATE products SET subcategory_id = 102 WHERE name ILIKE '%Amoxicillin%';
UPDATE products SET subcategory_id = 104 WHERE name ILIKE '%Artemether%';

-- SUPABASE SCHEMA FOR KIE PHARMA

-- 1. Banners Table (For Hero Slider)
CREATE TABLE IF NOT EXISTS banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  imageurl text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  imageurl text NOT NULL,
  type text DEFAULT 'main', -- 'main' or 'sub'
  parent_id uuid REFERENCES categories(id) NULL
);

-- 3. Products Table (Shein-style rich details)
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text, -- Detailed markdown or rich text
  price numeric NOT NULL,
  imageurl text NOT NULL, -- Main Image
  gallery text[],         -- Extra Carousel Images
  badge text,             -- e.g., 'Hot', 'New'
  category_id text,       -- Link to Category Name or UUID
  in_stock boolean DEFAULT true,
  shipping_info text DEFAULT 'Express pharmaceutical delivery across Uganda within 24hrs.',
  variants jsonb NULL,    -- To store sizes/dosages (e.g., [{"name": "Pack of 50", "price": "100"}])
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS) and Create Strict Admin Policies

-- Banners policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Admin write banners" ON banners FOR ALL USING ((select auth.jwt()->>'email') = 'israelezrakisakye@gmail.com');

-- Categories policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write categories" ON categories FOR ALL USING ((select auth.jwt()->>'email') = 'israelezrakisakye@gmail.com');

-- Products policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON products FOR ALL USING ((select auth.jwt()->>'email') = 'israelezrakisakye@gmail.com');

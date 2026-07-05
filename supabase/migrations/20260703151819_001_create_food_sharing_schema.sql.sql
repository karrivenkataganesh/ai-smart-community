/*
# Create food sharing tables (single-tenant, no auth)

1. New Tables
- `categories` - Food categories (produce, dairy, baked goods, etc.)
  - id (uuid, primary key)
  - name (text, not null)
  - icon (text, for UI icons)
  - created_at (timestamp)
  
- `foods` - Food items available for sharing
  - id (uuid, primary key)
  - title (text, not null)
  - description (text)
  - quantity (text, e.g., "5 items", "2 lbs")
  - location (text, pickup location)
  - pickup_instructions (text)
  - expires_at (timestamp, when food should be claimed by)
  - image_url (text, optional food photo)
  - category_id (uuid, foreign key to categories)
  - status (text: 'available', 'claimed', 'expired')
  - claimed_by (text, optional name of who claimed it)
  - created_at (timestamp)
  
- `claims` - History of food claims
  - id (uuid, primary key)
  - food_id (uuid, foreign key to foods)
  - claimed_by_name (text)
  - claimed_at (timestamp)
  - notes (text, optional)

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD because this is a public community sharing app.
- Data is intentionally shared/public for community benefit.
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'UtensilsCrossed',
  created_at timestamptz DEFAULT now()
);

-- Foods table
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  quantity text NOT NULL DEFAULT '1 item',
  location text NOT NULL,
  pickup_instructions text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'expired')),
  claimed_by text,
  created_at timestamptz DEFAULT now()
);

-- Claims history table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  claimed_by_name text NOT NULL,
  claimed_at timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, no direct write by users - seeded)
DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Foods policies (public CRUD)
DROP POLICY IF EXISTS "anon_select_foods" ON foods;
CREATE POLICY "anon_select_foods" ON foods FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_foods" ON foods;
CREATE POLICY "anon_insert_foods" ON foods FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_foods" ON foods;
CREATE POLICY "anon_update_foods" ON foods FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_foods" ON foods;
CREATE POLICY "anon_delete_foods" ON foods FOR DELETE
  TO anon, authenticated USING (true);

-- Claims policies (public read and insert)
DROP POLICY IF EXISTS "anon_select_claims" ON claims;
CREATE POLICY "anon_select_claims" ON claims FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_claims" ON claims;
CREATE POLICY "anon_insert_claims" ON claims FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed categories
INSERT INTO categories (name, icon) VALUES
  ('Fruits & Vegetables', 'Apple'),
  ('Baked Goods', 'Croissant'),
  ('Dairy & Eggs', 'Egg'),
  ('Prepared Meals', 'UtensilsCrossed'),
  ('Canned Goods', 'Package'),
  ('Beverages', 'Coffee'),
  ('Snacks', 'Cookie'),
  ('Other', 'Package')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_foods_status ON foods(status);
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category_id);
CREATE INDEX IF NOT EXISTS idx_foods_expires ON foods(expires_at);
CREATE INDEX IF NOT EXISTS idx_claims_food ON claims(food_id);

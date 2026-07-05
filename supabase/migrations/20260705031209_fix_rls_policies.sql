-- Drop existing overly permissive policies
DROP POLICY IF EXISTS anon_select_categories ON categories;
DROP POLICY IF EXISTS anon_select_foods ON foods;
DROP POLICY IF EXISTS anon_insert_foods ON foods;
DROP POLICY IF EXISTS anon_update_foods ON foods;
DROP POLICY IF EXISTS anon_delete_foods ON foods;
DROP POLICY IF EXISTS anon_select_claims ON claims;
DROP POLICY IF EXISTS anon_insert_claims ON claims;

-- Categories: Read-only for everyone (reference data)
CREATE POLICY "categories_select" ON categories
  FOR SELECT TO anon, authenticated
  USING (true);

-- Foods: View available foods (public sharing)
CREATE POLICY "foods_select" ON foods
  FOR SELECT TO anon, authenticated
  USING (status = 'available' OR status IS NULL);

-- Foods: Insert new listings (anyone can share food)
CREATE POLICY "foods_insert" ON foods
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    title IS NOT NULL 
    AND length(title) >= 3 
    AND location IS NOT NULL 
    AND length(location) >= 5
    AND status IN ('available', 'claimed', 'expired')
  );

-- Foods: Update only available items (prevent modifying claimed/expired)
CREATE POLICY "foods_update" ON foods
  FOR UPDATE TO anon, authenticated
  USING (status = 'available')
  WITH CHECK (status IN ('available', 'claimed', 'expired'));

-- Foods: Delete only available items (prevent deleting claimed items)
CREATE POLICY "foods_delete" ON foods
  FOR DELETE TO anon, authenticated
  USING (status = 'available');

-- Claims: View all claims (transparency in community sharing)
CREATE POLICY "claims_select" ON claims
  FOR SELECT TO anon, authenticated
  USING (true);

-- Claims: Insert claims with required fields
CREATE POLICY "claims_insert" ON claims
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    food_id IS NOT NULL 
    AND claimed_by_name IS NOT NULL 
    AND length(claimed_by_name) >= 2
  );
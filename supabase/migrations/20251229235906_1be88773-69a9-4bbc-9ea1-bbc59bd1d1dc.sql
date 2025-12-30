-- Drop existing demo update policy and recreate with both USING and WITH CHECK
DROP POLICY IF EXISTS "Anyone can update demo cutouts" ON storage.objects;

CREATE POLICY "Anyone can update demo cutouts"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clothing-items' AND name ILIKE 'demo/%')
WITH CHECK (bucket_id = 'clothing-items' AND name ILIKE 'demo/%');
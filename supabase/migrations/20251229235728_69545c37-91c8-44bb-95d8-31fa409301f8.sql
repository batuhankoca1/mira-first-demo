-- Allow public INSERT to clothing-items bucket for demo cutouts
CREATE POLICY "Anyone can upload demo cutouts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clothing-items' AND name ILIKE 'demo/%');

-- Allow public UPDATE (upsert) to clothing-items bucket for demo cutouts
CREATE POLICY "Anyone can update demo cutouts"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clothing-items' AND name ILIKE 'demo/%');

-- Allow public SELECT (already public bucket, but ensure policy exists)
CREATE POLICY "Anyone can read clothing items"
ON storage.objects FOR SELECT
USING (bucket_id = 'clothing-items');
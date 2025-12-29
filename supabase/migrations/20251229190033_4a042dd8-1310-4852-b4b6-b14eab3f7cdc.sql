-- Create storage bucket for clothing items
INSERT INTO storage.buckets (id, name, public)
VALUES ('clothing-items', 'clothing-items', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to clothing items
CREATE POLICY "Public read access for clothing items"
ON storage.objects FOR SELECT
USING (bucket_id = 'clothing-items');

-- Allow anyone to upload to clothing items (for MVP without auth)
CREATE POLICY "Anyone can upload clothing items"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clothing-items');

-- Allow anyone to delete their own uploads
CREATE POLICY "Anyone can delete clothing items"
ON storage.objects FOR DELETE
USING (bucket_id = 'clothing-items');
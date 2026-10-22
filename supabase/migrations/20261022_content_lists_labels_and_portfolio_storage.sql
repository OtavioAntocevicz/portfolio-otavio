-- Labels opcionais para listas (ex.: categorias do ecossistema em destaque)
ALTER TABLE public.content_lists
  ADD COLUMN IF NOT EXISTS label_pt text,
  ADD COLUMN IF NOT EXISTS label_en text;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY IF NOT EXISTS "portfolio_assets_public_read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-assets');

CREATE POLICY IF NOT EXISTS "portfolio_assets_auth_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY IF NOT EXISTS "portfolio_assets_auth_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-assets');

CREATE POLICY IF NOT EXISTS "portfolio_assets_auth_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-assets');

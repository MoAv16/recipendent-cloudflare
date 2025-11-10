-- ============================================================================
-- RECIPENDENT APP - STORAGE SETUP & RLS POLICIES
-- ============================================================================
-- WICHTIG: Diese SQL muss im Supabase SQL Editor ausgeführt werden!
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================================================

-- ============================================================================
-- SCHRITT 1: Prüfe ob Buckets existieren und erstelle sie falls nötig
-- ============================================================================

-- Hinweis: Storage Buckets können nur über Supabase Dashboard erstellt werden
-- oder via SQL mit storage.buckets table (falls RLS policies erlauben)

-- Prüfe existierende Buckets
DO $$
BEGIN
  RAISE NOTICE 'Checking existing storage buckets...';
END $$;

SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name IN ('profile-pictures', 'company-logos', 'order-images');

-- Falls Buckets fehlen, erstelle sie:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('profile-pictures', 'profile-pictures', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']::text[]),
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']::text[]),
  ('order-images', 'order-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SCHRITT 2: Aktiviere RLS für storage.objects
-- ============================================================================

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SCHRITT 3: Lösche alte Policies (falls vorhanden)
-- ============================================================================

-- Profile Pictures
DROP POLICY IF EXISTS "Users can view company profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;

-- Company Logos
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload company logo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update company logo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete company logo" ON storage.objects;

-- Order Images
DROP POLICY IF EXISTS "Users can view company order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update order images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete order images" ON storage.objects;

-- ============================================================================
-- SCHRITT 4: Erstelle neue hierarchische RLS Policies
-- ============================================================================

-- ============================================================================
-- 4.1 PROFILE-PICTURES BUCKET
-- ============================================================================
-- Path: {company_id}/{user_id}/filename.jpg

-- SELECT: User kann profile pictures seiner Company sehen
CREATE POLICY "Users can view company profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  )
);

-- INSERT: User kann nur sein eigenes Profilbild hochladen
CREATE POLICY "Users can upload own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- UPDATE: User kann nur sein eigenes Profilbild aktualisieren
CREATE POLICY "Users can update own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[2] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- DELETE: User kann nur sein eigenes Profilbild löschen
CREATE POLICY "Users can delete own profile picture"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- ============================================================================
-- 4.2 COMPANY-LOGOS BUCKET
-- ============================================================================
-- Path: {company_id}/filename.jpg

-- SELECT: Alle authentifizierten User können Company-Logos sehen
CREATE POLICY "Anyone can view company logos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'company-logos'
);

-- INSERT: Nur Admins können Logo ihrer Company hochladen
CREATE POLICY "Admins can upload company logo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- UPDATE: Nur Admins können Logo ihrer Company aktualisieren
CREATE POLICY "Admins can update company logo"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- DELETE: Nur Admins können Logo ihrer Company löschen
CREATE POLICY "Admins can delete company logo"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- ============================================================================
-- 4.3 ORDER-IMAGES BUCKET
-- ============================================================================
-- Path: {company_id}/{order_id}/filename.jpg

-- SELECT: User kann order images seiner Company sehen
CREATE POLICY "Users can view company order images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-images' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  )
);

-- INSERT: User kann order images seiner Company hochladen
CREATE POLICY "Users can upload order images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-images' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  )
);

-- UPDATE: User kann order images seiner Company aktualisieren
CREATE POLICY "Users can update order images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'order-images' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'order-images' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  )
);

-- DELETE: Nur Admins können order images löschen
CREATE POLICY "Admins can delete order images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-images' AND
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'co-admin')
);

-- ============================================================================
-- SCHRITT 5: Verifiziere Installation
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Storage RLS Policies wurden erfolgreich installiert!';
  RAISE NOTICE '';
  RAISE NOTICE 'Neue Ordner-Struktur:';
  RAISE NOTICE '  • profile-pictures/{company_id}/{user_id}/filename.jpg';
  RAISE NOTICE '  • company-logos/{company_id}/filename.jpg';
  RAISE NOTICE '  • order-images/{company_id}/{order_id}/filename.jpg';
  RAISE NOTICE '';
  RAISE NOTICE 'Nächster Schritt: App neu starten und neues Profilbild hochladen';
END $$;

-- Zeige alle aktiven Storage Policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- ENDE DER MIGRATION
-- ============================================================================

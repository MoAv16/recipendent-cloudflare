-- ============================================================================
-- RECIPENDENT APP - HIERARCHICAL STORAGE RLS POLICIES
-- ============================================================================
-- Policies für neue Storage-Struktur mit company_id/user_id Hierarchie
--
-- Neue Struktur:
-- - profile-pictures/{company_id}/{user_id}/filename.jpg
-- - company-logos/{company_id}/filename.jpg
-- - order-images/{company_id}/{order_id}/filename.jpg
-- ============================================================================

-- ============================================================================
-- 1. PROFILE-PICTURES BUCKET
-- ============================================================================
-- Path: {company_id}/{user_id}/filename.jpg
-- Access: User kann nur eigene Bilder und Bilder von Company-Mitgliedern sehen

-- DROP existing policies (falls vorhanden)
DROP POLICY IF EXISTS "Users can view company profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;

-- SELECT: User kann profile pictures seiner Company sehen
CREATE POLICY "Users can view company profile pictures"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  -- Extrahiere company_id aus Pfad (erste Komponente)
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
  -- Pfad muss {company_id}/{user_id}/filename sein
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
-- 2. COMPANY-LOGOS BUCKET
-- ============================================================================
-- Path: {company_id}/filename.jpg
-- Access: Admins können Logo ihrer Company verwalten, alle können sehen

DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload company logo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update company logo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete company logo" ON storage.objects;

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
  -- Pfad muss {company_id}/filename sein
  (storage.foldername(name))[1] = (
    SELECT company_id::text FROM public.users WHERE id = auth.uid()
  ) AND
  -- User muss Admin sein
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
-- 3. ORDER-IMAGES BUCKET
-- ============================================================================
-- Path: {company_id}/{order_id}/filename.jpg
-- Access: User kann nur Bilder seiner Company sehen/bearbeiten

DROP POLICY IF EXISTS "Users can view company order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update order images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete order images" ON storage.objects;

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
-- HINWEISE ZUR VERWENDUNG
-- ============================================================================

-- 1. Diese Policies nutzen storage.foldername() um Pfad-Komponenten zu extrahieren
--    Beispiel: storage.foldername('123/456/file.jpg') = ['123', '456']
--
-- 2. Legacy Unterstützung:
--    Die App-Code unterstützt noch legacy Pfade ohne Hierarchie für
--    Backward Compatibility während der Migration
--
-- 3. Migration bestehender Dateien:
--    Bestehende Dateien in Buckets sollten in die neue Struktur migriert werden:
--
--    -- Beispiel: Profile Pictures Migration
--    UPDATE storage.objects
--    SET name = (
--      SELECT company_id::text || '/' || id::text || '/' ||
--             split_part(name, '/', -1)
--      FROM public.users
--      WHERE profile_picture LIKE '%' || storage.objects.name
--    )
--    WHERE bucket_id = 'profile-pictures'
--    AND NOT name ~ '^[a-f0-9-]+/[a-f0-9-]+/';
--
-- 4. Testing:
--    Test policies mit verschiedenen User-Rollen und Companies
--    um sicherzustellen, dass Multi-Tenancy korrekt funktioniert

-- ============================================================================
-- ENDE DER POLICIES
-- ============================================================================

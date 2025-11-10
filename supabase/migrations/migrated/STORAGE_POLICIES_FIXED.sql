-- ============================================================================
-- RECIPENDENT APP - STORAGE RLS POLICIES (FIXED VERSION)
-- ============================================================================
-- Diese Version funktioniert auch ohne direkten Zugriff auf storage.objects
-- ============================================================================

-- ============================================================================
-- SCHRITT 1: Prüfe ob RLS bereits aktiviert ist
-- ============================================================================

DO $$
BEGIN
  -- Versuche RLS zu aktivieren (falls noch nicht aktiv)
  BEGIN
    EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';
    RAISE NOTICE '✅ RLS aktiviert für storage.objects';
  EXCEPTION
    WHEN insufficient_privilege THEN
      RAISE NOTICE '⚠️  RLS bereits aktiviert oder keine Berechtigung - fahre fort';
    WHEN OTHERS THEN
      RAISE NOTICE '⚠️  RLS Status unbekannt - fahre fort';
  END;
END $$;

-- ============================================================================
-- SCHRITT 2: Lösche alte Policies (mit Error Handling)
-- ============================================================================

-- Profile Pictures Policies
DROP POLICY IF EXISTS "Users can view company profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own profile picture" ON storage.objects;

-- Company Logos Policies
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload company logo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update company logo" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete company logo" ON storage.objects;

-- Order Images Policies
DROP POLICY IF EXISTS "Users can view company order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update order images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete order images" ON storage.objects;

-- ============================================================================
-- SCHRITT 3: Erstelle neue RLS Policies für PROFILE-PICTURES
-- ============================================================================

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
-- SCHRITT 4: Erstelle neue RLS Policies für COMPANY-LOGOS
-- ============================================================================

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
-- SCHRITT 5: Erstelle neue RLS Policies für ORDER-IMAGES
-- ============================================================================

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
-- SCHRITT 6: Verifiziere Installation
-- ============================================================================

DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  -- Zähle erstellte Policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'storage' AND tablename = 'objects';

  RAISE NOTICE '';
  RAISE NOTICE '========================================================';
  RAISE NOTICE '✅ Storage RLS Policies erfolgreich installiert!';
  RAISE NOTICE '';
  RAISE NOTICE 'Anzahl Policies: %', policy_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Neue Ordner-Struktur:';
  RAISE NOTICE '  • profile-pictures/{company_id}/{user_id}/filename.jpg';
  RAISE NOTICE '  • company-logos/{company_id}/filename.jpg';
  RAISE NOTICE '  • order-images/{company_id}/{order_id}/filename.jpg';
  RAISE NOTICE '';
  RAISE NOTICE 'Nächster Schritt:';
  RAISE NOTICE '  1. App neu starten';
  RAISE NOTICE '  2. Neues Profilbild hochladen';
  RAISE NOTICE '  3. In Supabase Storage prüfen ob Ordner korrekt';
  RAISE NOTICE '========================================================';
  RAISE NOTICE '';
END $$;

-- Zeige alle Storage Policies
SELECT
  policyname as "Policy Name",
  cmd as "Command",
  CASE
    WHEN qual IS NOT NULL THEN '✅ Has USING'
    ELSE '⚠️ No USING'
  END as "Status"
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- ENDE DER MIGRATION
-- ============================================================================

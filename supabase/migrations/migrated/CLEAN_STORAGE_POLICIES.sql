-- ============================================================================
-- RECIPENDENT APP - CLEAN STORAGE POLICIES (DELETE ALL + CREATE NEW)
-- ============================================================================
-- Diese SQL löscht ALLE existierenden Storage Policies und erstellt nur
-- die 12 neuen hierarchischen Policies
-- ============================================================================

-- ============================================================================
-- SCHRITT 1: Lösche ALLE existierenden Storage Policies
-- ============================================================================

DO $$
DECLARE
  pol RECORD;
BEGIN
  RAISE NOTICE 'Lösche alle existierenden Storage Policies...';

  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    RAISE NOTICE '  ✓ Gelöscht: %', pol.policyname;
  END LOOP;

  RAISE NOTICE 'Alle alten Policies gelöscht!';
  RAISE NOTICE '';
END $$;

-- ============================================================================
-- SCHRITT 2: Erstelle 12 neue hierarchische RLS Policies
-- ============================================================================

-- ============================================================================
-- 2.1 PROFILE-PICTURES BUCKET (4 Policies)
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
-- 2.2 COMPANY-LOGOS BUCKET (4 Policies)
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
-- 2.3 ORDER-IMAGES BUCKET (4 Policies)
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
-- SCHRITT 3: Verifiziere Installation
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
  RAISE NOTICE '✅ Storage RLS Policies erfolgreich neu erstellt!';
  RAISE NOTICE '';
  RAISE NOTICE 'Alte Policies: 29 (gelöscht)';
  RAISE NOTICE 'Neue Policies: % (hierarchisch)', policy_count;
  RAISE NOTICE '';

  IF policy_count = 12 THEN
    RAISE NOTICE '✅ PERFEKT! Genau 12 Policies wie erwartet.';
  ELSE
    RAISE NOTICE '⚠️  WARNUNG: Erwartet 12, gefunden %.', policy_count;
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE 'Neue Ordner-Struktur (ERZWUNGEN):';
  RAISE NOTICE '  • profile-pictures/{company_id}/{user_id}/filename.jpg';
  RAISE NOTICE '  • company-logos/{company_id}/filename.jpg';
  RAISE NOTICE '  • order-images/{company_id}/{order_id}/filename.jpg';
  RAISE NOTICE '';
  RAISE NOTICE 'Nächste Schritte:';
  RAISE NOTICE '  1. App komplett neu starten';
  RAISE NOTICE '  2. Neues Profilbild hochladen';
  RAISE NOTICE '  3. Sollte jetzt in {company_id}/{user_id}/ landen';
  RAISE NOTICE '========================================================';
  RAISE NOTICE '';
END $$;

-- Zeige finale Policies
SELECT
  policyname as "Policy Name",
  cmd as "Command",
  CASE
    WHEN cmd = 'INSERT' THEN '✅ WITH CHECK'
    WHEN qual IS NOT NULL THEN '✅ USING'
    ELSE '⚠️ No clause'
  END as "Clause"
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- ============================================================================
-- WICHTIG: Recipe Images Bucket
-- ============================================================================
-- Falls du später Recipes implementierst, fehlen noch 4 Policies für
-- 'recipe-images' bucket. Die wurden bewusst ausgelassen da recipes
-- noch nicht in der DB existieren.
-- ============================================================================

-- ============================================================================
-- ENDE DER MIGRATION
-- ============================================================================

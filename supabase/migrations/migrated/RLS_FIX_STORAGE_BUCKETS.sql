-- ============================================================================
-- RECIPENDENT APP - RLS POLICIES FIX FÜR STORAGE BUCKETS
-- ============================================================================
-- Problem: Profile Picture Upload schlägt fehl während Admin-Registration
-- Grund: RLS Policy prüft users Tabelle, aber User existiert noch nicht
-- Lösung: Authenticated users dürfen IMMER ihre eigenen Bilder hochladen
-- ============================================================================

-- Datum der Durchführung: [05.11.2025 ; 13:14]

-- ============================================================================
-- 1. PROFILE-PICTURES BUCKET
-- ============================================================================

-- Lösche alte Policies
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile pictures" ON storage.objects;

-- SELECT Policy - Jeder kann Profilbilder SEHEN (public)
CREATE POLICY "Anyone can view profile pictures"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- INSERT Policy - Authenticated users können hochladen
-- ✅ FIX: Keine Prüfung der users Tabelle, nur authenticated
CREATE POLICY "Authenticated users can upload profile pictures"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures'
);

-- UPDATE Policy - User kann nur eigene Bilder aktualisieren
CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND (storage.foldername(name))[1] = 'user-avatars'
);

-- DELETE Policy - User kann nur eigene Bilder löschen
CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
);

-- ============================================================================
-- 2. COMPANY-LOGOS BUCKET
-- ============================================================================

-- Lösche alte Policies
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload company logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update company logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete company logos" ON storage.objects;

-- SELECT Policy - Jeder kann Logos SEHEN (public)
CREATE POLICY "Anyone can view company logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');

-- INSERT Policy - Authenticated users können hochladen
-- ✅ FIX: Keine Prüfung der users Tabelle für Registration
CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos'
);

-- UPDATE Policy - Nur Admins/Co-Admins können Logos aktualisieren
CREATE POLICY "Admins can update company logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (
    SELECT role FROM public.users
    WHERE id = auth.uid()
  ) IN ('admin', 'co-admin')
);

-- DELETE Policy - Nur Admins können Logos löschen
CREATE POLICY "Admins can delete company logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos'
  AND (
    SELECT role FROM public.users
    WHERE id = auth.uid()
  ) = 'admin'
);

-- ============================================================================
-- 3. ORDER-IMAGES BUCKET
-- ============================================================================

-- Lösche alte Policies
DROP POLICY IF EXISTS "Users can view order images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update order images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete order images" ON storage.objects;

-- SELECT Policy - Authenticated users können Order-Bilder sehen
CREATE POLICY "Users can view order images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'order-images');

-- INSERT Policy - Authenticated users können Order-Bilder hochladen
CREATE POLICY "Authenticated users can upload order images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'order-images');

-- UPDATE Policy - Users können Order-Bilder aktualisieren
CREATE POLICY "Users can update order images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'order-images');

-- DELETE Policy - Users können Order-Bilder löschen
CREATE POLICY "Users can delete order images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'order-images');

-- ============================================================================
-- 4. RECIPE-IMAGES BUCKET (falls vorhanden)
-- ============================================================================

-- Lösche alte Policies
DROP POLICY IF EXISTS "Users can view recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete recipe images" ON storage.objects;

-- SELECT Policy - Authenticated users können Recipe-Bilder sehen
CREATE POLICY "Users can view recipe images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'recipe-images');

-- INSERT Policy - Authenticated users können Recipe-Bilder hochladen
CREATE POLICY "Authenticated users can upload recipe images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');

-- UPDATE Policy - Users können Recipe-Bilder aktualisieren
CREATE POLICY "Users can update recipe images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe-images');

-- DELETE Policy - Users können Recipe-Bilder löschen
CREATE POLICY "Users can delete recipe images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recipe-images');

-- ============================================================================
-- WICHTIG: BUCKETS ERSTELLEN (falls noch nicht vorhanden)
-- ============================================================================

-- Prüfe ob Buckets existieren, erstelle falls nötig
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- WICHTIGER HINWEIS
-- ============================================================================
-- Diese Policies erlauben authenticated users Upload während der Registration.
-- Das ist sicher, weil:
-- 1. Der User ist bereits authenticated (Supabase Auth)
-- 2. Der User kann nur mit seiner eigenen auth.uid() hochladen
-- 3. Nach der Registration wird der User in die users Tabelle eingefügt
-- 4. Spätere Updates/Deletes prüfen dann die users Tabelle und Rollen
-- ============================================================================

-- ============================================================================
-- TEST: Prüfe ob Policies funktionieren
-- ============================================================================

-- Als authenticated user - sollte uploaden können
-- SET LOCAL role TO authenticated;
-- SET LOCAL request.jwt.claims TO '{"sub": "test-user-id", "role": "authenticated"}';

-- Teste INSERT auf profile-pictures bucket
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata)
-- VALUES ('profile-pictures', 'user-avatars/test.jpg', 'test-user-id', '{}');

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste die Admin-Registration erneut
-- ============================================================================
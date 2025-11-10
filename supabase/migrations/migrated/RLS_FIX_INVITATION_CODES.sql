-- ============================================================================
-- RECIPENDENT APP - RLS POLICIES FIX FÜR INVITATION_CODES
-- ============================================================================
-- Problem: Invitation Codes können nicht als "used" markiert werden
-- Lösung: RLS Policies anpassen, damit authenticated users ihre Codes
--         als verwendet markieren können
-- ============================================================================

--  Datum der durchführung: 05.11.2025 12:12

-- 1. Aktiviere RLS falls noch nicht aktiviert
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- 2. Lösche ALLE existierenden Policies (um Konflikte zu vermeiden)
DROP POLICY IF EXISTS "Users can view invitation codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Users can view company invitation codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Admins can create invitation codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Users can mark their code as used" ON public.invitation_codes;
DROP POLICY IF EXISTS "Users can mark any code as used" ON public.invitation_codes;
DROP POLICY IF EXISTS "Public can read valid codes for registration" ON public.invitation_codes;
DROP POLICY IF EXISTS "Admins can delete invitation codes" ON public.invitation_codes;

-- Lösche auch alle anderen möglichen Varianten/alte Policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.invitation_codes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.invitation_codes;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.invitation_codes;
DROP POLICY IF EXISTS "Allow public read access to valid codes" ON public.invitation_codes;
DROP POLICY IF EXISTS "Allow users to update their invitation code" ON public.invitation_codes;

-- 3. SELECT Policy - Alle authentifizierten User können Codes ihrer Company sehen
CREATE POLICY "Users can view company invitation codes"
ON public.invitation_codes FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- 4. SELECT Policy - Unauthentifizierte können Codes für Registrierung lesen
-- (WICHTIG: Ohne diese Policy kann man sich nicht registrieren!)
CREATE POLICY "Public can read valid codes for registration"
ON public.invitation_codes FOR SELECT
TO anon
USING (
  used = false
  AND expires_at > now()
);

-- 5. INSERT Policy - Nur Admins/Co-Admins können Codes erstellen
CREATE POLICY "Admins can create invitation codes"
ON public.invitation_codes FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'co-admin')
  )
);

-- 6. UPDATE Policy - Authentifizierte User können Codes als verwendet markieren
-- (Dies ist der WICHTIGSTE Fix!)
CREATE POLICY "Users can mark their code as used"
ON public.invitation_codes FOR UPDATE
TO authenticated
USING (true)  -- Jeder authentifizierte User kann updaten
WITH CHECK (
  -- Aber nur diese Felder dürfen geändert werden:
  used = true
  AND used_by = auth.uid()  -- Nur eigene User-ID
  AND used_at IS NOT NULL
);

-- 7. Alternative: Weniger restriktive Policy (falls die obige nicht funktioniert)
-- DROP POLICY IF EXISTS "Users can mark their code as used" ON public.invitation_codes;
--
-- CREATE POLICY "Users can mark any code as used"
-- ON public.invitation_codes FOR UPDATE
-- TO authenticated
-- USING (used = false)  -- Nur noch nicht verwendete Codes
-- WITH CHECK (
--   used = true
--   AND used_by IS NOT NULL
-- );

-- 8. DELETE Policy - Nur Admins können Codes löschen
CREATE POLICY "Admins can delete invitation codes"
ON public.invitation_codes FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- ZUSÄTZLICH: Index für Performance
-- ============================================================================

-- Index auf 'code' für schnelle Lookups
CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON public.invitation_codes(code);

-- Index auf 'used' und 'expires_at' für Validierung
CREATE INDEX IF NOT EXISTS idx_invitation_codes_validation
ON public.invitation_codes(used, expires_at)
WHERE used = false;

-- ============================================================================
-- TEST: Prüfe ob Policies funktionieren
-- ============================================================================

-- Als anon (nicht eingeloggt) - sollte nur gültige Codes sehen
-- SET LOCAL role TO anon;
-- SELECT code, used, expires_at FROM public.invitation_codes
-- WHERE used = false AND expires_at > now();

-- Als authenticated user - sollte Codes updaten können
-- SET LOCAL role TO authenticated;
-- SET LOCAL request.jwt.claims TO '{"sub": "your-user-id", "role": "authenticated"}';
-- UPDATE public.invitation_codes
-- SET used = true, used_by = 'your-user-id', used_at = now()
-- WHERE code = 'TEST1234';

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste die Registration erneut
-- ============================================================================
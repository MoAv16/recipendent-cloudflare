-- ============================================================================
-- COMPLETE FIX: Support Tickets RLS + Verification
-- ============================================================================
-- Führe diese SQL-Datei komplett im Supabase SQL Editor aus
-- Dashboard → SQL Editor → New query → Code kopieren → Run

-- ============================================================================
-- STEP 1: Prüfe, ob Tickets in der DB existieren
-- ============================================================================
SELECT
  COUNT(*) as ticket_count,
  COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets
FROM support_tickets;

-- Erwartetes Ergebnis: Zeigt Anzahl der Tickets
-- Falls ticket_count = 0 → Keine Tickets in DB
-- Falls ticket_count > 0 → Tickets existieren, RLS blockiert Zugriff

-- ============================================================================
-- STEP 2: Zeige alle Tickets (für Debugging)
-- ============================================================================
SELECT
  id,
  ticket_number,
  user_name,
  user_email,
  category,
  status,
  created_at
FROM support_tickets
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- STEP 3: Prüfe aktuelle RLS Policies für support_tickets
-- ============================================================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'support_tickets';

-- Erwartete Policies:
-- - "Super Admins können alle Tickets sehen" (SELECT)
-- - "Super Admins können Tickets löschen" (DELETE)
-- - "Super Admins können Tickets updaten" (UPDATE)

-- ============================================================================
-- STEP 4: RLS Policies für Super Admins erstellen/aktualisieren
-- ============================================================================

-- 4a) Alte Policies entfernen (falls vorhanden)
DROP POLICY IF EXISTS "Super Admins können alle Tickets sehen" ON support_tickets;
DROP POLICY IF EXISTS "Super Admins können Tickets löschen" ON support_tickets;
DROP POLICY IF EXISTS "Super Admins können Tickets updaten" ON support_tickets;

-- 4b) Super Admin SELECT Policy
CREATE POLICY "Super Admins können alle Tickets sehen"
ON support_tickets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
);

-- 4c) Super Admin DELETE Policy
CREATE POLICY "Super Admins können Tickets löschen"
ON support_tickets
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
);

-- 4d) Super Admin UPDATE Policy
CREATE POLICY "Super Admins können Tickets updaten"
ON support_tickets
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
);

-- ============================================================================
-- STEP 5: Verify Policies wurden erstellt
-- ============================================================================
SELECT
  policyname,
  cmd as command_type,
  CASE
    WHEN cmd = 'SELECT' THEN 'Tickets lesen'
    WHEN cmd = 'DELETE' THEN 'Tickets löschen'
    WHEN cmd = 'UPDATE' THEN 'Tickets aktualisieren'
  END as description
FROM pg_policies
WHERE tablename = 'support_tickets'
  AND policyname LIKE '%Super Admin%'
ORDER BY cmd;

-- Erwartetes Ergebnis: 3 Policies für Super Admins

-- ============================================================================
-- STEP 6: Prüfe Super Admins in DB
-- ============================================================================
SELECT
  email,
  created_at,
  last_login,
  notes
FROM super_admins
ORDER BY created_at DESC;

-- WICHTIG: Deine Email MUSS in dieser Liste sein!
-- Falls nicht, füge dich hinzu:
-- INSERT INTO super_admins (email, notes) VALUES ('deine@email.com', 'Main Admin');

-- ============================================================================
-- FERTIG! 🎉
-- ============================================================================
-- Nach dem Ausführen dieser SQL:
-- 1. Öffne Admin Panel: https://deine-app.com/admin
-- 2. Logge dich als Super Admin ein
-- 3. Wechsle zum Tab "💬 Support-Tickets"
-- 4. Tickets sollten jetzt sichtbar sein!

-- ============================================================================
-- FIX: Support Tickets RLS für Super Admins
-- ============================================================================
-- Problem: Super Admins können keine Tickets sehen, weil RLS sie blockiert
-- Lösung: Policy hinzufügen, die Super Admins Zugriff auf ALLE Tickets gibt

-- 1. Bestehende Super Admin Policies entfernen (falls vorhanden)
DROP POLICY IF EXISTS "Super Admins können alle Tickets sehen" ON support_tickets;
DROP POLICY IF EXISTS "Super Admins können Tickets löschen" ON support_tickets;

-- 2. Super Admin SELECT Policy (alle Tickets sehen)
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

-- 3. Super Admin DELETE Policy (Tickets löschen)
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

-- 4. Super Admin UPDATE Policy (für Status-Updates bei Antwort)
DROP POLICY IF EXISTS "Super Admins können Tickets updaten" ON support_tickets;

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
-- INFO: Diese Policies erlauben Super Admins (aus super_admins Tabelle)
-- Zugriff auf ALLE support_tickets, unabhängig von company_id
-- ============================================================================

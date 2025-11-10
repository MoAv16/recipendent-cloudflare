-- ============================================================================
-- RECIPENDENT APP - RLS DELETE POLICY FÜR USERS TABELLE
-- ============================================================================
-- Problem: Employees können nicht gelöscht werden (fehlende DELETE Policy)
-- Lösung: DELETE Policy erstellen für Admins und Co-Admins mit Permission
-- ============================================================================

-- Datum: 07.11.2025

-- 1. Aktiviere RLS falls noch nicht aktiviert
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Lösche existierende DELETE Policy (falls vorhanden)
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete company users" ON public.users;

-- ============================================================================
-- DELETE POLICY - Admins und Co-Admins (mit Permission) können User löschen
-- ============================================================================
CREATE POLICY "Admins can delete company users"
ON public.users FOR DELETE
TO authenticated
USING (
  -- User ist in derselben Company
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
  AND
  (
    -- CASE 1: User ist Admin
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    OR
    -- CASE 2: User ist Co-Admin mit can_delete_employees Permission
    (
      (SELECT role FROM public.users WHERE id = auth.uid()) = 'co-admin'
      AND
      (
        SELECT (co_admin_permissions->>'can_delete_employees')::boolean
        FROM public.users
        WHERE id = auth.uid()
      ) = true
    )
  )
  AND
  -- WICHTIG: User kann sich nicht selbst löschen
  id != auth.uid()
);

-- ============================================================================
-- ZUSÄTZLICH: Cascade Delete für related data
-- ============================================================================

-- Trigger-Funktion: Lösche auth.users Eintrag wenn public.users gelöscht wird
CREATE OR REPLACE FUNCTION delete_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Lösche Auth-User (nur wenn es ein Service Role gibt)
  -- NOTE: Dies funktioniert NUR wenn die Funktion mit Security Definer ausgeführt wird
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Automatisches Löschen des auth.users Eintrags
DROP TRIGGER IF EXISTS on_user_deleted ON public.users;
CREATE TRIGGER on_user_deleted
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION delete_auth_user();

-- ============================================================================
-- CLEANUP: Orders von gelöschten Users
-- ============================================================================

-- Trigger-Funktion: Entferne User aus assigned_to Arrays in Orders
CREATE OR REPLACE FUNCTION cleanup_user_assignments()
RETURNS TRIGGER AS $$
BEGIN
  -- Entferne User aus allen assigned_to Arrays
  UPDATE public.orders
  SET assigned_to = array_remove(assigned_to, OLD.id)
  WHERE OLD.id = ANY(assigned_to);

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Cleanup bei User-Deletion
DROP TRIGGER IF EXISTS on_user_deleted_cleanup_orders ON public.users;
CREATE TRIGGER on_user_deleted_cleanup_orders
  BEFORE DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_assignments();

-- ============================================================================
-- TEST-QUERIES (auskommentiert)
-- ============================================================================

-- Als Admin
-- SET LOCAL request.jwt.claims TO '{"sub": "admin-user-id", "role": "authenticated"}';
--
-- DELETE FROM public.users WHERE id = 'employee-user-id';

-- Als Co-Admin mit Permission
-- SET LOCAL request.jwt.claims TO '{"sub": "co-admin-user-id", "role": "authenticated"}';
--
-- DELETE FROM public.users WHERE id = 'employee-user-id';

-- Als Co-Admin OHNE Permission (sollte fehlschlagen)
-- DELETE FROM public.users WHERE id = 'employee-user-id';
-- ERROR: new row violates row-level security policy

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste User-Deletion erneut
-- ============================================================================

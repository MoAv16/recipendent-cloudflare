-- ============================================================================
-- RECIPENDENT APP - RLS DELETE POLICY UPDATE FÜR ORDERS (CO-ADMIN SUPPORT)
-- ============================================================================
-- Problem: Nur Admins können Orders löschen, Co-Admins nicht
-- Lösung: DELETE Policy erweitern für Co-Admins mit can_delete_orders Permission
-- ============================================================================

-- Datum: 07.11.2025

-- 1. Lösche existierende DELETE Policy
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- ============================================================================
-- DELETE POLICY - Admins und Co-Admins (mit Permission) können Orders löschen
-- ============================================================================
CREATE POLICY "Admins and authorized co-admins can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (
  -- Order ist in der Company des Users
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
  AND
  (
    -- CASE 1: User ist Admin
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
    OR
    -- CASE 2: User ist Co-Admin mit can_delete_orders Permission
    (
      (SELECT role FROM public.users WHERE id = auth.uid()) = 'co-admin'
      AND
      (
        SELECT (co_admin_permissions->>'can_delete_orders')::boolean
        FROM public.users
        WHERE id = auth.uid()
      ) = true
    )
  )
);

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste Order-Deletion mit Co-Admin erneut
-- ============================================================================

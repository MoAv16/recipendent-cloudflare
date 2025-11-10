-- ============================================================================
-- RECIPENDENT APP - RLS POLICIES FÜR ORDERS TABELLE
-- ============================================================================
-- Problem: Employees können Orders nicht updaten/Status ändern/Kommentare schreiben
-- Lösung: RLS Policies erstellen, die role-based access ermöglichen
-- ============================================================================

-- Datum: 05.11.2025

-- 1. Aktiviere RLS falls noch nicht aktiviert
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 2. Lösche ALLE existierenden Policies (um Konflikte zu vermeiden)
DROP POLICY IF EXISTS "Users can view company orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own company orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Employees can update assigned orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for company members" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.orders;
DROP POLICY IF EXISTS "Enable update for order owners" ON public.orders;

-- ============================================================================
-- SELECT POLICY - Alle Company-Mitglieder können Orders ihrer Company sehen
-- ============================================================================
CREATE POLICY "Users can view own company orders"
ON public.orders FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
);

-- ============================================================================
-- INSERT POLICY - Alle authentifizierten User können Orders erstellen
-- ============================================================================
CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
  AND author_id = auth.uid()
);

-- ============================================================================
-- UPDATE POLICY 1 - Admins und Co-Admins können alle Orders updaten
-- ============================================================================
CREATE POLICY "Admins can update all company orders"
ON public.orders FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'co-admin')
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'co-admin')
  )
);

-- ============================================================================
-- UPDATE POLICY 2 - Employees können assigned Orders updaten (wenn erlaubt)
-- ============================================================================
CREATE POLICY "Employees can update assigned orders if allowed"
ON public.orders FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
  AND (
    -- Employee ist zugewiesen UND editable_by_assigned ist true
    (
      auth.uid() = ANY(assigned_to)
      AND editable_by_assigned = true
    )
    -- ODER Employee ist der Autor
    OR author_id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid()
  )
  AND (
    (
      auth.uid() = ANY(assigned_to)
      AND editable_by_assigned = true
    )
    OR author_id = auth.uid()
  )
);

-- ============================================================================
-- DELETE POLICY - Nur Admins können Orders löschen
-- ============================================================================
CREATE POLICY "Admins can delete orders"
ON public.orders FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ============================================================================
-- ZUSÄTZLICH: Indizes für Performance
-- ============================================================================

-- Index auf company_id für schnelle Company-Lookups
CREATE INDEX IF NOT EXISTS idx_orders_company_id ON public.orders(company_id);

-- Index auf status für Filterung
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Index auf folder_id für Folder-Ansichten
CREATE INDEX IF NOT EXISTS idx_orders_folder_id ON public.orders(folder_id);

-- Index auf author_id für Author-Queries
CREATE INDEX IF NOT EXISTS idx_orders_author_id ON public.orders(author_id);

-- Index auf assigned_to für Assignment-Queries (GIN Index für Arrays)
CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON public.orders USING GIN(assigned_to);

-- Index auf priority für Sortierung
CREATE INDEX IF NOT EXISTS idx_orders_priority ON public.orders(priority);

-- Index auf created_at für chronologische Sortierung
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Composite Index für häufige Query-Patterns
CREATE INDEX IF NOT EXISTS idx_orders_company_status ON public.orders(company_id, status);

-- ============================================================================
-- TEST-QUERIES (auskommentiert)
-- ============================================================================

-- Als Employee (assigned und editable_by_assigned = true)
-- SET LOCAL role TO authenticated;
-- SET LOCAL request.jwt.claims TO '{"sub": "employee-user-id", "role": "authenticated"}';
--
-- SELECT * FROM public.orders WHERE company_id = 'company-id';
--
-- UPDATE public.orders
-- SET status = 'done'
-- WHERE id = 'order-id' AND 'employee-user-id' = ANY(assigned_to);
--
-- UPDATE public.orders
-- SET notes = jsonb_set(notes, '{-1}', '{"id": "123", "text": "Test", "author_id": "employee-user-id"}')
-- WHERE id = 'order-id';

-- Als Admin
-- SET LOCAL request.jwt.claims TO '{"sub": "admin-user-id", "role": "authenticated"}';
--
-- UPDATE public.orders
-- SET status = 'done'
-- WHERE id = 'order-id';
--
-- DELETE FROM public.orders WHERE id = 'order-id';

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste Order-Updates und Kommentare erneut
-- ============================================================================
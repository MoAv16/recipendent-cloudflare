-- ============================================================================
-- RECIPENDENT APP - FIX LOGO DISPLAY DEFAULTS
-- ============================================================================
-- Problem: show_logo_in_dashboard ist NULL oder TRUE bei neuen Companies
-- Lösung: Default auf FALSE setzen und existierende NULL-Werte aktualisieren
-- ============================================================================

-- Datum: 07.11.2025

-- 1. Setze DEFAULT für neue Einträge
ALTER TABLE public.companies
  ALTER COLUMN show_logo_in_dashboard SET DEFAULT false;

-- 2. Update existierende NULL-Werte auf FALSE
UPDATE public.companies
SET show_logo_in_dashboard = false
WHERE show_logo_in_dashboard IS NULL;

-- 3. Optional: Setze NOT NULL Constraint (falls gewünscht)
-- ALTER TABLE public.companies
--   ALTER COLUMN show_logo_in_dashboard SET NOT NULL;

-- ============================================================================
-- VERIFICATION QUERY (auskommentiert)
-- ============================================================================

-- SELECT id, name, show_logo_in_dashboard, logo
-- FROM public.companies;

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste Logo Display Toggle erneut
-- ============================================================================

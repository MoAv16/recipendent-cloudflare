-- ============================================================================
-- RECIPENDENT APP - ADD LOGO BRANDING TOGGLE
-- ============================================================================
-- Feature: Admin kann Logo-Farbe als App Primary Color aktivieren
-- Neue Column: use_logo_branding in companies Tabelle
-- Default: FALSE (App startet mit Standard-Farbe #6326ad)
-- ============================================================================

-- Datum: 08.11.2025

-- ============================================================================
-- 1. ADD COLUMN: use_logo_branding
-- ============================================================================

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS use_logo_branding BOOLEAN DEFAULT false;

-- ============================================================================
-- 2. SET DEFAULT für existierende Rows (falls Column schon existiert)
-- ============================================================================

UPDATE public.companies
SET use_logo_branding = false
WHERE use_logo_branding IS NULL;

-- ============================================================================
-- 3. COMMENT für Dokumentation
-- ============================================================================

COMMENT ON COLUMN public.companies.use_logo_branding IS
  'Admin-Einstellung: Logo-Farbe (dominant_color) als App Primary Color verwenden. Default: false (App nutzt Standard-Farbe #6326ad)';

-- ============================================================================
-- VERIFICATION QUERY (auskommentiert)
-- ============================================================================

-- SELECT
--   id,
--   name,
--   dominant_color,
--   use_logo_branding,
--   logo
-- FROM public.companies;

-- ============================================================================
-- WICHTIG: Diese SQL-Datei in Supabase SQL Editor ausführen!
-- ============================================================================
-- 1. Öffne Supabase Dashboard
-- 2. Gehe zu "SQL Editor"
-- 3. Kopiere den gesamten Inhalt dieser Datei
-- 4. Führe das SQL aus
-- 5. Teste Branding Toggle in Admin Settings
-- ============================================================================

-- ============================================================================
-- ROLLBACK (falls nötig)
-- ============================================================================

-- ALTER TABLE public.companies DROP COLUMN IF EXISTS use_logo_branding;

-- ============================================================================

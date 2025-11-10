-- ============================================================================
-- DROP UNUSED custom_theme_color COLUMN
-- ============================================================================
-- Das neue Farb-System verwendet use_logo_branding (Toggle) + dominant_color (Logo-Farbe)
-- custom_theme_color war Teil des alten Systems und wird nicht mehr benötigt

ALTER TABLE public.users
  DROP COLUMN IF EXISTS custom_theme_color;

-- Migration ist NICHT destructive, da die Column nicht mehr verwendet wird
-- Alte Daten gehen verloren, aber das ist okay, da das Feature durch das neue System ersetzt wurde

COMMENT ON TABLE public.users IS
  'App users - custom_theme_color removed in favor of use_logo_branding system';

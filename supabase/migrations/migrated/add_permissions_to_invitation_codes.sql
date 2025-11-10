-- ============================================================================
-- MIGRATION: Add co_admin_permissions field to invitation_codes
-- ============================================================================
-- Date: 2025-11-09
-- Description: Adds jsonb field to store co-admin permissions in invitation codes
--              These permissions will be applied when the co-admin registers
-- ============================================================================

-- Add permissions column to invitation_codes table
ALTER TABLE public.invitation_codes
ADD COLUMN co_admin_permissions jsonb DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.invitation_codes.co_admin_permissions IS
'JSONB object containing co-admin permissions to be applied on registration. Example:
{
  "can_remove_employees": true,
  "can_delete_comments": true,
  "can_create_recipes": true,
  "can_edit_orders": true,
  "can_manage_folders": true,
  "can_invite_employees": false,
  "can_edit_company_settings": false
}';

-- Create index for faster queries
CREATE INDEX idx_invitation_codes_permissions ON public.invitation_codes USING GIN (co_admin_permissions);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify the migration:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'invitation_codes' AND column_name = 'co_admin_permissions';

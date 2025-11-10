-- ============================================================================
-- CASCADE DELETE MIGRATION
-- ============================================================================
-- Aktiviert automatisches Löschen von abhängigen Daten bei Company/User Delete
--
-- Hierarchie:
-- Company gelöscht → users, orders, folders, invitation_codes, co_admin_permissions
-- User gelöscht → orders (author), invitation_codes, co_admin_permissions
-- Folder gelöscht → orders.folder_id wird NULL gesetzt
--
-- Stand: 09.11.2025
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. USERS TABLE - CASCADE bei Company Delete
-- ============================================================================

-- Drop existing constraint
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_company_id_fkey;

-- Add CASCADE constraint
ALTER TABLE public.users
ADD CONSTRAINT users_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.companies(id)
ON DELETE CASCADE;

COMMENT ON CONSTRAINT users_company_id_fkey ON public.users IS
'When company is deleted, all users are deleted';

-- ============================================================================
-- 2. FOLDERS TABLE - CASCADE bei Company Delete
-- ============================================================================

ALTER TABLE public.folders
DROP CONSTRAINT IF EXISTS folders_company_id_fkey;

ALTER TABLE public.folders
ADD CONSTRAINT folders_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.companies(id)
ON DELETE CASCADE;

COMMENT ON CONSTRAINT folders_company_id_fkey ON public.folders IS
'When company is deleted, all folders are deleted';

-- ============================================================================
-- 3. INVITATION_CODES TABLE - CASCADE bei Company/User Delete
-- ============================================================================

-- Company FK
ALTER TABLE public.invitation_codes
DROP CONSTRAINT IF EXISTS invitation_codes_company_id_fkey;

ALTER TABLE public.invitation_codes
ADD CONSTRAINT invitation_codes_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.companies(id)
ON DELETE CASCADE;

-- User FK (sent_by) - CASCADE
ALTER TABLE public.invitation_codes
DROP CONSTRAINT IF EXISTS invitation_codes_sent_by_fkey;

ALTER TABLE public.invitation_codes
ADD CONSTRAINT invitation_codes_sent_by_fkey
FOREIGN KEY (sent_by)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- User FK (used_by) - SET NULL (Code bleibt, aber User-Referenz wird gelöscht)
ALTER TABLE public.invitation_codes
DROP CONSTRAINT IF EXISTS invitation_codes_used_by_fkey;

ALTER TABLE public.invitation_codes
ADD CONSTRAINT invitation_codes_used_by_fkey
FOREIGN KEY (used_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

COMMENT ON CONSTRAINT invitation_codes_company_id_fkey ON public.invitation_codes IS
'When company is deleted, all invitation codes are deleted';

-- ============================================================================
-- 4. CO_ADMIN_PERMISSIONS TABLE - CASCADE bei User/Company Delete
-- ============================================================================

-- User FK
ALTER TABLE public.co_admin_permissions
DROP CONSTRAINT IF EXISTS co_admin_permissions_user_id_fkey;

ALTER TABLE public.co_admin_permissions
ADD CONSTRAINT co_admin_permissions_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- Company FK
ALTER TABLE public.co_admin_permissions
DROP CONSTRAINT IF EXISTS co_admin_permissions_company_id_fkey;

ALTER TABLE public.co_admin_permissions
ADD CONSTRAINT co_admin_permissions_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.companies(id)
ON DELETE CASCADE;

COMMENT ON CONSTRAINT co_admin_permissions_user_id_fkey ON public.co_admin_permissions IS
'When user is deleted, their permissions are deleted';

-- ============================================================================
-- 5. ORDERS TABLE - CASCADE/SET NULL
-- ============================================================================

-- Company FK - CASCADE
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_company_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_company_id_fkey
FOREIGN KEY (company_id)
REFERENCES public.companies(id)
ON DELETE CASCADE;

-- Author FK - CASCADE (Order wird gelöscht wenn Author gelöscht wird)
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_author_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- Folder FK - SET NULL (Order bleibt, Folder-Referenz wird NULL)
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_folder_id_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_folder_id_fkey
FOREIGN KEY (folder_id)
REFERENCES public.folders(id)
ON DELETE SET NULL;

-- Status Changed By FK - SET NULL (Order bleibt, User-Referenz wird NULL)
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_status_changed_by_fkey;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_changed_by_fkey
FOREIGN KEY (status_changed_by)
REFERENCES public.users(id)
ON DELETE SET NULL;

COMMENT ON CONSTRAINT orders_company_id_fkey ON public.orders IS
'When company is deleted, all orders are deleted';

COMMENT ON CONSTRAINT orders_folder_id_fkey ON public.orders IS
'When folder is deleted, folder_id in orders is set to NULL';

-- ============================================================================
-- 6. CREATE FUNCTION TO DELETE AUTH.USERS WHEN PUBLIC.USERS IS DELETED
-- ============================================================================

-- Function: Automatically delete auth.users when public.users is deleted
CREATE OR REPLACE FUNCTION delete_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Execute function after delete on public.users
DROP TRIGGER IF EXISTS on_user_deleted ON public.users;

CREATE TRIGGER on_user_deleted
AFTER DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION delete_auth_user();

COMMENT ON FUNCTION delete_auth_user() IS
'Automatically deletes auth.users when public.users is deleted';

COMMIT;

-- ============================================================================
-- USAGE EXAMPLE
-- ============================================================================
-- DELETE FROM public.companies WHERE id = 'company-uuid';
-- → Deletes:
--   - All users in that company
--   - All auth.users for those users (via trigger)
--   - All orders in that company
--   - All folders in that company
--   - All invitation_codes for that company
--   - All co_admin_permissions for users in that company
--   - Storage files are NOT automatically deleted (manual cleanup required)
-- ============================================================================

import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { supabase } from '../../../config/supabase';

/**
 * Hook to check permissions for Co-Admins
 * Admins always have all permissions
 * Employees have no admin permissions
 */
export const usePermissions = () => {
  const { userData, isAuthenticated } = useAuth();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions', userData?.id],
    queryFn: async () => {
      if (!userData || userData.role !== 'co-admin') {
        return null;
      }

      const { data, error } = await supabase
        .from('co_admin_permissions')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned
        throw error;
      }

      return data;
    },
    enabled: isAuthenticated && userData?.role === 'co-admin',
  });

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission name (e.g., 'can_edit_orders')
   * @returns {boolean}
   */
  const can = (permission) => {
    if (!userData) return false;

    // Admins can do everything
    if (userData.role === 'admin') return true;

    // Employees have no admin permissions
    if (userData.role === 'employee') return false;

    // Co-Admins check permissions table
    return permissions?.[permission] || false;
  };

  return {
    isAdmin: userData?.role === 'admin',
    isCoAdmin: userData?.role === 'co-admin',
    isEmployee: userData?.role === 'employee',
    can,
    loading: isLoading,
    permissions,
  };
};

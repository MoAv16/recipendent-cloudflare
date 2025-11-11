import { supabase } from '../../../config/supabase';

/**
 * Get all team members for the current user's company
 */
export const getTeamMembers = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', userData.company_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

/**
 * Generate a random 6-character invitation code
 */
const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate an invitation code for a new team member
 */
export const generateInvitationCode = async (email, role, permissions = null) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userData } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', user.id)
      .single();

    const code = generateRandomCode();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const { data, error } = await supabase
      .from('invitation_codes')
      .insert({
        code,
        company_id: userData.company_id,
        email,
        role,
        expires_at: expiresAt.toISOString(),
        sent_by: user.id,
        co_admin_permissions: permissions,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating invitation code:', error);
    throw error;
  }
};

/**
 * Send invitation email via Supabase Edge Function
 */
export const sendInvitationEmail = async (email, code, role, companyName) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-invitation-email', {
      body: { email, code, role, companyName },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Delete a user (Admin only)
 */
export const deleteUser = async (userId) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

/**
 * Get co-admin permissions for a user
 */
export const getCoAdminPermissions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('co_admin_permissions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching co-admin permissions:', error);
    throw error;
  }
};

/**
 * Update co-admin permissions
 */
export const updateCoAdminPermissions = async (userId, permissions) => {
  try {
    // Check if permissions already exist
    const existing = await getCoAdminPermissions(userId);

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('co_admin_permissions')
        .update(permissions)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('co_admin_permissions')
        .insert({
          user_id: userId,
          ...permissions,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating co-admin permissions:', error);
    throw error;
  }
};

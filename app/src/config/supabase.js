import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper functions
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  return user;
};

export const getCurrentUserData = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*, company:companies(*)')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

export const getCurrentUserRole = async () => {
  const userData = await getCurrentUserData();
  return userData?.role || null;
};

export const getCurrentCompanyId = async () => {
  const userData = await getCurrentUserData();
  return userData?.company_id || null;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Debug helper
export const debugAuthStatus = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = await getCurrentUser();
    const userData = await getCurrentUserData();
    const role = await getCurrentUserRole();
    const companyId = await getCurrentCompanyId();

    console.log('=== Supabase Auth Status ===');
    console.log('Session:', session);
    console.log('User:', user);
    console.log('User Data:', userData);
    console.log('Role:', role);
    console.log('Company ID:', companyId);
    console.log('===========================');
  } catch (error) {
    console.error('Auth Debug Error:', error);
  }
};

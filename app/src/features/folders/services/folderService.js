import { supabase } from '../../../config/supabase';

/**
 * Get all folders for the current user's company
 */
export const getFolders = async () => {
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
      .from('folders')
      .select('*')
      .eq('company_id', userData.company_id)
      .order('name');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

/**
 * Create a new folder
 */
export const createFolder = async (folderData) => {
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
      .from('folders')
      .insert({
        ...folderData,
        company_id: userData.company_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating folder:', error);
    throw error;
  }
};

/**
 * Update a folder
 */
export const updateFolder = async (folderId, updates) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .update(updates)
      .eq('id', folderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating folder:', error);
    throw error;
  }
};

/**
 * Delete a folder
 */
export const deleteFolder = async (folderId) => {
  try {
    const { error } = await supabase.from('folders').delete().eq('id', folderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
};

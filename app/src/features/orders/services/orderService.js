import { supabase } from '../../../config/supabase';

/**
 * Fetch all orders for the current user's company
 * Employees only see orders assigned to them
 */
export const getOrders = async (status = null) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color)
      `
      )
      .eq('company_id', userData.company_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Employees only see orders assigned to them
    if (userData.role === 'employee') {
      query = query.contains('assigned_to', [user.id]);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Fetch a single order by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color)
      `
      )
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
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
      .from('orders')
      .insert({
        ...orderData,
        company_id: userData.company_id,
        author_id: user.id,
      })
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color)
      `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (orderId, updates) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color)
      `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (orderId) => {
  try {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

/**
 * Get assigned users for an order
 */
export const getAssignedUsers = async (userIds) => {
  try {
    if (!userIds || userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, profile_picture')
      .in('id', userIds);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    throw error;
  }
};

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

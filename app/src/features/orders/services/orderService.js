import { supabase } from '../../../config/supabase';
import { getCurrentUser, getCurrentUserData, getCurrentCompanyId } from '../../../config/supabase';

/**
 * Fetch all orders for the current user's company
 * Employees only see orders assigned to them
 * @param {string} status - Optional: 'open', 'done', or null (all)
 * @param {string} folderId - Optional: Filter by folder ID
 */
export const getOrders = async (status = null, folderId = undefined) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const userData = await getCurrentUserData();
    if (!userData) throw new Error('User data not found');

    let query = supabase
      .from('orders')
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color, icon)
      `
      )
      .eq('company_id', userData.company_id)
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by folder if provided (undefined means no filter, null means "no folder")
    if (folderId !== undefined && folderId !== null) {
      query = query.eq('folder_id', folderId);
    }

    // Employees only see orders assigned to them
    if (userData.role === 'employee') {
      query = query.contains('assigned_to', [user.id]);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Load assigned users for each order
    const ordersWithUsers = await Promise.all(
      (data || []).map(async (order) => {
        if (order.assigned_to && order.assigned_to.length > 0) {
          const assignedUsers = await getAssignedUsers(order.assigned_to);
          return { ...order, assignedUsers };
        }
        return { ...order, assignedUsers: [] };
      })
    );

    return ordersWithUsers;
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
        folder:folders(id, name, color, icon),
        status_changed_by_user:users!status_changed_by(id, first_name, last_name)
      `
      )
      .eq('id', orderId)
      .single();

    if (error) throw error;

    // Load assigned users
    if (data && data.assigned_to && data.assigned_to.length > 0) {
      const assignedUsers = await getAssignedUsers(data.assigned_to);
      return { ...data, assignedUsers };
    }

    return { ...data, assignedUsers: [] };
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
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const userData = await getCurrentUserData();
    if (!userData) throw new Error('User data not found');

    // Ensure author_name is set (NOT NULL constraint)
    const authorName = userData.first_name && userData.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData.email || 'Unknown';

    const { data, error } = await supabase
      .from('orders')
      .insert({
        company_id: userData.company_id,
        author_id: user.id,
        author_name: authorName,
        title: orderData.title,
        description: orderData.description || '',
        additional_text: orderData.additional_text || null,
        customer_name: orderData.customer_name || null,
        category: orderData.category || null,
        location: orderData.location || null,
        image_url: orderData.image_url || null,
        folder_id: orderData.folder_id || null,
        priority: orderData.priority || null,
        due_date: orderData.due_date || null,
        critical_timer: orderData.critical_timer || 2,
        status: orderData.status || 'open',
        assigned_to: orderData.assigned_to || [],
        editable_by_assigned: orderData.editable_by_assigned || false,
        notes: [],
      })
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color, icon)
      `
      )
      .single();

    if (error) throw error;

    // Load assigned users
    if (data && data.assigned_to && data.assigned_to.length > 0) {
      const assignedUsers = await getAssignedUsers(data.assigned_to);
      return { ...data, assignedUsers };
    }

    return { ...data, assignedUsers: [] };
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
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .update(updatesWithTimestamp)
      .eq('id', orderId)
      .select(
        `
        *,
        author:users!author_id(id, first_name, last_name, profile_picture),
        folder:folders(id, name, color, icon),
        status_changed_by_user:users!status_changed_by(id, first_name, last_name)
      `
      )
      .single();

    if (error) throw error;

    // Load assigned users
    if (data && data.assigned_to && data.assigned_to.length > 0) {
      const assignedUsers = await getAssignedUsers(data.assigned_to);
      return { ...data, assignedUsers };
    }

    return { ...data, assignedUsers: [] };
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Update order status with tracking and notes
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const user = await getCurrentUser();
    const userData = await getCurrentUserData();

    if (!user || !userData) throw new Error('Not authenticated');

    // Get current order to create status change note
    const order = await getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const authorName = userData.first_name && userData.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData.email || 'Unknown';

    // Status labels
    const getStatusLabel = (status) => {
      const labels = { open: 'Offen', done: 'Erledigt', archived: 'Archiviert' };
      return labels[status] || status;
    };

    // Create status change note
    const statusChangeNote = {
      id: `note_${Date.now()}`,
      type: 'status_change',
      text: `Status geändert: ${getStatusLabel(order.status)} → ${getStatusLabel(newStatus)}`,
      author: authorName,
      author_id: user.id,
      timestamp: new Date().toISOString(),
      old_status: order.status,
      new_status: newStatus,
    };

    // Add note to existing notes
    const updatedNotes = [...(order.notes || []), statusChangeNote];

    // Update order
    return await updateOrder(orderId, {
      status: newStatus,
      status_changed_by: user.id,
      status_changed_at: new Date().toISOString(),
      notes: updatedNotes,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
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
 * Add comment to order
 */
export const addCommentToOrder = async (orderId, commentText) => {
  try {
    const user = await getCurrentUser();
    const userData = await getCurrentUserData();

    if (!user || !userData) throw new Error('Not authenticated');

    // Get current order
    const order = await getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    const authorName = userData.first_name && userData.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData.email || 'Unknown';

    // Create comment
    const newComment = {
      id: `note_${Date.now()}`,
      type: 'comment',
      text: commentText.trim(),
      author: authorName,
      author_id: user.id,
      timestamp: new Date().toISOString(),
    };

    // Add to notes
    const updatedNotes = [...(order.notes || []), newComment];

    return await updateOrder(orderId, { notes: updatedNotes });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Delete comment from order
 */
export const deleteComment = async (orderId, commentId) => {
  try {
    // Get current order
    const order = await getOrderById(orderId);
    if (!order) throw new Error('Order not found');

    // Remove comment from notes
    const updatedNotes = (order.notes || []).filter((note) => note.id !== commentId);

    return await updateOrder(orderId, { notes: updatedNotes });
  } catch (error) {
    console.error('Error deleting comment:', error);
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
      .select('id, first_name, last_name, profile_picture, email')
      .in('id', userIds);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    return [];
  }
};

/**
 * Get all users for the current company
 */
export const getCompanyUsers = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const userData = await getCurrentUserData();
    if (!userData) throw new Error('User data not found');

    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, profile_picture, email, role')
      .eq('company_id', userData.company_id)
      .order('first_name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching company users:', error);
    throw error;
  }
};

/**
 * Get all folders for the current user's company
 */
export const getFolders = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Not authenticated');

    const userData = await getCurrentUserData();
    if (!userData) throw new Error('User data not found');

    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('company_id', userData.company_id)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error;
  }
};

import { supabase } from '../../../config/supabase';

// Ticket Categories
export const TICKET_CATEGORIES = {
  GENERAL_QUESTIONS: 'general_questions',
  APP_PROBLEMS: 'app_problems',
  FEATURE_REQUEST: 'feature_request',
  BUG_REPORT: 'bug_report',
  OTHER: 'other',
};

// Category Labels (German)
export const CATEGORY_LABELS = {
  [TICKET_CATEGORIES.GENERAL_QUESTIONS]: 'Allgemeine Fragen',
  [TICKET_CATEGORIES.APP_PROBLEMS]: 'Probleme mit der App',
  [TICKET_CATEGORIES.FEATURE_REQUEST]: 'Feature-Anfrage',
  [TICKET_CATEGORIES.BUG_REPORT]: 'Bug-Report',
  [TICKET_CATEGORIES.OTHER]: 'Sonstiges',
};

/**
 * Validates ticket message
 * @param {string} message - Ticket message
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateTicketMessage = (message) => {
  if (!message || message.trim().length === 0) {
    return { valid: false, error: 'Nachricht darf nicht leer sein' };
  }

  if (message.length > 500) {
    return { valid: false, error: 'Nachricht darf maximal 500 Zeichen lang sein' };
  }

  return { valid: true, error: null };
};

/**
 * Validates ticket category
 * @param {string} category - Ticket category
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateTicketCategory = (category) => {
  const validCategories = Object.values(TICKET_CATEGORIES);

  if (!category || !validCategories.includes(category)) {
    return { valid: false, error: 'Ungültige Kategorie ausgewählt' };
  }

  return { valid: true, error: null };
};

/**
 * Creates a new support ticket
 * @param {Object} ticketData - { category, message, userId, companyId, userName, userEmail }
 * @returns {Promise<Object>} - { data, error }
 */
export const createSupportTicket = async ({
  category,
  message,
  userId,
  companyId,
  userName,
  userEmail,
}) => {
  try {
    // Validate category
    const categoryValidation = validateTicketCategory(category);
    if (!categoryValidation.valid) {
      return { data: null, error: { message: categoryValidation.error } };
    }

    // Validate message
    const messageValidation = validateTicketMessage(message);
    if (!messageValidation.valid) {
      return { data: null, error: { message: messageValidation.error } };
    }

    // Create ticket
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        category,
        message: message.trim(),
        user_id: userId,
        company_id: companyId,
        user_name: userName,
        user_email: userEmail,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating support ticket:', error);
      return { data: null, error };
    }

    console.log('Support ticket created successfully:', data.id);
    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createSupportTicket:', error);
    return { data: null, error };
  }
};

/**
 * Gets all tickets for the current user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - { data, error }
 */
export const getUserTickets = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user tickets:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserTickets:', error);
    return { data: null, error };
  }
};

/**
 * Gets all tickets for the company (Admin only)
 * @param {string} companyId - Company ID
 * @returns {Promise<Object>} - { data, error }
 */
export const getCompanyTickets = async (companyId) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching company tickets:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getCompanyTickets:', error);
    return { data: null, error };
  }
};

/**
 * Updates ticket status (User can only update their own tickets)
 * @param {string} ticketId - Ticket ID
 * @param {string} status - New status ('open', 'in_progress', 'resolved', 'closed')
 * @returns {Promise<Object>} - { data, error }
 */
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

    if (!validStatuses.includes(status)) {
      return { data: null, error: { message: 'Ungültiger Status' } };
    }

    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket status:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateTicketStatus:', error);
    return { data: null, error };
  }
};

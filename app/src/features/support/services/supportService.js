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

// Category Icons (using Unicode symbols for web)
export const CATEGORY_ICONS = {
  [TICKET_CATEGORIES.GENERAL_QUESTIONS]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [TICKET_CATEGORIES.APP_PROBLEMS]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  [TICKET_CATEGORIES.FEATURE_REQUEST]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  [TICKET_CATEGORIES.BUG_REPORT]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  [TICKET_CATEGORIES.OTHER]: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  ),
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

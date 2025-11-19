import { useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useToast } from '../../../shared/hooks/useToast';
import {
  TICKET_CATEGORIES,
  CATEGORY_LABELS,
  createSupportTicket,
  validateTicketMessage,
} from '../services/supportService';

// Category Icons
const CATEGORY_ICONS = {
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

export default function SupportTicketForm() {
  const { user, company } = useAuth();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const maxLength = 500;
  const remainingChars = maxLength - message.length;

  // Character counter color
  const getCounterColor = () => {
    if (remainingChars > 50) return 'text-gray-500';
    if (remainingChars > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate category
    if (!selectedCategory) {
      showToast({ message: 'Bitte wähle eine Kategorie aus', type: 'error' });
      return;
    }

    // Validate message
    const messageValidation = validateTicketMessage(message);
    if (!messageValidation.valid) {
      showToast({ message: messageValidation.error, type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await createSupportTicket({
        category: selectedCategory,
        message,
        userId: user.id,
        companyId: company.id,
        userName: `${user.first_name} ${user.last_name}`,
        userEmail: user.email,
      });

      if (error) {
        showToast({
          message: error.message || 'Fehler beim Erstellen des Tickets',
          type: 'error',
        });
        return;
      }

      showToast({
        message: 'Ticket erfolgreich erstellt! Wir melden uns bald bei dir.',
        type: 'success',
      });

      // Reset form
      setSelectedCategory('');
      setMessage('');
      setShowCategoryDropdown(false);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      showToast({
        message: 'Ein unerwarteter Fehler ist aufgetreten',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Problemcenter</h3>
            <p className="text-sm text-blue-800">
              Hast du Fragen oder Probleme mit der App? Schreibe uns hier eine Nachricht
              und wir melden uns schnellstmöglich bei dir. Alle Support-Anfragen werden
              persönlich bearbeitet.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorie *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-colors ${
                selectedCategory
                  ? 'border-primary bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedCategory ? (
                  <>
                    <span className="text-primary">
                      {CATEGORY_ICONS[selectedCategory]}
                    </span>
                    <span className="font-medium">
                      {CATEGORY_LABELS[selectedCategory]}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500">Kategorie auswählen</span>
                )}
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${
                  showCategoryDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {Object.entries(TICKET_CATEGORIES).map(([key, value]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(value);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      selectedCategory === value
                        ? 'bg-primary-50 text-primary-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={
                        selectedCategory === value ? 'text-primary' : 'text-gray-600'
                      }
                    >
                      {CATEGORY_ICONS[value]}
                    </span>
                    <span className="font-medium">{CATEGORY_LABELS[value]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nachricht *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={maxLength}
            rows={6}
            placeholder="Beschreibe dein Problem oder deine Frage..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500">
              Deine E-Mail: <span className="font-medium">{user.email}</span>
            </p>
            <p className={`text-sm font-medium ${getCounterColor()}`}>
              {remainingChars} / {maxLength} Zeichen
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !selectedCategory || message.trim().length === 0}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
            isSubmitting || !selectedCategory || message.trim().length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Wird gesendet...
            </span>
          ) : (
            'Ticket erstellen'
          )}
        </button>
      </form>
    </div>
  );
}

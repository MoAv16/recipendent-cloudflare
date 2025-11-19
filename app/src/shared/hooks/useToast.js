/**
 * Simple Toast Hook
 * For now, uses browser's native alert for error messages
 * and console.log for success messages.
 *
 * TODO: Replace with a proper toast notification library like react-hot-toast
 */

export const useToast = () => {
  const showToast = ({ message, type = 'info' }) => {
    if (type === 'error') {
      alert(`❌ ${message}`);
    } else if (type === 'success') {
      alert(`✅ ${message}`);
    } else {
      alert(`ℹ️ ${message}`);
    }

    console.log(`[Toast ${type}]:`, message);
  };

  return { showToast };
};

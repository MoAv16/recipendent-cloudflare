import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../config/supabase';
import { ROUTES } from '../../../config/constants';

export default function SecuritySettings() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOutAllDevices = async () => {
    if (confirm('Möchtest du dich wirklich von allen Geräten abmelden?')) {
      await supabase.auth.signOut({ scope: 'global' });
      navigate(ROUTES.LOGIN);
    }
  };

  const handleDeleteAccount = async () => {
    if (showDeleteConfirm) {
      // TODO: Implement account deletion via Edge Function
      alert('Account-Löschung wird in einem zukünftigen Update implementiert.');
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Passwort ändern</h3>
        <p className="text-sm text-gray-600 mb-4">
          Du kannst dein Passwort über die Passwort-vergessen-Funktion auf der Login-Seite
          zurücksetzen.
        </p>
        <button
          onClick={() => navigate(ROUTES.LOGIN)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Zur Login-Seite
        </button>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aktive Sitzungen</h3>
        <p className="text-sm text-gray-600 mb-4">
          Melde dich von allen Geräten ab (außer diesem).
        </p>
        <button
          onClick={handleSignOutAllDevices}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          Von allen Geräten abmelden
        </button>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Gefahrenzone</h3>
        <p className="text-sm text-gray-600 mb-4">
          Diese Aktionen können nicht rückgängig gemacht werden. Bitte sei vorsichtig.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-2">Account löschen</h4>
          <p className="text-sm text-red-700 mb-4">
            Dein Account und alle zugehörigen Daten werden permanent gelöscht.
          </p>

          {showDeleteConfirm ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-900">
                Bist du sicher? Diese Aktion kann nicht rückgängig gemacht werden!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Ja, Account löschen
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Account löschen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateCoAdminPermissions, getCoAdminPermissions } from '../services/teamService';

const PERMISSION_GROUPS = {
  orders: {
    label: 'Aufträge',
    permissions: [
      { key: 'can_edit_orders', label: 'Aufträge bearbeiten' },
      { key: 'can_delete_orders', label: 'Aufträge löschen' },
      { key: 'can_create_orders', label: 'Aufträge erstellen' },
    ],
  },
  team: {
    label: 'Team',
    permissions: [
      { key: 'can_invite_members', label: 'Mitglieder einladen' },
      { key: 'can_remove_members', label: 'Mitglieder entfernen' },
      { key: 'can_edit_members', label: 'Mitglieder bearbeiten' },
    ],
  },
  folders: {
    label: 'Ordner',
    permissions: [
      { key: 'can_create_folders', label: 'Ordner erstellen' },
      { key: 'can_edit_folders', label: 'Ordner bearbeiten' },
      { key: 'can_delete_folders', label: 'Ordner löschen' },
    ],
  },
  recipes: {
    label: 'Rezepte',
    permissions: [
      { key: 'can_create_recipes', label: 'Rezepte erstellen' },
      { key: 'can_edit_recipes', label: 'Rezepte bearbeiten' },
      { key: 'can_delete_recipes', label: 'Rezepte löschen' },
    ],
  },
};

export default function PermissionsEditor({ userId, userName, onClose }) {
  const queryClient = useQueryClient();
  const [permissions, setPermissions] = useState({});

  const { data: existingPermissions } = useQuery({
    queryKey: ['permissions', userId],
    queryFn: () => getCoAdminPermissions(userId),
  });

  useEffect(() => {
    if (existingPermissions) {
      setPermissions(existingPermissions);
    } else {
      // Default: All false
      const defaultPerms = {};
      Object.values(PERMISSION_GROUPS).forEach((group) => {
        group.permissions.forEach((perm) => {
          defaultPerms[perm.key] = false;
        });
      });
      setPermissions(defaultPerms);
    }
  }, [existingPermissions]);

  const mutation = useMutation({
    mutationFn: (perms) => updateCoAdminPermissions(userId, perms),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions', userId] });
      queryClient.invalidateQueries({ queryKey: ['team'] });
      onClose();
    },
  });

  const handleToggle = (permKey) => {
    setPermissions((prev) => ({
      ...prev,
      [permKey]: !prev[permKey],
    }));
  };

  const handleSelectAll = (group) => {
    const newPerms = { ...permissions };
    const allSelected = group.permissions.every((perm) => newPerms[perm.key]);

    group.permissions.forEach((perm) => {
      newPerms[perm.key] = !allSelected;
    });

    setPermissions(newPerms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(permissions);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Berechtigungen bearbeiten
              </h3>
              <p className="text-sm text-gray-600 mt-1">{userName}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(PERMISSION_GROUPS).map(([groupKey, group]) => (
              <div key={groupKey} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{group.label}</h4>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(group)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {group.permissions.every((p) => permissions[p.key])
                      ? 'Alle abwählen'
                      : 'Alle auswählen'}
                  </button>
                </div>

                <div className="space-y-2">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={permissions[perm.key] || false}
                        onChange={() => handleToggle(perm.key)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-700">
                <strong>Hinweis:</strong> Admins haben automatisch alle Berechtigungen.
                Diese Einstellungen gelten nur für Co-Admins.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Wird gespeichert...' : 'Speichern'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeamMembers, generateInvitationCode } from '../services/teamService';
import { useAuth } from '../../auth/hooks/useAuth';
import InviteModal from './InviteModal';

const ROLE_LABELS = {
  admin: { label: 'Admin', color: 'bg-green-100 text-green-800' },
  'co-admin': { label: 'Co-Admin', color: 'bg-blue-100 text-blue-800' },
  employee: { label: 'Mitarbeiter', color: 'bg-gray-100 text-gray-800' },
};

export default function TeamList() {
  const { userData, isAdmin } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ['team'],
    queryFn: getTeamMembers,
  });

  const inviteMutation = useMutation({
    mutationFn: ({ email, role }) => generateInvitationCode(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] });
      setShowInviteModal(false);
    },
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Team-Mitglieder: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="mt-1 text-sm text-gray-600">
            Verwalte deine Team-Mitglieder und deren Berechtigungen
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Mitglied einladen
          </button>
        )}
      </div>

      {/* Team Members List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : teamMembers && teamMembers.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitglied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-Mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rolle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beigetreten
                </th>
                {isAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teamMembers.map((member) => {
                const roleInfo = ROLE_LABELS[member.role] || ROLE_LABELS.employee;
                return (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.first_name} {member.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.created_at).toLocaleDateString('de-DE')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {member.id !== userData?.id && (
                          <button className="text-blue-600 hover:text-blue-900">
                            Bearbeiten
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Keine Team-Mitglieder gefunden</p>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={inviteMutation.mutate}
          isLoading={inviteMutation.isPending}
          error={inviteMutation.error?.message}
        />
      )}
    </div>
  );
}

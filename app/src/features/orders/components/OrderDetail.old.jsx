import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrderById, updateOrder, deleteOrder } from '../services/orderService';
import { useAuth } from '../../auth/hooks/useAuth';
import { usePermissions } from '../../auth/hooks/usePermissions';
import { ROUTES } from '../../../config/constants';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PRIORITY_LABELS = {
  1: { label: 'Dringend', color: 'bg-red-100 text-red-800' },
  2: { label: 'Hoch', color: 'bg-orange-100 text-orange-800' },
  3: { label: 'Mittel', color: 'bg-yellow-100 text-yellow-800' },
  4: { label: 'Niedrig', color: 'bg-green-100 text-green-800' },
};

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userData } = useAuth();
  const { can, isAdmin, isCoAdmin } = usePermissions();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderById(orderId),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateOrder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(ROUTES.ORDERS);
    },
  });

  const handleMarkAsDone = () => {
    updateMutation.mutate({
      id: orderId,
      updates: { status: order.status === 'done' ? 'open' : 'done' },
    });
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteMutation.mutate(orderId);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const canEdit = () => {
    if (isAdmin || (isCoAdmin && can('can_edit_orders'))) return true;
    if (order?.editable_by_assigned && order?.assigned_to?.includes(userData?.id)) return true;
    return false;
  };

  const canDelete = () => {
    if (isAdmin) return true;
    if (isCoAdmin && can('can_delete_orders')) return true;
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden des Auftrags</p>
        <button
          onClick={() => navigate(ROUTES.ORDERS)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Zurück zu Aufträgen
        </button>
      </div>
    );
  }

  const priority = PRIORITY_LABELS[order.priority] || PRIORITY_LABELS[3];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.ORDERS)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{order.title}</h1>
            <p className="text-sm text-gray-600">
              Erstellt von {order.author?.first_name} {order.author?.last_name}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {canEdit() && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Abbrechen' : 'Bearbeiten'}
            </button>
          )}
          {canDelete() && (
            <button
              onClick={handleDelete}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showDeleteConfirm
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showDeleteConfirm ? 'Bestätigen' : 'Löschen'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status & Priority */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${priority.color}`}>
                  {priority.label}
                </span>
                {order.status === 'done' && (
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Abgeschlossen
                  </span>
                )}
              </div>
              <button
                onClick={handleMarkAsDone}
                disabled={!canEdit()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {order.status === 'done' ? 'Als Offen markieren' : 'Als Erledigt markieren'}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Details</h2>

            {order.customer && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kunde</label>
                <p className="text-gray-900">{order.customer}</p>
              </div>
            )}

            {order.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschreibung
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{order.description}</p>
              </div>
            )}

            {order.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standort</label>
                <p className="text-gray-900">📍 {order.location}</p>
              </div>
            )}

            {order.due_date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fälligkeitsdatum
                </label>
                <p className="text-gray-900">
                  {format(new Date(order.due_date), 'dd. MMMM yyyy', { locale: de })}
                </p>
              </div>
            )}

            {order.folder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ordner</label>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: order.folder.color || '#gray' }}
                  />
                  <span className="text-gray-900">{order.folder.name}</span>
                </div>
              </div>
            )}

            {order.image_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bild</label>
                <img
                  src={order.image_url}
                  alt="Order"
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notizen</h2>
            {order.notes && order.notes.length > 0 ? (
              <div className="space-y-3">
                {order.notes.map((note, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-600">{note.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(note.created_at), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Noch keine Notizen vorhanden</p>
            )}
          </div>
        </div>

        {/* Right Column - Meta Info */}
        <div className="space-y-6">
          {/* Assigned Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Zugewiesen an</h3>
            {order.assigned_to && order.assigned_to.length > 0 ? (
              <div className="space-y-2">
                {order.assigned_to.map((userId, index) => (
                  <div key={userId} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">Team-Mitglied {index + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Niemandem zugewiesen</p>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Informationen</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Erstellt:</span>
                <p className="text-gray-900">
                  {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Zuletzt bearbeitet:</span>
                <p className="text-gray-900">
                  {format(new Date(order.updated_at), 'dd.MM.yyyy HH:mm')}
                </p>
              </div>
              {order.editable_by_assigned && (
                <div className="pt-2 border-t">
                  <span className="text-xs text-green-600 font-medium">
                    ✓ Bearbeitbar durch zugewiesene Benutzer
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

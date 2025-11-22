import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrderById,
  updateOrderStatus,
  addCommentToOrder,
  deleteComment,
  deleteOrder,
} from '../services/orderService';
import { ROUTES } from '../../../config/constants';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PRIORITIES = {
  1: { label: 'Sehr wichtig', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
  2: { label: 'Wichtig', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
  3: { label: 'Neutral', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
  4: { label: 'Weniger wichtig', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
};

const STATUS_LABELS = {
  open: { label: 'Offen', color: 'bg-blue-100 text-blue-800' },
  done: { label: 'Erledigt', color: 'bg-green-100 text-green-800' },
  archived: { label: 'Archiviert', color: 'bg-gray-100 text-gray-800' },
};

export default function OrderDetailNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch order
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    refetchInterval: 5000, // Poll every 5s for updates (until realtime is implemented)
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (newStatus) => updateOrderStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: (text) => addCommentToOrder(id, text),
    onSuccess: () => {
      setCommentText('');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteComment(id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(ROUTES.ORDERS);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleStatusToggle = () => {
    const newStatus = order.status === 'open' ? 'done' : 'open';
    statusMutation.mutate(newStatus);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Kommentar wirklich löschen?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleDeleteOrder = () => {
    if (window.confirm(`Auftrag "${order.title}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      deleteMutation.mutate();
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Lade Auftrag...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Auftrag nicht gefunden</div>
      </div>
    );
  }

  const priorityConfig = PRIORITIES[order.priority] || PRIORITIES[2];
  const statusConfig = STATUS_LABELS[order.status] || STATUS_LABELS.open;

  const comments = (order.notes || []).filter((note) => note.type === 'comment');
  const statusChanges = (order.notes || []).filter((note) => note.type === 'status_change');

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(ROUTES.ORDERS)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{order.title}</h1>
            {order.category && (
              <p className="text-sm text-gray-500 mt-1">Kategorie: {order.category}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${ROUTES.ORDERS}/${id}/edit`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Bearbeiten
          </button>
          <button
            onClick={handleDeleteOrder}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Löschen
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Image */}
      {order.image_url && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src={order.image_url}
            alt={order.title}
            className="w-full h-96 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowImageModal(true)}
          />
        </div>
      )}

      {/* Status & Priority */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Status & Priorität</h2>
          <button
            onClick={handleStatusToggle}
            disabled={statusMutation.isPending}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              order.status === 'open'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } disabled:opacity-50`}
          >
            {order.status === 'open' ? 'Als erledigt markieren' : 'Als offen markieren'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Status</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>

          {order.priority && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Priorität</p>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${priorityConfig.color} flex items-center justify-center text-white text-xs font-bold`}>
                  P{order.priority}
                </div>
                <span className="text-sm font-medium">{priorityConfig.label}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>

        {order.description && (
          <div>
            <p className="text-sm text-gray-500">Beschreibung</p>
            <p className="text-gray-900 whitespace-pre-wrap">{order.description}</p>
          </div>
        )}

        {order.additional_text && (
          <div>
            <p className="text-sm text-gray-500">Notizen</p>
            <p className="text-gray-900 whitespace-pre-wrap">{order.additional_text}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {order.customer_name && (
            <div>
              <p className="text-sm text-gray-500">Kundenname</p>
              <p className="text-gray-900">{order.customer_name}</p>
            </div>
          )}

          {order.location && (
            <div>
              <p className="text-sm text-gray-500">Ort</p>
              <p className="text-gray-900">{order.location}</p>
            </div>
          )}

          {order.due_date && (
            <div>
              <p className="text-sm text-gray-500">Fälligkeitsdatum</p>
              <p className="text-gray-900">{formatDateTime(order.due_date)}</p>
            </div>
          )}

          {order.critical_timer !== null && (
            <div>
              <p className="text-sm text-gray-500">Kritischer Timer</p>
              <p className="text-gray-900">{order.critical_timer} Stunden vor Fälligkeit</p>
            </div>
          )}
        </div>

        {order.folder && (
          <div>
            <p className="text-sm text-gray-500">Ordner</p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: order.folder.color || '#6326ad' }}
              />
              <span className="text-gray-900">{order.folder.name}</span>
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Erstellt von</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
              {order.author?.first_name?.[0]}{order.author?.last_name?.[0]}
            </div>
            <div>
              <p className="text-gray-900 text-sm font-medium">
                {order.author?.first_name} {order.author?.last_name}
              </p>
              <p className="text-xs text-gray-500">{formatDateTime(order.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned Users */}
      {order.assignedUsers && order.assignedUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Zugewiesen an</h2>
          <div className="flex flex-wrap gap-3">
            {order.assignedUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            ))}
          </div>
          {order.editable_by_assigned && (
            <p className="text-sm text-gray-500 mt-3">
              ✓ Zugewiesene Mitarbeiter dürfen diesen Auftrag bearbeiten
            </p>
          )}
        </div>
      )}

      {/* Status History */}
      {statusChanges.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status-Verlauf</h2>
          <div className="space-y-3">
            {statusChanges.reverse().map((change) => (
              <div key={change.id} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
                <div className="flex-1">
                  <p className="text-gray-900">{change.text}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {change.author} • {formatDateTime(change.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Kommentare ({comments.length})
        </h2>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Kommentar hinzufügen..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!commentText.trim() || commentMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {commentMutation.isPending ? 'Wird gesendet...' : 'Kommentar hinzufügen'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Noch keine Kommentare</p>
          ) : (
            comments.reverse().map((comment) => (
              <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {formatDateTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                    title="Kommentar löschen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={order.image_url}
              alt={order.title}
              className="max-w-full max-h-screen object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

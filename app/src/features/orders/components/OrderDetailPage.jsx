import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrderById,
  updateOrderStatus,
  addCommentToOrder,
  deleteComment,
  deleteOrder,
} from '../services/orderService';
import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  // Fetch order
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (newStatus) => updateOrderStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (text) => addCommentToOrder(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setCommentText('');
    },
  });

  // Delete order mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteOrder(id),
    onSuccess: () => {
      navigate('/orders');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-10">
        <div className="bg-white rounded-2xl border-2 border-red-500 shadow-soft p-8">
          <h2 className="text-2xl font-albert-sans font-bold text-red-600 mb-4">
            Fehler
          </h2>
          <p className="text-gray-700 mb-6">
            {error?.message || 'Auftrag nicht gefunden'}
          </p>
          <Link
            to="/orders"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-cabin font-semibold"
          >
            ← Zurück zu Aufträgen
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = `ORD-${order.id?.substring(0, 8).toUpperCase()}` || 'ORD-XXXXXXXX';

  return (
    <div className="p-10">
      {/* Back Button */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-primary font-cabin font-semibold hover:underline mb-6"
      >
        ← Zurück zu Aufträgen
      </Link>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-primary shadow-soft p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-sm font-cabin font-semibold text-text-gray">
                Order number
              </span>
              <h1 className="text-3xl font-product-sans font-bold text-text-dark mt-1">
                {orderNumber}
              </h1>
              <h2 className="text-2xl font-product-sans font-bold text-text-dark mt-4">
                {order.title}
              </h2>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to={`/orders/${id}/edit`}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-purple-light transition-colors font-cabin font-semibold"
              >
                Bearbeiten
              </Link>
              <button
                onClick={() => {
                  if (confirm('Möchten Sie diesen Auftrag wirklich löschen?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="px-4 py-2 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-cabin font-semibold"
              >
                Löschen
              </button>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-cabin font-semibold text-text-gray">Status:</span>
            <select
              value={order.status}
              onChange={(e) => statusMutation.mutate(e.target.value)}
              className="px-4 py-2 border-2 border-border-inactive rounded-lg font-cabin focus:border-primary focus:outline-none"
            >
              <option value="open">Offen</option>
              <option value="done">Erledigt</option>
              <option value="archived">Archiviert</option>
            </select>
          </div>
        </div>

        {/* Order Image */}
        {order.image_url && (
          <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
            <h3 className="text-xl font-albert-sans font-bold text-text-dark mb-4">Bild</h3>
            <img
              src={order.image_url}
              alt={order.title}
              className="w-full max-h-96 object-contain rounded-lg"
            />
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
          <h3 className="text-xl font-albert-sans font-bold text-text-dark mb-6">Details</h3>
          <div className="grid grid-cols-2 gap-6">
            {order.customer_name && (
              <div>
                <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                  Kunde
                </label>
                <p className="text-base font-product-sans text-text-dark">{order.customer_name}</p>
              </div>
            )}
            {order.location && (
              <div>
                <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                  Standort
                </label>
                <p className="text-base font-product-sans text-text-dark">{order.location}</p>
              </div>
            )}
            {order.due_date && (
              <div>
                <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                  Fälligkeitsdatum
                </label>
                <p className="text-base font-product-sans text-text-dark">
                  {format(new Date(order.due_date), 'dd.MM.yyyy HH:mm', { locale: de })}
                </p>
              </div>
            )}
            {order.priority && (
              <div>
                <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                  Priorität
                </label>
                <p className="text-base font-product-sans text-text-dark">
                  Priorität {order.priority}
                </p>
              </div>
            )}
          </div>

          {order.description && (
            <div className="mt-6">
              <label className="text-sm font-cabin font-semibold text-text-gray block mb-2">
                Beschreibung
              </label>
              <p className="text-base font-abeezee text-[#474a58] whitespace-pre-wrap">
                {order.description}
              </p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
          <h3 className="text-xl font-albert-sans font-bold text-text-dark mb-6">Notizen</h3>

          {/* Add Comment */}
          <div className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Notiz hinzufügen..."
              className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:border-primary focus:outline-none resize-none"
              rows={3}
            />
            <button
              onClick={() => commentText.trim() && addCommentMutation.mutate(commentText)}
              disabled={!commentText.trim() || addCommentMutation.isPending}
              className="mt-3 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-cabin font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Notiz hinzufügen
            </button>
          </div>

          {/* Comments List */}
          {order.notes && order.notes.filter(n => n.type === 'comment').length > 0 ? (
            <div className="space-y-4">
              {order.notes
                .filter(n => n.type === 'comment')
                .map((note, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-product-sans font-bold text-text-dark">
                          {note.author?.first_name} {note.author?.last_name}
                        </p>
                        <p className="text-xs font-cabin text-gray-500">
                          {note.timestamp ? format(new Date(note.timestamp), 'dd.MM.yyyy HH:mm', { locale: de }) : ''}
                        </p>
                        <p className="text-sm font-abeezee text-[#474a58] mt-2">
                          {note.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400 font-cabin">
              Keine Notizen vorhanden
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

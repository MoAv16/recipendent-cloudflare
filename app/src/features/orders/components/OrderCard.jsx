import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PRIORITY_LABELS = {
  1: { label: 'Dringend', color: 'bg-red-100 text-red-800' },
  2: { label: 'Hoch', color: 'bg-orange-100 text-orange-800' },
  3: { label: 'Mittel', color: 'bg-yellow-100 text-yellow-800' },
  4: { label: 'Niedrig', color: 'bg-green-100 text-green-800' },
};

export default function OrderCard({ order }) {
  const priority = PRIORITY_LABELS[order.priority] || PRIORITY_LABELS[3];

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {order.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${priority.color}`}
            >
              {priority.label}
            </span>
          </div>

          {order.customer && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Kunde:</span> {order.customer}
            </p>
          )}

          {order.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {order.description}
            </p>
          )}

          {order.folder && (
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: order.folder.color || '#gray' }}
              />
              <span className="text-sm text-gray-600">{order.folder.name}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {order.due_date && (
              <span>
                Fällig: {format(new Date(order.due_date), 'dd.MM.yyyy', { locale: de })}
              </span>
            )}
            {order.location && <span>📍 {order.location}</span>}
          </div>
        </div>

        {order.status === 'done' && (
          <div className="ml-4 text-green-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {order.assigned_to && order.assigned_to.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Zugewiesen an:</span>
          <div className="flex -space-x-2">
            {order.assigned_to.slice(0, 3).map((userId, index) => (
              <div
                key={userId}
                className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
              >
                {index + 1}
              </div>
            ))}
            {order.assigned_to.length > 3 && (
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-700 text-xs font-medium">
                +{order.assigned_to.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

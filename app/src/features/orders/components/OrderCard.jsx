import { Link } from 'react-router-dom';
import { format, isPast, differenceInHours } from 'date-fns';
import { de } from 'date-fns/locale';

const PRIORITY_CONFIG = {
  1: { label: 'Sehr wichtig', color: 'bg-red-500', bgLight: 'bg-red-100', textColor: 'text-red-800' },
  2: { label: 'Wichtig', color: 'bg-orange-500', bgLight: 'bg-orange-100', textColor: 'text-orange-800' },
  3: { label: 'Neutral', color: 'bg-yellow-500', bgLight: 'bg-yellow-100', textColor: 'text-yellow-800' },
  4: { label: 'Weniger wichtig', color: 'bg-green-500', bgLight: 'bg-green-100', textColor: 'text-green-800' },
};

const STATUS_CONFIG = {
  open: { label: 'Offen', color: 'bg-blue-100 text-blue-800' },
  done: { label: 'Erledigt', color: 'bg-green-100 text-green-800' },
  archived: { label: 'Archiviert', color: 'bg-gray-100 text-gray-800' },
};

export default function OrderCard({ order }) {
  const priorityConfig = PRIORITY_CONFIG[order.priority] || PRIORITY_CONFIG[3];
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.open;

  // Check if order is critical (due soon)
  const isCritical = order.due_date && order.critical_timer
    ? differenceInHours(new Date(order.due_date), new Date()) <= order.critical_timer
    : false;

  const isOverdue = order.due_date ? isPast(new Date(order.due_date)) && order.status === 'open' : false;

  return (
    <Link
      to={`/orders/${order.id}`}
      className={`block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 ${
        isCritical && order.status === 'open' ? 'ring-2 ring-red-400' : ''
      } ${isOverdue ? 'border-l-4 border-red-500' : ''}`}
    >
      {/* Image Preview */}
      {order.image_url && (
        <div className="mb-3 -mx-4 -mt-4">
          <img
            src={order.image_url}
            alt={order.title}
            className="w-full h-32 object-cover rounded-t-lg"
          />
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title & Priority */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-shrink-0">
              {order.title}
            </h3>
            {order.priority && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${priorityConfig.bgLight}`}>
                <div className={`w-2 h-2 rounded-full ${priorityConfig.color}`} />
                <span className={`text-xs font-medium ${priorityConfig.textColor}`}>
                  P{order.priority}
                </span>
              </div>
            )}
            {isCritical && order.status === 'open' && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                ⚠️ Kritisch
              </span>
            )}
            {isOverdue && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                ⏰ Überfällig
              </span>
            )}
          </div>

          {/* Category */}
          {order.category && (
            <p className="text-xs text-gray-500 mb-2">
              {order.category}
            </p>
          )}

          {/* Customer Name */}
          {order.customer_name && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Kunde:</span> {order.customer_name}
            </p>
          )}

          {/* Description */}
          {order.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {order.description}
            </p>
          )}

          {/* Folder */}
          {order.folder && (
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: order.folder.color || '#6326ad' }}
              />
              <span className="text-sm text-gray-600">{order.folder.name}</span>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            {order.due_date && (
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                📅 {format(new Date(order.due_date), 'dd.MM.yyyy HH:mm', { locale: de })}
              </span>
            )}
            {order.location && <span>📍 {order.location}</span>}
            {order.notes && order.notes.filter(n => n.type === 'comment').length > 0 && (
              <span>💬 {order.notes.filter(n => n.type === 'comment').length}</span>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="ml-4 flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          {order.status === 'done' && (
            <div className="text-green-500">
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
      </div>

      {/* Assigned Users */}
      {order.assignedUsers && order.assignedUsers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-500">Zugewiesen:</span>
          <div className="flex -space-x-2">
            {order.assignedUsers.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="w-8 h-8 bg-primary-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                title={`${user.first_name} ${user.last_name}`}
              >
                {user.first_name[0]}{user.last_name[0]}
              </div>
            ))}
            {order.assignedUsers.length > 4 && (
              <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-700 text-xs font-medium">
                +{order.assignedUsers.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const FILTER_CHIPS = [
  'Kunde',
  'Standort',
  'Beschreibung',
  'Fälligkeitsdatum',
  'Priorität',
  'Status',
  'Notizen',
  'Zugewiesen',
];

export default function OrderDetailView({ order }) {
  const [activeFilters, setActiveFilters] = useState([]);

  if (!order) {
    return (
      <div className="bg-white rounded-xl border-2 border-primary shadow-soft h-[893px] w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg font-cabin">
            Wähle einen Auftrag aus, um Details anzuzeigen
          </p>
        </div>
      </div>
    );
  }

  const orderNumber = `ORD-${order.id?.substring(0, 8).toUpperCase()}` || 'ORD-XXXXXXXX';

  const toggleFilter = (filter) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="bg-white rounded-xl border-2 border-primary shadow-soft w-full">
      {/* Header with Filter Chips */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => toggleFilter(chip)}
              className={`
                px-3 py-1.5 rounded-lg border transition-colors
                text-sm font-medium font-roboto
                ${activeFilters.includes(chip)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }
              `}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Main Content */}
      <div className="p-6 space-y-6 max-h-[800px] overflow-y-auto">
        {/* Order Header */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-sm font-cabin font-semibold text-text-gray">
                Order number
              </span>
              <h2 className="text-2xl font-product-sans font-bold text-text-dark mt-1">
                {orderNumber}
              </h2>
            </div>

            {/* Zoom Icon */}
            <button className="w-12 h-12 hover:bg-gray-50 rounded-lg flex items-center justify-center">
              <img
                src="/design-assets/icons/zoom.svg"
                alt="Zoom"
                className="w-8 h-8"
              />
            </button>
          </div>

          {/* Title */}
          <h3 className="text-xl font-product-sans font-bold text-text-dark mb-4">
            {order.title}
          </h3>

          {/* Order Image - Only show if image_url exists */}
          {order.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={order.image_url}
                alt={order.title}
                className="w-full h-64 object-contain"
              />
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Customer */}
          {order.customer_name && (
            <div>
              <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                Kunde
              </label>
              <p className="text-base font-product-sans text-text-dark">
                {order.customer_name}
              </p>
            </div>
          )}

          {/* Location */}
          {order.location && (
            <div>
              <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                Standort
              </label>
              <p className="text-base font-product-sans text-text-dark flex items-center gap-2">
                <img
                  src="/design-assets/icons/vuesaxlinearrouting2.svg"
                  alt="Location"
                  className="w-4 h-4"
                />
                {order.location}
              </p>
            </div>
          )}

          {/* Due Date */}
          {order.due_date && (
            <div>
              <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                Fälligkeitsdatum
              </label>
              <p className="text-base font-product-sans text-text-dark flex items-center gap-2">
                <img
                  src="/design-assets/icons/vuesaxlinearcalendartick.svg"
                  alt="Calendar"
                  className="w-4 h-4"
                />
                {format(new Date(order.due_date), 'dd.MM.yyyy HH:mm', { locale: de })}
              </p>
            </div>
          )}

          {/* Priority */}
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

          {/* Status */}
          <div>
            <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
              Status
            </label>
            <p className="text-base font-product-sans text-text-dark capitalize">
              {order.status === 'open' ? 'Offen' : order.status === 'done' ? 'Erledigt' : 'Archiviert'}
            </p>
          </div>

          {/* Folder */}
          {order.folder && (
            <div>
              <label className="text-sm font-cabin font-semibold text-text-gray block mb-1">
                Ordner
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: order.folder.color || '#5932ea' }}
                />
                <p className="text-base font-product-sans text-text-dark">
                  {order.folder.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {order.description && (
          <div>
            <label className="text-sm font-cabin font-semibold text-text-gray block mb-2">
              Beschreibung
            </label>
            <p className="text-base font-abeezee text-[#474a58] whitespace-pre-wrap">
              {order.description}
            </p>
          </div>
        )}

        {/* Author Info */}
        {order.author && (
          <div className="pt-6 border-t border-gray-200">
            <label className="text-sm font-cabin font-semibold text-text-gray block mb-3">
              Erstellt von
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {order.author.first_name?.[0]}{order.author.last_name?.[0]}
              </div>
              <div>
                <p className="text-base font-product-sans font-bold text-text-dark">
                  {order.author.first_name} {order.author.last_name}
                </p>
                <p className="text-sm font-cabin text-[#484a58]">
                  {order.author.company?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Users */}
        {order.assignedUsers && order.assignedUsers.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <label className="text-sm font-cabin font-semibold text-text-gray block mb-3">
              Zugewiesen an
            </label>
            <div className="space-y-2">
              {order.assignedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {user.first_name[0]}{user.last_name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-product-sans font-bold text-text-dark">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs font-cabin text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        {order.notes && order.notes.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <label className="text-sm font-cabin font-semibold text-text-gray block mb-3 flex items-center gap-2">
              <img
                src="/design-assets/icons/vuesaxlinearmessagetext.svg"
                alt="Notes"
                className="w-4 h-4"
              />
              Notizen ({order.notes.filter(n => n.type === 'comment').length})
            </label>
            <div className="space-y-3">
              {order.notes
                .filter(n => n.type === 'comment')
                .map((note, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                        {note.author?.first_name?.[0]}{note.author?.last_name?.[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-product-sans font-bold text-text-dark">
                          {note.author?.first_name} {note.author?.last_name}
                        </p>
                        <p className="text-xs font-cabin text-gray-500">
                          {note.timestamp ? format(new Date(note.timestamp), 'dd.MM.yyyy HH:mm', { locale: de }) : ''}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-abeezee text-[#474a58]">
                      {note.text}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

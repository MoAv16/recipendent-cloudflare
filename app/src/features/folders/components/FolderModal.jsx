import { useState, useEffect } from 'react';

export default function FolderModal({ folder, onClose, onSave, isLoading, colors }) {
  const [name, setName] = useState(folder?.name || '');
  const [description, setDescription] = useState(folder?.description || '');
  const [color, setColor] = useState(folder?.color || colors[0]);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setDescription(folder.description || '');
      setColor(folder.color);
    }
  }, [folder]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, color });
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
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {folder ? 'Ordner bearbeiten' : 'Neuer Ordner'}
            </h3>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordner-Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Lieferungen"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kurze Beschreibung..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farbe</label>
              <div className="grid grid-cols-8 gap-2">
                {colors.map((availableColor) => (
                  <button
                    key={availableColor}
                    type="button"
                    onClick={() => setColor(availableColor)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      color === availableColor
                        ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: availableColor }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Wird gespeichert...' : 'Speichern'}
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

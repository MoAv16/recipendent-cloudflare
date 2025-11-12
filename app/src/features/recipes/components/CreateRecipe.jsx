import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createRecipe } from '../services/recipeService';
import { getFolders } from '../../orders/services/orderService';
import { ROUTES, PRIORITIES } from '../../../config/constants';

const AVAILABLE_ICONS = ['📖', '🍕', '🍔', '🥗', '🍜', '🍰', '☕', '🥤', '📦', '🎁'];
const AVAILABLE_COLORS = [
  '#ad42b3', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22',
];

const FIELD_CONFIG_DEFAULTS = {
  title: { enabled: true, required: true, label: 'Titel' },
  customer: { enabled: true, required: false, label: 'Kunde' },
  description: { enabled: true, required: false, label: 'Beschreibung' },
  location: { enabled: true, required: false, label: 'Standort' },
  priority: { enabled: true, required: true, label: 'Priorität' },
  due_date: { enabled: true, required: false, label: 'Fälligkeitsdatum' },
  image: { enabled: true, required: false, label: 'Bild' },
  folder: { enabled: true, required: false, label: 'Ordner' },
};

export default function CreateRecipe() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(AVAILABLE_ICONS[0]);
  const [color, setColor] = useState(AVAILABLE_COLORS[0]);
  const [folderId, setFolderId] = useState('');

  // Step 2: Field Configuration
  const [fieldConfig, setFieldConfig] = useState(FIELD_CONFIG_DEFAULTS);

  // Step 3: Default Values
  const [defaultPriority, setDefaultPriority] = useState(PRIORITIES.MEDIUM);
  const [defaultFolderId, setDefaultFolderId] = useState('');
  const [defaultAssignTo, setDefaultAssignTo] = useState([]);

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      navigate(ROUTES.RECIPES);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleNext = () => {
    if (currentStep === 1 && !name.trim()) {
      setError('Bitte gib einen Namen ein');
      return;
    }
    setError(null);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    setError(null);

    mutation.mutate({
      name,
      description,
      icon,
      color,
      folder_id: folderId || null,
      field_config: fieldConfig,
      default_values: {
        priority: defaultPriority,
        folder_id: defaultFolderId || null,
        assigned_to: defaultAssignTo,
      },
    });
  };

  const toggleField = (fieldName) => {
    setFieldConfig((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        enabled: !prev[fieldName].enabled,
      },
    }));
  };

  const updateFieldLabel = (fieldName, label) => {
    setFieldConfig((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        label,
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.RECIPES)}
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
          <h1 className="text-2xl font-bold text-gray-900">Neues Rezept erstellen</h1>
          <p className="text-sm text-gray-600">Schritt {currentStep} von 3</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Grundinfos</span>
          <span>Felder</span>
          <span>Standardwerte</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rezept-Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="z.B. Pizza Margherita Lieferung"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kurze Beschreibung des Rezepts..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {AVAILABLE_ICONS.map((availableIcon) => (
                  <button
                    key={availableIcon}
                    onClick={() => setIcon(availableIcon)}
                    className={`w-12 h-12 text-2xl rounded-lg border-2 transition-all ${
                      icon === availableIcon
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {availableIcon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farbe</label>
              <div className="flex gap-2 flex-wrap">
                {AVAILABLE_COLORS.map((availableColor) => (
                  <button
                    key={availableColor}
                    onClick={() => setColor(availableColor)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      color === availableColor ? 'border-gray-900' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: availableColor }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordner (optional)
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kein Ordner</option>
                {folders?.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Field Configuration */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Wähle, welche Felder beim Verwenden dieses Rezepts angezeigt werden sollen.
            </p>

            {Object.entries(fieldConfig).map(([fieldName, config]) => (
              <div
                key={fieldName}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => toggleField(fieldName)}
                    disabled={fieldName === 'title'} // Title is always required
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={config.label}
                      onChange={(e) => updateFieldLabel(fieldName, e.target.value)}
                      disabled={!config.enabled}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                  {config.required && (
                    <span className="text-xs text-red-600 font-medium">Pflichtfeld</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Default Values */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Lege Standardwerte fest, die beim Verwenden des Rezepts vorausgefüllt werden.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard-Priorität
              </label>
              <select
                value={defaultPriority}
                onChange={(e) => setDefaultPriority(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={PRIORITIES.LOW}>Niedrig</option>
                <option value={PRIORITIES.MEDIUM}>Mittel</option>
                <option value={PRIORITIES.HIGH}>Hoch</option>
                <option value={PRIORITIES.URGENT}>Dringend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard-Ordner
              </label>
              <select
                value={defaultFolderId}
                onChange={(e) => setDefaultFolderId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Kein Ordner</option>
                {folders?.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Vorschau:</strong> Wenn du dieses Rezept verwendest, wird ein neuer
                Auftrag mit diesen Einstellungen vorausgefüllt.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Zurück
            </button>
          )}

          <div className="flex-1" />

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Weiter
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? 'Wird erstellt...' : 'Rezept erstellen'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

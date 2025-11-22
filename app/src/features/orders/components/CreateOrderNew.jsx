import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createOrder, getCompanyUsers, getFolders } from '../services/orderService';
import { uploadImage, validateImageFile } from '../../../shared/utils/storage';
import { ROUTES } from '../../../config/constants';

// Priority configuration
const PRIORITIES = {
  1: { label: 'Sehr wichtig', color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50' },
  2: { label: 'Wichtig', color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-50' },
  3: { label: 'Neutral', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50' },
  4: { label: 'Weniger wichtig', color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-50' },
};

const orderSchema = z.object({
  title: z.string().min(2, 'Titel muss mindestens 2 Zeichen lang sein'),
  category: z.string().optional(),
  description: z.string().optional(),
  additional_text: z.string().optional(),
  customer_name: z.string().optional(),
  location: z.string().optional(),
  priority: z.number().min(1).max(4).optional(),
  due_date: z.string().optional(),
  critical_timer: z.number().min(0).max(48),
  folder_id: z.string().optional(),
  assigned_to: z.array(z.string()),
  editable_by_assigned: z.boolean(),
});

export default function CreateOrderNew() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [assignToAllTeam, setAssignToAllTeam] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priority: 2,
      critical_timer: 2,
      assigned_to: [],
      editable_by_assigned: false,
    },
  });

  const selectedPriority = watch('priority');
  const selectedUsers = watch('assigned_to');
  const criticalTimer = watch('critical_timer');

  // Fetch company users
  const { data: users = [] } = useQuery({
    queryKey: ['company-users'],
    queryFn: getCompanyUsers,
  });

  // Fetch folders
  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  // Auto-assign all team members when toggle is on
  useEffect(() => {
    if (assignToAllTeam && users.length > 0) {
      setValue('assigned_to', users.map((u) => u.id));
    }
  }, [assignToAllTeam, users, setValue]);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(ROUTES.ORDERS);
    },
    onError: (err) => {
      setError(err.message);
      setIsUploading(false);
    },
  });

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const toggleUserSelection = (userId) => {
    const current = selectedUsers || [];
    if (current.includes(userId)) {
      setValue('assigned_to', current.filter((id) => id !== userId));
    } else {
      setValue('assigned_to', [...current, userId]);
    }
    setAssignToAllTeam(false);
  };

  const onSubmit = async (data) => {
    setError(null);
    setIsUploading(true);

    try {
      // Upload image first if selected
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'order-images', {
          folder: 'orders',
        });
      }

      // Create order
      await mutation.mutateAsync({
        ...data,
        image_url: imageUrl,
        status: 'open',
      });
    } catch (err) {
      setError(err.message || 'Fehler beim Erstellen des Auftrags');
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(ROUTES.ORDERS)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
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
        <h1 className="text-3xl font-bold text-gray-900">Auftrag erstellen</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Image Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bild</h2>

          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-12 h-12 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Klicken zum Hochladen</span> oder drag & drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG oder WebP (max. 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          )}
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basis-Informationen</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titel *
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="z.B. BMW 3er Außenreinigung"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <input
              {...register('category')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="z.B. Reinigung, Wartung..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Detaillierte Beschreibung..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notizen</label>
            <textarea
              {...register('additional_text')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Zusätzliche Informationen..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kundenname</label>
              <input
                {...register('customer_name')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="z.B. Max Mustermann"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
              <input
                {...register('location')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="z.B. Halle 1 / Platz 3"
              />
            </div>
          </div>
        </div>

        {/* Priority */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Priorität</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(PRIORITIES).map(([value, config]) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('priority', parseInt(value))}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPriority === parseInt(value)
                    ? `${config.bgLight} border-current ${config.textColor}`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${config.color} flex items-center justify-center text-white font-bold`}>
                  P{value}
                </div>
                <p className="text-sm text-center font-medium">{config.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Due Date & Critical Timer */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Fälligkeitsdatum</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Datum und Uhrzeit
            </label>
            <input
              {...register('due_date')}
              type="datetime-local"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kritischer Timer: {criticalTimer} Stunden
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Der Auftrag wird als kritisch markiert, wenn diese Anzahl an Stunden vor dem
              Fälligkeitsdatum erreicht ist
            </p>
            <input
              {...register('critical_timer', { valueAsNumber: true })}
              type="range"
              min="0"
              max="48"
              step="1"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0h</span>
              <span>24h</span>
              <span>48h</span>
            </div>
          </div>
        </div>

        {/* Folder Selection */}
        {folders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ordner</h2>
            <select
              {...register('folder_id')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Kein Ordner</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Team Assignment */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Zuweisung</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={assignToAllTeam}
              onChange={(e) => {
                setAssignToAllTeam(e.target.checked);
                if (e.target.checked) {
                  setValue('assigned_to', users.map((u) => u.id));
                }
              }}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Dem gesamten Team zuweisen
            </span>
          </label>

          {!assignToAllTeam && (
            <div className="space-y-2 mt-4">
              <p className="text-sm text-gray-600 mb-3">
                {selectedUsers.length} von {users.length} ausgewählt
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {users.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <input
              {...register('editable_by_assigned')}
              type="checkbox"
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Zugewiesene Mitarbeiter dürfen bearbeiten
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending || isUploading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Wird hochgeladen...' : mutation.isPending ? 'Wird erstellt...' : 'Auftrag erstellen'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ORDERS)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createOrder, getCompanyUsers, getFolders } from '../services/orderService';
import { uploadImage, validateImageFile } from '../../../shared/utils/storage';
import { ROUTES } from '../../../config/constants';

const orderSchema = z.object({
  title: z.string().min(2, 'Titel muss mindestens 2 Zeichen lang sein'),
  description: z.string().optional(),
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
    <div className="p-10">
      {/* Back Button */}
      <Link
        to={ROUTES.ORDERS}
        className="inline-flex items-center gap-2 text-primary font-cabin font-semibold hover:underline mb-6"
      >
        ← Zurück zu Aufträgen
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-albert-sans font-bold text-text-dark mb-8">
          Neuen Auftrag erstellen
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl font-cabin">
              {error}
            </div>
          )}

          {/* Image Upload */}
          <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
            <h2 className="text-xl font-albert-sans font-bold text-text-dark mb-6">Bild</h2>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-lg bg-gray-50"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-inactive rounded-xl cursor-pointer bg-purple-light hover:bg-purple-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-600 font-cabin">
                    <span className="font-semibold">Klicken zum Hochladen</span> oder drag & drop
                  </p>
                  <p className="text-xs text-gray-500 font-cabin">PNG, JPG oder WebP (max. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8 space-y-6">
            <h2 className="text-xl font-albert-sans font-bold text-text-dark">Basis-Informationen</h2>

            <div>
              <label className="block text-sm font-cabin font-semibold text-text-gray mb-2">
                Titel *
              </label>
              <input
                {...register('title')}
                className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors"
                placeholder="z.B. BMW 3er Außenreinigung"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 font-cabin">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-cabin font-semibold text-text-gray mb-2">
                Beschreibung
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Beschreibe den Auftrag..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-cabin font-semibold text-text-gray mb-2">
                  Kundenname
                </label>
                <input
                  {...register('customer_name')}
                  className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors"
                  placeholder="Max Mustermann"
                />
              </div>

              <div>
                <label className="block text-sm font-cabin font-semibold text-text-gray mb-2">
                  Standort
                </label>
                <input
                  {...register('location')}
                  className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors"
                  placeholder="z.B. München"
                />
              </div>
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8 space-y-6">
            <h2 className="text-xl font-albert-sans font-bold text-text-dark">Priorität & Fälligkeit</h2>

            <div>
              <label className="block text-sm font-cabin font-semibold text-text-gray mb-3">
                Priorität
              </label>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setValue('priority', priority)}
                    className={`px-4 py-3 rounded-lg font-cabin font-semibold transition-all ${
                      selectedPriority === priority
                        ? 'bg-primary text-white border-2 border-primary'
                        : 'bg-white text-gray-700 border-2 border-border-inactive hover:border-primary'
                    }`}
                  >
                    P{priority}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-cabin font-semibold text-text-gray mb-2">
                Fälligkeitsdatum
              </label>
              <input
                {...register('due_date')}
                type="datetime-local"
                className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-cabin font-semibold text-text-gray mb-2">
                Kritisch-Timer (Stunden vor Fälligkeit)
              </label>
              <input
                {...register('critical_timer', { valueAsNumber: true })}
                type="number"
                min="0"
                max="48"
                className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Folder */}
          {folders.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
              <h2 className="text-xl font-albert-sans font-bold text-text-dark mb-6">Ordner</h2>
              <select
                {...register('folder_id')}
                className="w-full px-4 py-3 border-2 border-border-inactive rounded-lg font-cabin focus:outline-none focus:border-primary transition-colors"
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
          <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
            <h2 className="text-xl font-albert-sans font-bold text-text-dark mb-6">Team zuweisen</h2>

            <div className="flex items-center gap-3 mb-6">
              <input
                type="checkbox"
                id="assignAll"
                checked={assignToAllTeam}
                onChange={(e) => setAssignToAllTeam(e.target.checked)}
                className="w-5 h-5 text-primary border-2 border-border-inactive rounded focus:ring-primary"
              />
              <label htmlFor="assignAll" className="text-sm font-cabin font-semibold text-text-dark">
                Gesamtes Team zuweisen
              </label>
            </div>

            {!assignToAllTeam && (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      checked={selectedUsers?.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="w-5 h-5 text-primary border-2 border-border-inactive rounded focus:ring-primary"
                    />
                    <label htmlFor={`user-${user.id}`} className="text-sm font-cabin text-text-dark">
                      {user.first_name} {user.last_name}
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <input
                {...register('editable_by_assigned')}
                type="checkbox"
                id="editable"
                className="w-5 h-5 text-primary border-2 border-border-inactive rounded focus:ring-primary"
              />
              <label htmlFor="editable" className="text-sm font-cabin text-text-dark">
                Zugewiesene Benutzer können Auftrag bearbeiten
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ORDERS)}
              className="flex-1 px-6 py-4 border-2 border-border-inactive text-gray-700 rounded-xl hover:border-primary hover:text-primary transition-colors font-cabin font-semibold"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || isUploading}
              className="flex-1 px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors font-cabin font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending || isUploading ? 'Wird erstellt...' : 'Auftrag erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

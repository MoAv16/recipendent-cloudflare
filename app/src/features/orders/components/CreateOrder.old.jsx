import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrder } from '../services/orderService';
import { ROUTES, PRIORITIES } from '../../../config/constants';

const orderSchema = z.object({
  title: z.string().min(2, 'Titel muss mindestens 2 Zeichen lang sein'),
  customer: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  priority: z.number().min(1).max(4),
  due_date: z.string().optional(),
  folder_id: z.string().optional(),
});

export default function CreateOrder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priority: PRIORITIES.MEDIUM,
      status: 'open',
    },
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(ROUTES.ORDERS);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const onSubmit = (data) => {
    setError(null);
    mutation.mutate({
      ...data,
      status: 'open',
      assigned_to: [],
      editable_by_assigned: false,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
        <h1 className="text-2xl font-bold text-gray-900">Neuer Auftrag</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Titel *
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="z.B. Lieferung Pizza Margherita"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
            Kunde
          </label>
          <input
            {...register('customer')}
            type="text"
            id="customer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="z.B. Restaurant Bella Italia"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Weitere Details zum Auftrag..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Standort
            </label>
            <input
              {...register('location')}
              type="text"
              id="location"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="z.B. Hauptstraße 123"
            />
          </div>

          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fälligkeitsdatum
            </label>
            <input
              {...register('due_date')}
              type="date"
              id="due_date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priorität *
          </label>
          <select
            {...register('priority', { valueAsNumber: true })}
            id="priority"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={PRIORITIES.LOW}>Niedrig</option>
            <option value={PRIORITIES.MEDIUM}>Mittel</option>
            <option value={PRIORITIES.HIGH}>Hoch</option>
            <option value={PRIORITIES.URGENT}>Dringend</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Wird erstellt...' : 'Auftrag erstellen'}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ORDERS)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}

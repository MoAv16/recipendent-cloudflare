import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../config/supabase';
import { ROUTES } from '../../../config/constants';

const registerSchema = z
  .object({
    inviteCode: z.string().min(6, 'Einladungscode muss mindestens 6 Zeichen lang sein'),
    firstName: z.string().min(2, 'Vorname muss mindestens 2 Zeichen lang sein'),
    lastName: z.string().min(2, 'Nachname muss mindestens 2 Zeichen lang sein'),
    email: z.string().email('Ungültige E-Mail-Adresse'),
    password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  });

export default function EmployeeRegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Validate Invitation Code
      const { data: invitationData, error: inviteError } = await supabase
        .from('invitation_codes')
        .select('*, company:companies(*)')
        .eq('code', formData.inviteCode)
        .eq('email', formData.email)
        .eq('used', false)
        .single();

      if (inviteError || !invitationData) {
        throw new Error('Ungültiger oder abgelaufener Einladungscode');
      }

      // Check expiration
      if (new Date(invitationData.expires_at) < new Date()) {
        throw new Error('Dieser Einladungscode ist abgelaufen');
      }

      // 2. Create Auth User
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 3. Create User in public.users table
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        company_id: invitationData.company_id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: invitationData.role,
        co_admin_permissions: invitationData.co_admin_permissions,
      });

      if (userError) throw userError;

      // 4. Mark invitation as used
      await supabase
        .from('invitation_codes')
        .update({ used: true })
        .eq('id', invitationData.id);

      // Success - redirect to dashboard
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registrierung fehlgeschlagen');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Recipendent</h2>
          <p className="mt-2 text-sm text-gray-600">
            Tritt deinem Team bei
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
              Einladungscode *
            </label>
            <input
              {...register('inviteCode')}
              type="text"
              id="inviteCode"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="ABC123"
            />
            {errors.inviteCode && (
              <p className="mt-1 text-sm text-red-600">{errors.inviteCode.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Vorname *
              </label>
              <input
                {...register('firstName')}
                type="text"
                id="firstName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nachname *
              </label>
              <input
                {...register('lastName')}
                type="text"
                id="lastName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mustermann"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="max@beispiel.de"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Muss mit der E-Mail übereinstimmen, an die die Einladung gesendet wurde
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Passwort *
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Passwort bestätigen *
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Wird registriert...' : 'Registrieren'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Admin-Account erstellen? </span>
            <Link to={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
              Hier registrieren
            </Link>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Bereits registriert? </span>
            <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
              Jetzt anmelden
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

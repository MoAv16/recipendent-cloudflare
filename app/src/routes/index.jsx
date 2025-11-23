import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import EmployeeRegisterForm from '../features/auth/components/EmployeeRegisterForm';
import Dashboard from '../features/dashboard/Dashboard';
import OrdersList from '../features/orders/components/OrdersList';
import CreateOrderNew from '../features/orders/components/CreateOrderNew';
import OrderDetailPage from '../features/orders/components/OrderDetailPage';
import EditOrder from '../features/orders/components/EditOrder';
import TeamList from '../features/team/components/TeamList';
import RecipesList from '../features/recipes/components/RecipesList';
import CreateRecipe from '../features/recipes/components/CreateRecipe';
import FoldersList from '../features/folders/components/FoldersList';
import Settings from '../features/settings/components/Settings';
import Messages from '../features/messages/Messages';
import Notes from '../features/notes/Notes';
import Calendar from '../features/calendar/Calendar';
import Account from '../features/account/Account';
import { ROUTES } from '../config/constants';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
      {
        path: 'join',
        element: <EmployeeRegisterForm />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'orders',
        element: <OrdersList />,
      },
      {
        path: 'orders/new',
        element: <CreateOrderNew />,
      },
      {
        path: 'orders/:id',
        element: <OrderDetailPage />,
      },
      {
        path: 'orders/:id/edit',
        element: <EditOrder />,
      },
      {
        path: 'messages',
        element: <Messages />,
      },
      {
        path: 'notes',
        element: <Notes />,
      },
      {
        path: 'recipes',
        element: <RecipesList />,
      },
      {
        path: 'recipes/new',
        element: <CreateRecipe />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'team',
        element: <TeamList />,
      },
      {
        path: 'folders',
        element: <FoldersList />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'account',
        element: <Account />,
      },
    ],
  },
]);

export default router;

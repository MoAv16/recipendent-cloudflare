export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Recipendent';
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:5173';

export const ROLES = {
  ADMIN: 'admin',
  CO_ADMIN: 'co-admin',
  EMPLOYEE: 'employee',
};

export const ORDER_STATUS = {
  OPEN: 'open',
  DONE: 'done',
};

export const PRIORITIES = {
  LOW: 4,
  MEDIUM: 3,
  HIGH: 2,
  URGENT: 1,
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  RECIPES: '/recipes',
  TEAM: '/team',
  SETTINGS: '/settings',
};

# Recipendent WebApp - Claude Code Terminal Guide

**Version:** 1.0.0 | **Framework:** React 18 + Vite 6 + Supabase  
**Purpose:** Web-based Order Management System with Multi-Tenant Architecture (Feature Parity mit iOS App)

---

## 🎯 CRITICAL: Read This First

This is a **PRODUCTION-READY** multi-tenant web app sharing the same Supabase backend with the iOS app.

### Core Principles (Non-Negotiable)
1. **NEVER modify without `company_id` filter** - Multi-tenant isolation is CRITICAL
2. **NEVER break RLS policies** - Row Level Security protects all data
3. **ALWAYS use TanStack Query** - Data fetching, caching, and realtime updates
4. **ALWAYS use Tailwind CSS** - No custom CSS unless absolutely necessary
5. **NEVER create new state management** - Use React Context + TanStack Query

### 🗣️ Communication Guidelines
**When user describes a bug:**
- ✅ **Assume they describe the CURRENT state** (what they see NOW)
- ✅ **Verify the bug exists before fixing** - Show what you found in code
- ✅ **Ask clarifying questions if ambiguous**
- ⚠️ **If code differs from description:** "The code shows [X], but you mentioned [Y]. Should I still make changes?"

---

## 🏗️ Architecture Overview

### Tech Stack
```
Frontend:  React 18.3, Vite 6.0, React Router 7.0
Backend:   Supabase (PostgreSQL + Realtime + Auth + Storage)
State:     React Context API + TanStack Query v5
Styling:   TailwindCSS 4.0 (Custom Primary Color: #5cf2d6)
Animation: Framer Motion 11.0
Deployment: Cloudflare Pages
```

### Project Structure (Critical Paths)
```
app/
├── src/
│   ├── config/
│   │   ├── supabase.js                # Supabase client + auth helpers
│   │   └── constants.js               # App constants (ROLES, ROUTES, STATUS)
│   ├── features/
│   │   ├── auth/                      # Login, Register, OAuth, Permissions
│   │   │   ├── hooks/useAuth.jsx      # Auth state + user/company (CRITICAL)
│   │   │   ├── hooks/usePermissions.js # Permission checks (Admin/Co-Admin/Employee)
│   │   │   └── components/            # LoginForm, RegisterForm, EmployeeRegisterForm
│   │   ├── orders/                    # Main feature (CRUD, Realtime, Images)
│   │   │   ├── services/orderService.js
│   │   │   ├── hooks/useOrderRealtime.js
│   │   │   └── components/            # OrdersList, OrderCard, OrderDetail, CreateOrder
│   │   ├── recipes/                   # ⚠️ INCOMPLETE: DB table exists, frontend 60% done
│   │   │   ├── services/recipeService.js
│   │   │   └── components/            # RecipesList, RecipeCard, CreateRecipe
│   │   ├── team/                      # Team management, Invitations, Permissions
│   │   │   ├── services/teamService.js
│   │   │   └── components/            # TeamList, InviteModal, PermissionsEditor
│   │   ├── folders/                   # Folder management
│   │   │   ├── services/folderService.js
│   │   │   └── components/            # FoldersList, FolderModal
│   │   ├── dashboard/                 # Dashboard overview
│   │   │   └── Dashboard.jsx
│   │   └── settings/                  # Profile, Company, Security settings
│   │       └── components/            # Settings, ProfileSettings, CompanySettings, SecuritySettings
│   ├── shared/
│   │   ├── components/                # Reusable UI (Button, Input, Modal, Toast)
│   │   ├── hooks/                     # Shared hooks (useToast, useDebounce)
│   │   └── utils/                     # Helpers (formatters, validators)
│   ├── layouts/
│   │   ├── AuthLayout.jsx             # Layout for Login/Register screens
│   │   └── AppLayout.jsx              # Layout with Sidebar + Header
│   ├── routes/
│   │   ├── index.jsx                  # React Router setup
│   │   └── ProtectedRoute.jsx         # Route guard (auth + role-based)
│   ├── App.jsx                        # Root component (Providers)
│   └── main.jsx                       # Entry point
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🗄️ Database Schema (Shared with iOS App)

### Multi-Tenant Architecture
**CRITICAL:** Every table has `company_id` + RLS policies. NEVER query without `company_id` filter.

### Core Tables
```sql
-- Companies (Multi-Tenant Root)
companies (
  id UUID PRIMARY KEY,
  name TEXT,
  logo TEXT,                        -- Supabase Storage URL
  dominant_color TEXT,              -- Extracted from logo (hex)
  use_logo_branding BOOLEAN,        -- Enable logo-based theming
  show_logo_in_dashboard BOOLEAN,
  logo_position TEXT,               -- 'top-left' | 'top-center' | 'top-right'
  logo_scale NUMERIC,               -- 0.5 - 1.5
  logo_opacity NUMERIC,             -- 0.5 - 1.0
  created_at TIMESTAMP
)

-- Users (Auth + Roles)
users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role TEXT,                        -- 'admin' | 'co-admin' | 'employee'
  company_id UUID REFERENCES companies,
  profile_picture TEXT,
  theme TEXT,                       -- 'light' | 'dark' | 'custom'
  created_at TIMESTAMP
)

-- Orders (Main Feature)
orders (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,  -- ⚠️ ALWAYS FILTER BY THIS
  author_id UUID REFERENCES users,
  title TEXT,
  description TEXT,
  customer_name TEXT,
  location TEXT,
  priority INTEGER,                 -- 1-4 (1=highest, 4=lowest)
  status TEXT,                      -- 'open' | 'done' | 'archived'
  assigned_to UUID[],               -- Array of user IDs
  editable_by_assigned BOOLEAN,     -- Allow assigned users to edit
  folder_id UUID REFERENCES folders,
  due_date TIMESTAMP,
  critical_timer_hours INTEGER,     -- Hours before due_date to mark critical
  image_url TEXT,                   -- Supabase Storage URL
  notes JSONB,                      -- Array of notes with author, timestamp
  recipe_id UUID REFERENCES recipes, -- ✅ Recipe template used
  field_values JSONB,               -- Dynamic fields from recipe template
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Recipes (Templates for Orders)
recipes (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  name TEXT,
  description TEXT,
  icon TEXT,                        -- MaterialCommunityIcons name
  color TEXT,                       -- Hex color
  folder_id UUID REFERENCES folders,
  field_config JSONB,               -- { title: { enabled: true, label: '...' }, ... }
  default_values JSONB,             -- Default values for fields
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Folders (Organization)
folders (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  name TEXT,
  color TEXT,                       -- Hex color
  icon TEXT,                        -- MaterialCommunityIcons name
  sort_order INTEGER,
  created_at TIMESTAMP
)

-- Invitation Codes (Team Invites)
invitation_codes (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE,                 -- 6-digit code
  company_id UUID REFERENCES companies,
  email TEXT,
  role TEXT,                        -- 'employee' | 'co-admin'
  expires_at TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES users,
  used_at TIMESTAMP,
  sent_by UUID REFERENCES users,
  co_admin_permissions JSONB,       -- If role = 'co-admin'
  created_at TIMESTAMP
)

-- Co-Admin Permissions (Granular Permissions)
co_admin_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  company_id UUID REFERENCES companies,
  can_invite_employees BOOLEAN DEFAULT TRUE,
  can_remove_employees BOOLEAN DEFAULT TRUE,
  can_create_recipes BOOLEAN DEFAULT TRUE,
  can_edit_orders BOOLEAN DEFAULT TRUE,
  can_delete_orders BOOLEAN DEFAULT FALSE,
  can_delete_comments BOOLEAN DEFAULT TRUE,
  can_manage_folders BOOLEAN DEFAULT TRUE,
  can_edit_company_settings BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Notifications
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  company_id UUID REFERENCES companies,
  type TEXT,                        -- 'order_assigned' | 'order_updated' | 'team_invite'
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,                  -- Deep link URL
  created_at TIMESTAMP
)
```

### RLS Policies (Automatic Security)
- **All tables have RLS enabled**
- **SELECT:** `company_id = auth.user_company_id()`
- **INSERT/UPDATE/DELETE:** Role-based + company_id check
- **CRITICAL:** Never disable RLS, never bypass with service_role key in frontend

**Full Schema:** See `./supabase/Supabase SQL Schema.txt`

---

## 🔐 Authentication & Permissions

### Auth Hook (features/auth/hooks/useAuth.jsx)
```javascript
// CRITICAL: Single source of truth for user + company
const { 
  user,              // User object
  company,           // Company object
  loading,           // Boolean
  isAuthenticated,   // Boolean
  signIn,            // (email, password) => Promise
  signOut,           // () => Promise
  signInWithGoogle,  // () => Promise (OAuth)
} = useAuth();

// User object:
user: {
  id: UUID,
  email: string,
  first_name: string,
  last_name: string,
  role: 'admin' | 'co-admin' | 'employee',
  company_id: UUID,
  profile_picture: string,
  theme: 'light' | 'dark' | 'custom'
}

// Company object:
company: {
  id: UUID,
  name: string,
  logo: string,
  dominant_color: string (hex),
  use_logo_branding: boolean,
  show_logo_in_dashboard: boolean,
  logo_position: string,
  logo_scale: number,
  logo_opacity: number
}
```

### Permission System (features/auth/hooks/usePermissions.js)
```javascript
const { isAdmin, isCoAdmin, isEmployee, can, loading } = usePermissions();

// Permission Checks:
can('inviteEmployees')       // Admin: true, Co-Admin: check DB, Employee: false
can('editOrders')            // Admin: true, Co-Admin: check DB, Employee: false
can('deleteOrders')          // Admin: true, Co-Admin: check DB, Employee: false
can('createRecipes')         // Admin: true, Co-Admin: check DB, Employee: false
can('editCompanySettings')   // Admin: true, Co-Admin: check DB, Employee: false
can('manageFolders')         // Admin: true, Co-Admin: check DB, Employee: false
can('removeEmployees')       // Admin: true, Co-Admin: check DB, Employee: false
can('deleteComments')        // Admin: true, Co-Admin: check DB, Employee: false
```

### Role-Based Routing (routes/ProtectedRoute.jsx)
```javascript
// Not logged in → /auth/login
!isAuthenticated → LoginForm

// User exists but no company (company was deleted) → Re-Onboarding
user && !user.company_id → Redirect to /auth/register (show re-onboarding flow)

// Employee: Limited routes
user.role === 'employee' → Dashboard, Orders (assigned only), Recipes, Settings

// Admin/Co-Admin: Full access
user.role === 'admin' | 'co-admin' → Dashboard, Orders, Recipes, Team, Folders, Settings
```

---

## 📊 State Management

### React Context Providers (App.jsx)
```javascript
// Provider Hierarchy
<QueryClientProvider client={queryClient}>  // TanStack Query
  <AuthProvider>                            // User + Company (CRITICAL)
    <Router>                                 // React Router
      <ToastProvider>                        // Toast notifications
        <AppRoutes />
```

### TanStack Query Usage
```javascript
// ✅ ALWAYS use TanStack Query for data fetching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch Orders
const { data: orders, isLoading, error } = useQuery({
  queryKey: ['orders', company?.id],
  queryFn: () => orderService.getOrders(),
  enabled: !!company?.id,
  staleTime: 30000,  // Cache for 30s
});

// Create Order (with optimistic update)
const queryClient = useQueryClient();
const createMutation = useMutation({
  mutationFn: orderService.createOrder,
  onMutate: async (newOrder) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['orders', company.id]);
    
    // Snapshot previous value
    const previousOrders = queryClient.getQueryData(['orders', company.id]);
    
    // Optimistically update
    queryClient.setQueryData(['orders', company.id], (old) => [newOrder, ...old]);
    
    return { previousOrders };
  },
  onError: (err, newOrder, context) => {
    // Rollback on error
    queryClient.setQueryData(['orders', company.id], context.previousOrders);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries(['orders', company.id]);
  },
});
```

---

## 🎨 Styling System

### Tailwind CSS (Primary Method)
```javascript
// ✅ ALWAYS use Tailwind utility classes
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark 
                   transition-colors duration-200 shadow-md hover:shadow-lg">
  Submit
</button>

// Custom Primary Color (tailwind.config.js)
theme: {
  extend: {
    colors: {
      primary: '#5cf2d6',          // Mint-turquoise
      'primary-dark': '#1dd1a1',
      'primary-light': '#7fffd4',
      // ... more colors
    }
  }
}
```

### Responsive Design
```javascript
// Mobile-first approach
<div className="flex flex-col md:flex-row lg:gap-6">
  {/* Mobile: column, Desktop: row */}
</div>

// Sidebar collapsible on mobile
<div className="hidden md:block">
  <Sidebar />
</div>
<div className="md:hidden">
  <MobileMenu />
</div>
```

---

## 🔧 Common Patterns & Solutions

### Supabase Query Patterns
```javascript
// ✅ CORRECT: Always filter by company_id
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('company_id', company.id)  // ⚠️ CRITICAL
  .order('created_at', { ascending: false });

// ✅ CORRECT: With relations (join users and folders)
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    author:users!author_id(id, first_name, last_name, profile_picture),
    folder:folders(id, name, color, icon),
    recipe:recipes(id, name, icon, color)
  `)
  .eq('company_id', company.id);

// ✅ CORRECT: Insert with company_id and author_id
const { data, error } = await supabase
  .from('orders')
  .insert({
    ...orderData,
    company_id: company.id,      // ⚠️ CRITICAL
    author_id: user.id,
    created_at: new Date().toISOString()
  })
  .select()
  .single();

// ✅ CORRECT: Update
const { data, error } = await supabase
  .from('orders')
  .update(updates)
  .eq('id', orderId)
  .eq('company_id', company.id)  // ⚠️ SECURITY: Double-check ownership
  .select()
  .single();

// ✅ CORRECT: Delete
const { error } = await supabase
  .from('orders')
  .delete()
  .eq('id', orderId)
  .eq('company_id', company.id); // ⚠️ SECURITY: Double-check ownership
```

### Realtime Subscriptions
```javascript
// ✅ CORRECT: Subscribe to company-specific changes
useEffect(() => {
  if (!company?.id) return;

  const channel = supabase
    .channel('orders-changes')
    .on('postgres_changes', {
      event: '*',                 // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'orders',
      filter: `company_id=eq.${company.id}`,  // ⚠️ CRITICAL
    }, (payload) => {
      console.log('Change received:', payload.eventType);
      
      // Invalidate TanStack Query cache
      queryClient.invalidateQueries(['orders', company.id]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [company?.id]);
```

### File Upload (Supabase Storage)
```javascript
// Upload Image
const uploadImage = async (file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `${company.id}/${user.id}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('order-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get Public URL
  const { data: urlData } = supabase.storage
    .from('order-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

// ✅ Storage Buckets:
// - order-images       (public)
// - company-logos      (public)
// - profile-pictures   (public)
// - recipe-images      (public)
```

### Error Handling
```javascript
// ✅ CORRECT: Always handle errors with Toast
import { useToast } from '../../shared/hooks/useToast';

const { showToast } = useToast();

try {
  const { data, error } = await supabase.from('orders').insert(orderData);
  if (error) throw error;
  
  showToast({ message: 'Order erstellt!', type: 'success' });
  navigate('/orders');
} catch (error) {
  console.error('Create Order Error:', error);
  showToast({ 
    message: error.message || 'Fehler beim Erstellen', 
    type: 'error' 
  });
}
```

---

## 🚨 Known Issues & Limitations

### Active Development Areas
1. **Recipes Feature (60% complete)**
    - **Status:** DB table exists, frontend partially implemented
    - **TODO:** 
        - Recipe → Order flow (template selector)
        - Dynamic form rendering based on `field_config`
        - Usage count tracking
    - **Files:**
        - `features/recipes/services/recipeService.js` ✅
        - `features/recipes/components/RecipesList.jsx` ✅
        - `features/recipes/components/CreateRecipe.jsx` ⚠️ Incomplete
        - `features/orders/components/CreateOrder.jsx` ⚠️ Recipe integration missing

2. **OAuth Callback Route**
    - **Status:** Not implemented
    - **TODO:** Handle Google OAuth callback, check if user exists, redirect appropriately
    - **Route:** `/auth/callback`

3. **Account Deletion**
    - **Status:** Edge Function exists, frontend not connected
    - **TODO:** Settings screen → Delete Account button → Call `delete-company` edge function

### Non-Critical Issues
1. **Email Sending Not Integrated**
    - Edge Functions exist but not fully connected
    - Team invitations generate codes but don't send emails
    - Manual code sharing required

2. **Bundle Size Large (~676KB)**
    - **Fix:** Code splitting, lazy loading routes, dynamic imports
    - **Target:** ~300KB

---

## 🛠️ Development Guidelines

### When Fixing Bugs

**⚠️ STEP 0: Verify & Clarify (ALWAYS DO THIS FIRST)**
```
1. Find the relevant file/code based on user description
2. Read current code and compare to user's description
3. If there's a mismatch:
   → Show user what you found: "I see [current code] at [location]"
   → Ask: "Is this what you're referring to? Should I change it to [X]?"
   → WAIT for user confirmation before making ANY changes
4. If it matches: Proceed with fix
```

**Standard Bug Fix Flow:**
1. **Identify the layer:**
    - UI bug → Check component + Tailwind classes
    - Data bug → Check service + TanStack Query
    - Permission bug → Check usePermissions hook
    - Auth bug → Check AuthProvider + Supabase Auth

2. **Reproduce the bug:**
    - Check if `company_id` filter is present
    - Check if RLS policies allow the operation
    - Check if user has required permissions
    - Check browser console for errors

3. **Fix with minimal changes:**
    - Don't refactor unrelated code
    - Don't change working patterns
    - Always test with Admin, Co-Admin, and Employee roles

4. **Test multi-tenant isolation:**
    - Create test companies
    - Verify data doesn't leak between companies

### When Adding Features
1. **Use TanStack Query for data fetching:**
    - `useQuery` for reads
    - `useMutation` for writes
    - Optimistic updates for instant feedback

2. **Follow Tailwind patterns:**
    - Use utility classes
    - Custom classes only for complex components
    - Responsive design (mobile-first)

3. **Add permission checks:**
    - Use `usePermissions()` hook
    - Check `can('permission')` before showing UI
    - Check permissions before API calls

4. **Add Realtime if needed:**
    - Subscribe to table changes with `company_id` filter
    - Invalidate TanStack Query cache on changes

---

## 📝 Example Tasks & Solutions

### Task: "Fix order creation not working"
**Diagnosis Steps:**
1. Check `CreateOrder.jsx` → `handleSubmit()` function
2. Check if `company_id` is included in insert
3. Check if `author_id` is set correctly
4. Check RLS policy for `orders` table (INSERT)
5. Check browser console for Supabase errors

**Common Causes:**
- Missing `company_id` in insert
- RLS policy blocking insert
- Invalid data validation
- Network error

**Solution Template:**
```javascript
// Check: features/orders/components/CreateOrder.jsx
const { user, company } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const orderData = {
    title,
    description,
    company_id: company.id,      // ✅ Must be present
    author_id: user.id,          // ✅ Must be present
    created_at: new Date().toISOString(),
    ...otherFields
  };
  
  createMutation.mutate(orderData);
};
```

### Task: "User can't see orders"
**Diagnosis Steps:**
1. Check user role: `user.role`
2. Check company_id: `user.company_id`
3. Check RLS policies in Supabase dashboard
4. Check if `company_id` filter is in query
5. Check if orders exist for this company

**Common Causes:**
- User has no `company_id` (company deleted)
- RLS policy blocking SELECT
- Query missing `company_id` filter
- Wrong company_id in filter

**Solution Template:**
```javascript
// Check: features/orders/services/orderService.js
export const getOrders = async (companyId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('company_id', companyId);      // ✅ Filter present?
    
  if (error) throw error;
  return data;
};
```

---

## 🎯 Quick Reference

### Must-Have Imports for Every Component
```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { usePermissions } from '../../../features/auth/hooks/usePermissions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../shared/hooks/useToast';
```

### Must-Check Before Any Change
- [ ] Is `company_id` included in query/insert/update?
- [ ] Does user have permission for this action?
- [ ] Is RLS policy allowing this operation?
- [ ] Is error handled with Toast?
- [ ] Is loading state shown?
- [ ] Is Realtime subscription filtered by `company_id`?

### Emergency Debugging
```javascript
// Auth Status
const { user, company, isAuthenticated } = useAuth();
console.log('User:', user);
console.log('Company:', company);
console.log('Authenticated:', isAuthenticated);

// Supabase Query Debug
const { data, error } = await supabase.from('orders').select('*');
console.log('Data:', data);
console.log('Error:', error);       // Check RLS error
console.log('Company ID:', company.id);

// Permission Debug
const { can } = usePermissions();
console.log('Can edit orders:', can('editOrders'));
console.log('User role:', user.role);
```

---

## 🚀 Deployment (Cloudflare Pages)

### Environment Variables
```env
VITE_SUPABASE_URL=https://bgqzxwgsdbptbyimzwtf.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Build Settings
```bash
# Framework Preset: Vite
# Build Command: npm run build
# Build Output Directory: dist
# Root Directory: app (if in monorepo)
```

### Custom Domain
```
# Primary Domain: app.recipendent.com
# SSL/TLS: Full (Cloudflare)
```

---

## 📚 Additional Resources

### Supabase Dashboard
- **URL:** https://bgqzxwgsdbptbyimzwtf.supabase.co
- **Tables:** Database → Tables → View data + RLS policies
- **Realtime:** Database → Replication → Enable for tables
- **Storage:** Storage → Buckets → View files

### Edge Functions
- `register-admin` - Create first admin user for company
- `delete-company` - Delete company + cascade delete users/orders
- `send-invitation-email` - Send team invitation emails

### External Libraries
- **Supabase:** https://supabase.com/docs
- **TanStack Query:** https://tanstack.com/query/latest/docs/react
- **React Router:** https://reactrouter.com/en/main
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Last Updated:** 2025-11-19  
**App Version:** 1.0.0  
**Status:** Production-Ready (80% feature parity with iOS app)

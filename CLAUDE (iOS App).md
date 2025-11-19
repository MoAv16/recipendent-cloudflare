# Recipendent iOS App - Claude Code Terminal Guide

**Version:** 1.0.2 | **Framework:** Expo SDK 54 + React Native 0.81.5 + Supabase  
**Purpose:** iOS Enterprise Order Management App with Multi-Tenant Architecture

---

## 🎯 CRITICAL: Read This First

This is a **PRODUCTION-READY** multi-tenant app. Every change you make affects real user data.

### Core Principles (Non-Negotiable)
1. **NEVER modify without `company_id` filter** - Multi-tenant isolation is CRITICAL
2. **NEVER break RLS policies** - Row Level Security protects all data
3. **ALWAYS use existing Context Providers** - 11 providers with strict hierarchy
4. **ALWAYS use `useThemedStyles()` hook** - Dynamic theming is app-wide
5. **NEVER create new state management** - Use OrdersContext, TeamContext, FoldersContext

### 🗣️ Communication Guidelines (How to interpret user requests)
**When user describes a bug:**
- ✅ **Assume they describe the CURRENT state** (what they see NOW in the app)
- ✅ **Don't assume they checked git history** (they may not know if it was already fixed)
- ✅ **Ask clarifying questions if ambiguous:** "I see [X] in the code. Is that what you're referring to?"
- ✅ **Verify the bug exists before fixing:** "I found [X] in line Y. This is currently [Z]. Should I change it to [A]?"
- ⚠️ **If you find something different than described:** "The code shows [X], but you mentioned [Y]. The issue may have been fixed already. Should I still make changes?"

**Examples:**
```
User: "Orders without images show a food icon"
You: "I found RecipeListScreen.js line 364 uses 'clipboard-list-outline'. 
      Was this recently changed? Should I change it to something else?"

User: "Theme is not working"
You: "I see useThemedStyles() is used in [Screen]. Can you describe 
      what behavior you're seeing? (Colors not changing? Wrong values?)"
```

---

## 🏗️ Architecture Overview

### Tech Stack
```
Frontend:  Expo SDK 54, React Native 0.81.5, React 19.1.0
Backend:   Supabase (PostgreSQL + Realtime + Auth + Storage)
Navigation: React Navigation v7 (Native Stack + Bottom Tabs)
State:     React Context API (11 Providers)
Animation: React Native Reanimated 4.1
Storage:   Expo SecureStore (session persistence)
```

### Project Structure (Critical Paths)
```
recipendent-app/
├── App.js                          # Root (11 Context Providers, Role-based routing)
├── config/
│   ├── supabaseClient.js           # Supabase client + auth helpers (getCurrentCompanyId, getCurrentUser)
│   ├── brandConfig.js              # Dynamic branding (logo colors, theme)
│   ├── designSystem.js             # Static design tokens (spacing, typography, shadows, glass)
│   └── featureFlags.js             # Feature toggles
├── features/
│   ├── auth/                       # Login, Register, Permissions, Role system
│   │   ├── authContext.js          # User + Company state (CRITICAL)
│   │   └── hooks/usePermissions.js # Permission checks (Admin/Co-Admin/Employee)
│   ├── orders/                     # Main feature (CRUD, Realtime, Caching)
│   │   ├── services/
│   │   │   ├── ordersService.js    # Optimized service (caching, retry, deduplication)
│   │   │   ├── crudOperations.js   # Legacy CRUD (use ordersService instead)
│   │   │   └── realtimeService.js  # Realtime subscriptions
│   │   └── screens/                # CreateOrder, EditOrder, OrderDetail, Dashboard, etc.
│   ├── recipes/                    # ⚠️ BROKEN: DB table missing (Frontend ready, 35% complete)
│   ├── notifications/              # Push notifications (90% complete)
│   ├── team/                       # Team management, Invitations, Co-Admin Permissions
│   └── settings/                   # Profile, Logo Customization, Theme, Face ID
├── shared/
│   ├── contexts/                   # ✅ Phase 3: Split Context Architecture
│   │   ├── OrdersContext.js        # Orders CRUD + Realtime + Optimistic Updates
│   │   ├── TeamContext.js          # Team members + Realtime
│   │   └── FoldersContext.js       # Folders + Realtime
│   ├── appDataContext.js           # ⚠️ LEGACY WRAPPER (use split contexts instead)
│   ├── themeContext.js             # Light/Dark/Custom theme
│   ├── brandingContext.js          # Logo branding (primary color)
│   ├── hooks/
│   │   ├── useThemedStyles.js      # ✅ PRIMARY HOOK for all styling
│   │   ├── useOrdersSelectors.js   # Selector hooks (filtered orders)
│   │   ├── useTeamSelectors.js     # Team selectors
│   │   └── useFoldersSelectors.js  # Folder selectors
│   ├── components/                 # Reusable UI (Glass*, Toast, Loading, DateTimePicker)
│   └── utils/                      # timeUtils, colorExtractor, faceIdAuth, performanceMonitor
├── navigation/
│   ├── AppTabNavigator.js          # Tab navigation (Admin/Employee)
│   └── AppTabBar.js                # Custom tab bar with glassmorphism
└── supabase/
    └── functions/                  # Edge Functions (register-admin, delete-company, send-invitation)
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

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
  co_admin_permissions JSONB,       -- Legacy (use co_admin_permissions table)
  face_id_enabled BOOLEAN,
  theme TEXT,                       -- 'light' | 'dark' | 'custom'
  created_at TIMESTAMP
)

-- Orders (Main Feature)
orders (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,  -- ⚠️ ALWAYS FILTER BY THIS
  author_id UUID REFERENCES users,
  author_name TEXT,
  title TEXT,
  category TEXT,
  description TEXT,
  additional_text TEXT,
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

-- Notifications
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  company_id UUID REFERENCES companies,
  type TEXT,                        -- 'order_assigned' | 'order_updated' | 'team_invite' | etc.
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,                  -- Deep link URL
  created_at TIMESTAMP
)

-- Invitation Codes (Team Invites)
invitation_codes (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE,                 -- 6-digit code
  company_id UUID REFERENCES companies,
  role TEXT,                        -- 'employee' | 'co-admin'
  expires_at TIMESTAMP,
  used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES users,
  used_at TIMESTAMP,
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
  can_delete_comments BOOLEAN DEFAULT TRUE,
  can_manage_folders BOOLEAN DEFAULT TRUE,
  can_edit_company_settings BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- ⚠️ MISSING TABLE (CRITICAL ISSUE)
-- recipes (
--   id UUID PRIMARY KEY,
--   company_id UUID REFERENCES companies,
--   folder_id UUID REFERENCES folders,
--   title TEXT,
--   ingredients JSONB,
--   instructions TEXT,
--   image_url TEXT,
--   created_by UUID REFERENCES users,
--   created_at TIMESTAMP
-- )
-- STATUS: Frontend ready, DB table missing - recipes screens use orders table as workaround
```

### RLS Policies (Automatic Security)
- **All tables have RLS enabled**
- **SELECT:** `company_id = auth.user_company_id()`
- **INSERT/UPDATE/DELETE:** Role-based + company_id check
- **CRITICAL:** Never disable RLS, never bypass with service_role key in frontend

---

## 🔐 Authentication & Permissions

### Auth Context (features/auth/authContext.js)
```javascript
// CRITICAL: Single source of truth for user + company
const { user, company, loading, userRole, logout } = useAuth();

// User object:
user: {
  id: UUID,
  email: string,
  first_name: string,
  last_name: string,
  role: 'admin' | 'co-admin' | 'employee',
  company_id: UUID,
  profile_picture: string,
  face_id_enabled: boolean,
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
const { isAdmin, isCoAdmin, isEmployee, can, canEdit, loading } = usePermissions();

// Permission Checks:
can('inviteEmployees')       // Admin: true, Co-Admin: check DB, Employee: false
can('editOrders')            // Admin: true, Co-Admin: check DB, Employee: false
can('deleteOrders')          // Admin: true, Co-Admin: check DB, Employee: false
can('createRecipes')         // Admin: true, Co-Admin: check DB, Employee: false
can('editCompanyInfo')       // Admin: true, Co-Admin: check DB, Employee: false
can('manageFolders')         // Admin: true, Co-Admin: check DB, Employee: false
can('removeEmployees')       // Admin: true, Co-Admin: check DB, Employee: false
can('deleteComments')        // Admin: true, Co-Admin: check DB, Employee: false

// Ownership Check:
canEdit('editOrders', order.author_id)  // true if Admin OR has permission OR is owner

// Co-Admin Permissions (loaded from co_admin_permissions table):
// - can_invite_employees
// - can_remove_employees
// - can_create_recipes
// - can_edit_orders
// - can_delete_comments
// - can_manage_folders
// - can_edit_company_settings
```

### Role-Based Routing (App.js)
```javascript
// Not logged in: Start, Login, Register screens
!user → StartScreen, LoginScreen, RegisterScreen

// User exists but no company (company was deleted): Re-Onboarding
user && !user.company_id → ReOnboardingScreen

// Employee: Limited screens
user.role === 'employee' → EmployeeTabNavigator (Dashboard, Recipes, Settings)

// Admin/Co-Admin: Full access
user.role === 'admin' | 'co-admin' → AdminTabNavigator (Dashboard, Recipes, Team, Settings)
```

---

## 📊 State Management (Context Providers)

### Context Provider Hierarchy (App.js)
```javascript
// ⚠️ ORDER IS CRITICAL - DO NOT CHANGE
<ErrorBoundary>
  <ThemeProvider>              // 1. Theme (light/dark/custom)
    <TabBarProvider>           // 2. Tab bar state
      <AuthProvider>           // 3. User + Company (CRITICAL)
        <CompanyProvider>      // 4. Company details (logo, colors)
          <BrandingProvider>   // 5. Primary color (standard or logo-based)
            <OrdersProvider>   // 6. Orders CRUD + Realtime
              <FoldersProvider>  // 7. Folders CRUD + Realtime
                <TeamProvider>   // 8. Team members + Realtime
                  <AppDataProvider>  // 9. ⚠️ LEGACY WRAPPER (use split contexts)
                    <NotificationProvider>  // 10. Notifications
                      <ToastProvider>       // 11. Toast messages
                        <AppNavigator />
```

### Split Context Architecture (Phase 3) ✅ PREFERRED
```javascript
// Orders Context (shared/contexts/OrdersContext.js)
const {
  orders,                      // Array of all orders
  loading,                     // Boolean
  error,                       // Error message or null
  refreshOrders,               // Fetch fresh data
  createOrder,                 // (orderData) => Promise
  updateOrder,                 // (orderId, updates) => Promise
  deleteOrder,                 // (orderId) => Promise
  optimisticUpdateOrder,       // ✅ Optimistic update with rollback
  optimisticCreateOrder,       // ✅ Optimistic create with rollback
  optimisticDeleteOrder        // ✅ Optimistic delete with rollback
} = useOrders();

// Team Context (shared/contexts/TeamContext.js)
const {
  teamMembers,                 // Array of users in company
  loading,
  error,
  refreshTeam,
  updateTeamMember,            // (memberId, updates) => Promise
  removeTeamMember             // (memberId) => Promise
} = useTeam();

// Folders Context (shared/contexts/FoldersContext.js)
const {
  folders,                     // Array of folders (sorted by sort_order)
  loading,
  error,
  refreshFolders,
  createFolder,                // (folderData) => Promise
  updateFolder,                // (folderId, updates) => Promise
  deleteFolder                 // (folderId) => Promise
} = useFolders();
```

### Selector Hooks (Optimized Data Access)
```javascript
// Orders Selectors (shared/hooks/useOrdersSelectors.js)
const {
  allOrders,                   // All orders
  openOrders,                  // status === 'open'
  completedOrders,             // status === 'done'
  criticalOrders,              // due_date < now + critical_timer_hours
  assignedOrders,              // assigned_to includes current user
  ordersByFolder,              // (folderId) => filtered orders
  orderById                    // (orderId) => single order
} = useOrdersSelectors();

// Team Selectors (shared/hooks/useTeamSelectors.js)
const {
  allMembers,
  admins,
  coAdmins,
  employees,
  memberById                   // (memberId) => single member
} = useTeamSelectors();

// Folders Selectors (shared/hooks/useFoldersSelectors.js)
const {
  allFolders,
  folderById,                  // (folderId) => single folder
  sortedFolders                // Sorted by sort_order
} = useFoldersSelectors();
```

### Legacy Context (⚠️ DEPRECATED - Use split contexts)
```javascript
// shared/appDataContext.js
// DO NOT USE in new code - wrapper for backward compatibility
const { orders, folders, teamMembers, loading } = useAppData();
```

---

## 🎨 Theming & Styling System

### Primary Styling Hook (useThemedStyles)
```javascript
// ✅ ALWAYS USE THIS HOOK for styling
import useThemedStyles from '../../../shared/hooks/useThemedStyles';

const MyScreen = () => {
  const styles = useThemedStyles(createStyles);
  
  return <View style={styles.container}>...</View>;
};

const createStyles = (theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,      // Dynamic (light/dark)
    padding: theme.spacing.lg,                     // Static (16)
  },
  button: {
    backgroundColor: theme.colors.primary,         // Dynamic (standard or logo-based)
    borderRadius: theme.borderRadius.md,           // Static (12)
    ...theme.shadows.md,                           // Static shadow
  },
  text: {
    ...theme.typography.body,                      // Static typography
    color: theme.colors.text,                      // Dynamic (light/dark)
  },
  // Conditional styling
  header: {
    backgroundColor: theme.isDark ? '#1A1A1A' : '#FFFFFF',
  }
});
```

### Theme Object Structure
```javascript
theme: {
  colors: {
    // Primary (dynamic - standard or logo-based)
    primary: string,              // Default: #5cf2d6 (mint-turquoise) OR logo color
    primaryDark: string,          // Darker variant
    primaryLight: string,         // Lighter variant
    
    // Backgrounds (light/dark)
    background: string,           // Light: #F5F5F7, Dark: #000000
    surface: string,              // Light: #FFFFFF, Dark: #1A1A1A
    surfaceVariant: string,       // Light: #F0F0F0, Dark: #2A2A2A
    
    // Text (light/dark)
    text: string,                 // Light: #1A1A1A, Dark: #FFFFFF
    textSecondary: string,        // Light: #666666, Dark: #AAAAAA
    textTertiary: string,         // Light: #999999, Dark: #666666
    textOnPrimary: string,        // Contrast color for text on primary color elements
    
    // Borders
    border: string,               // Light: #E0E0E0, Dark: #333333
    borderLight: string,          // Light: #F0F0F0, Dark: #2A2A2A
    
    // Status (semantic - NEVER change)
    success: '#28A745',
    danger: '#DC3545',
    warning: '#FFC107',
    info: '#17A2B8',
    critical: '#F44336',
    statusOpen: '#4CAF50',
    statusDone: '#2196F3',
    
    // Priority (semantic - NEVER change)
    priority1: '#F44336',         // P1 - Red (highest)
    priority2: '#FF9800',         // P2 - Orange
    priority3: '#FFC107',         // P3 - Yellow
    priority4: '#4CAF50',         // P4 - Green (lowest)
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
  },
  borderRadius: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, round: 9999
  },
  typography: {
    h1: { fontFamily, fontSize: 32, fontWeight: '800', ... },
    h2: { fontFamily, fontSize: 24, fontWeight: '700', ... },
    h3: { fontFamily, fontSize: 20, fontWeight: '700', ... },
    h4: { fontFamily, fontSize: 18, fontWeight: '600', ... },
    body: { fontFamily, fontSize: 16, fontWeight: '400', ... },
    bodySmall: { fontFamily, fontSize: 14, fontWeight: '400', ... },
    caption: { fontFamily, fontSize: 12, fontWeight: '500', ... },
    button: { fontFamily, fontSize: 16, fontWeight: '600', ... },
    input: { fontFamily, fontSize: 16, fontWeight: '400', ... },
  },
  shadows: {
    none: { shadowColor: 'transparent', ... },
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, ... },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, ... },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, ... },
  },
  isDark: boolean,                // For conditional styling
}
```

### Brand Configuration (config/brandConfig.js)
```javascript
// Dynamic Primary Color
BrandConfig.getPrimaryColor(useBranding, logoColor)
// Returns: logoColor if branding enabled, else #5cf2d6

// Color Palette Generation
BrandConfig.getColorPalette(primaryColor, isDark)
// Returns: Complete theme.colors object

// Helper Functions
BrandConfig.adjustColor(hex, percent)         // Lighten/darken color
BrandConfig.getContrastColor(hex)            // Return #000000 or #FFFFFF
BrandConfig.getButtonTextColor(primary, isDark)  // Text color for buttons
BrandConfig.hexToRgba(hex, opacity)          // Convert hex to rgba
```

### Design System (config/designSystem.js)
```javascript
// Static Tokens (spacing, typography, shadows, glass)
DesignSystem.spacing.lg              // 16
DesignSystem.typography.body         // { fontSize: 16, ... }
DesignSystem.borderRadius.lg         // 16
DesignSystem.shadows.md              // iOS shadow
DesignSystem.glass.blur.medium       // 20 (glassmorphism blur intensity)
DesignSystem.glass.opacity.medium    // 0.2 (glassmorphism background opacity)
```

### Glassmorphism Components (iOS-styled)
```javascript
// Glass Components (shared/components/)
<GlassContainer blur="medium" opacity={0.2}>...</GlassContainer>
<GlassCard blur="heavy" opacity={0.4}>...</GlassCard>
<GlassButton title="Submit" onPress={handleSubmit} />
<GlassInput value={text} onChangeText={setText} placeholder="..." />
<GlassHeader title="Orders" showBack={true} />
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
    folder:folders(id, name, color, icon)
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
      console.log('Change received:', payload.eventType, payload.new);
      
      // Handle INSERT
      if (payload.eventType === 'INSERT') {
        setOrders((prev) => [payload.new, ...prev]);
      }
      
      // Handle UPDATE
      if (payload.eventType === 'UPDATE') {
        setOrders((prev) => prev.map((o) => 
          o.id === payload.new.id ? payload.new : o
        ));
      }
      
      // Handle DELETE
      if (payload.eventType === 'DELETE') {
        setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
      }
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [company?.id]);
```

### Optimistic Updates (OrdersContext)
```javascript
// ✅ PREFERRED: Use optimistic methods for instant UI feedback
const { optimisticUpdateOrder, optimisticCreateOrder, optimisticDeleteOrder } = useOrders();

// Update Order
const { success, error } = await optimisticUpdateOrder(orderId, { status: 'done' });
if (!success) {
  showToast({ message: error.message, type: 'error' });
}

// Create Order
const { success, data, error } = await optimisticCreateOrder(orderData);
if (success) {
  navigation.goBack();
}

// Delete Order
const { success, error } = await optimisticDeleteOrder(orderId);
```

### Date & Time Handling
```javascript
import { TimeUtils } from '../../../shared/utils/timeUtils';

// Format DateTime
TimeUtils.formatDateTime(date)       // "17.11.2025, 18:30 Uhr"

// Format Countdown
TimeUtils.formatCountdown(dueDate)   // "2d" | "5h" | "30m" | "Überfällig"

// Critical Check
TimeUtils.isCritical(dueDate, criticalHours)  // true if within critical window

// Parse ISO string
const date = new Date(order.due_date);
```

### File Upload (Supabase Storage)
```javascript
import { uploadImage } from '../../../shared/utils/storage';

// Upload Image
const imageUrl = await uploadImage(imageUri, 'order-images', `${orderId}.jpg`);

// ✅ Storage Buckets:
// - order-images       (public)
// - company-logos      (public)
// - profile-pictures   (public)
// - recipe-images      (public)

// Delete Image (manual)
const { error } = await supabase.storage
  .from('order-images')
  .remove([`${orderId}.jpg`]);
```

### Error Handling
```javascript
// ✅ CORRECT: Always handle errors with Toast
import { useToast } from '../../../shared/components/Toast';

const { showToast } = useToast();

try {
  const { data, error } = await supabase.from('orders').insert(orderData);
  if (error) throw error;
  
  showToast({ message: 'Order erstellt!', type: 'success' });
  navigation.goBack();
} catch (error) {
  console.error('Create Order Error:', error);
  showToast({ 
    message: error.message || 'Fehler beim Erstellen', 
    type: 'error' 
  });
}
```

### Loading States
```javascript
// ✅ CORRECT: Use loading states from contexts
const { orders, loading } = useOrders();

if (loading) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}
```

---

## 🚨 Known Issues & Limitations

### Critical Issues
1. **Recipes Feature (35% complete)**
    - **Problem:** DB table `recipes` does not exist
    - **Workaround:** Frontend uses `orders` table with category filter
    - **Files affected:**
        - `features/recipes/screens/RecipeListScreen.js`
        - `features/recipes/screens/CreateRecipeScreen.js`
    - **Fix:** Create `recipes` table in Supabase with proper schema + RLS policies

### Non-Critical Issues
1. **Email Sending Not Integrated**
    - Edge Functions exist but not connected
    - Team invitations generate codes but don't send emails
    - Manual code sharing required

---

## 🛠️ Development Guidelines

### When Fixing Bugs

**⚠️ STEP 0: Verify & Clarify (ALWAYS DO THIS FIRST)**
```
1. Find the relevant file/code based on user description
2. Read current code and compare to user's description
3. If there's a mismatch between what you find vs. what user described:
   → Show user what you found: "I see [current code] at [location]"
   → Ask: "Is this what you're referring to? Should I change it to [X]?"
   → WAIT for user confirmation before making ANY changes
4. If it matches: Proceed with steps 1-4 below
5. If user confirms it was recently changed: Ask what they want done
```

**Example Clarification:**
```
User: "Orders show food icon as fallback"
You Find: <MaterialCommunityIcons name="clipboard-list-outline" />
You Say: "I found RecipeListScreen.js line 364 uses 'clipboard-list-outline'. 
         This doesn't match the 'food' icon you mentioned. Was this recently 
         changed, or am I looking at the wrong file? Should I still modify it?"
```

**THEN: Standard Bug Fix Flow**
1. **Identify the affected layer:**
    - UI bug → Check Screen component + useThemedStyles
    - Data bug → Check Context Provider + Realtime subscription
    - Permission bug → Check usePermissions hook
    - Theming bug → Check BrandConfig + DesignSystem

2. **Reproduce the bug:**
    - Check if `company_id` filter is present
    - Check if RLS policies allow the operation
    - Check if user has required permissions
    - Check console for errors

3. **Fix with minimal changes:**
    - Don't refactor unrelated code
    - Don't change working patterns
    - Don't break existing tests
    - Always test with Admin, Co-Admin, and Employee roles

4. **Test multi-tenant isolation:**
    - Create test companies
    - Verify data doesn't leak between companies
    - Check RLS policies in Supabase dashboard

### When Adding Features
1. **Check if Context Provider exists:**
    - Use OrdersContext, TeamContext, FoldersContext
    - Don't create new state management
    - Use selector hooks for derived state

2. **Follow theming patterns:**
    - ALWAYS use `useThemedStyles()` hook
    - Use `theme.colors.*` for dynamic colors
    - Use `theme.spacing.*`, `theme.typography.*` for static tokens
    - Use Glass components for iOS-styled UI

3. **Add permission checks:**
    - Use `usePermissions()` hook
    - Check `can('permission')` before showing UI
    - Check permissions before API calls

4. **Add Realtime if needed:**
    - Subscribe to table changes with `company_id` filter
    - Handle INSERT, UPDATE, DELETE events
    - Cleanup subscription on unmount

### When Modifying Screens
1. **Check navigation structure:**
    - Admin screens in `AdminTabNavigator`
    - Employee screens in `EmployeeTabNavigator`
    - Shared screens registered in both navigators

2. **Check Context usage:**
    - Use split contexts (OrdersContext, TeamContext, FoldersContext)
    - Avoid AppDataContext (legacy wrapper)
    - Use selector hooks for filtered data

3. **Check styling:**
    - Use `useThemedStyles()` hook
    - Don't hardcode colors
    - Use Design System tokens

---

## 📝 Example Tasks & Solutions

### Task: "Fix order creation not working"
**Diagnosis Steps:**
1. Check `CreateOrderScreen.js` → `handleSubmit()` function
2. Check if `company_id` is included in insert
3. Check if `author_id` is set correctly
4. Check RLS policy for `orders` table (INSERT)
5. Check console for Supabase errors
6. Check if `optimisticCreateOrder()` is used correctly

**Common Causes:**
- Missing `company_id` in insert
- RLS policy blocking insert
- Invalid data validation
- Network error (check internet)

**Solution Template:**
```javascript
// Check: config/supabaseClient.js
export const getCurrentCompanyId = async () => { ... }  // Must return valid UUID

// Check: CreateOrderScreen.js
const { company } = useAuth();
const { optimisticCreateOrder } = useOrders();

const handleSubmit = async () => {
  const orderData = {
    title,
    company_id: company.id,      // ✅ Must be present
    author_id: user.id,          // ✅ Must be present
    created_at: new Date().toISOString(),
    ...otherFields
  };
  
  const { success, error } = await optimisticCreateOrder(orderData);
  if (!success) {
    showToast({ message: error.message, type: 'error' });
  }
};
```

### Task: "Add new field to orders"
**Steps:**
1. Add column to `orders` table in Supabase
2. Update RLS policies if needed
3. Update `CreateOrderScreen.js` (add input field)
4. Update `EditOrderScreen.js` (add input field)
5. Update `OrderDetailScreen.js` (display field)
6. Test with all roles (Admin, Co-Admin, Employee)

**Example:**
```javascript
// 1. Supabase SQL:
ALTER TABLE orders ADD COLUMN custom_field TEXT;

// 2. CreateOrderScreen.js:
const [customField, setCustomField] = useState('');

<GlassInput
  value={customField}
  onChangeText={setCustomField}
  placeholder="Custom Field"
/>

// 3. Include in orderData:
const orderData = {
  ...existingFields,
  custom_field: customField
};
```

### Task: "User can't see orders"
**Diagnosis Steps:**
1. Check user role: `user.role`
2. Check company_id: `user.company_id`
3. Check RLS policies in Supabase dashboard
4. Check if `company_id` filter is in query
5. Check if orders exist for this company
6. Check Realtime subscription filter

**Common Causes:**
- User has no `company_id` (company deleted)
- RLS policy blocking SELECT
- Query missing `company_id` filter
- Wrong company_id in filter

**Solution Template:**
```javascript
// Check: features/auth/authContext.js
console.log('User:', user);           // Has company_id?
console.log('Company:', company);     // Exists?

// Check: shared/contexts/OrdersContext.js
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('company_id', company.id);      // ✅ Filter present?
  
console.log('Orders:', data);
console.log('Error:', error);         // RLS policy blocking?
```

### Task: "Theme not applying correctly"
**Diagnosis Steps:**
1. Check if `useThemedStyles()` hook is used
2. Check if `theme.colors.*` is used (not hardcoded colors)
3. Check if `ThemeProvider` is in App.js
4. Check if `BrandingProvider` is in App.js
5. Check if logo branding is enabled

**Common Causes:**
- Screen uses `StyleSheet.create()` directly (wrong)
- Hardcoded colors instead of `theme.colors.*`
- Theme context not available (Provider missing)

**Solution Template:**
```javascript
// ❌ WRONG:
const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF' }  // Hardcoded
});

// ✅ CORRECT:
import useThemedStyles from '../../../shared/hooks/useThemedStyles';

const MyScreen = () => {
  const styles = useThemedStyles(createStyles);
  return <View style={styles.container}>...</View>;
};

const createStyles = (theme) => ({
  container: {
    backgroundColor: theme.colors.background,  // Dynamic
    padding: theme.spacing.lg                  // Static token
  }
});
```

---

## 🎯 Quick Reference

### Must-Have Imports for Every Screen
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../features/auth/authContext';
import { usePermissions } from '../../../features/auth/hooks/usePermissions';
import { useOrders } from '../../../shared/contexts/OrdersContext';
import { useToast } from '../../../shared/components/Toast';
import useThemedStyles from '../../../shared/hooks/useThemedStyles';
```

### Must-Check Before Any Change
- [ ] Is `company_id` included in query/insert/update?
- [ ] Does user have permission for this action?
- [ ] Is RLS policy allowing this operation?
- [ ] Is theme applied via `useThemedStyles()`?
- [ ] Is error handled with Toast?
- [ ] Is loading state shown?
- [ ] Is Realtime subscription filtered by `company_id`?

### Emergency Debugging
```javascript
// Auth Status
import { debugAuthStatus } from './config/supabaseClient';
await debugAuthStatus();  // Logs: session, user, company, role

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

## 🚀 Performance Optimizations

### Context Optimizations (Phase 3)
- ✅ Split contexts (Orders, Team, Folders) instead of monolithic AppDataContext
- ✅ `useMemo` for context values (prevents unnecessary re-renders)
- ✅ `useCallback` for CRUD functions (stable references)
- ✅ Selector hooks for derived state (no recalculations)
- ✅ Optimistic updates (instant UI feedback)

### Realtime Optimizations
- ✅ Deduplication (ignore events for optimistic operations)
- ✅ Filtered subscriptions (only relevant company data)
- ✅ Cleanup on unmount (prevent memory leaks)

### Caching (ordersService.js)
- ✅ In-memory cache with TTL (30s for orders, 60s for folders, 5m for users)
- ✅ Request deduplication (prevent duplicate fetches)
- ✅ Retry logic with exponential backoff (network resilience)
- ✅ Cache invalidation on mutations

### React Native Performance
- ✅ `FlatList` for long lists (virtualization)
- ✅ `React.memo` for expensive components
- ✅ Lazy loading disabled in tabs (prevents white flash)
- ✅ Animated transitions with `react-native-reanimated`

---

## 🔄 Migration Guide (Legacy → Phase 3)

### Replace AppDataContext with Split Contexts
```javascript
// ❌ OLD:
import { useAppData } from '../../../shared/appDataContext';
const { orders, folders, teamMembers, loading } = useAppData();

// ✅ NEW:
import { useOrders } from '../../../shared/contexts/OrdersContext';
import { useFolders } from '../../../shared/contexts/FoldersContext';
import { useTeam } from '../../../shared/contexts/TeamContext';

const { orders, loading: ordersLoading } = useOrders();
const { folders, loading: foldersLoading } = useFolders();
const { teamMembers, loading: teamLoading } = useTeam();

const loading = ordersLoading || foldersLoading || teamLoading;
```

### Replace Direct Supabase Queries with Context Methods
```javascript
// ❌ OLD:
const { data, error } = await supabase.from('orders').insert(orderData);

// ✅ NEW:
const { optimisticCreateOrder } = useOrders();
const { success, data, error } = await optimisticCreateOrder(orderData);
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
- `send-invitation-email` - Send team invitation emails (not integrated)

### External Libraries
- **Supabase:** https://supabase.com/docs
- **React Navigation:** https://reactnavigation.org/docs
- **Expo:** https://docs.expo.dev
- **date-fns:** https://date-fns.org/docs

---

**Last Updated:** 2025-11-17  
**App Version:** 1.0.2  
**Author:** AI-assisted development for Recipendent Team

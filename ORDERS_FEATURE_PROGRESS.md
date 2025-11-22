# Orders Feature - Web App Implementation Progress

## Overview
Building web app equivalent of iOS order feature with feature parity.

**Status:** Phase 1 Complete (Service Layer & Core Components) ✅

---

## ✅ Completed Components

### 1. Enhanced Order Service (`app/src/features/orders/services/orderService.js`)

#### New Functions Added:
- `updateOrderStatus()` - Updates status with tracking and auto-generates status change notes
- `addCommentToOrder()` - Adds comments to order notes
- `deleteComment()` - Removes comments from order notes
- `getCompanyUsers()` - Fetches all users for team assignment
- Enhanced `getOrders()` - Now supports folder filtering and loads assigned users
- Enhanced `createOrder()` - Includes all new fields (category, additional_text, customer_name, location, critical_timer, etc.)
- Enhanced `updateOrder()` - Auto-timestamps updates and loads assigned users

#### Features:
- ✅ Multi-tenant isolation (company_id filtering)
- ✅ Role-based access (employees see only assigned orders)
- ✅ Notes/comments system (JSONB array)
- ✅ Status change tracking (status_changed_by, status_changed_at)
- ✅ Assigned users loading (eager loading pattern)
- ✅ Folder support
- ✅ All iOS fields supported

### 2. Image Upload Service (`app/src/shared/utils/storage.js`)

#### Functions:
- `uploadImage()` - Upload to Supabase Storage
- `replaceImage()` - Replace existing image
- `deleteImage()` - Delete from storage
- `validateImageFile()` - Validate size and type
- `getSignedUrl()` - For private images (future use)

#### Features:
- ✅ Company-based file organization
- ✅ Automatic unique filenames
- ✅ Public URL generation
- ✅ File validation (size, type)
- ✅ Error handling

### 3. Comprehensive CreateOrder Component (`app/src/features/orders/components/CreateOrderNew.jsx`)

#### Features Implemented:
- ✅ **Image Upload** - Drag & drop with preview
- ✅ **All Fields** - title, category, description, additional_text, customer_name, location
- ✅ **Priority Selector** - Visual P1-P4 buttons with colors
- ✅ **Due Date Picker** - datetime-local input
- ✅ **Critical Timer** - Slider (0-48 hours)
- ✅ **Folder Selection** - Dropdown from company folders
- ✅ **Team Assignment** - "All team" toggle or individual selection
- ✅ **Editable by Assigned** - Checkbox for permissions
- ✅ **Form Validation** - Zod schema validation
- ✅ **Image Validation** - Size and type checks
- ✅ **TanStack Query** - For users and folders fetching
- ✅ **Responsive Design** - Tailwind CSS grid layouts

---

## 📋 Database Schema Support

### Orders Table Fields Covered:
```sql
✅ id, company_id, author_id, author_name (NOT NULL)
✅ title, description, additional_text
✅ customer_name, category, location
✅ priority (1-4), status (open/done)
✅ due_date, critical_timer
✅ folder_id, image_url
✅ assigned_to (UUID[]), editable_by_assigned
✅ notes (JSONB - comments + status changes)
✅ status_changed_by, status_changed_at
✅ created_at, updated_at
```

---

## 🚧 Next Steps (To Complete Feature Parity)

### High Priority:

1. **OrderDetail Component** (Critical)
   - Display all order fields
   - Comments section with add/delete
   - Status toggle button (Open/Done)
   - Image display with lightbox
   - Assigned users list
   - Edit/Delete buttons (permission-based)
   - Realtime updates for changes from other users

2. **EditOrder Component**
   - Copy of CreateOrder but pre-populated
   - Same form fields
   - Update instead of create

3. **Realtime Hook Enhancement** (`hooks/useOrderRealtime.js`)
   - Subscribe to orders table changes
   - Filter by company_id (RLS handles this)
   - Callbacks for INSERT, UPDATE, DELETE
   - Auto-invalidate TanStack Query cache

4. **OrderCard Component Enhancement**
   - Display all new fields
   - Priority badge with colors
   - Assigned users avatars
   - Folder badge
   - Critical/overdue indicators

5. **OrdersList Component Enhancement**
   - Filter by status (open/done/all)
   - Filter by folder
   - Filter by assigned user (for employees)
   - Search by title/customer
   - Sort options

### Medium Priority:

6. **Dashboard Screens**
   - Active Orders (status = 'open')
   - Critical Orders (due soon based on critical_timer)
   - Completed Orders (status = 'done')
   - Statistics widgets

7. **User Selection Component** (Reusable)
   - Used in CreateOrder, EditOrder
   - Checkbox list with avatars
   - Search/filter users

8. **Folder Management Integration**
   - Move order to folder (drag & drop?)
   - Folder-based filtering in OrdersList

### Low Priority:

9. **Notifications** (Future)
   - Order assigned notification
   - Status changed notification
   - New comment notification
   - Critical order alert

10. **Image Features** (Enhancement)
    - Multiple images per order
    - Image gallery/carousel
    - Image annotations

---

## 🔄 iOS Feature Comparison

| Feature | iOS | Web App | Status |
|---------|-----|---------|--------|
| **CRUD Operations** | ✅ | ✅ | Complete |
| **Optimistic Updates** | ✅ | ⏳ | Pending (TanStack Query supports this) |
| **Realtime Subscriptions** | ✅ | ⏳ | Hook exists, needs enhancement |
| **Image Upload** | ✅ | ✅ | Complete |
| **Comments System** | ✅ | ✅ | Service layer complete, UI pending |
| **Status Tracking** | ✅ | ✅ | Complete |
| **Priority System (1-4)** | ✅ | ✅ | Complete |
| **Due Date & Timer** | ✅ | ✅ | Complete |
| **Team Assignment** | ✅ | ✅ | Complete |
| **Editable by Assigned** | ✅ | ✅ | Complete |
| **Folder Support** | ✅ | ✅ | Complete |
| **All Fields** | ✅ | ✅ | Complete |
| **Notifications** | ✅ | ❌ | Not implemented |
| **Order Detail Screen** | ✅ | ⏳ | Pending |
| **Edit Screen** | ✅ | ⏳ | Pending |
| **Enhanced List View** | ✅ | ⏳ | Pending |

**Legend:** ✅ Complete | ⏳ In Progress | ❌ Not Started

---

## 🎯 Implementation Notes

### Multi-Tenant Architecture
- All queries filtered by `company_id` (from `useAuth` hook)
- RLS policies enforce company isolation
- Never bypass RLS with service_role key

### Permission System
- Admins: Full access
- Co-Admins: Permission-based (check `usePermissions` hook)
- Employees: Only assigned orders, limited editing

### Data Flow Pattern
```
User Action
  ↓
React Component (UI)
  ↓
TanStack Query (useMutation/useQuery)
  ↓
Order Service (orderService.js)
  ↓
Supabase Client (supabase.js)
  ↓
PostgreSQL (with RLS policies)
  ↓
Realtime (broadcasts changes)
  ↓
useOrderRealtime Hook
  ↓
TanStack Query Cache Invalidation
  ↓
Component Re-renders with fresh data
```

### File Structure
```
app/src/
├── features/orders/
│   ├── components/
│   │   ├── CreateOrder.jsx (OLD - 188 lines)
│   │   ├── CreateOrderNew.jsx (NEW - 500+ lines, comprehensive) ✅
│   │   ├── OrderDetail.jsx (TODO - critical)
│   │   ├── EditOrder.jsx (TODO)
│   │   ├── OrderCard.jsx (EXISTS - needs enhancement)
│   │   └── OrdersList.jsx (EXISTS - needs enhancement)
│   ├── services/
│   │   └── orderService.js (ENHANCED) ✅
│   └── hooks/
│       └── useOrderRealtime.js (EXISTS - needs enhancement)
├── shared/
│   └── utils/
│       └── storage.js (NEW) ✅
```

---

## 🔧 Configuration Required

### Supabase Storage Bucket
Ensure `order-images` bucket exists with:
- Public access enabled
- RLS policies allowing upload by authenticated users
- Path structure: `{company_id}/orders/{filename}`

### Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📝 Next Immediate Action

**Replace old CreateOrder.jsx with new version:**
```bash
mv app/src/features/orders/components/CreateOrder.jsx app/src/features/orders/components/CreateOrder.old.jsx
mv app/src/features/orders/components/CreateOrderNew.jsx app/src/features/orders/components/CreateOrder.jsx
```

Then build **OrderDetail.jsx** as the most critical missing piece for feature parity.

---

## 🚀 Testing Checklist

### When OrderDetail is complete:
- [ ] Create order with all fields
- [ ] Upload image
- [ ] Assign to team members
- [ ] View order detail
- [ ] Add comments
- [ ] Change status (open ↔ done)
- [ ] Edit order
- [ ] Delete order
- [ ] Test as Employee (see only assigned)
- [ ] Test realtime updates (2 browser tabs)
- [ ] Test folder filtering
- [ ] Test priority filtering

---

## 📚 References

- iOS Code: `/tmp/orders/` (extracted from orders.zip)
- SQL Schema: `docs/Supabase SQL Schema.txt`
- CLAUDE.md: Project guidelines and architecture

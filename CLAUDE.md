# Projekt: Recipendent iOS App - Claude Code Integration Guide

# Meine Notes (ignoriere diesen Bereich)
git pull origin claude/ios-expo-claude-md-011CUpZFR2ckwbzkMpGiozSe
git merge claude/ios-expo-claude-md-011CUpZFR2ckwbzkMpGiozSe
git push origin main
Device UDID: 00008150-000869900C88401C

# Expo Details (ignoriere diesen Bereich)
Project Credentials Configuration

Project                   @moav16/recipendent-app
Bundle Identifier         com.recipendent.app

Ad Hoc Configuration

Distribution Certificate  
Serial Number             3C6619396108788CBF6EEC2B041DC439
Expiration Date           Sun, 08 Nov 2026 14:33:11 GMT+0100
Apple Team                H34S3RDUW7 (MUHAMMED AVCI (Individual))
Updated                   4 minutes ago

Provisioning Profile      
Developer Portal ID       X56A37ADU5
Status                    active
Expiration                Sun, 08 Nov 2026 14:33:11 GMT+0100
Apple Team                H34S3RDUW7 (MUHAMMED AVCI (Individual))
Provisioned devices       - iPhone (UDID: 00008150-000869900C88401C)
Updated                   7 seconds ago

# Config
- Diese Config gilt als "normal-mode" und ist standardmäßig aktiv wenn ich keine Befehle anordne.
- Du befolgst diese Config strikt, außer ich gebe ein Befehl ein der dein Mode ändern soll.
- Konzentration auf sauberen Code.
- Formuliere deine wörtlichen Antworten sachlich und knapp.
- Generiere keine zusätzlichen Dokumente wie Erklärungen oder Zusammenfassungen pro Änderung die du vornimmst, außer wenn ich es will.
- Versuche Tokens zu sparen wenn du kannst, aber nur dann, wenn es NICHT die Code-Qualität einschränkt.
- Stichpunkte mit einem "Var_" sind Variablen, behandele Sie wie eine Syntax in dieser Config.
- Meine Anrede ist: Var myName
- Variablen B_1 bis B_X sind Befehle, die du ausführst in der Konsole, wenn ich es dir schreibe.
  Eine Beispiel-Nachricht könnte sein: "rpd -help", deine Antwort darauf: Du führst diesen Befehl aus.
  Noch ein Beisiel: rpd -l 4 : Du gibst Bereich [4] als Text aus.
- Befehle können mit der verfassten Nachricht kombiniert werden.
- Befehle musst du erkennen und ausführen, egal ob sie am anfang, am ende oder mitten in der Nachricht stehen.
- Ignoriere beim lesen des Projekts diese Ordner: node_modules, cloudflare-pages

# Syntax
**Stichpunkte mit einem "Var_" sind Präfixe, behandele Sie wie eine Syntax in deiner Config.**
- Var myName               : Chef_R.
- Var [1-X]                : Dies sind Bereiche, die neben den Überschriften mit "[]" gekennzeichnet sind 
                             und nummeriert sind von 1 bis X.
- Var B_1 rpd -init -d     : Lese CLAUDE.md vollständig durch und verstehe das Projekt vollständig, ohne außnahme einer Datei. 
                             Bestätige mit "✅ Initialized CLAUDE.md.".
- Var B_2 rpd -init -proj  : Lese das gesamte Projekt vollständig durch, verstehe alles und vervollständige/korrigiere diese CLAUDE.md
                             wenn es etwas zum vervollständigen/korrigieren gibt. 
                             Bestätige mit "✅ Initialized [Projekt-Hauptordner-name].".
- Var B_3 rpd -init -proj /[file_1], [file_2], [file_X]:
                             Lese das gesamte Projekt vollständig durch, verstehe alles und vervollständige diese CLAUDE.md, 
                             Schließe die Dateien [file_1 - X] aus aus deinem Kontext und deiner initialisierung.
                             Bestätige mit "✅ Initialized [Projekt-Hauptordner-name].".
- Var B_3 rpd -check       : Prüfe, ob der Inhalt dieses Dokumentes dem Inhalt des Projektordners entspricht, 
                             wenn nein, liste Unterschiede ordentlich kurz und knapp auf.
- Var B_4 rpd -up          : Dieses Dokument durch deine code-erneuerungen updaten.
- Var B_5 rpd -sum         : eine ganz kurz und knappe zusammenfasung der in dieser session gemachten änderungen geben.
- Var B_6 rpd -help        : Erkläre in einem kurzen Satz dieses Projekt und zeige alle möglichen Befehle 
                             und Modis untereinander gelistet in Kategorien und eckigen klammern  an, 
                             zmB: "[rpd -init]: ...", [Modi 1]: ...", usw.
- Var B_7 rpd -l [1-X]     : Gebe den Bereich [1-X] als Text aus.
- Var B_8 rpd -think [1-X] : Gebe Änderungs-Vorschläge im Bereich [1-X]
- Var GIT git -check       : Schaue, ob das Projekt mit der Git Repo verbunden ist, wenn nicht, gebe anweisungen zum verbinden.
- Var GIT git -full        : Pushe alle Änderungen im Projekt mit detaillierten Beschreibungen zu jeder File in die Git Repo des Projekts.
- Var B_9 rpd -last        : Was weißt du noch über unseren letzten Chat ?
- Var B_10 rpd -unhandled  : Liste alle unbenutzten Dateien, Const's, imports/exports, Dependencies innerhalb
                             diesen Projekts auf.
- Var B_11 rpd -cat -err   : Kategorisiere die Projekt dateien in Ordner mit Unterordnern und liste fehlerhafte, unbenutzte und unbrauchbare 
                             Codes / Dateien / Pfade auf.


# Modis
"t" = Token 
- Mod M_1 rpd mod -t -e : "s" = saving-mode -> Token Sparmodus -> Gehe sehr sparsam mit deinen Tokenausgaben um. 
- Mod M_2 rpd mod -t -p : "q" = performance-mode -> Maximale Konzentration auf Qualität des Ergebnisses, ohne rücksicht auf Token-Verbrauch .
- Mod M_3 rpd mod -t -n : normal-mode -> Standard-Config Einstellung
- Mod M_4 rpd mod -t -f : "f" = fast-mode -> Eine Mischung aus schnell und effizient.
- Mod M_5 rpd mod -g -s : "g" = git-mode, "s" = start -> Halte die Git-Repository auf den neusten stand mit git befehlen
- Mod M_6 rpd mod -g -e : "e" = end -> Beende den git-mode und wechsle auf den vorherigen Modus.
- Mod M_7 rpd mod -supa -s : "supa" = supabase-mode ->
                             Jede Migration die du erstellst für supabase soll im Ordner supabase/migrations/pending landen, 
                             dann, nachdem du mich gefragt hast "Migration in SQL-Schema implementieren?"
                             und ich mit "ja" antworte, soll die Migration in das SQL Schema "Supabase SQL Schema.txt" eingebunden werden
                             und die Migrations-Datei selbst vom ordner "pending" in Ordner "migrated" verschoben werden. 
                             wenn ich weder Ja noch Nein sage, frage so lange weiter nach bis ich ja oder nein sage, 
                             aber achtung: die Migration könnte destructive sein, deshalb binde es
                             dies berücksichtigend in die .txt ein, damit die App ein sauberes SQL-Schema hat um es zukünftig
                             bei Abruf zu verstehen.
- Mod M_8 rpd mod -supa -e : supabase-mode deaktivieren.

## Project Overview 

**Recipendent** ist eine iOS Expo React Native App für die Auftrags- 
und Bestellverwaltung mit rollenbasiertem Team-Management.
Die App ermöglicht Unternehmen, ihre Aufträge zu erstellen, zu verwalten, zu verteilen 
und ihr Team zu koordinieren.

### Tech Stack [1]

- **Framework:** Expo SDK 54
- **React:** 19.1.0
- **React Native:** 0.81.5
- **Backend:** Supabase (PostgreSQL + Realtime + Auth + Storage)
- **Navigation:** React Navigation v7 (Stack + Bottom Tabs)
- **Animations:** React Native Reanimated 4.1
- **State Management:** React Context API
- **Storage:** Expo SecureStore (für sensitive Daten)
- **TypeScript:** Konfiguriert aber nicht verwendet (tsconfig.json vorhanden, keine .ts/.tsx Files)

### Implementation Status Overview

| Feature | Status | Completeness | Critical Issues |
|---------|--------|--------------|-----------------|
| **Core Architecture** | ✅ Production | 95% | None |
| **Authentication** | ✅ Production | 95% | None |
| **Orders Management** | ✅ Production | 95% | None |
| **Team Management** | ✅ Production | 90% | Email sending not integrated |
| **Settings & Customization** | ✅ Production | 90% | None |
| **Recipes Feature** | ❌ **CRITICAL** | 35% | **Missing imports + Database table** |
| **Shared Components** | ✅ Production | 100% | None (Toast, useThemedStyles, Loading, DateTimePicker) |

**TypeScript:** tsconfig.json existiert, aber **nur 2 .ts Dateien** (Edge Functions) - Rest ist JavaScript.

### Key Dependencies [2]

```json
{
  "@supabase/supabase-js": "^2.76.1",
  "@react-navigation/native": "^7.0.15",
  "@react-navigation/bottom-tabs": "^7.2.1",
  "@react-navigation/native-stack": "^7.2.2",
  "react-native-reanimated": "~4.1.1",
  "react-native-ble-plx": "^3.5.0",
  "react-native-chart-kit": "^6.12.0",
  "expo-image-picker": "~17.0.8",
  "expo-local-authentication": "~17.0.7",
  "expo-secure-store": "~15.0.7"
}
```

---

## Project Architecture (

### Feature-Based Structure [3]

```
recipendent-app/
├── App.js                      # Root component mit Navigation
├── config/
│   ├── supabaseClient.js      # Supabase client setup
│   └── theme.js               # Design system & theme constants
├── navigation/
│   ├── AppTabNavigator.js     # Tab Navigator für Admin/Employee
│   └── AppTabBar.js           # Custom Tab Bar Component
├── features/
│   ├── auth/                  # Authentication
│   │   ├── authContext.js     # Auth Context Provider
│   │   ├── hooks/             # usePermissions hook
│   │   ├── screens/           # Login, Register, Start
│   │   ├── components/        # AnimatedBackground, AnimatedSubmitButton
│   │   └── services/          # loginService, registrationService
│   ├── orders/                # Bestellverwaltung
│   │   ├── screens/           # Create, Edit, Detail, Active, Completed, Critical
│   │   ├── components/        # RecipeCard, EmptyState
│   │   └── services/          # crudOperations, realtimeService
│   ├── recipes/               # Rezeptverwaltung
│   │   ├── screens/           # Folders, List, Create, Management
│   │   └── components/        # FolderCard, FolderModal, SwipeableFolderCard
│   ├── settings/              # Einstellungen
│   │   ├── CompanyContext.js  # Company Context Provider
│   │   └── screens/           # AdminSettings, EditProfile, LogoCustomization, EmployeeSettings
│   └── team/                  # Team Management
│       └── screens/           # TeamManagement, EmployeeWelcome, EmployeeProfile, CoAdminPermissions
├── shared/
│   ├── components/
│   │   ├── loading/           # LoadingAnimation
│   │   ├── Toast/             # Toast notification system
│   │   └── DateTimePicker/    # iOS-style date/time picker
│   ├── hooks/
│   │   └── useThemedStyles.js # Dynamic styling hook (used by 26 files)
│   ├── utils/
│   │   ├── storage.js         # AsyncStorage helpers
│   │   ├── colorExtractor.js  # Logo color extraction
│   │   └── timeUtils.js       # Time formatting utilities
│   └── themeContext.js        # Theme management
├── assets/
│   └── images/                # App icons, splash screens
├── scripts/
│   └── apply-theme-to-screen.sh # Theme migration script
└── supabase/
    ├── functions/             # Supabase Edge Functions
    └── migrations/            # SQL migrations (RLS policies)
```

---

## Database Schema (Supabase PostgreSQL) [4]

### Overview

Die App verwendet eine **multi-tenant Architektur** mit `company_id` als Tenant-Identifier.
Jedes Unternehmen hat isolierte Daten durch Row Level Security (RLS) Policies.

**Haupttabellen:**
- `companies` - Firmen/Tenants mit Logo-Customization
- `users` - App-Benutzer (erweitert auth.users) mit Rollen (admin, co-admin, employee)
- `orders` - Bestellungen/Aufträge mit Notes, Priority, Multi-Assignment
- `folders` - Organisation für Recipes/Orders
- `invitation_codes` - Team-Einladungssystem
- `co_admin_permissions` - Granulare Berechtigungen für Co-Admins
- ⚠️ `recipes` - **FEHLT** (Frontend vorbereitet, DB-Tabelle fehlt)

**Details:** Siehe `./supabase/Supabase SQL Schema.txt` für vollständiges SQL-Schema, RLS Policies, Storage Buckets, Edge Functions und Query-Beispiele.


## Core Concepts

### 1. Rollen-System

Die App unterstützt drei Benutzerrollen mit unterschiedlichen Berechtigungen:

- **Admin:** Vollzugriff auf alle Features (Team, Orders, Recipes, Settings)
- **Co-Admin:** Eingeschränkter Admin mit konfigurierbaren Permissions
- **Employee:** Begrenzter Zugriff (Orders ansehen/bearbeiten, Recipes ansehen)

### 2. Authentication Flow

**Auth Context:** `features/auth/authContext.js`
**Supabase Client:** `config/supabaseClient.js`

- Email/Password Authentication via Supabase
- Email Verification mit Deep Linking (App.js:34-95)
- Secure Session Storage mit Expo SecureStore
- Auto-refresh tokens

**Key Functions:**
```javascript
// config/supabaseClient.js
getCurrentUser()         // User object
getCurrentUserRole()     // 'admin' | 'co-admin' | 'employee'
getCurrentCompanyId()    // Company ID from users table
logoutUser()            // Sign out
```

**Key Features:**
- **Realtime Subscriptions:** Live-Updates für Orders (`features/orders/services/realtimeService.js`)
- **Row Level Security (RLS):** Multi-Tenant Isolation via `company_id`
- **Storage Buckets:** Logos, Profile Pictures, Order Images
- **Auth Integration:** Email/Password + Email Verification
- **Secure Session:** Expo SecureStore für persistent sessions

**Query Patterns:**
```javascript
// Mit company_id filtering (RLS)
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    author:users!author_id(first_name, last_name, profile_picture),
    folder:folders(name, color)
  `)
  .eq('company_id', companyId)
  .order('created_at', { ascending: false });
```

### 3. Hooks & Advanced Features

#### usePermissions Hook

**Location:** `features/auth/hooks/usePermissions.js`

Sophisticated permission checking system für role-based access control:

```javascript
import { usePermissions } from '../auth/hooks/usePermissions';

const MyComponent = () => {
  const {
    isAdmin,              // User ist Admin
    isCoAdmin,            // User ist Co-Admin
    isEmployee,           // User ist Employee
    can,                  // Permission checker
    isOwner,              // Ownership check
    canEdit,              // Combined permission + ownership check
    loading,              // Loading state
    coAdminPermissions    // Raw permissions object
  } = usePermissions();

  if (can('editOrders')) {
    // Show edit button
  }

  if (canEdit('editOrders', orderId)) {
    // User can edit this specific order
  }
};
```

**Supported Permissions:**
- **Team:** `inviteEmployees`, `removeEmployees`, `viewTeam`
- **Orders:** `createOrders`, `editOrders`, `deleteOrders`, `deleteComments`, `viewAllOrders`
- **Recipes:** `createRecipes`, `editRecipes`, `deleteRecipes`, `manageFolders`
- **Company:** `editCompanyInfo`, `editCompanyLogo`, `editCompanyColors`
- **User:** `promoteToCoAdmin`, `demoteCoAdmin`, `editEmployeeProfiles`, `viewInvitationCodes`

**Implementation Details:**
- Queries `co_admin_permissions` table directly
- Caches permissions for performance
- Auto-refreshes on user role change
- Provides loading state for async operations

#### useThemedStyles Hook

**Location:** `shared/hooks/useThemedStyles.js`

Dynamic styling system that enables theme-aware component styling:

**Usage Pattern:**
```javascript
import useThemedStyles from '../../../shared/hooks/useThemedStyles';

const MyScreen = () => {
  const { isDark } = useThemedStyles(createStyles);

  // Access dynamic styles
  return <View style={styles.container}>...</View>;
};

const createStyles = (theme, isDark) => ({
  container: {
    backgroundColor: theme.backgroundColor,
    // isDark can be used for conditional styling
  },
  text: {
    color: theme.textColor,
  }
});
```

**Features:**
- ✅ Automatically updates styles on theme change
- ✅ Provides `isDark` boolean for conditional logic
- ✅ Integrates with ThemeContext
- ✅ Memoized for performance
- ✅ Used by 26 screens across the app

**Screens using this hook:**
- All major screens (Orders, Recipes, Team, Settings)
- 159 total occurrences in codebase

#### Design System

**Architektur:**
- **`config/brandConfig.js`** - Dynamische Farben & Logo-Branding
- **`config/designSystem.js`** - Statische Design-Tokens (Spacing, Typography, Shadows, Glassmorphism)

**Brand Configuration (brandConfig.js):**
```javascript
import BrandConfig from '../config/brandConfig';

// Zentrale Farb-Logik
BrandConfig.defaultPrimary              // '#ad42b3' (Standard App-Farbe)
BrandConfig.getPrimaryColor(useBranding, logoColor)  // Dynamisch: Logo oder Standard
BrandConfig.getColorPalette(primary, isDark)         // Komplette Palette (inkl. Dark Mode)

// Helper Functions
BrandConfig.adjustColor(hex, percent)   // Helligkeit anpassen
BrandConfig.getContrastColor(hex)       // Optimal lesbare Text-Farbe
BrandConfig.hexToRgba(hex, opacity)     // Hex → RGBA Konvertierung
```

**Design Tokens (designSystem.js):**
```javascript
import { DesignSystem } from '../config/designSystem';

// Spacing: xs(4) → sm(8) → md(12) → lg(16) → xl(20) → xxl(24) → xxxl(32)
DesignSystem.spacing.md

// Typography: h1, h2, h3, h4, body, bodySmall, caption, button, input
DesignSystem.typography.body  // { fontSize: 16, fontWeight: '400', lineHeight: 22 }

// Border Radius: xs(4) → sm(8) → md(12) → lg(16) → xl(20) → xxl(24) → round(9999)
DesignSystem.borderRadius.lg

// Shadows: none, sm, md, lg (iOS optimiert)
DesignSystem.shadows.md

// Glassmorphism (iOS frosted glass)
DesignSystem.glass.blur.medium          // Blur intensity: ultraLight(5), light(10), medium(20), heavy(40)
DesignSystem.glass.opacity.medium       // Background opacity: ultraLight(0.05), light(0.1), medium(0.2), heavy(0.4)
DesignSystem.glass.tint.light           // BlurView tint: light, dark, prominent, regular, extraLight
```

**Details:** Siehe `config/brandConfig.js` und `config/designSystem.js`

---

## Key Features & Implementation

### Orders Management

**Screens:**
- `CreateOrderScreen` - Neue Bestellung erstellen
- `EditOrderScreen` - Bestellung bearbeiten
- `OrderDetailScreen` - Bestelldetails anzeigen
- `AdminActiveOrdersScreen` / `EmployeeActiveOrdersScreen` - Aktive Bestellungen
- `CompletedOrdersScreen` - Abgeschlossene Bestellungen
- `CriticalOrdersScreen` - Kritische/dringende Bestellungen
- `UnifiedDashboardScreen` - Übersicht

**Services:**
- `crudOperations.js` - CRUD für Orders
- `realtimeService.js` - Realtime updates via Supabase

**Details:** Siehe `./supabase/Supabase SQL Schema.txt` für vollständiges Data Model.

**Key Features:**
- **Multi-Assignment:** Orders können mehreren Users zugewiesen werden (`assigned_to` Array)
- **Notes System:** jsonb Array für Kommentare/Notizen
- **Priority System:** 4 Prioritätsstufen (1-4)
- **Critical Timer:** Countdown für dringende Orders
- **Folder Organization:** Orders können in Ordnern organisiert werden
- **Edit Permissions:** `editable_by_assigned` Flag steuert, ob zugewiesene User editieren dürfen
- **Status Tracking:** Wer hat wann den Status geändert

### Recipes Management

**Status:** ⚠️ Teilweise implementiert (nutzt Orders als Workaround, keine dedizierte `recipes` DB-Tabelle)

**Screens:**
- `RecipeFoldersScreen` - Ordner-Verwaltung (✅ nutzt `folders` table)
- `RecipeListScreen` - Rezept-Liste (⚠️ nutzt `getOrders()` - Orders als Workaround)
- `CreateRecipeScreen` - Template-Erstellung (⚠️ LocalStorage only via `StorageService`)

**Components:**
- `FolderCard`, `SwipeableFolderCard` - Folder UI Components
- `FolderModal` - Create/Edit Modal

**Fehlende Integration:**
- ❌ Keine `recipes` Datenbanktabelle
- ❌ Recipes werden als Orders gespeichert (Workaround)
- ❌ Templates nur in LocalStorage, nicht synchronisiert
- ℹ️ Siehe `./supabase/Supabase SQL Schema.txt` für Migrations-Vorschlag

### Team Management

**Screens:**
- `TeamManagementScreen` - Team-Mitglieder verwalten (Admin only)
- `EmployeeWelcomeScreen` - Onboarding für neue Mitarbeiter
- `EmployeeProfileScreen` - Mitarbeiter-Profil erstellen
- `CoAdminPermissionsScreen` - Co-Admin Berechtigungen konfigurieren

**Invitation System:**

Die App verwendet ein **Einladungscode-System** für neue Team-Mitglieder:

1. **Admin generiert Einladungscode:**
   ```javascript
   const code = generateRandomCode(); // 6-stelliger Code
   const { data, error } = await supabase
     .from('invitation_codes')
     .insert({
       code,
       company_id: adminCompanyId,
       email: 'employee@example.com',  // Optional
       role: 'employee',  // oder 'co-admin'
       key_type: 'employee',
       expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 Tage
       sent_by: adminUserId
     });
   ```

2. **Employee registriert sich mit Code:**
    - EmployeeWelcomeScreen: Code eingeben
    - Code wird validiert (nicht used, nicht expired)
    - Employee erstellt Profil (EmployeeProfileScreen)
    - Code wird als "used" markiert

3. **Code Lifecycle:**
   ```javascript
   {
     code: string,           // Unique 6-digit code
     expires_at: timestamp,  // Expiration date
     used: boolean,          // Has been used?
     used_at: timestamp,     // When was it used?
     used_by: uuid,          // Who used it?
     sent_by: uuid,          // Admin who created it
     company_id: uuid,       // Target company
     role: 'employee' | 'co-admin' | 'admin',
     email: string | null    // Optional pre-assignment
   }
   ```

**Co-Admin Permissions:**

Co-Admins haben konfigurierbare Berechtigungen (gesetzt in `CoAdminPermissionsScreen`):

**Duale Speicherung:**
1. `users.co_admin_permissions` (jsonb) - für schnellen Zugriff
2. `co_admin_permissions` Tabelle - für strukturierte Queries

**Permissions:**
```javascript
{
  can_manage_team: boolean,           // Team verwalten
  can_edit_recipes: boolean,          // Rezepte bearbeiten
  can_delete_orders: boolean,         // Orders löschen
  can_create_recipes: boolean,        // Rezepte erstellen
  can_delete_recipes: boolean,        // Rezepte löschen
  can_manage_folders: boolean,        // Ordner verwalten
  can_delete_comments: boolean,       // Kommentare löschen
  can_edit_all_orders: boolean,       // Alle Orders bearbeiten
  can_delete_employees: boolean,      // Employees entfernen
  can_invite_employees: boolean,      // Neue Employees einladen
  can_change_company_settings: boolean // Firmen-Settings ändern (meist false)
}
```

### Settings & Customization

**Screens:**
- `AdminSettingsScreen` - Admin-Einstellungen (Profil, Logo, Team, Logout)
- `EmployeeSettingsScreen` - Employee-Einstellungen (Profil, Benachrichtigungen, Logout)
- `EditProfileScreen` - Profil bearbeiten
- `LogoCustomizationScreen` - Firmenlogo hochladen/anpassen

**Logo Customization:**

Umfangreiche Logo-Anpassungsoptionen in der `companies` Tabelle:

```javascript
{
  logo: string,                      // Storage URL
  dominant_color: string,            // Extracted color (default '#2196F3')
  show_logo_in_dashboard: boolean,   // Logo im Dashboard zeigen?
  logo_position: string,             // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  logo_scale: number,                // 0.1 to 2.0 (default 1.0)
  logo_opacity: number               // 0 to 100 (default 30)
}
```

**Logo Upload Flow:**
1. Admin wählt Bild via `expo-image-picker`
2. Bild wird zu Supabase Storage hochgeladen
3. Color extraction: `shared/utils/colorExtractor.js` analysiert Logo
4. `dominant_color` wird automatisch gesetzt
5. Company record wird mit URL und Settings aktualisiert

**Theme System:**

Benutzer können zwischen 3 Themes wählen:

```javascript
// users.theme
'light'   // Standard Light Theme
'dark'    // Dark Theme
'custom'  // Custom Theme mit eigener Farbe

// Bei custom:
-- custom_theme_color removed - use BrandingContext instead
```

**Theme Context:** `shared/themeContext.js`
- Verwaltet aktives Theme
- Stellt Theme-Farben für die gesamte App bereit
- Reagiert auf System-Theme (automatic)

**Face ID / Biometric Authentication:**

**✅ Status: Production Ready**
- Implementation: `shared/utils/faceIdAuth.js`
- DB-Feld: `users.face_id_enabled`
- Features: Biometric guards für kritische Aktionen, Debug-Tools
- Details: Siehe `shared/utils/faceIdAuth.js`

### Toast Notification System

**Location:** `shared/components/Toast/`

Modernes, animiertes Toast-System für non-intrusive Benachrichtigungen (ersetzt Alert.alert für Erfolgs-Meldungen).

**Components:**
- `Toast.js` - Animated toast component mit 4 Typen
- `ToastContext.js` - Global provider mit `useToast()` hook
- Integriert in `App.js` via `<ToastProvider>`

**Usage:**
```javascript
import { useToast } from '../../../shared/components/Toast';

const MyScreen = () => {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      message: 'Erfolgreich gespeichert!',
      type: 'success',      // success | error | warning | info
      duration: 3000,       // optional, default 3000ms
      position: 'top'       // optional, default 'top'
    });
  };
};
```

**Features:**
- ✅ 4 Typen: Success (grün), Error (rot), Warning (orange), Info (blau)
- ✅ Slide-in Animation mit Spring-Effekt
- ✅ Auto-dismiss nach 3 Sekunden
- ✅ Manuell schließbar
- ✅ Icons für jeden Typ
- ✅ Non-blocking UI

**Implementiert in 9 Screens:**
- OrderDetailScreen, CreateOrderScreen, EditOrderScreen
- AdminSettingsScreen, EditProfileScreen, LogoCustomizationScreen
- CoAdminPermissionsScreen, EmployeeProfileScreen, CreateRecipeScreen

---

## Development Guidelines

### Environment Configuration

**Supabase Credentials:** In `app.json` unter `expo.extra`
- `supabaseUrl`
- `supabaseAnonKey`
- `supabaseServiceRoleKey` (⚠️ Achtung: Sollte nicht im Client verwendet werden!)

**Recommended:** Verwende `.env` Dateien und `expo-constants` für sensible Daten.

---

## Code Patterns & Conventions

### File Naming

- **Screens:** `PascalCaseScreen.js` (z.B. `CreateOrderScreen.js`)
- **Components:** `camelCase.js` oder `PascalCase.js` (z.B. `recipeCard.js`, `FolderCard.js`)
- **Services:** `camelCase.js` (z.B. `realtimeService.js`)
- **Contexts:** `camelCaseContext.js` (z.B. `authContext.js`)

### Import Structure

```javascript
// React & React Native
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Third-party libraries
import { useNavigation } from '@react-navigation/native';

// Local imports
import { supabase } from '../../../config/supabaseClient';
import { useAuth } from '../authContext';
import LoadingAnimation from '../../../shared/components/loading';
```


### Supabase Queries

```javascript
// CRUD pattern
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('company_id', companyId)
  .order('created_at', { ascending: false });

if (error) {
  console.error('Error:', error);
  return;
}

// Mit Realtime
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders',
    filter: `company_id=eq.${companyId}`,
  }, handleChange)
  .subscribe();

// Cleanup
return () => subscription.unsubscribe();
```

---

## Common Tasks

### Adding a New Screen

1. Create screen file in appropriate feature folder
2. Import and add to Stack.Navigator in `App.js`
3. Add to appropriate role section (employee/admin)
4. Update navigation types if using TypeScript

### Adding a New Feature Module

1. Create folder under `features/`
2. Create subfolders: `screens/`, `components/`, `services/`
3. Add context if needed
4. Update navigation and imports

### Adding a New Database Table

1. **Create Migration in Supabase:**
   ```sql
   CREATE TABLE public.my_table (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     company_id uuid REFERENCES companies(id) NOT NULL,
     -- your columns here
     created_at timestamp with time zone DEFAULT now(),
     updated_at timestamp with time zone DEFAULT now()
   );
   ```

2. **Enable RLS:**
   ```sql
   ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

   -- SELECT Policy
   CREATE POLICY "Users can view own company data"
   ON public.my_table FOR SELECT
   USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

   -- INSERT/UPDATE/DELETE Policies (role-based)
   CREATE POLICY "Admins can modify data"
   ON public.my_table FOR ALL
   USING (
     company_id = (SELECT company_id FROM public.users WHERE id = auth.uid())
     AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'co-admin')
   );
   ```

3. **Create Service Layer:**
   ```javascript
   // features/myfeature/services/myService.js
   import { supabase } from '../../../config/supabaseClient';
   import { getCurrentCompanyId } from '../../../config/supabaseClient';

   export const fetchItems = async () => {
     const companyId = await getCurrentCompanyId();
     const { data, error } = await supabase
       .from('my_table')
       .select('*')
       .eq('company_id', companyId)
       .order('created_at', { ascending: false });

     if (error) throw error;
     return data;
   };
   ```

4. **Add Realtime (optional):**
   ```javascript
   const subscription = supabase
     .channel('my_table')
     .on('postgres_changes', {
       event: '*',
       schema: 'public',
       table: 'my_table',
       filter: `company_id=eq.${companyId}`,
     }, handleChange)
     .subscribe();
   ```

### Implementing the Recipes Table (TODO)

Die `recipes` Tabelle fehlt aktuell. So würde man sie implementieren:

1. **Run Migration:**
   ```sql
   -- Siehe "Supabase SQL Schema" in ./supabase für vollständiges SQL
   CREATE TABLE public.recipes (...);
   ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
   -- Add policies
   ```

2. **Update Recipe Screens:**
    - `CreateRecipeScreen` - Supabase insert implementieren
    - `RecipeListScreen` - Supabase query implementieren
    - `RecipeManagementScreen` - Update/Delete implementieren

3. **Add Recipe Service:**
   ```javascript
   // features/recipes/services/recipeService.js
   export const createRecipe = async (recipeData) => {
     const companyId = await getCurrentCompanyId();
     const { data, error } = await supabase
       .from('recipes')
       .insert({ ...recipeData, company_id: companyId })
       .select()
       .single();

     if (error) throw error;
     return data;
   };
   ```

### Modifying User Roles/Permissions

1. Update database schema in Supabase
2. Modify `getCurrentUserRole()` in `config/supabaseClient.js`
3. Update conditional rendering in `App.js`
4. Add permission checks in relevant screens

### Checking Co-Admin Permissions

```javascript
// In component
import { supabase } from '../../../config/supabaseClient';

const checkPermission = async (permission) => {
  const { data: user } = await supabase.auth.getUser();

  // Option 1: Query users.co_admin_permissions (jsonb)
  const { data, error } = await supabase
    .from('users')
    .select('co_admin_permissions')
    .eq('id', user.id)
    .single();

  return data?.co_admin_permissions?.[permission] || false;
};

// Usage
const canEditRecipes = await checkPermission('can_edit_recipes');
```

### Styling & Theming

- Theme context: `shared/themeContext.js`
- Company colors: Extracted from logo in `shared/utils/colorExtractor.js`
- Use StyleSheet.create() for styles
- Consider responsive design (safe area, different screen sizes)

---

## Testing & Debugging

### Debug Auth Status

```javascript
import { debugAuthStatus } from './config/supabaseClient';

// In component
debugAuthStatus(); // Logs session, user, company, role
```

### Database Debugging

**Test RLS Policies:**
```javascript
// In Supabase SQL Editor als specific user:
SET LOCAL request.jwt.claims = '{"sub": "user-uuid-here", "role": "authenticated"}';

-- Test query
SELECT * FROM orders WHERE company_id = 'company-uuid';
```

**Check Current User Context:**
```javascript
const debugUserContext = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  console.log('Auth User:', user);
  console.log('Public User:', userData);
  console.log('Company ID:', userData.company_id);
  console.log('Role:', userData.role);
  console.log('Permissions:', userData.co_admin_permissions);
};
```

**Test Realtime Subscription:**
```javascript
const testRealtime = async () => {
  const companyId = await getCurrentCompanyId();

  const subscription = supabase
    .channel('test-orders')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'orders',
      filter: `company_id=eq.${companyId}`,
    }, (payload) => {
      console.log('Realtime event:', payload);
    })
    .subscribe((status) => {
      console.log('Subscription status:', status);
    });

  return () => subscription.unsubscribe();
};
```

**Debug Storage URLs:**
```javascript
// Get public URL
const { data } = supabase.storage
  .from('company-logos')
  .getPublicUrl('path/to/file.png');

console.log('Public URL:', data.publicUrl);

// List files
const { data: files } = await supabase.storage
  .from('company-logos')
  .list();

console.log('Files:', files);
```

### Common Issues

**Session nicht persistent:**
- Check SecureStore permissions
- Verify Supabase client config (config/supabaseClient.js:45-52)
- Ensure `autoRefreshToken: true` is set

**Navigation nicht funktioniert:**
- Ensure screen is registered in Stack.Navigator (App.js)
- Check role-based rendering in App.js:124-156
- Verify user.role matches expected value

**Realtime updates fehlen:**
- Verify RLS policies in Supabase (SELECT policy muss vorhanden sein)
- Check subscription filter: `company_id=eq.${companyId}`
- Ensure table has REPLICA IDENTITY enabled
- Check subscription status in console

**RLS Policy Errors:**
```
Error: new row violates row-level security policy
```
**Solution:**
- Check INSERT/UPDATE policies
- Ensure `company_id` is set correctly
- Verify user has correct role

**Missing Recipes Data:**
- ⚠️ Die `recipes` Tabelle existiert nicht im Schema
- Frontend ist vorbereitet, aber Backend fehlt
- Siehe "Implementing the Recipes Table" Sektion

**Invitation Code Errors:**
```javascript
// Debug invitation code
const { data, error } = await supabase
  .from('invitation_codes')
  .select('*')
  .eq('code', inputCode)
  .single();

console.log('Code found:', data);
console.log('Used:', data?.used);
console.log('Expired:', new Date(data?.expires_at) < new Date());
```

**Co-Admin Permission Issues:**
```javascript
// Check permissions
const { data } = await supabase
  .from('users')
  .select('co_admin_permissions')
  .eq('id', userId)
  .single();

console.log('Permissions:', data.co_admin_permissions);

// Also check co_admin_permissions table
const { data: perms } = await supabase
  .from('co_admin_permissions')
  .select('*')
  .eq('user_id', userId)
  .single();

console.log('Permissions Table:', perms);
```

---

## Important Files Reference

### Core Application Files

| File | Purpose | Key Lines |
|------|---------|-----------|
| `App.js` | Root component, navigation setup, role-based routing | :1, :124-156 (role routing) |
| `config/supabaseClient.js` | Supabase client, auth helpers, SecureStore adapter | :1, :16-39 (adapter), :64-112 (helpers) |
| `config/brandConfig.js` | Zentrale Brand-Logik (dynamic primary color, branding system) | All |
| `config/designSystem.js` | Design system constants (spacing, typography, shadows, glassmorphism) | All |
| `config/theme.js` | Legacy theme constants (deprecated, use brandConfig + designSystem) | All |
| `app.json` | Expo config, Supabase credentials, deep linking | :1, :10-13 (Supabase keys) |
| `package.json` | Dependencies & scripts | :1 |
| `eas.json` | EAS Build configuration | :1 |

### Context Providers

| File | Purpose |
|------|---------|
| `features/auth/authContext.js` | Authentication state, user session |
| `features/settings/CompanyContext.js` | Company data, logo, settings |
| `shared/themeContext.js` | Theme management (light/dark/custom) |
| `shared/brandingContext.js` | Logo-Branding System (useBranding hook, dynamic primary color) |
| `shared/appDataContext.js` | App-wide data cache & realtime subscriptions (preloads orders, folders, team) |

### Navigation

| File | Purpose |
|------|---------|
| `navigation/AppTabNavigator.js` | Tab Navigator für Admin/Employee |
| `navigation/AppTabBar.js` | Custom Tab Bar Component |

### Orders Feature

| File | Purpose |
|------|---------|
| `features/orders/services/crudOperations.js` | CRUD operations für Orders |
| `features/orders/services/realtimeService.js` | Realtime subscriptions |
| `features/orders/screens/CreateOrderScreen.js` | Order erstellen |
| `features/orders/screens/OrderDetailScreen.js` | Order Details mit Notes |

### Recipes Feature

| File | Purpose |
|------|---------|
| `features/recipes/screens/RecipeFoldersScreen.js` | Folder-Übersicht |
| `features/recipes/components/FolderCard.js` | Folder Card Component |
| `features/recipes/components/FolderModal.js` | Create/Edit Folder Modal |

### Team Management

| File | Purpose |
|------|---------|
| `features/team/screens/TeamManagementScreen.js` | Team-Mitglieder verwalten |
| `features/team/screens/EmployeeWelcomeScreen.js` | Invitation Code Eingabe |
| `features/team/screens/CoAdminPermissionsScreen.js` | Permissions konfigurieren |

### Settings & Customization

| File | Purpose |
|------|---------|
| `features/settings/screens/LogoCustomizationScreen.js` | Logo Upload & Anpassung |
| `features/settings/screens/EmployeeSettingsScreen.js` | Employee Einstellungen |
| `shared/utils/colorExtractor.js` | Farbe aus Logo extrahieren |
| `shared/utils/storage.js` | AsyncStorage helpers |
| `shared/utils/timeUtils.js` | Time formatting utilities |

### Hooks & Advanced Features

| File | Purpose |
|------|---------|
| `features/auth/hooks/usePermissions.js` | Advanced permission checking hook |
| `features/auth/components/AnimatedBackground.js` | Animated wave background for StartScreen |
| `features/auth/components/AnimatedSubmitButton.js` | Animated button with micro-interactions |
| `config/theme.js` | Design system constants (colors, spacing, typography, shadows) |

### Shared Components

| File | Purpose |
|------|---------|
| `shared/components/loading/` | Loading Animation Component |
| `shared/components/Toast/` | Modern Toast Notification System (success, error, warning, info) |
| `shared/components/DateTimePicker/CustomDateTimePicker.js` | iOS-style date/time picker |
| `shared/components/Glass*` | Glassmorphism UI System (GlassCard, GlassButton, GlassInput, GlassContainer, GlassHeader) |
| `shared/components/ActionSheet.js` | Native-style action sheet component |
| `shared/utils/faceIdAuth.js` | Biometric authentication helpers & guards |
| `shared/utils/glassStyles.js` | Glass effect utilities (blur, tint, opacity) |
| `shared/utils/glowEffects.js` | Glow & shine effect utilities |

### Supabase Edge Functions & Migrations

**Edge Functions:**

| File | Purpose | Status |
|------|---------|--------|
| `supabase/functions/send-invitation-email/index.ts` | Email invitation codes via Resend API | ⚠️ Implemented, not integrated |
| `supabase/functions/send-admin-invitation/index.ts` | Admin invitation emails via SendGrid | ⚠️ Implemented, not integrated |

**Database Migrations:**

Siehe `./supabase/migrations` für Details zu neuesten Migrationen.

---

## Database Schema Quick Reference

### Tables Overview

| Table | Primary Purpose | Key Fields |
|-------|----------------|------------|
| `companies` | Firmen/Tenants | name, logo, dominant_color, use_logo_branding, logo settings |
| `users` | App-Benutzer | email, role, company_id, co_admin_permissions |
| `orders` | Bestellungen | title, status, priority, assigned_to[], notes |
| `folders` | Organisation | name, color, icon, sort_order |
| `invitation_codes` | Team-Einladungen | code, expires_at, used, company_id |
| `co_admin_permissions` | Berechtigungen | user_id, can_* flags |
| ⚠️ `recipes` | **FEHLT** | - |

### Common Queries

Siehe `./supabase/Supabase SQL Schema.txt` für Details zu häufig verwendeten Queries.


## Known Issues & Limitations [5]


## Prompt-Korb [6]

 - Neues recipeCard Layout:
______________________________________________________________
|   ____________________________            |            |   |
|   |Titel                      |           |            |   |
|   |___________________________|           |   Bild     |   |
|    Kategorie                              |____________|   |
|                                                            |
|    BESCHREIBUNG                                            |
|   _________                      _______         _______   |
|   | Author |                     | Zeit |        | Ort  |  |
|   ________     ___________         _________               |
|   |Kunde |     |Zuweisung|        |Priorität|              |
|____________________________________________________________|


## Contact & Support

Für Fragen zur App-Entwicklung oder Claude Code Integration, 
konsultiere diese Dokumentation oder die verlinkten Ressourcen.

---

## Project Health Summary

**Last Updated:** November 6, 2025
**Branch:** claude/rpd-init-011CUsTiNDG8AiHhz7AifK8x

### Production Readiness: 75%

**NOT Ready:**
- ❌ Recipes Feature (35% - Missing database table)
- ❌ Missing critical imports (3 files will crash)
- ⚠️ Security issues (exposed service role key)



**Happy Coding! 🚀**
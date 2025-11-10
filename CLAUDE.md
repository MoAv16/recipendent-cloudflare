# Projekt: Recipendent Website & WebApp - Claude Code Integration Guide

## Config
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

## Syntax
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

## Modis
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

---

## Project Overview [1]

**Recipendent Website & WebApp** ist die vollständige Web-Version der iOS Expo React Native App.
Das Projekt besteht aus zwei Teilen:
1. **Marketing Website** (`recipendent.com`) - Statische Landing Page, Impressum, Datenschutz, AGB
2. **WebApp** (`app.recipendent.com`) - Vollständige React SPA mit allen iOS App Features

**Ziel:** Feature Parity mit iOS App + zusätzliche Web-spezifische Features (OAuth, bessere Keyboard-Navigation).

**Status:** 🚧 In Development - Phase 1 (Foundation)

**Wichtig:** Dies ist ein **kostenlos** bereitgestelltes Projekt. Preise auf der Website sind Beispielwerte.
Rechtliche Absicherung (Impressum, Datenschutz, Beta-Disclaimer) ist Pflicht.

---

## Tech Stack & Architecture [2]

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3+ | UI Framework |
| **Vite** | 6.0+ | Build Tool & Dev Server |
| **React Router** | 7.0+ | Client-side Routing |
| **Supabase JS** | 2.76+ | Backend SDK |
| **TanStack Query** | 5.0+ | Data Fetching & Caching |
| **Zustand** | 5.0+ | State Management (leichter als Redux) |
| **TailwindCSS** | 4.0+ | Styling (oder CSS Modules) |
| **Framer Motion** | 11.0+ | Animations |

### Backend & Infrastructure

- **Supabase:** PostgreSQL + Realtime + Auth + Storage (Shared DB mit iOS App)
- **Cloudflare Pages:** Hosting für Marketing + WebApp (separate Projekte)
- **Cloudflare DNS:** `recipendent.com` + `app.recipendent.com`
- **Supabase Edge Functions:** Email-Versand, Admin-Registration, Company-Deletion

### Architecture Pattern: Subdomain Separation

```
recipendent.com (Cloudflare Pages #1)
├── index.html              → Landing Page
├── privacy/index.html      → Datenschutzerklärung
├── terms/index.html        → AGB
├── admin/index.html        → Invite-Key-Versand (Email-Form)
└── support/index.html      → Support-Seite

app.recipendent.com (Cloudflare Pages #2)
└── Vite React SPA
    ├── /auth/login         → Login
    ├── /auth/register      → Registration (Admin + Employee via Invite)
    ├── /dashboard          → Dashboard
    ├── /orders             → Orders Management
    ├── /recipes            → Recipes Management
    ├── /team               → Team Management
    └── /settings           → Settings
```

**Vorteile:**
- ✅ Klare Trennung (Marketing vs App)
- ✅ Unabhängige Deployments
- ✅ Supabase Auth funktioniert perfekt (`app.recipendent.com` als Redirect URL)
- ✅ OAuth Provider akzeptieren Subdomains besser
- ✅ Separate CSP, Caching, Rate Limiting

---

## Database Schema (Shared mit iOS App) [3]

Die WebApp nutzt die **gleiche Supabase-Datenbank** wie die iOS App.

### Wichtige Tabellen

**Multi-Tenant Architektur:** Jede Company hat isolierte Daten via `company_id` + RLS Policies.

```sql
-- Haupt-Tabellen
public.companies           -- Firmen (Logo, Branding, Settings)
public.users               -- App-Benutzer (role: admin | co-admin | employee)
public.orders              -- Aufträge/Bestellungen
public.folders             -- Ordner-Organisation
public.invitation_codes    -- Einladungssystem für Team-Mitglieder
public.co_admin_permissions -- Granulare Berechtigungen für Co-Admins

-- Geplant (siehe readme/RECIPE_SYSTEM_PROMPT.md)
public.recipes             -- Recipe Templates (Update-Feature)
```

**Vollständiges Schema:** Siehe `./supabase/Supabase SQL Schema.txt`

### Auth Flow (Web-spezifisch)

**Admin Registration:**
1. User füllt Registration-Form aus
2. Frontend ruft Supabase Edge Function `register-admin` auf
3. Edge Function erstellt:
   - `auth.users` Entry (mit Email-Verifizierung)
   - `public.companies` Entry
   - `public.users` Entry (role: 'admin')
   - Uploaded Logo + Profile Picture zu Storage

**Employee Registration:**
1. Admin generiert Invitation Code in `/admin` oder in App
2. Employee bekommt Code per Email (via Edge Function `send-invitation-email`)
3. Employee registriert sich mit Code → wird zu Company hinzugefügt

**OAuth (Google/Apple):**
- Supabase unterstützt Google OAuth out-of-the-box
- Redirect URL: `https://app.recipendent.com/auth/callback`
- Nach OAuth: User wird in `public.users` angelegt (via Trigger oder Frontend-Logic)

---

## 🚀 IMPLEMENTATION ROADMAP (Phasen-Plan) [4]

**Gesamtdauer:** 8-12 Wochen (Teil-/Vollzeit abhängig)

---

### Phase 1: Foundation & Legal Setup (1-2 Wochen)

**Ziel:** Rechtliche Absicherung + Projekt-Setup

#### 1.1 Rechtliche Dokumente erstellen

**Pflicht-Dokumente (DSGVO & TMG konform):**

**Impressum (§5 TMG):**
- [ ] Name, Adresse, E-Mail, Telefon (Privatperson oder Firma)
- [ ] Optional: Impressums-Service nutzen (z.B. eRecht24, wenn Privatsphäre gewünscht)
- [ ] In Footer verlinken: `/impressum` oder `/imprint`

**Datenschutzerklärung (DSGVO Art. 13):**
- [ ] Datenerhebung (Welche Daten werden gespeichert?)
- [ ] Supabase Hosting (USA → Standard Contractual Clauses erwähnen)
- [ ] Cookie-Verwendung (Technical Cookies, Analytics wenn vorhanden)
- [ ] OAuth-Provider (Google/Apple) Datenfluss beschreiben
- [ ] Rechte des Nutzers (Auskunft, Löschung, Widerspruch)
- [ ] Generator nutzen: **eRecht24**, **Iubenda**, oder Anwalt konsultieren

**AGB (Allgemeine Geschäftsbedingungen):**
- [ ] Nutzungsbedingungen (Wer darf die App nutzen?)
- [ ] Haftungsausschluss (Keine Gewährleistung auf Verfügbarkeit)
- [ ] Beta-Disclaimer: "Diese App befindet sich in der Beta-Phase. Nutzung auf eigenes Risiko."
- [ ] Kein Geld-Disclaimer: "Die angezeigten Preise sind Beispielwerte. Es werden keine Zahlungen akzeptiert."
- [ ] Recht zur Löschung von Daten (Admin-seitig)

**Cookie-Banner (DSGVO):**
- [ ] Optional: Wenn nur technische Cookies → einfacher Hinweis reicht
- [ ] Wenn Analytics (Google Analytics, Plausible, etc.) → Cookie-Consent Tool nutzen
- [ ] Tools: **Cookiebot**, **OneTrust**, oder manuell mit `react-cookie-consent`

**Support/Kontakt-Seite:**
- [ ] E-Mail: `recipendent@gmail.com`
- [ ] Optional: FAQ, Hilfe-Center

**To-Do-Liste:**
```
[ ] Impressum erstellen (via Generator oder Anwalt)
[ ] Datenschutzerklärung erstellen (via eRecht24/Iubenda)
[ ] AGB erstellen (via Generator oder Anwalt)
[ ] Beta-Disclaimer + Preis-Disclaimer hinzufügen
[ ] Cookie-Banner implementieren (falls Analytics gewünscht)
[ ] Alle Dokumente in Footer verlinken
[ ] Rechtsprüfung durch Anwalt (optional, aber empfohlen)
```

#### 1.2 Marketing Website Setup (statisch)

**Projekt:** `recipendent-cloudflare` (aktuelles Repo)

**Struktur:**
```
recipendent-cloudflare/
├── index.html              # Landing Page (fertig)
├── logo_appstore.png       # Logo (fertig)
├── privacy/
│   └── index.html          # Datenschutzerklärung (fertig, muss aktualisiert werden)
├── terms/
│   ├── index.html          # AGB (fertig, muss aktualisiert werden)
│   └── Terms and Conditions.txt  # Source
├── admin/
│   └── index.html          # Invite-Key-Versand (fertig, Basic-Form)
├── support/
│   └── index.html          # Support-Seite (fertig)
└── CLAUDE.md               # Diese Datei
```

**Tasks:**
- [x] Landing Page Design (fertig, aber kann verbessert werden)
- [x] Impressum-Seite erstellen (`/impressum/index.html`) ✅
- [ ] Datenschutzerklärung aktualisieren (Supabase, OAuth erwähnen)
- [x] AGB aktualisieren (Beta-Disclaimer, Preis-Disclaimer) ✅
- [x] Footer-Links aktualisieren (Impressum hinzufügen) ✅
- [ ] Cookie-Banner implementieren (falls nötig)
- [ ] SEO: Meta-Tags, Open Graph, Structured Data
- [ ] Analytics: Plausible oder Cloudflare Web Analytics (DSGVO-konform)

**Cloudflare Pages Deployment:**
```bash
# In Cloudflare Dashboard:
# 1. New Project → Connect Git Repository
# 2. Build Settings:
#    - Framework Preset: None (statisch)
#    - Build Command: (leer)
#    - Build Output Directory: /
# 3. Custom Domain: recipendent.com
```

#### 1.3 WebApp Projekt Setup (Vite + React)

**Status:** ✅ **ABGESCHLOSSEN** - Projekt erstellt in `app/` Subfolder

**Projekt:** `app/` (Vite + React)

**Erstellt:**
```bash
npm create vite@latest app -- --template react  ✅
cd app
npm install  ✅

# Dependencies (alle installiert) ✅
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install zustand
npm install react-router-dom
npm install framer-motion
npm install tailwindcss postcss autoprefixer
npm install @headlessui/react  # Accessible UI Components
npm install react-hook-form    # Form Validation
npm install zod                # Schema Validation
npm install date-fns           # Date Utilities
```

**Tailwind Setup:** ✅ Manuell konfiguriert
```bash
# tailwind.config.js + postcss.config.js erstellt
```

**Projekt-Struktur:** ✅ Erstellt
```
app/                           # ✅ WebApp Root
├── public/
│   └── vite.svg
├── src/
│   ├── config/                # ✅ Erstellt
│   │   ├── supabase.js        # ✅ Supabase Client + Helpers
│   │   └── constants.js       # ✅ App Constants (ROLES, ROUTES, etc.)
│   ├── features/              # ✅ Ordner erstellt
│   │   ├── auth/
│   │   │   ├── hooks/         # 📁 useAuth, usePermissions
│   │   │   ├── components/    # 📁 LoginForm, RegisterForm
│   │   │   └── services/      # 📁 authService.js
│   │   ├── orders/
│   │   │   ├── hooks/         # 📁 useOrders, useOrderRealtime
│   │   │   ├── components/    # 📁 OrderCard, OrderForm
│   │   │   └── services/      # 📁 orderService.js
│   │   ├── recipes/           # 📁 Recipes Management
│   │   ├── team/              # 📁 Team Management
│   │   └── settings/          # 📁 Settings
│   ├── shared/                # ✅ Ordner erstellt
│   │   ├── components/        # 📁 atoms, molecules, organisms
│   │   ├── hooks/             # 📁 useTheme, useToast
│   │   └── utils/             # 📁 helpers
│   ├── layouts/               # 📁 Layout Components
│   ├── routes/                # 📁 React Router Setup
│   ├── App.jsx                # ✅ Vite Default
│   ├── main.jsx               # ✅ Vite Default
│   └── index.css              # ✅ Tailwind imports
├── .env.local.example         # ✅ Environment Template
├── .env.local                 # ⚠️ Muss manuell erstellt werden
├── vite.config.js             # ✅ Vite Config
├── tailwind.config.js         # ✅ Custom Theme mit Primary Color
├── postcss.config.js          # ✅ Tailwind + Autoprefixer
├── package.json               # ✅ Alle Dependencies installiert
└── README.md                  # ✅ Setup Guide
```

**Environment Variables (`.env.local`):**
```env
VITE_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Cloudflare Pages Deployment:**
```bash
# In Cloudflare Dashboard:
# 1. New Project → Connect Git Repository
# 2. Build Settings:
#    - Framework Preset: Vite
#    - Build Command: npm run build
#    - Build Output Directory: dist
# 3. Custom Domain: app.recipendent.com
# 4. Environment Variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

**Deliverables Phase 1:**
- ✅ **Rechtliche Dokumente:** Impressum (Placeholder), Beta-Disclaimer in AGB, Preis-Disclaimer in AGB
- ✅ **Marketing-Website:** Footer mit Impressum-Link aktualisiert
- ✅ **WebApp-Projekt:** Komplett setup in `app/` Subfolder
  - ✅ Vite + React + Tailwind CSS konfiguriert
  - ✅ Alle Dependencies installiert (Supabase, TanStack Query, Zustand, React Router, etc.)
  - ✅ Projekt-Struktur erstellt (config, features, shared, layouts, routes)
  - ✅ Supabase Client konfiguriert mit Helper-Functions
  - ✅ Environment Template (`.env.local.example`)
  - ✅ README.md mit Setup-Guide
- ⏳ **Deployments:** Noch nicht deployed (Phase 1.4)

**Estimated Time:** 1-2 Wochen (abhängig von rechtlicher Beratung)
**Actual Time:** ~2 Stunden (Setup Phase)

---

### Phase 2: Marketing Website Refinement (1 Woche)

**Ziel:** Professionelle Landing Page mit SEO-Optimierung

#### 2.1 Design & Content Improvements

**Landing Page (`index.html`):**
- [ ] Hero Section: Call-to-Action verbessern ("Jetzt kostenlos testen")
- [ ] Features Section: Screenshots/Mockups der App hinzufügen
- [ ] Social Proof: Testimonials (wenn vorhanden)
- [ ] FAQ Section hinzufügen
- [ ] Newsletter/Waitlist-Form (optional, via Formspree oder Supabase)

**Design Enhancements:**
- [ ] Responsive Design testen (Mobile, Tablet, Desktop)
- [ ] Accessibility: Alt-Tags, ARIA-Labels, Keyboard-Navigation
- [ ] Performance: Bilder komprimieren (WebP), Lazy Loading
- [ ] Animations: Subtle Scroll-Animations (AOS.js oder Intersection Observer)

#### 2.2 SEO & Analytics

**SEO Optimierung:**
- [ ] Meta-Tags: Title, Description, Keywords
- [ ] Open Graph Tags: Facebook/LinkedIn Previews
- [ ] Twitter Card Tags
- [ ] Structured Data: JSON-LD für Organization/Software
- [ ] Sitemap.xml erstellen
- [ ] robots.txt erstellen
- [ ] Google Search Console einrichten
- [ ] Bing Webmaster Tools einrichten

**Analytics (DSGVO-konform):**
- [ ] Option 1: **Plausible Analytics** (empfohlen, kein Cookie-Banner nötig)
- [ ] Option 2: **Cloudflare Web Analytics** (kostenlos, kein Cookie-Banner)
- [ ] Option 3: Google Analytics 4 (Cookie-Consent nötig)

**Deliverables Phase 2:**
- ✅ Professionelle Landing Page mit Screenshots
- ✅ SEO-optimiert (Meta-Tags, Sitemap)
- ✅ Analytics setup und DSGVO-konform
- ✅ Responsive und Accessible

**Estimated Time:** 1 Woche

---

### Phase 3: WebApp MVP - Auth & Dashboard (2-3 Wochen)

**Ziel:** Benutzer können sich registrieren, einloggen und Dashboard sehen

#### 3.1 Supabase Auth Integration

**Auth Context (`src/features/auth/hooks/useAuth.jsx`):**
```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*, company:companies(*)')
      .eq('id', userId)
      .single();

    if (!error) {
      setUserData(data);
    }
    setLoading(false);
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setUserData(null);
    }
    return { error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      isAuthenticated: !!user,
      isAdmin: userData?.role === 'admin',
      isCoAdmin: userData?.role === 'co-admin',
      isEmployee: userData?.role === 'employee',
      signIn,
      signOut,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

**Login Screen (`src/features/auth/components/LoginForm.jsx`):**
- [ ] Email/Password Form mit Validation (react-hook-form + zod)
- [ ] "Passwort vergessen" Link (Supabase Password Reset)
- [ ] "Mit Google anmelden" Button (OAuth)
- [ ] Loading States, Error Handling
- [ ] Redirect nach Login zu `/dashboard`

**Register Screen (Admin):**
- [ ] Company Name
- [ ] Logo Upload (via Supabase Storage oder Base64)
- [ ] Admin Name, Email, Password
- [ ] Profile Picture Upload (optional)
- [ ] Ruft Edge Function `register-admin` auf

**Register Screen (Employee):**
- [ ] Invitation Code Input
- [ ] Code Validierung (fetch from `invitation_codes` table)
- [ ] Employee Name, Email, Password
- [ ] Profile Picture Upload (optional)
- [ ] Wird zu Company hinzugefügt

**OAuth Callback Route (`/auth/callback`):**
- [ ] Supabase Exchange Code for Session
- [ ] Check if user exists in `public.users`
- [ ] If not: Show "Complete Profile" screen (Company-Auswahl oder Admin-Registration)
- [ ] Redirect zu `/dashboard`

#### 3.2 Dashboard Screen

**Layout (`src/layouts/AppLayout.jsx`):**
```
┌─────────────────────────────────────────────────┐
│  Sidebar          │  Main Content               │
│                   │                             │
│  🏠 Dashboard     │  ┌───────────────────────┐ │
│  📋 Orders        │  │  Header               │ │
│  📖 Recipes       │  │  Profile, Settings    │ │
│  👥 Team          │  └───────────────────────┘ │
│  ⚙️ Settings      │                             │
│                   │  [Page Content]             │
│  [Company Logo]   │                             │
│  [User Profile]   │                             │
└─────────────────────────────────────────────────┘
```

**Dashboard Content:**
- [ ] Welcome Message: "Willkommen, [User Name]"
- [ ] Statistics Cards:
  - Active Orders Count
  - Completed Orders Count
  - Team Members Count
  - Recipes Count (wenn implementiert)
- [ ] Recent Orders List (letzten 5)
- [ ] Quick Actions: "Neuen Auftrag erstellen", "Team einladen"

**Responsive Design:**
- [ ] Mobile: Sidebar als Drawer/Offcanvas (Hamburger Menu)
- [ ] Tablet: Sidebar collapsible
- [ ] Desktop: Full Sidebar

#### 3.3 Protected Routes

**Route Guard (`src/routes/ProtectedRoute.jsx`):**
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export const ProtectedRoute = ({ children, requireRole }) => {
  const { isAuthenticated, userData, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (requireRole && userData?.role !== requireRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};
```

**Router Setup (`src/routes/index.jsx`):**
```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import Dashboard from '../features/dashboard/Dashboard';
// ... more imports

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginForm /> },
      { path: 'register', element: <RegisterForm /> },
      { path: 'callback', element: <OAuthCallback /> },
    ]
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      { path: 'dashboard', element: <Dashboard /> },
      // More routes in later phases
    ]
  }
]);

export default router;
```

**Deliverables Phase 3:**
- ✅ Login/Register funktioniert (Email/Password + Google OAuth)
- ✅ Dashboard zeigt Benutzer-Informationen und Statistiken
- ✅ Protected Routes (nur authenticated users können App nutzen)
- ✅ Responsive Sidebar/Navigation
- ✅ Loading States, Error Handling

**Estimated Time:** 2-3 Wochen

---

### Phase 4: Core Features - Orders & Team Management (3-4 Wochen)

**Ziel:** Feature Parity mit iOS App für Orders und Team

#### 4.1 Orders Management

**Order Service (`src/features/orders/services/orderService.js`):**
```javascript
import { supabase } from '../../../config/supabase';

export const getOrders = async (status = null) => {
  const { data: userData } = await supabase.auth.getUser();
  const { data: user } = await supabase
    .from('users')
    .select('company_id, role')
    .eq('id', userData.user.id)
    .single();

  let query = supabase
    .from('orders')
    .select(`
      *,
      author:users!author_id(first_name, last_name, profile_picture),
      folder:folders(name, color),
      assigned_users:users!inner(first_name, last_name, profile_picture)
    `)
    .eq('company_id', user.company_id)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  // Employees sehen nur ihre eigenen Orders
  if (user.role === 'employee') {
    query = query.contains('assigned_to', [userData.user.id]);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createOrder = async (orderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateOrder = async (orderId, updates) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteOrder = async (orderId) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) throw error;
};
```

**Realtime Subscriptions (`src/features/orders/hooks/useOrderRealtime.js`):**
```javascript
import { useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useQueryClient } from '@tanstack/react-query';

export const useOrderRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders'
      }, (payload) => {
        console.log('Order changed:', payload);
        // Invalidate orders query to refetch
        queryClient.invalidateQueries(['orders']);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};
```

**Orders Screens:**

**OrdersListScreen:**
- [ ] Tabs: "Aktiv", "Abgeschlossen", "Kritisch"
- [ ] Filter: By Folder, By Priority, By Assigned User
- [ ] Search: Title, Customer Name
- [ ] Order Cards: Title, Customer, Priority, Due Date, Assigned Users
- [ ] Click → Order Detail Screen

**OrderDetailScreen:**
- [ ] Full Order Info: Title, Description, Customer, Location, Priority, Image
- [ ] Notes Section: Comments/Timeline (jsonb `notes` field)
- [ ] Actions: Edit, Delete, Mark as Done
- [ ] Assigned Users: Avatars
- [ ] Created By: Author Info
- [ ] Realtime Updates (wenn andere User ändern)

**CreateOrderScreen:**
- [ ] Form: Title, Customer, Description, Location, Priority, Due Date, Image, Folder
- [ ] Multi-Select: Assign to Users
- [ ] Toggle: "Editable by Assigned Users"
- [ ] Image Upload: Drag & Drop oder File Picker → Supabase Storage
- [ ] Submit → Redirect to Order Detail

**EditOrderScreen:**
- [ ] Gleiche Form wie Create, aber mit Daten vorausgefüllt
- [ ] Permission Check: Nur Admin/Co-Admin oder Assigned Users (wenn `editable_by_assigned` = true)

**Permission Checks:**
- [ ] Employee: Kann nur Orders sehen, die ihm zugewiesen sind
- [ ] Employee: Kann Orders nur editieren, wenn `editable_by_assigned` = true
- [ ] Admin/Co-Admin: Kann alle Orders sehen und editieren
- [ ] Delete Orders: Nur Admin/Co-Admin (mit Permission Check für Co-Admin)

#### 4.2 Team Management

**Team Service (`src/features/team/services/teamService.js`):**
```javascript
export const getTeamMembers = async () => {
  const { data: userData } = await supabase.auth.getUser();
  const { data: user } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', userData.user.id)
    .single();

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('company_id', user.company_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const generateInvitationCode = async (email, role, permissions = null) => {
  const { data: userData } = await supabase.auth.getUser();
  const { data: user } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', userData.user.id)
    .single();

  const code = generateRandomCode(); // 6-digit code
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Tage

  const { data, error } = await supabase
    .from('invitation_codes')
    .insert({
      code,
      company_id: user.company_id,
      email,
      role,
      expires_at: expiresAt,
      sent_by: userData.user.id,
      co_admin_permissions: permissions
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const sendInvitationEmail = async (email, code, role, companyName) => {
  const { data, error } = await supabase.functions.invoke('send-invitation-email', {
    body: { email, code, role, companyName }
  });

  if (error) throw error;
  return data;
};
```

**Team Management Screen:**
- [ ] Team Members List: Avatar, Name, Email, Role, Actions
- [ ] Role Badges: Admin (green), Co-Admin (blue), Employee (gray)
- [ ] Actions: Edit Profile, Change Role (nur Admin), Delete (nur Admin)
- [ ] "Team-Mitglied einladen" Button → Modal

**Invite Modal:**
- [ ] Email Input
- [ ] Role Selector: Employee | Co-Admin
- [ ] If Co-Admin: Permission Checkboxes (can_edit_orders, can_delete_orders, etc.)
- [ ] Generate Code → Send Email via Edge Function
- [ ] Success: "Einladung verschickt an [email]"

**Co-Admin Permissions Screen:**
- [ ] Only visible to Admin
- [ ] Liste aller Co-Admins
- [ ] Click → Edit Permissions Modal
- [ ] Checkboxes für jede Permission (siehe iOS App CLAUDE.md)
- [ ] Save → Update `co_admin_permissions` table + `users.co_admin_permissions` jsonb

**usePermissions Hook (übernehmen von iOS App):**
```javascript
// src/features/auth/hooks/usePermissions.js
import { useAuth } from './useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../config/supabase';

export const usePermissions = () => {
  const { userData, isAuthenticated } = useAuth();

  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions', userData?.id],
    queryFn: async () => {
      if (!userData || userData.role !== 'co-admin') {
        return null;
      }

      const { data, error } = await supabase
        .from('co_admin_permissions')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && userData?.role === 'co-admin'
  });

  const can = (permission) => {
    if (!userData) return false;
    if (userData.role === 'admin') return true;
    if (userData.role === 'employee') return false;
    return permissions?.[permission] || false;
  };

  return {
    isAdmin: userData?.role === 'admin',
    isCoAdmin: userData?.role === 'co-admin',
    isEmployee: userData?.role === 'employee',
    can,
    loading: isLoading,
    permissions
  };
};
```

**Deliverables Phase 4:**
- ✅ Orders CRUD funktioniert vollständig
- ✅ Realtime-Updates für Orders
- ✅ Team Management: Invite, List, Permissions
- ✅ Permission System funktioniert (Admin, Co-Admin, Employee)
- ✅ Image Upload zu Supabase Storage

**Estimated Time:** 3-4 Wochen

---

### Phase 5: Advanced Features - Recipes & Settings (2-3 Wochen)

**Ziel:** Recipe System (siehe `readme/RECIPE_SYSTEM_PROMPT.md`) + Settings

#### 5.1 Recipe System Implementation

**Database Migration:**
```sql
-- Execute in Supabase SQL Editor (siehe RECIPE_SYSTEM_PROMPT.md)
-- Create recipes table
-- Add recipe_id + field_values to orders table
-- Create RLS policies
-- Create increment_recipe_usage function
```

**Recipe Service (`src/features/recipes/services/recipeService.js`):**
- [ ] `getRecipes()` - Fetch all recipes für Company
- [ ] `createRecipe(data)` - Create new recipe template
- [ ] `updateRecipe(id, data)` - Update recipe
- [ ] `deleteRecipe(id)` - Delete recipe
- [ ] `useRecipe(id)` - Increment usage count

**Recipes Screens:**

**RecipeFoldersScreen (3-Tab-System):**
- [ ] Tab 1: "Alle" - Statistics + Most Used + Folders + Recent Orders
- [ ] Tab 2: "Rezepte" - Recipe List with Usage Counts
- [ ] Tab 3: "Ordner" - Folder Management
- [ ] Click Recipe → Recipe Detail Screen

**CreateRecipeScreen (3-Schritt Wizard):**
- [ ] Schritt 1: Template Name, Description, Icon, Color, Folder
- [ ] Schritt 2: Field Config Editor (Enable/Disable/Rename Fields)
- [ ] Schritt 3: Preview + Default Values (Priority, Assignment, Folder)
- [ ] Submit → Save to `recipes` table

**RecipeDetailScreen:**
- [ ] Template Preview (wie Order aussehen würde)
- [ ] Usage Statistics (45x verwendet)
- [ ] Actions: Edit, Duplicate, Delete
- [ ] "Auftrag mit diesem Rezept erstellen" Button → CreateOrderScreen with pre-filled form

**Template Selector Modal (in CreateOrderScreen):**
- [ ] Liste aller Recipes (gruppiert nach Ordner)
- [ ] "Standard-Auftrag" Template (hardcoded, immer verfügbar)
- [ ] Click Template → Form passt sich an field_config an
- [ ] Only visible fields werden angezeigt

**Field Config Implementation:**
- [ ] Dynamic Form Rendering basierend auf `field_config` jsonb
- [ ] Field Types: text, textarea, date, select, image, checkbox
- [ ] Validation: Required Fields
- [ ] Field Values werden in `orders.field_values` jsonb gespeichert

#### 5.2 Settings Screens

**Settings Layout:**
- [ ] Tabs: "Profil", "Firma", "Team", "Sicherheit"

**Profile Settings:**
- [ ] Edit Name, Email, Profile Picture
- [ ] Change Password
- [ ] Theme Selector: Light, Dark, Custom
- [ ] Language (später, wenn i18n implementiert)

**Company Settings (nur Admin):**
- [ ] Company Name
- [ ] Logo Upload/Change
- [ ] Logo Branding Toggle: Use Logo Color as Primary Color
- [ ] Logo Display Settings: Show in Dashboard, Position, Scale, Opacity
- [ ] Dominant Color Picker (wenn Logo Branding off)

**Team Settings (siehe Phase 4.2):**

**Security Settings:**
- [ ] Enable/Disable Face ID (Browser Biometrics via WebAuthn API)
- [ ] Active Sessions: Liste aller aktiven Sessions, "Logout from other devices"
- [ ] Delete Account (mit Confirmation Modal)

**Deliverables Phase 5:**
- ✅ Recipe System vollständig implementiert
- ✅ Dynamic Order Forms basierend auf Recipe Templates
- ✅ Settings Screens für Profil, Firma, Sicherheit
- ✅ Logo Branding System funktioniert

**Estimated Time:** 2-3 Wochen

---

### Phase 6: Polish, Testing & Launch (2-3 Wochen)

**Ziel:** App produktionsreif machen

#### 6.1 UI/UX Polish

**Animations:**
- [ ] Page Transitions (Framer Motion)
- [ ] Loading States: Skeleton Screens statt Spinner
- [ ] Toast Notifications für Success/Error Messages
- [ ] Micro-Interactions: Button Hover, Card Hover

**Responsive Design:**
- [ ] Test auf allen Screen Sizes (Mobile, Tablet, Desktop)
- [ ] Touch-friendly Buttons (min. 44x44px)
- [ ] Mobile Navigation: Bottom Tab Bar (optional)

**Accessibility:**
- [ ] Keyboard Navigation: Tab-Order, Focus States
- [ ] Screen Reader: ARIA-Labels, Alt-Tags
- [ ] Color Contrast: WCAG AA compliant
- [ ] Skip Links: "Skip to main content"

**Dark Mode:**
- [ ] Full Dark Mode Support (alle Screens)
- [ ] Theme Toggle in Header
- [ ] Theme Persistence (LocalStorage oder User Setting)

#### 6.2 Performance Optimization

**Frontend:**
- [ ] Code Splitting: Lazy Load Routes (`React.lazy()`)
- [ ] Image Optimization: WebP, Lazy Loading
- [ ] Bundle Size Optimization: Tree Shaking, Analyze with `vite-bundle-visualizer`
- [ ] Caching: TanStack Query Cache Strategies

**Backend/Supabase:**
- [ ] Indexes: Ensure indexes on `company_id`, `folder_id`, `recipe_id` in all tables
- [ ] Query Optimization: Use `select()` with only needed fields
- [ ] Realtime: Only subscribe to relevant channels (filter by company_id)
- [ ] Rate Limiting: Cloudflare Rate Limiting Rules (prevent abuse)

**Lighthouse Score Target:**
- [ ] Performance: 90+
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100

#### 6.3 Testing

**Unit Tests:**
- [ ] Service Functions: `orderService.js`, `recipeService.js`, `authService.js`
- [ ] Utility Functions: Validators, Helpers
- [ ] Hooks: `useAuth`, `usePermissions`

**Integration Tests:**
- [ ] Auth Flow: Login → Dashboard → Logout
- [ ] Order CRUD: Create → Edit → Delete
- [ ] Team Invite: Generate Code → Register with Code
- [ ] Realtime: Order Update triggers UI update

**E2E Tests (Playwright or Cypress):**
- [ ] Admin Registration → Create Order → Assign to Team → Complete Order
- [ ] Employee Login → See assigned Orders → Edit Order (if allowed)
- [ ] Recipe Creation → Order from Recipe → Usage Count increments

**Browser Testing:**
- [ ] Chrome/Edge (Desktop + Mobile)
- [ ] Firefox (Desktop + Mobile)
- [ ] Safari (Desktop + Mobile)

#### 6.4 Security Audit

**Frontend:**
- [ ] XSS Prevention: Sanitize User Input (DOMPurify)
- [ ] CSRF Protection: Supabase handles this
- [ ] Content-Security-Policy Header (Cloudflare Pages)

**Backend/Supabase:**
- [ ] RLS Policies: Test with different user roles
- [ ] SQL Injection: Supabase parameterized queries prevent this
- [ ] File Upload: Validate file types, size limits in Storage Policies
- [ ] API Keys: Never expose Service Role Key in frontend

**Penetration Testing:**
- [ ] OWASP Top 10 checklist
- [ ] Optional: Hire security firm for audit (wenn Budget vorhanden)

#### 6.5 Documentation

**User Guide:**
- [ ] Getting Started: Registration, Login
- [ ] Orders: How to create, edit, delete
- [ ] Recipes: How to use templates
- [ ] Team: How to invite members, set permissions
- [ ] FAQ: Common questions

**Developer Documentation:**
- [ ] README.md: Project setup, installation, deployment
- [ ] CONTRIBUTING.md: How to contribute (wenn Open Source)
- [ ] API Documentation: Supabase Schema, Edge Functions
- [ ] Deployment Guide: Cloudflare Pages, Environment Variables

#### 6.6 Beta Testing

**Internal Testing:**
- [ ] Use app internally (with real data) for 1-2 weeks
- [ ] Collect feedback from team

**Closed Beta:**
- [ ] Invite 5-10 beta users (friends, colleagues)
- [ ] Collect feedback via Form (Typeform, Google Forms)
- [ ] Fix critical bugs

**Public Beta:**
- [ ] Launch to public with "Beta" badge
- [ ] Monitor errors (Sentry.io or similar)
- [ ] Collect feedback via In-App Feedback Button

#### 6.7 Launch Preparation

**Pre-Launch Checklist:**
- [ ] All critical bugs fixed
- [ ] Performance optimized (Lighthouse 90+)
- [ ] Accessibility tested
- [ ] Legal documents final (Impressum, Datenschutz, AGB)
- [ ] Analytics setup and tested
- [ ] Error Monitoring setup (Sentry, LogRocket)
- [ ] Backup Strategy: Database Backups (Supabase auto-backup)
- [ ] Support Email: recipendent@gmail.com monitored

**Launch Day:**
- [ ] Deploy final version to `app.recipendent.com`
- [ ] Update Marketing Website mit "Launch"-Announcement
- [ ] Social Media Post (wenn vorhanden)
- [ ] Submit to Product Hunt (optional)
- [ ] Email to Beta Users: "We're Live!"

**Post-Launch:**
- [ ] Monitor Analytics: User Registrations, Active Users
- [ ] Monitor Errors: Fix critical bugs within 24h
- [ ] Collect Feedback: In-App Feedback, Support Emails
- [ ] Iterate: Weekly updates mit Bug Fixes + Small Features

**Deliverables Phase 6:**
- ✅ App ist performant, accessible, responsive
- ✅ Tests geschrieben und passed
- ✅ Security Audit durchgeführt
- ✅ Beta Testing abgeschlossen
- ✅ App ist live auf `app.recipendent.com`
- ✅ Dokumentation vollständig

**Estimated Time:** 2-3 Wochen

---

### 🎯 Roadmap Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| **Phase 1: Foundation** | 1-2 Wochen | Legal Docs, Marketing Website, WebApp Setup |
| **Phase 2: Marketing** | 1 Woche | SEO, Analytics, Refined Landing Page |
| **Phase 3: Auth & Dashboard** | 2-3 Wochen | Login, Register, Dashboard, Protected Routes |
| **Phase 4: Core Features** | 3-4 Wochen | Orders CRUD, Team Management, Permissions |
| **Phase 5: Advanced Features** | 2-3 Wochen | Recipe System, Settings |
| **Phase 6: Launch** | 2-3 Wochen | Polish, Testing, Beta, Launch |
| **TOTAL** | **11-18 Wochen** | **Vollständige WebApp + Marketing** |

---

## Admin Area (/admin) - Invite Key Versand [5]

**Status:** ✅ Basic Form bereits vorhanden (`admin/index.html`)

**Funktionalität:**
- Formular: Email Input + Role Selector (Employee | Co-Admin)
- Submit → Ruft Supabase Edge Function `send-invitation-email` auf
- Edge Function generiert Code, speichert in `invitation_codes` Tabelle, sendet Email via Resend API

**Improvement Ideas:**
- [ ] Auth: Nur Admins können auf `/admin` zugreifen (via Supabase Auth + Password-Schutz)
- [ ] Liste gesendeter Codes (mit Expiry Date, Used Status)
- [ ] Bulk-Invite: CSV-Upload mit mehreren Emails
- [ ] Custom Email Template Editor

**Oder:** Komplett in WebApp integrieren (Team Management Screen) und `/admin` entfernen.

---

## Development Guidelines [6]

### Component Structure

**Atomic Design:**
```
src/shared/components/
├── atoms/              # Button, Input, Icon
├── molecules/          # FormField, SearchBar, Toast
├── organisms/          # OrderCard, RecipeCard, Sidebar
└── templates/          # PageLayout, DashboardLayout
```

**Naming Conventions:**
- Components: `PascalCase.jsx` (z.B. `OrderCard.jsx`)
- Hooks: `use[Name].js` (z.B. `useOrders.js`)
- Services: `[name]Service.js` (z.B. `orderService.js`)
- Utils: `camelCase.js` (z.B. `formatDate.js`)

### Styling Guidelines

**Tailwind Utility-First:**
```jsx
// Good
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Click me
</button>

// Avoid (unless reusable)
<button className={styles.button}>Click me</button>
```

**Custom Styles (wenn nötig):**
- Verwende CSS Modules für komplexe Komponenten
- Oder: Tailwind @apply in `globals.css`

**Theme System:**
- Tailwind Config: Farben aus Supabase `companies.dominant_color` dynamisch setzen
- Verwende CSS Variables für Primary Color:
  ```css
  :root {
    --color-primary: #ad42b3; /* Default */
  }

  .bg-primary {
    background-color: var(--color-primary);
  }
  ```

### Supabase Query Patterns

**Query with RLS:**
```javascript
// RLS Policies filtern automatisch nach company_id
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    author:users!author_id(first_name, last_name),
    folder:folders(name, color)
  `)
  .order('created_at', { ascending: false });
```

**Realtime Subscription:**
```javascript
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'orders',
    filter: `company_id=eq.${companyId}` // Optional: Filter
  }, handleChange)
  .subscribe();

// Cleanup
return () => subscription.unsubscribe();
```

**File Upload:**
```javascript
// Upload to Storage
const file = event.target.files[0];
const fileName = `${Date.now()}_${file.name}`;
const filePath = `${companyId}/${userId}/${fileName}`;

const { data, error } = await supabase.storage
  .from('profile-pictures')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  });

if (error) throw error;

// Get Public URL
const { data: urlData } = supabase.storage
  .from('profile-pictures')
  .getPublicUrl(filePath);

const publicUrl = urlData.publicUrl;
```

### Error Handling

**Consistent Error Messages:**
```javascript
try {
  const data = await createOrder(orderData);
  showToast({ type: 'success', message: 'Auftrag erfolgreich erstellt!' });
  return data;
} catch (error) {
  console.error('Create Order Error:', error);
  showToast({ type: 'error', message: error.message || 'Ein Fehler ist aufgetreten' });
  throw error;
}
```

**Global Error Boundary:**
```jsx
// src/App.jsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-screen">
      <h1>Oops! Etwas ist schief gelaufen.</h1>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Erneut versuchen</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
```

---

## Known Issues & Limitations [7]

**Known Issues:**

1. **Recipes Table fehlt noch:**
   - Migration `RECIPE_SYSTEM_PROMPT.md` muss in Supabase ausgeführt werden
   - Workaround: Orders werden als Recipes gespeichert (iOS App)

2. **OAuth Post-Registration Flow:**
   - User registriert sich via Google OAuth
   - Muss dann Company auswählen oder Admin-Registration durchlaufen
   - iOS App: Invitation Code System
   - WebApp: Gleicher Flow oder separate "Complete Profile" Screen nötig

3. **File Upload Size Limits:**
   - Supabase Free Tier: 1GB Storage
   - Upgrade zu Pro Tier empfohlen für Production

**Limitations:**

1. **Multi-Tenant Isolation:**
   - Abhängig von RLS Policies (gut getestet)
   - Keine physische DB-Trennung zwischen Companies

2. **Realtime Performance:**
   - Bei vielen gleichzeitigen Users: Supabase Realtime kann Limits erreichen
   - Fallback: Polling statt Realtime

3. **iOS App Sync:**
   - WebApp und iOS App teilen DB
   - Keine native Sync-Logik (z.B. Offline-Support)
   - WebApp ist immer Online, iOS App hat partial Offline-Support

---

## Deployment & CI/CD [8]

### Cloudflare Pages Deployment

**Marketing Website (`recipendent.com`):**
```bash
# Cloudflare Dashboard:
# 1. Pages → Create Project → Connect Git
# 2. Repository: recipendent-cloudflare
# 3. Build Settings:
#    - Framework Preset: None
#    - Build Command: (leer)
#    - Build Output Directory: /
# 4. Custom Domain: recipendent.com
# 5. Deploy
```

**WebApp (`app.recipendent.com`):**
```bash
# Cloudflare Dashboard:
# 1. Pages → Create Project → Connect Git
# 2. Repository: recipendent-app-web (oder subfolder)
# 3. Build Settings:
#    - Framework Preset: Vite
#    - Build Command: npm run build
#    - Build Output Directory: dist
# 4. Environment Variables:
#    - VITE_SUPABASE_URL
#    - VITE_SUPABASE_ANON_KEY
# 5. Custom Domain: app.recipendent.com
# 6. Deploy
```

**Auto-Deploy:**
- Git Push zu `main` Branch → Auto-Deploy
- Preview Deployments für Pull Requests

### CI/CD with GitHub Actions (optional)

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test # Optional: Run tests before deploy
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: recipendent-app
          directory: dist
```

---

## Support & Contact [9]

**Für Fragen zur WebApp-Entwicklung oder Claude Code Integration:**
- Konsultiere diese Dokumentation
- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vite.dev

**User Support:**
- Email: recipendent@gmail.com
- Support-Seite: recipendent.com/support

**Rechtliche Dokumente:**
- Impressum: recipendent.com/impressum
- Datenschutz: recipendent.com/privacy
- AGB: recipendent.com/terms

---

## Quick Reference Commands

```bash
# Marketing Website Development
cd recipendent-cloudflare
# Edit HTML files directly, no build needed

# WebApp Development
cd recipendent-app-web
npm install
npm run dev                 # Start dev server (localhost:5173)
npm run build               # Build for production
npm run preview             # Preview production build

# Supabase CLI
supabase login
supabase link --project-ref [YOUR-PROJECT-REF]
supabase db pull            # Pull remote schema
supabase migration new [name] # Create new migration
supabase db push            # Push local migrations

# Edge Functions
supabase functions deploy [function-name]
supabase functions logs [function-name]
```

---

**Happy Coding, Chef_R.! 🚀**

# Recipendent WebApp

React + Vite WebApp für Recipendent - Team & Order Management

## 🚀 Quick Start

### 1. Environment Setup

Kopiere `.env.local.example` zu `.env.local` und füge deine Supabase Credentials ein:

```bash
cp .env.local.example .env.local
```

Bearbeite `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Install Dependencies (bereits erledigt)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

App läuft auf: http://localhost:5173

## 📦 Tech Stack

- **React 18.3** - UI Framework
- **Vite 6.0** - Build Tool
- **TailwindCSS** - Styling
- **Supabase** - Backend (Auth, Database, Storage)
- **TanStack Query** - Data Fetching & Caching
- **Zustand** - State Management
- **React Router 7** - Routing
- **Framer Motion** - Animations
- **React Hook Form + Zod** - Form Validation

## 🗂️ Project Structure

```
src/
├── config/
│   ├── supabase.js        # Supabase Client & Helpers
│   └── constants.js       # App Constants
├── features/
│   ├── auth/              # Authentication
│   ├── orders/            # Orders Management
│   ├── recipes/           # Recipes Management
│   ├── team/              # Team Management
│   └── settings/          # Settings
├── shared/
│   ├── components/        # Reusable Components
│   ├── hooks/             # Custom Hooks
│   └── utils/             # Utility Functions
├── layouts/               # Layout Components
└── routes/                # React Router Setup
```

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📚 Documentation

Siehe `../CLAUDE.md` für vollständige Dokumentation und Roadmap.

## 🔗 Related

- **Marketing Website:** `../index.html` (deployed auf `recipendent.com`)
- **Supabase Schema:** `../supabase/Supabase SQL Schema.txt`
- **iOS App:** Separate Repository

## 📝 Next Steps

1. ✅ Setup abgeschlossen
2. ⏳ Phase 3: Auth & Dashboard implementieren
3. ⏳ Phase 4: Orders & Team Management
4. ⏳ Phase 5: Recipes & Settings
5. ⏳ Phase 6: Polish & Launch

---

**Happy Coding! 🚀**

# Recipendent Deployment Guide

**Version:** 1.0.0
**Letzte Aktualisierung:** 2025-11-19
**Deployment-Platform:** Cloudflare Pages

---

## 🏗️ Projekt-Architektur

Dieses Monorepo enthält **zwei separate Cloudflare Pages Deployments**:

```
recipendent-cloudflare/
│
├── static/                    # 📄 Marketing Website
│   ├── index.html            # Landing Page
│   ├── admin/                # 🔐 Admin Portal (Super Admin)
│   ├── privacy/              # Datenschutz
│   ├── terms/                # AGB
│   ├── support/              # Support
│   └── impressum/            # Impressum
│
├── app/                      # ⚛️ React Web App (Vite)
│   ├── src/
│   │   ├── features/         # Auth, Orders, Recipes, Team, etc.
│   │   ├── config/           # Supabase Client
│   │   ├── layouts/          # AuthLayout, AppLayout
│   │   └── routes/           # React Router
│   ├── package.json
│   └── vite.config.js
│
├── supabase/                 # 🗄️ Backend (Shared)
│   ├── functions/            # Edge Functions
│   └── migrations/           # DB Schema
│
├── CLAUDE.md                 # Web App Docs (für Claude Code)
├── CLAUDE (iOS App).md       # iOS App Docs
└── DEPLOYMENT.md             # Diese Datei
```

---

## 🌐 Domain-Mapping

| Domain | Deployment Source | Zweck |
|--------|-------------------|-------|
| **recipendent.com** | `/static` | Marketing Landing Page |
| **recipendent.com/admin** | `/static/admin` | Super Admin Portal (Email Invites) |
| **app.recipendent.com** | `/app` | User Web App (React/Vite) |

---

## 🚀 Cloudflare Pages Setup

### Projekt 1: Marketing Website

**Name:** `recipendent-cloudflare` (oder `recipendent-marketing`)

```yaml
Repository: recipendent-cloudflare
Root Directory: static
Build Command: (leer)
Build Output Directory: /
Production Branch: main
```

**Environment Variables:** Keine benötigt

**Custom Domain:**
- `recipendent.com` (Primary)
- `www.recipendent.com` → Redirect zu `recipendent.com`

**Verfügbare Routes:**
- `/` → Landing Page
- `/admin/` → Admin Portal (Super Admin)
- `/privacy/` → Datenschutzerklärung
- `/terms/` → AGB
- `/support/` → Support
- `/impressum/` → Impressum

---

### Projekt 2: React Web App

**Name:** `recipendent-app`

```yaml
Repository: recipendent-cloudflare
Root Directory: app
Build Command: npm run build
Build Output Directory: dist
Production Branch: main
Node.js Version: 18
```

**Environment Variables:**
```env
VITE_SUPABASE_URL=https://bgqzxwgsdbptbyimzwtf.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

**Custom Domain:**
- `app.recipendent.com` (Primary)

**App Routes:**
- `/auth/login` → Login
- `/auth/register` → Registrierung (Admin + Company)
- `/auth/register-employee` → Employee Registrierung (mit Code)
- `/dashboard` → Dashboard
- `/orders` → Aufträge
- `/recipes` → Rezepte
- `/team` → Team-Verwaltung
- `/folders` → Ordner
- `/settings` → Einstellungen

---

## 🔧 Deployment-Workflow

### 1. Lokale Entwicklung

**Marketing Website (static/):**
```bash
# Keine Build-Schritte erforderlich
# Einfach Dateien bearbeiten und committen
```

**Web App (app/):**
```bash
cd app
npm install
npm run dev           # Dev-Server auf http://localhost:5173
npm run build         # Production Build testen
npm run preview       # Production Build lokal testen
```

### 2. Git Push

```bash
git add .
git commit -m "feat: Update XYZ"
git push origin main
```

### 3. Automatisches Deployment

- **Cloudflare Pages** erkennt automatisch den Push
- **Projekt 1 (Marketing):** Deployed `/static` zu `recipendent.com`
- **Projekt 2 (Web App):** Baut `/app` und deployed zu `app.recipendent.com`

---

## 📋 Pre-Deployment Checklist

### Vor jedem Marketing-Update (static/):
- [ ] HTML-Syntax prüfen
- [ ] Links testen (interne + externe)
- [ ] Mobile Responsiveness checken
- [ ] SEO Meta-Tags aktualisiert?
- [ ] Logo + Bilder optimiert?

### Vor jedem Web-App-Update (app/):
- [ ] `npm run build` erfolgreich?
- [ ] Keine TypeScript/ESLint Fehler?
- [ ] Environment Variables gesetzt?
- [ ] Supabase RLS Policies getestet?
- [ ] Multi-Tenant Isolation (company_id) sichergestellt?
- [ ] Mobile Responsiveness getestet?

---

## 🔐 Admin Portal (recipendent.com/admin)

**Zweck:** Super Admin Portal für MoAv16 (du)

**Funktionen:**
- ✅ Email-Einladungen für neue Admin-Kunden versenden
- ✅ Admin-Keys generieren
- ✅ Passwort-geschützter Zugang

**Zukunftspläne:**
- Metriken & Analytics (Anzahl Companies, Users, Orders)
- System Health Monitoring
- User Management Tools
- Billing Dashboard (wenn monetarisiert wird)

**Zugriff:**
- URL: `https://recipendent.com/admin`
- Passwort: Siehe internes Passwort-Management

---

## 🗄️ Supabase Backend

**Projekt-URL:** `https://bgqzxwgsdbptbyimzwtf.supabase.co`

**Shared zwischen:**
- ✅ React Web App (app.recipendent.com)
- ✅ iOS App (nativ)
- ✅ Admin Portal (recipendent.com/admin)

**Wichtige Features:**
- **Multi-Tenant Architecture:** Jede Tabelle hat `company_id` + RLS
- **Realtime Subscriptions:** Orders, Recipes updates
- **Supabase Auth:** Email/Password + Google OAuth
- **Storage:** Images (Orders, Company Logos, Profile Pictures)
- **Edge Functions:** `send-admin-invitation`, `register-admin`, `delete-company`

---

## 🐛 Troubleshooting

### Marketing Website deployed nicht?
1. Check Cloudflare Pages Build Log
2. Prüfe ob `Root Directory: static` gesetzt ist
3. Prüfe ob HTML-Syntax korrekt ist

### Web App Build schlägt fehl?
1. Prüfe `app/package.json` dependencies
2. Teste lokal: `cd app && npm run build`
3. Check Node.js Version (sollte 18+ sein)
4. Prüfe Environment Variables in Cloudflare Pages

### Admin Portal nicht erreichbar?
1. Prüfe ob `static/admin/index.html` existiert
2. Teste lokal: `open static/admin/index.html`
3. Prüfe Cloudflare Pages Routing

### Supabase Queries geben keine Daten zurück?
1. Prüfe RLS Policies in Supabase Dashboard
2. Prüfe ob `company_id` Filter in Query vorhanden ist
3. Check User Auth Status: `user.company_id` gesetzt?

---

## 🎯 Nächste Schritte

### Marketing Website (static/):
- [ ] SEO optimieren (Meta-Tags, Schema.org)
- [ ] Performance: Bilder komprimieren
- [ ] Analytics einbinden (Cloudflare Analytics / Plausible)

### Web App (app/):
- [ ] Recipes Feature fertigstellen (60% → 100%)
- [ ] OAuth Callback Route implementieren
- [ ] Account Deletion Button in Settings
- [ ] Bundle Size reduzieren (Code Splitting)
- [ ] PWA Features (Service Worker, Offline-Mode)

### Admin Portal:
- [ ] Migration zu React (für Charts/Dashboards)
- [ ] Metriken Dashboard erstellen
- [ ] System Health Monitoring
- [ ] Billing Integration (Stripe?)

---

## 📞 Support

Bei Fragen oder Problemen:
- **Technische Fragen:** Siehe `CLAUDE.md` (Web App Docs)
- **iOS App:** Siehe `CLAUDE (iOS App).md`
- **Deployment Issues:** Cloudflare Pages Dashboard checken

---

**Deployment Status:** ✅ Production-Ready
**Letzte erfolgreiche Deployments:**
- Marketing: recipendent.com
- Web App: app.recipendent.com

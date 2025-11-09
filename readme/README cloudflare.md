# 🌐 Cloudflare Pages Deployment für recipendent.com

Diese Dateien sind bereit zum Upload auf Cloudflare Pages.

---

## 📁 Struktur

```
cloudflare-pages-deploy/
├── privacy/
│   └── index.html      → recipendent.com/privacy
└── support/
    └── index.html      → recipendent.com/support
```

---

## 🚀 Deployment-Optionen

### **Option A: Cloudflare Pages Dashboard (Web Interface)**

#### 1. Zu Cloudflare Pages gehen
https://dash.cloudflare.com/ → **Workers & Pages**

#### 2. Dein Projekt öffnen
Klicke auf dein bestehendes `recipendent` Projekt

#### 3. Dateien hinzufügen

**Via GitHub/Git (EMPFOHLEN):**
1. Committe diese Ordner in dein Website-Repository
2. Cloudflare Pages synchronisiert automatisch

```bash
# In deinem Website-Repository:
cp -r /path/to/recipendent-app/cloudflare-pages-deploy/privacy ./privacy
cp -r /path/to/recipendent-app/cloudflare-pages-deploy/support ./support

git add privacy/ support/
git commit -m "Add privacy policy and support pages"
git push origin main
```

3. Cloudflare Pages deployed automatisch (1-2 Minuten)
4. Fertig! 🎉

**Via Direct Upload:**
1. Gehe zu deinem Projekt → **Deployments**
2. Klicke **"Create deployment"**
3. Wähle **"Upload assets"**
4. Ziehe die Ordner `privacy/` und `support/` hinein
5. **Deploy**

---

### **Option B: Wrangler CLI (Command Line)**

#### 1. Wrangler installieren
```bash
npm install -g wrangler
```

#### 2. Login
```bash
wrangler login
```

#### 3. Deploy
```bash
# Im cloudflare-pages-deploy Ordner
wrangler pages deploy . --project-name=recipendent

# Oder aus dem Root-Verzeichnis
wrangler pages deploy cloudflare-pages-deploy --project-name=recipendent
```

---

## 🔗 URLs nach Deployment

Nach erfolgreichem Deployment sind deine Seiten erreichbar unter:

- **Privacy Policy:** https://recipendent.com/privacy
- **Support:** https://recipendent.com/support

**Alternative URLs (falls /privacy nicht funktioniert):**
- https://recipendent.com/privacy/
- https://recipendent.com/privacy.html (wenn du die Datei im Root ablegst)

---

## ✅ Deployment testen

1. Öffne: https://recipendent.com/privacy
2. Prüfe, ob die Privacy Policy korrekt lädt
3. Öffne: https://recipendent.com/support
4. Prüfe, ob die Support-Seite korrekt lädt

---

## 📱 URLs in App Store Connect eintragen

Nach erfolgreichem Deployment:

1. Gehe zu: https://appstoreconnect.apple.com/
2. My Apps → Recipendent → App Information
3. **Privacy Policy URL:** `https://recipendent.com/privacy`
4. **Support URL:** `https://recipendent.com/support`
5. **Save**

---

## 🔧 Troubleshooting

### Problem: 404 Not Found

**Lösung 1:** Prüfe Dateiname
- Datei muss `index.html` heißen (nicht `privacy.html`)
- Ordnerstruktur: `/privacy/index.html`

**Lösung 2:** Cloudflare Einstellungen
- Gehe zu Cloudflare Dashboard → Pages → Dein Projekt
- Settings → Functions → Check "Directory listing"
- Oder: **Build settings** → Output directory: `.`

**Lösung 3:** Cache leeren
- Cloudflare Dashboard → Caching → Purge Everything
- Warte 2-3 Minuten
- Versuche es erneut

### Problem: Alte Version wird angezeigt

**Lösung:** Cache leeren
```bash
# Via Cloudflare Dashboard
# Caching → Purge Cache → Purge Everything

# Oder im Browser
# Öffne die Seite
# CMD + Shift + R (Mac) / CTRL + F5 (Windows)
```

---

## 📞 Hilfe benötigt?

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Support:** recipendent@gmail.com

---

**Viel Erfolg beim Deployment! 🚀**

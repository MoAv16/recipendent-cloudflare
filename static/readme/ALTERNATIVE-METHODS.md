# 🔄 Alternative Hosting-Methoden

Falls du **nicht** Cloudflare Pages nutzt, hier sind andere Optionen:

---

## **Methode 2: Cloudflare Workers (für dynamische Websites)**

Falls deine Website mit Cloudflare Workers läuft:

### Option A: Workers mit Routing

Erstelle eine `_worker.js` Datei:

```javascript
// _worker.js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Privacy Policy Route
    if (url.pathname === '/privacy') {
      return new Response(PRIVACY_HTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Support Route
    if (url.pathname === '/support') {
      return new Response(SUPPORT_HTML, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    // Standard-Antwort für andere Routes
    return fetch(request);
  }
};

// HTML Content einbetten
const PRIVACY_HTML = `
<!DOCTYPE html>
... (dein privacy-policy.html Inhalt) ...
`;

const SUPPORT_HTML = `
<!DOCTYPE html>
... (dein support.html Inhalt) ...
`;
```

**Deployment:**
```bash
wrangler deploy
```

### Option B: Workers KV Storage

Falls der HTML-Content zu groß ist:

```bash
# KV Namespace erstellen
wrangler kv:namespace create "HTML_CONTENT"

# HTML hochladen
wrangler kv:key put --binding=HTML_CONTENT "privacy" --path privacy/index.html
wrangler kv:key put --binding=HTML_CONTENT "support" --path support/index.html
```

**Worker Code:**
```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/privacy') {
      const html = await env.HTML_CONTENT.get('privacy');
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    if (url.pathname === '/support') {
      const html = await env.HTML_CONTENT.get('support');
      return new Response(html, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    }

    return fetch(request);
  }
};
```

---

## **Methode 3: Externer Host mit Cloudflare DNS**

Falls deine Website auf einem anderen Server läuft (Vercel, Netlify, eigener Server):

### Vercel

1. **Projekt vorbereiten:**
```bash
# In deinem Website-Projekt
mkdir -p public/privacy public/support

cp privacy/index.html public/privacy/
cp support/index.html public/support/
```

2. **vercel.json erstellen:**
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

3. **Deployment:**
```bash
vercel --prod
```

### Netlify

1. **Projekt vorbereiten:**
```bash
# In deinem Website-Projekt
mkdir -p privacy support

cp privacy/index.html privacy/
cp support/index.html support/
```

2. **netlify.toml erstellen:**
```toml
[build]
  publish = "."

[[redirects]]
  from = "/privacy"
  to = "/privacy/index.html"
  status = 200

[[redirects]]
  from = "/support"
  to = "/support/index.html"
  status = 200
```

3. **Deployment:**
```bash
netlify deploy --prod
```

---

## **Methode 4: Eigener Server (FTP/SFTP)**

Falls du einen eigenen Webserver hast:

### Via FTP/SFTP

1. **Verbinde dich zu deinem Server:**
   - Nutze FileZilla, Cyberduck, oder Terminal

2. **Ordnerstruktur:**
```
public_html/                (oder www/, httpdocs/)
├── index.html             (deine Homepage)
├── privacy/
│   └── index.html
└── support/
    └── index.html
```

3. **Upload:**
```bash
# Via SFTP Command Line
sftp user@recipendent.com

sftp> mkdir privacy
sftp> mkdir support
sftp> put privacy/index.html privacy/
sftp> put support/index.html support/
sftp> quit
```

### Via SSH/SCP

```bash
# Direkt hochladen
scp privacy/index.html user@recipendent.com:/var/www/html/privacy/
scp support/index.html user@recipendent.com:/var/www/html/support/
```

---

## **Methode 5: GitHub Pages + Cloudflare DNS**

Falls du GitHub Pages nutzen möchtest:

### 1. GitHub Repository erstellen

```bash
# Neues Repo: recipendent-website
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/recipendent-website.git
git push -u origin main
```

### 2. GitHub Pages aktivieren

1. GitHub → Repository → **Settings**
2. **Pages** → Source: **main branch**
3. Warte 2-3 Minuten
4. Site wird published: `https://<username>.github.io/recipendent-website/`

### 3. Custom Domain in Cloudflare

1. **Cloudflare Dashboard** → recipendent.com → **DNS**
2. Füge CNAME Record hinzu:
```
Type: CNAME
Name: @ (oder www)
Content: <username>.github.io
Proxy: ON (orange cloud)
```

3. **GitHub Pages Settings:**
   - Custom domain: `recipendent.com`
   - Enforce HTTPS: ✅

4. Warte 10-15 Minuten für DNS Propagation

---

## **Methode 6: Cloudflare R2 (Object Storage)**

Falls du statische Dateien über R2 hosten möchtest:

### 1. R2 Bucket erstellen

```bash
wrangler r2 bucket create recipendent-website
```

### 2. Dateien hochladen

```bash
wrangler r2 object put recipendent-website/privacy/index.html --file=privacy/index.html --content-type="text/html"
wrangler r2 object put recipendent-website/support/index.html --file=support/index.html --content-type="text/html"
```

### 3. Public Domain aktivieren

1. Cloudflare Dashboard → R2 → recipendent-website
2. **Settings** → **Public Access** → Enable
3. Custom Domain: `assets.recipendent.com` oder `recipendent.com`

---

## **Methode 7: Cloudflare Pages mit Git Integration**

Falls du Git nutzen möchtest:

### 1. Git Repository für Website

```bash
# In deinem Website-Ordner
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab/Bitbucket
git remote add origin https://github.com/<username>/recipendent-website.git
git push -u origin main
```

### 2. Cloudflare Pages mit Git verbinden

1. Cloudflare Dashboard → **Workers & Pages** → **Create application**
2. **Pages** → **Connect to Git**
3. Wähle dein Repository: `recipendent-website`
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (leer lassen)
   - **Build output directory:** `/` oder `.`
5. **Save and Deploy**

### 3. Custom Domain

1. Pages Projekt → **Custom domains**
2. **Set up a custom domain:** `recipendent.com`
3. Cloudflare konfiguriert automatisch DNS

---

## 🤔 Welche Methode soll ich wählen?

| Methode | Best für | Schwierigkeit | Kosten |
|---------|----------|---------------|--------|
| **Cloudflare Pages (Git)** | Automatische Deployments | Einfach | Kostenlos |
| **Cloudflare Pages (Upload)** | Schnelle Änderungen | Sehr einfach | Kostenlos |
| **Cloudflare Workers** | Dynamische Websites | Mittel | Kostenlos (10k req/Tag) |
| **Eigener Server (FTP)** | Volle Kontrolle | Einfach | Abhängig vom Host |
| **GitHub Pages** | Open Source | Einfach | Kostenlos |
| **Vercel/Netlify** | Full-Stack Apps | Einfach | Kostenlos (Limits) |

---

## 📞 Hilfe benötigt?

Sag mir:
1. **Wie hostest du aktuell recipendent.com?**
   - Cloudflare Pages?
   - Cloudflare Workers?
   - Vercel/Netlify?
   - Eigener Server?
   - GitHub Pages?

2. **Hast du Zugriff auf:**
   - Git Repository?
   - FTP/SFTP Credentials?
   - Cloudflare Dashboard?

Dann kann ich dir den besten Weg zeigen!

---

**Support:** recipendent@gmail.com

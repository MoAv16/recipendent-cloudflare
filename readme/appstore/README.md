# App Store Submission Dateien

Dieser Ordner enthält alle notwendigen Dateien für die App Store Veröffentlichung.

## 📄 Dateien

### `privacy-policy.html`
- **Zweck:** Privacy Policy für App Store Connect
- **Status:** ✅ Ready to publish
- **Sprache:** Deutsch/Englisch gemischt (App Store konform)

---

## 🌐 Privacy Policy auf GitHub Pages hosten

### Schritt 1: GitHub Repository erstellen

```bash
# Option A: Neues Repository erstellen
# 1. Gehe zu: https://github.com/new
# 2. Repository Name: recipendent-privacy
# 3. Public (wichtig!)
# 4. Erstellen

# Option B: Dieses Repository nutzen
# Aktiviere einfach GitHub Pages für dieses Repo
```

### Schritt 2: Privacy Policy hochladen

**Option A: GitHub Web Interface**
1. Gehe zu deinem Repository
2. Klicke auf "Add file" → "Upload files"
3. Ziehe `privacy-policy.html` ins Fenster
4. Commit: "Add privacy policy"
5. Benenne die Datei um zu: `index.html` (wichtig für GitHub Pages!)

**Option B: Git Command Line**
```bash
# Wenn du dieses Projekt bereits committed hast:
git add AppStore/privacy-policy.html
git commit -m "Add privacy policy for App Store"
git push origin main

# Dann auf GitHub: Datei umbenennen zu index.html
```

### Schritt 3: GitHub Pages aktivieren

1. Gehe zu: Repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** (oder master)
4. Folder: **/ (root)** ODER **AppStore** (falls du Subfolder nutzt)
5. Klicke **Save**
6. Warte 2-3 Minuten

### Schritt 4: URL erhalten

Deine Privacy Policy ist dann erreichbar unter:

```
https://<dein-github-username>.github.io/recipendent-app/AppStore/privacy-policy.html

# ODER (wenn als index.html im Root):
https://<dein-github-username>.github.io/recipendent-privacy/
```

**Beispiel:**
```
https://moav16.github.io/recipendent-app/AppStore/privacy-policy.html
```

---

## 📱 URL in App Store Connect eintragen

1. Gehe zu: [App Store Connect](https://appstoreconnect.apple.com/)
2. My Apps → **Recipendent** → App Information
3. **Privacy Policy URL:**
   ```
   https://<dein-github-username>.github.io/recipendent-app/AppStore/privacy-policy.html
   ```
4. Save

---

## ✅ Checkliste vor App Store Submission

- [ ] Privacy Policy auf GitHub Pages gehostet
- [ ] Privacy Policy URL funktioniert (im Browser testen!)
- [ ] Privacy Policy URL in App Store Connect eingetragen
- [ ] Support URL/E-Mail bereit: `recipendent@gmail.com`
- [ ] Screenshots erstellt (iPhone 6.7" & 6.5")
- [ ] App Icon 1024x1024px vorbereitet
- [ ] App Beschreibung geschrieben
- [ ] Test-Account für Apple Review vorbereitet
- [ ] `eas build --platform ios --profile production` erfolgreich
- [ ] `eas submit --platform ios --latest` ausgeführt

---

## 🔗 Wichtige Links

- **App Store Connect:** https://appstoreconnect.apple.com/
- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/

---

## 📞 Kontakt

Bei Fragen zur Privacy Policy oder App Store Submission:
- **E-Mail:** recipendent@gmail.com
- **Developer:** Muhammed Avci

---

**Hinweis:** Diese Privacy Policy erfüllt alle Apple App Store Anforderungen und DSGVO-Standards.

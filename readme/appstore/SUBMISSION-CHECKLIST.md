# ✅ App Store Submission Checklist

Komplette Checkliste für die Veröffentlichung von Recipendent im App Store.

---

## 🎯 Phase 1: Vorbereitung (BEVOR du baust)

### **Apple Developer Account**
- [ ] Apple Developer Program Mitgliedschaft aktiv (99€/Jahr)
- [ ] Apple ID verifiziert
- [ ] Zwei-Faktor-Authentifizierung aktiviert
- [ ] Team-Rolle: Account Holder oder Admin
- [ ] Bundle ID reserviert: `com.recipendent.app`

### **Expo/EAS Setup**
- [ ] Expo Account erstellt
- [ ] EAS CLI installiert: `npm install -g eas-cli`
- [ ] EAS Login: `eas login`
- [ ] Project ID in app.json: ✅ vorhanden

### **App Konfiguration**
- [ ] App Version korrekt: `1.0.0`
- [ ] Bundle Identifier: `com.recipendent.app`
- [ ] App Name: `Recipendent`
- [ ] App Icon (1024x1024px) vorbereitet
- [ ] ⚠️ **KRITISCH:** `supabaseServiceRoleKey` entfernt aus app.json ✅
- [ ] `ITSAppUsesNonExemptEncryption: false` gesetzt ✅

---

## 📄 Phase 2: Dokumente & Metadaten

### **Privacy Policy**
- [ ] `privacy-policy.html` erstellt ✅
- [ ] Auf GitHub Pages gehostet
- [ ] URL funktioniert (im Browser getestet)
- [ ] URL notiert: `https://___________________`

### **Support Seite**
- [ ] `support.html` erstellt ✅
- [ ] Auf GitHub Pages gehostet
- [ ] URL funktioniert (im Browser getestet)
- [ ] URL notiert: `https://___________________`

### **App Store Beschreibung**
- [ ] App Name (max 30 Zeichen): `Recipendent`
- [ ] Subtitle (max 30 Zeichen): `Auftrags- & Teamverwaltung`
- [ ] Description (max 4000 Zeichen): ✅ Vorlage in `app-description.txt`
- [ ] Keywords (max 100 Zeichen): ✅ Vorlage vorhanden
- [ ] Promotional Text (max 170 Zeichen, optional): ✅ Vorlage vorhanden
- [ ] What's New (max 4000 Zeichen): ✅ Vorlage vorhanden

### **Screenshots**
- [ ] iPhone 6.7" (1290x2796px): 3-10 Screenshots
- [ ] iPhone 6.5" (1242x2688px): 3-10 Screenshots
- [ ] iPad (optional): 3-10 Screenshots
- [ ] Screenshot 1: Dashboard
- [ ] Screenshot 2: Auftrag erstellen
- [ ] Screenshot 3: Team-Verwaltung
- [ ] Screenshot 4: Ordner
- [ ] Screenshot 5: Settings/Branding
- [ ] Screenshot 6: Dark Mode (optional)

### **Test Account für Apple Review**
- [ ] Test-Admin Account erstellt
- [ ] Email: ___________________
- [ ] Password: ___________________ (sicher aufbewahren!)
- [ ] Test-Company mit Daten gefüllt
- [ ] 3-5 Test-Aufträge vorhanden
- [ ] 2-3 Test-Team-Mitglieder angelegt

---

## 🏗️ Phase 3: Build & Test

### **Lokale Tests**
- [ ] App startet ohne Fehler: `npx expo start`
- [ ] Login funktioniert
- [ ] Auftrag erstellen funktioniert
- [ ] Team-Einladung funktioniert
- [ ] Face ID funktioniert (oder überspringt wenn nicht verfügbar)
- [ ] Dark Mode funktioniert
- [ ] Alle Screens erreichbar
- [ ] Keine Crashes

### **Production Build**
```bash
# Build starten (dauert 15-30 Minuten)
eas build --platform ios --profile production
```

- [ ] Build gestartet
- [ ] Build erfolgreich abgeschlossen
- [ ] Build-ID notiert: ___________________
- [ ] .ipa Datei heruntergeladen (optional)

---

## 🚀 Phase 4: App Store Connect Setup

### **App in App Store Connect erstellen**

Gehe zu: https://appstoreconnect.apple.com/

- [ ] "My Apps" → "+" → "New App"
- [ ] Platforms: **iOS**
- [ ] Name: **Recipendent**
- [ ] Primary Language: **German (Germany)**
- [ ] Bundle ID: **com.recipendent.app** (aus Dropdown)
- [ ] SKU: **recipendent-app-1** (oder eigene Wahl)
- [ ] User Access: **Full Access**

### **App Information**
- [ ] Category: **Business** (oder Productivity)
- [ ] Subcategory: (optional)
- [ ] Privacy Policy URL: `https://___________________`
- [ ] Support URL: `https://___________________`
- [ ] Marketing URL: (optional)
- [ ] Copyright: `© 2025 Muhammed Avci`

### **Age Rating**
- [ ] Age Rating Questionnaire ausgefüllt
- [ ] Ergebnis: **4+** (Business App, keine bedenklichen Inhalte)

### **Pricing & Availability**
- [ ] Price: **Free** (oder dein gewünschter Preis)
- [ ] Availability: **All Countries** (oder spezifische Länder)
- [ ] Available: **Immediately after approval**

---

## 📤 Phase 5: Build hochladen & Version vorbereiten

### **Build zu App Store Connect submitten**

```bash
# Automatischer Upload via EAS
eas submit --platform ios --latest

# Oder spezifische Build-ID
eas submit --platform ios --id <BUILD_ID>
```

**Während Submit:**
- [ ] Apple ID eingegeben
- [ ] App-specific Password erstellt und eingegeben
  - Erstelle eins: https://appleid.apple.com → Security → App-Specific Passwords
- [ ] Apple Team ID ausgewählt (falls mehrere)
- [ ] Upload erfolgreich

### **Build in App Store Connect verarbeitet** (5-15 Minuten warten)
- [ ] Build erscheint unter "Activity"
- [ ] Build Status: "Processing" → "Ready to Submit"
- [ ] Keine Fehler oder Warnungen

### **Version 1.0.0 vorbereiten**
- [ ] "My Apps" → Recipendent → "+" → iOS → Version 1.0.0
- [ ] Build ausgewählt (+ Button bei "Build")
- [ ] Screenshots hochgeladen (iPhone 6.7" & 6.5")
- [ ] App Icon hochgeladen (1024x1024px)
- [ ] Description eingefügt
- [ ] Keywords eingefügt
- [ ] Support URL eingefügt
- [ ] Privacy Policy URL eingefügt

---

## 🔍 Phase 6: App Review Information

### **Test Account & Review Notes**
- [ ] **Demo Account Email:** ___________________
- [ ] **Demo Account Password:** ___________________
- [ ] **Demo Account Role:** Admin
- [ ] **Sign-in required:** Yes

**Review Notes (eingeben):**
```
Recipendent ist eine Business-App für Auftrags- und Teamverwaltung.

TEST INSTRUCTIONS:
1. Login mit Demo-Account
2. Erstelle einen Auftrag im Dashboard (+ Button)
3. Navigiere zu Team → Lade einen Mitarbeiter ein
4. Gehe zu Einstellungen → Ändere Logo (Face ID wird abgefragt)
5. Teste Dark Mode in Einstellungen

WICHTIG:
- Face ID kann in Settings aktiviert/deaktiviert werden
- Für Team-Einladungen wird ein Einladungscode generiert
- Die App benötigt Internet-Verbindung

Bei Fragen: recipendent@gmail.com
```

- [ ] Review Notes eingefügt
- [ ] Test-Account Credentials eingegeben

### **Export Compliance**
- [ ] Frage: "Does your app use encryption?"
- [ ] Antwort: **No** (weil `ITSAppUsesNonExemptEncryption: false`)
- [ ] Keine weiteren Export-Compliance Fragen

---

## 🎉 Phase 7: Submit for Review

### **Final Check**
- [ ] Alle Felder ausgefüllt (kein rotes Ausrufezeichen)
- [ ] Screenshots hochgeladen
- [ ] Privacy Policy & Support URL funktionieren
- [ ] Build ausgewählt
- [ ] Test-Account funktioniert (selbst testen!)
- [ ] Review Notes vollständig

### **Submit!**
- [ ] "Add for Review" geklickt
- [ ] "Submit for Review" geklickt
- [ ] Status: **Waiting for Review**

---

## ⏳ Phase 8: Review-Prozess

### **Status Tracking**
Checke regelmäßig den Status in App Store Connect:

- [ ] **Waiting for Review** (24-48 Stunden)
  - Apple hat deine App in der Warteschlange

- [ ] **In Review** (1-3 Tage)
  - Apple testet deine App aktiv
  - Prüfe E-Mails von Apple!

- [ ] **Ready for Sale** ✅
  - **GESCHAFFT!** App ist live im App Store!

### **Bei Ablehnung (Rejection)**
- [ ] E-Mail von Apple lesen
- [ ] Resolution Center in App Store Connect prüfen
- [ ] Probleme beheben
- [ ] Neue Version einreichen (falls nötig)
- [ ] Oder: Antwort an Apple senden (falls Missverständnis)

---

## 📱 Phase 9: Nach der Genehmigung

### **App ist live!**
- [ ] App Store Link generiert: https://apps.apple.com/app/id___________
- [ ] App Store Link testen (im Safari öffnen)
- [ ] Marketing vorbereiten (Social Media, Website)
- [ ] Feedback von ersten Nutzern sammeln
- [ ] Monitoring: Crashes, Reviews, Ratings

### **Post-Launch Monitoring**
- [ ] App Store Connect Analytics prüfen
- [ ] User Reviews lesen und beantworten
- [ ] Crash Reports prüfen (App Store Connect → Analytics → Crashes)
- [ ] Performance Metrics beobachten

---

## 🆘 Häufige Ablehnungsgründe & Lösungen

### **4.0 Design - Copycats**
❌ "App ähnelt zu sehr einer anderen App"
✅ **Lösung:** Zeige Unique Value Proposition, erkläre Unterschiede

### **2.1 Information Needed**
❌ "Fehlende Test-Account Informationen"
✅ **Lösung:** Klare Test-Credentials + Review Notes

### **5.1.1 Data Collection and Storage**
❌ "Privacy Policy unvollständig"
✅ **Lösung:** Aktualisiere Privacy Policy (bereits erledigt! ✅)

### **2.3.1 Accurate Metadata**
❌ "Screenshots zeigen Features die nicht in der App sind"
✅ **Lösung:** Nur echte Screenshots verwenden

### **Guideline 4.2 - Minimum Functionality**
❌ "App hat zu wenig Funktionalität"
✅ **Lösung:** Zeige alle Features im Review (Aufträge, Team, Settings)

---

## 📞 Support & Hilfe

### **Apple Ressourcen**
- **App Store Connect:** https://appstoreconnect.apple.com/
- **Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Developer Support:** https://developer.apple.com/support/

### **Expo Ressourcen**
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/
- **Expo Forum:** https://forums.expo.dev/

### **Recipendent Support**
- **Email:** recipendent@gmail.com
- **Developer:** Muhammed Avci

---

## 🎯 Geschätzte Timeline

| Phase | Dauer |
|-------|-------|
| Vorbereitung & Dokumente | 2-4 Stunden |
| Screenshots erstellen | 1-2 Stunden |
| EAS Build | 15-30 Minuten |
| App Store Connect Setup | 1-2 Stunden |
| Submit & Upload | 15-30 Minuten |
| **Waiting for Review** | **24-48 Stunden** |
| **In Review** | **1-3 Tage** |
| **TOTAL** | **~3-5 Tage** |

---

## ✅ Quick Commands Cheat Sheet

```bash
# EAS Login
eas login

# Build starten
eas build --platform ios --profile production

# Build Status prüfen
eas build:list

# Submit zu App Store
eas submit --platform ios --latest

# App lokal testen
npx expo start
```

---

**Viel Erfolg mit deiner App Store Submission! 🚀**

Bei Fragen: recipendent@gmail.com

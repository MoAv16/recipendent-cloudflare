# 📸 Screenshots für App Store erstellen

Apple benötigt Screenshots in spezifischen Auflösungen. Hier ist eine Anleitung, wie du sie erstellst.

---

## 📱 Benötigte Screenshot-Größen

### **PFLICHT (iPhone):**

1. **iPhone 6.7" Display** (iPhone 15 Pro Max, 14 Pro Max)
   - Auflösung: **1290 x 2796 px**
   - Anzahl: 3-10 Screenshots

2. **iPhone 6.5" Display** (iPhone 14 Plus, 13 Pro Max, 12 Pro Max)
   - Auflösung: **1242 x 2688 px**
   - Anzahl: 3-10 Screenshots

### **OPTIONAL (iPad):**

3. **iPad Pro 12.9" Display**
   - Auflösung: **2048 x 2732 px**
   - Anzahl: 3-10 Screenshots

---

## 🛠️ Screenshots mit iOS Simulator erstellen

### **Schritt 1: Expo App im Simulator starten**

```bash
# Terminal öffnen und App starten
npx expo start

# Dann "i" drücken für iOS Simulator
# Oder: Wähle den gewünschten Simulator aus dem Menü
```

### **Schritt 2: Richtigen Simulator wählen**

Im Xcode Simulator:
- **Hardware → Device → iPhone 15 Pro Max** (für 6.7" Screenshots)
- **Hardware → Device → iPhone 14 Plus** (für 6.5" Screenshots)

Oder via Command Line:
```bash
# Liste aller verfügbaren Simulatoren
xcrun simctl list devices available

# Starte spezifischen Simulator
xcrun simctl boot "iPhone 15 Pro Max"
open -a Simulator
```

### **Schritt 3: Screenshots aufnehmen**

**Option A: Tastenkombination im Simulator**
- **CMD + S** (macOS)
- Screenshots werden automatisch auf dem Desktop gespeichert

**Option B: Command Line**
```bash
# Screenshot vom aktuell laufenden Simulator
xcrun simctl io booted screenshot ~/Desktop/screenshot-1.png

# Mit Timestamp im Namen
xcrun simctl io booted screenshot ~/Desktop/recipendent-$(date +%Y%m%d-%H%M%S).png
```

**Option C: Simulator Menü**
- **File → New Screen Recording** (für Videos)
- **File → Take Screenshot** (CMD + S)

---

## 📋 Screenshot-Checkliste

Erstelle Screenshots von folgenden Screens:

### **Screenshot 1: Dashboard (Home)**
- ✅ Zeige 3-4 Aufträge
- ✅ Ein Auftrag mit "Kritisch" Badge
- ✅ Company Logo sichtbar im Header
- ✅ Filter-Pills (Alle, Aktiv, Erledigt, Kritisch)

### **Screenshot 2: Auftrag erstellen/bearbeiten**
- ✅ Zeige Create Order Screen
- ✅ Gefüllte Felder (Titel, Beschreibung, etc.)
- ✅ Team-Zuweisung Dropdown
- ✅ Priorität-Auswahl

### **Screenshot 3: Team-Verwaltung**
- ✅ 3-5 Team-Mitglieder mit Profilbildern
- ✅ Rollen sichtbar (Admin, Co-Admin, Employee)
- ✅ "Neuen Mitarbeiter einladen" Section

### **Screenshot 4: Ordner & Organisation**
- ✅ Recipes/Folders Screen
- ✅ 3-4 Ordner mit Icons
- ✅ Anzahl der Rezepte pro Ordner

### **Screenshot 5: Settings mit Branding**
- ✅ Company Settings Section
- ✅ Logo-Vorschau
- ✅ Logo-Farbe Picker
- ✅ Face ID Toggle

### **Screenshot 6: Dark Mode (optional)**
- ✅ Dashboard im Dark Mode
- ✅ Zeige den Kontrast und Glassmorphism

---

## 🎨 Screenshot-Styling Tipps

### **Vorbereitung:**

1. **Test-Daten erstellen:**
   ```
   - 5-6 Aufträge mit verschiedenen Status
   - 3-4 Team-Mitglieder mit Profilbildern
   - 3-4 Ordner mit Icons
   - Ein kritischer Auftrag mit Timer
   ```

2. **Logo hochladen:**
   - Nutze ein professionelles Company Logo
   - Aktiviere "Logo-Branding"

3. **Themes testen:**
   - Light Mode für Screenshots 1-5
   - Dark Mode für Screenshot 6

### **Best Practices:**

- ✅ **Konsistente Uhrzeit**: Stelle Simulator auf 9:41 AM (Apple Standard)
  ```bash
  # Öffne den Simulator
  # Simulator → Menü → Features → Trigger iCloud Sync (um Zeit zu setzen)
  ```

- ✅ **Volle Batterie**: 100% im Simulator (automatisch)

- ✅ **Voller WiFi**: Maximale Signalstärke (automatisch)

- ✅ **Keine Notifikationen**: Deaktiviere Notifications im Simulator

- ✅ **Statusbar sauber**: Keine Timer oder laufende Apps im Hintergrund

---

## 🖼️ Screenshots bearbeiten (optional)

### **Mit macOS Preview:**

1. Screenshot öffnen
2. **Tools → Adjust Size** → Prüfe Auflösung
3. Falls nötig: Zuschneiden auf korrekte Größe

### **Mit Online-Tools:**

- **Figma** (https://figma.com) - Professionelle Mockups
- **Canva** (https://canva.com) - Screenshot-Rahmen
- **Smartmockups** (https://smartmockups.com) - iPhone Mockups

### **Mit Device Frames (optional):**

Füge iPhone-Rahmen hinzu für professionelleren Look:
- **Screenshots.pro** (https://screenshots.pro)
- **AppLaunchpad** (https://theapplaunchpad.com/)

---

## 📤 Screenshots hochladen

1. Gehe zu: **App Store Connect → Recipendent**
2. **Version 1.0.0** auswählen
3. Scrolle zu **App Store Screenshots**
4. Klicke auf **iPhone 6.7" Display**
5. Ziehe die 6.7" Screenshots rein (Reihenfolge beachten!)
6. Wiederhole für **iPhone 6.5" Display**
7. **Save**

---

## ✅ Screenshot-Validierung

Apple prüft:
- ✅ Korrekte Auflösung (1290x2796 bzw. 1242x2688)
- ✅ PNG Format (automatisch vom Simulator)
- ✅ Keine Statusbar-Probleme
- ✅ Screenshots zeigen reale App-Funktionen
- ✅ Keine Mockups oder Marketingtext (außer als Overlay)

---

## 🚨 Häufige Fehler

❌ **Falsche Auflösung** → Nutze die richtigen Simulatoren
❌ **Screenshots zu dunkel** → Helligkeit im Simulator erhöhen
❌ **Zu wenige Screenshots** → Mindestens 3 pro Gerät
❌ **Falscher Simulator** → Prüfe Display-Größe
❌ **Leere Screens** → Fülle die App mit Test-Daten

---

## 🎬 Alternative: Screen Recording

Statt Screenshots kannst du auch ein **30 Sekunden Video** hochladen:
```bash
# Screen Recording im Simulator
xcrun simctl io booted recordVideo --codec h264 recipendent-demo.mp4

# Drücke CTRL+C zum Stoppen
```

**Video-Spezifikationen:**
- Länge: 15-30 Sekunden
- Format: MOV oder M4V
- Max. Größe: 500 MB
- Auflösung: Gleiche wie Screenshots

---

## 📞 Hilfe benötigt?

Bei Fragen zu Screenshots:
- **E-Mail:** recipendent@gmail.com

---

**Viel Erfolg bei der Screenshot-Erstellung! 📸**

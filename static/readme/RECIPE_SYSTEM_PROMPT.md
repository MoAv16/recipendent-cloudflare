# Rezept-System (Template-System für Aufträge) - VOLLSTÄNDIGE IMPLEMENTIERUNG

**⚠️ HINWEIS:** Dieser Prompt soll in die CLAUDE.md unter "Prompt-Korb [6]" eingefügt werden.

---

## 🎯 VISION & KONZEPT

**Leitsatz der App:**
"Das Rezept (Template) für deine Aufträge (Orders) ist individuell, anpassbar und wiederverwendbar."

**Metapher:**
- 📋 **Order** = Fertiges Gericht (konkrete Bestellung)
- 📖 **Rezept (Template)** = Anleitung/Vorlage für wiederkehrende Orders
- 📁 **Ordner** = Rezeptbuch-Kategorien (z.B. "Pizza-Varianten", "Catering", "Express-Lieferungen")

**Kernproblem gelöst:**
Restaurants/Unternehmen haben wiederkehrende Auftragstypen mit unterschiedlichen Informations-Anforderungen:
- Pizza-Bestellung: Kunde, Gericht, Extras
- Catering-Auftrag: Veranstaltung, Personenanzahl, Menü
- Express-Lieferung: Abholadresse, Zieladresse, Lieferzeit

---

## 📊 TECHNISCHE ANFORDERUNGEN

### 1. Datenbank-Schema (Supabase PostgreSQL)

```sql
-- ============================================================================
-- RECIPES TABLE (Templates für Orders)
-- ============================================================================
CREATE TABLE public.recipes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  author_id uuid REFERENCES users(id) NOT NULL,

  -- Template Metadata
  name text NOT NULL,                          -- Template Name (z.B. "Pizza-Bestellung", "Catering-Standard")
  description text,                            -- Optionale Beschreibung
  icon text DEFAULT 'note-text',               -- MaterialCommunityIcons name
  color text DEFAULT '#2196F3',                -- Template-Farbe

  -- Custom Field Layout (JSONB für Flexibilität)
  field_config jsonb NOT NULL DEFAULT '{
    "customer": {"label": "Kunde", "visible": true, "required": true},
    "description": {"label": "Beschreibung", "visible": true, "required": false},
    "location": {"label": "Ort", "visible": true, "required": false},
    "due_date": {"label": "Fälligkeitsdatum", "visible": true, "required": false},
    "image": {"label": "Bild", "visible": true, "required": false},
    "notes": {"label": "Notizen", "visible": true, "required": false}
  }'::jsonb,

  -- Template-spezifische Defaults
  default_priority int DEFAULT 3,              -- Standard-Priorität (1-4)
  default_assigned_to uuid[],                  -- Standard-Zuweisung
  default_folder_id uuid REFERENCES folders(id),

  -- Usage Statistics
  usage_count int DEFAULT 0,                   -- Wie oft wurde Template verwendet
  last_used_at timestamp with time zone,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company recipes"
ON public.recipes FOR SELECT
USING (company_id = (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins/Co-Admins can manage recipes"
ON public.recipes FOR ALL
USING (
  company_id = (SELECT company_id FROM public.users WHERE id = auth.uid())
  AND (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'co-admin')
);

-- Indexes
CREATE INDEX idx_recipes_company_id ON public.recipes(company_id);
CREATE INDEX idx_recipes_folder_id ON public.recipes(folder_id);
CREATE INDEX idx_recipes_usage_count ON public.recipes(usage_count DESC);

-- ============================================================================
-- ERWEITERTE ORDERS TABLE (Verknüpfung mit Recipe)
-- ============================================================================
ALTER TABLE public.orders ADD COLUMN recipe_id uuid REFERENCES recipes(id) ON DELETE SET NULL;
ALTER TABLE public.orders ADD COLUMN field_values jsonb DEFAULT '{}'::jsonb; -- Werte für Custom Fields

CREATE INDEX idx_orders_recipe_id ON public.orders(recipe_id);
```

**Field Config Struktur (JSONB):**
```json
{
  "customer": {
    "label": "Kunde",           // Angezeigter Name
    "visible": true,            // Sichtbar im Order-Formular?
    "required": true,           // Pflichtfeld?
    "placeholder": "Name eingeben",  // Optional
    "type": "text"              // text | textarea | select | date | image
  },
  "description": {
    "label": "Auftrags-Details",
    "visible": true,
    "required": false,
    "type": "textarea"
  },
  // Weitere Custom Fields...
}
```

---

### 2. Frontend-Architektur

**Neue Screens:**
```
features/recipes/
├── screens/
│   ├── RecipeFoldersScreen.js      (✅ Existiert - ERWEITERN)
│   ├── RecipeListScreen.js         (✅ Existiert - REFACTOR)
│   ├── CreateRecipeScreen.js       (🆕 NEU - Template Builder)
│   ├── EditRecipeScreen.js         (🆕 NEU - Template Editor)
│   ├── RecipeDetailScreen.js       (🆕 NEU - Template Vorschau)
│   └── FieldEditorModal.js         (🆕 NEU - Field Config Editor)
├── components/
│   ├── RecipeCard.js               (🆕 NEU - Template-Karte)
│   ├── FieldConfigEditor.js        (🆕 NEU - Drag & Drop Field Editor)
│   └── TemplatePreview.js          (🆕 NEU - Live Preview)
└── services/
    └── recipeService.js            (🆕 NEU - CRUD für Recipes)
```

**Erweiterte Screens:**
```
features/orders/screens/
├── CreateOrderScreen.js            (⚙️ ERWEITERN - Template-Auswahl)
└── EditOrderScreen.js              (⚙️ ERWEITERN - Custom Fields)
```

---

## 🎨 UI/UX DESIGN ANFORDERUNGEN

### RecipeFoldersScreen (Hauptübersicht)

**Layout-Konzept: 3-Tab-System**

```
┌─────────────────────────────────────────┐
│  Rezepte                         ⚙️  +  │  ← Header
├─────────────────────────────────────────┤
│  ┌──────┬──────────┬──────────┐        │  ← Tab Bar
│  │ Alle │ Rezepte  │ Ordner   │        │
│  └──────┴──────────┴──────────┘        │
├─────────────────────────────────────────┤
│                                         │
│  📊 STATISTIK-CARDS (nur Tab "Alle")   │
│  ┌─────────────┐  ┌─────────────┐      │
│  │  📋 24      │  │  📖 8       │      │
│  │  Aufträge   │  │  Rezepte    │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  🔥 MEISTGENUTZTE REZEPTE              │
│  ┌───────────────────────────────┐     │
│  │ 🍕 Pizza-Standard      ↗️ 45x │     │
│  │ 🎂 Catering-Auftrag    ↗️ 23x │     │
│  └───────────────────────────────┘     │
│                                         │
│  📁 ORDNER                              │
│  [Folder Cards wie aktuell]            │
│                                         │
│  📋 LETZTE AUFTRÄGE                    │
│  [Order Cards mit Recipe-Badge]        │
│                                         │
└─────────────────────────────────────────┘

TAB "REZEPTE":
┌─────────────────────────────────────────┐
│  🔍 Rezepte durchsuchen...              │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ 📖 Standard-Auftrag             │   │
│  │ System • Immer verfügbar        │   │
│  │ ─────────────────────────        │   │
│  │ Alle Standardfelder • 156x      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🍕 Pizza-Bestellung             │   │
│  │ Restaurant • vor 2 Tagen        │   │
│  │ ─────────────────────────        │   │
│  │ Kunde, Gericht, Extras • 45x   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎂 Catering-Auftrag             │   │
│  │ Events • vor 1 Woche            │   │
│  │ ─────────────────────────        │   │
│  │ Event, Personen, Menü • 23x    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

TAB "ORDNER":
[Aktuelle Folder-Liste mit Erweiterung]
- Anzahl Rezepte pro Ordner anzeigen
- Anzahl Aufträge pro Ordner anzeigen
```

**Visual Design:**
- **Farb-Kodierung:** Rezepte haben individuelle Farben (wie Ordner)
- **Usage-Indicator:** Kleine Badges "45x verwendet"
- **Quick Actions:** Swipe → Bearbeiten, Duplizieren, Löschen
- **Drag & Drop:** Rezepte in Ordner ziehen (später)

---

### CreateRecipeScreen (Template Builder)

**Layout: 3-Schritt-Wizard**

```
SCHRITT 1: GRUNDDATEN
┌─────────────────────────────────────────┐
│  ← Rezept erstellen              1/3    │
├─────────────────────────────────────────┤
│  📝 TEMPLATE-NAME                       │
│  ┌───────────────────────────────────┐ │
│  │ z.B. "Pizza-Bestellung"           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📄 BESCHREIBUNG (Optional)            │
│  ┌───────────────────────────────────┐ │
│  │ Für wiederkehrende Pizza-Orders   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  🎨 FARBE & ICON                       │
│  [Color Picker] [Icon Selector]        │
│                                         │
│  📁 ORDNER (Optional)                  │
│  [Folder Dropdown]                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Weiter zu Feldern  →        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

SCHRITT 2: FELDER ANPASSEN
┌─────────────────────────────────────────┐
│  ← Felder konfigurieren          2/3    │
├─────────────────────────────────────────┤
│  🔧 STANDARD-FELDER                     │
│  (Aktivieren/Umbenennen/Sortieren)      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☑️ Kunde                          │ │
│  │   Label: [Kunde          ]        │ │
│  │   ⚠️ Pflichtfeld  📝 Sichtbar     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☑️ Beschreibung                   │ │
│  │   Label: [Auftrags-Details]       │ │
│  │   ⚠️ Pflichtfeld  📝 Sichtbar     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ☐ Ort                             │ │
│  │   [Deaktiviert - nicht sichtbar]  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  + Benutzerdefiniertes Feld            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ← Zurück    Vorschau →         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘

SCHRITT 3: VORSCHAU & STANDARDWERTE
┌─────────────────────────────────────────┐
│  ← Vorschau & Speichern          3/3    │
├─────────────────────────────────────────┤
│  👁️ VORSCHAU                           │
│  [Live Preview wie Order aussehen wird] │
│                                         │
│  ⚙️ STANDARDWERTE (Optional)           │
│  ┌───────────────────────────────────┐ │
│  │ Standard-Priorität: [Mittel ▼]   │ │
│  │ Standard-Zuweisung: [Team     ]   │ │
│  │ Standard-Ordner:   [Keine     ]   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ← Zurück    ✅ Erstellen       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Interaktionen:**
- **Drag Handles:** Felder per Drag & Drop sortieren
- **Toggle Switches:** Felder aktivieren/deaktivieren
- **Live Preview:** Änderungen sofort sichtbar
- **Field Types:** text, textarea, select, date, image, checkbox
- **Validation:** Name required, mindestens 1 Feld aktiv

---

### CreateOrderScreen (Erweitert mit Template-Auswahl)

**Template Selector Modal:**

```
┌─────────────────────────────────────────┐
│  Rezept wählen                       ✕  │
├─────────────────────────────────────────┤
│  🔍 Suchen...                           │
├─────────────────────────────────────────┤
│  📖 SYSTEM                              │
│  ┌───────────────────────────────────┐ │
│  │ ✓ Standard-Auftrag                │ │  ← Selected
│  │   Alle Standard-Felder            │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📁 RESTAURANT                          │
│  ┌───────────────────────────────────┐ │
│  │ 🍕 Pizza-Bestellung                │ │
│  │   Kunde, Gericht, Extras • 45x    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🍔 Burger-Auftrag                  │ │
│  │   Kunde, Burger-Typ • 12x         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  📁 EVENTS                              │
│  ┌───────────────────────────────────┐ │
│  │ 🎂 Catering-Auftrag                │ │
│  │   Event, Personen, Menü • 23x     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Nach Template-Auswahl:**
- Formular passt sich an field_config an
- Nur sichtbare Felder werden angezeigt
- Labels sind angepasst (z.B. "Gericht" statt "Kunde")
- Pflichtfelder haben rote Markierung
- Standard-Werte werden vorausgefüllt

---

## ⚙️ TECHNISCHE IMPLEMENTATION

### 1. Service Layer (recipeService.js)

```javascript
// features/recipes/services/recipeService.js

import { supabase } from '../../../config/supabaseClient';

/**
 * Erstellt ein neues Recipe Template
 */
export const createRecipe = async (recipeData) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single();

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      ...recipeData,
      company_id: userData.company_id,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Holt alle Recipes einer Company
 */
export const getRecipes = async (folderId = null) => {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: userData } = await supabase
    .from('users')
    .select('company_id')
    .eq('id', user.id)
    .single();

  let query = supabase
    .from('recipes')
    .select(`
      *,
      folder:folders(id, name, color),
      author:users!author_id(first_name, last_name)
    `)
    .eq('company_id', userData.company_id)
    .order('usage_count', { ascending: false });

  if (folderId) {
    query = query.eq('folder_id', folderId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Verwendet ein Recipe (erhöht Usage Count)
 */
export const useRecipe = async (recipeId) => {
  const { data, error } = await supabase.rpc('increment_recipe_usage', {
    recipe_id: recipeId
  });

  if (error) throw error;
  return data;
};

// Weitere CRUD Operationen...
```

### 2. Database Function für Usage Count

```sql
-- In Supabase SQL Editor
CREATE OR REPLACE FUNCTION increment_recipe_usage(recipe_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE recipes
  SET
    usage_count = usage_count + 1,
    last_used_at = now()
  WHERE id = recipe_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Field Config Validator

```javascript
// shared/utils/fieldConfigValidator.js

const DEFAULT_FIELD_CONFIG = {
  customer: { label: 'Kunde', visible: true, required: true, type: 'text' },
  description: { label: 'Beschreibung', visible: true, required: false, type: 'textarea' },
  location: { label: 'Ort', visible: true, required: false, type: 'text' },
  due_date: { label: 'Fälligkeitsdatum', visible: true, required: false, type: 'date' },
  image: { label: 'Bild', visible: true, required: false, type: 'image' },
};

/**
 * Validiert Field Config und merged mit Defaults
 */
export const validateFieldConfig = (config) => {
  const merged = { ...DEFAULT_FIELD_CONFIG };

  Object.keys(config).forEach(key => {
    if (merged[key]) {
      merged[key] = {
        ...merged[key],
        ...config[key]
      };
    }
  });

  // Mindestens 1 Feld muss visible sein
  const hasVisibleField = Object.values(merged).some(f => f.visible);
  if (!hasVisibleField) {
    throw new Error('Mindestens ein Feld muss sichtbar sein');
  }

  return merged;
};

/**
 * Generiert dynamisches Order-Formular basierend auf Field Config
 */
export const renderDynamicForm = (fieldConfig, values, onChange) => {
  return Object.entries(fieldConfig)
    .filter(([key, config]) => config.visible)
    .map(([key, config]) => {
      switch (config.type) {
        case 'text':
          return <TextInput key={key} label={config.label} required={config.required} />;
        case 'textarea':
          return <TextArea key={key} label={config.label} required={config.required} />;
        // Weitere Field Types...
      }
    });
};
```

---

## 🚀 IMPLEMENTATION ROADMAP

### Phase 1: Database & Backend (2-3h)
1. ✅ Create `recipes` table mit RLS Policies
2. ✅ Add `recipe_id` + `field_values` zu `orders` table
3. ✅ Create DB function `increment_recipe_usage`
4. ✅ Test RLS Policies mit verschiedenen Roles

### Phase 2: Recipe CRUD (3-4h)
1. ✅ `recipeService.js` implementieren
2. ✅ `CreateRecipeScreen` - 3-Schritt Wizard
3. ✅ `FieldEditorModal` - Field Config Editor
4. ✅ `RecipeDetailScreen` - Preview & Edit
5. ✅ `RecipeCard` Component - Visual Design

### Phase 3: RecipeFoldersScreen Refactor (2-3h)
1. ✅ 3-Tab-System implementieren (Alle/Rezepte/Ordner)
2. ✅ Statistik-Cards für Dashboard-Feeling
3. ✅ "Meistgenutzte Rezepte" Section
4. ✅ Recipe List mit Usage-Count Badges
5. ✅ Search & Filter Funktionalität

### Phase 4: Order Integration (2-3h)
1. ✅ Template Selector Modal in CreateOrderScreen
2. ✅ Dynamic Form Rendering basierend auf field_config
3. ✅ Standard-Template "Standard-Auftrag" hardcoded verfügbar
4. ✅ Recipe Usage Tracking beim Order-Create
5. ✅ Recipe Badge in Order Cards ("Erstellt mit: Pizza-Template")

### Phase 5: Advanced Features (3-4h)
1. ✅ Recipe Duplication (schnell neue Variante erstellen)
2. ✅ Recipe Analytics (Welches Template wird am meisten genutzt?)
3. ✅ Bulk Actions (Mehrere Recipes verschieben/löschen)
4. ✅ Template Export/Import (JSON für Backup)
5. ✅ Drag & Drop für Field Sorting

### Phase 6: Polish & UX (2-3h)
1. ✅ Animations & Transitions
2. ✅ Empty States für Recipes
3. ✅ Onboarding Tutorial für Recipe-System
4. ✅ Error Handling & Validation Messages
5. ✅ Accessibility (Screen Reader Labels)

**Gesamtaufwand:** 14-20 Stunden

---

## 🎯 ACCEPTANCE CRITERIA

### Must-Have:
- ✅ Recipes können erstellt, bearbeitet, gelöscht werden
- ✅ Field Config ist anpassbar (Labels, Visibility, Required)
- ✅ Standard-Template ist immer verfügbar
- ✅ Template-Auswahl beim Order-Create funktioniert
- ✅ Orders behalten Referenz zum verwendeten Recipe
- ✅ RecipeFoldersScreen zeigt Statistiken an
- ✅ Usage Count wird korrekt inkrementiert
- ✅ RLS Policies funktionieren korrekt (Multi-Tenant)

### Nice-to-Have:
- ⚠️ Drag & Drop Field Sorting
- ⚠️ Recipe Templates exportieren/importieren
- ⚠️ Recipe Versioning (Änderungen tracken)
- ⚠️ Shared Templates zwischen Companies (Marketplace)
- ⚠️ AI-basierte Template-Vorschläge basierend auf Order-Historie

---

## 🛡️ SICHERHEITS-ÜBERLEGUNGEN

1. **RLS Policies:** Recipes sind company-isolated
2. **Field Config Validation:** Kein XSS via Custom Labels
3. **Permission Checks:** Nur Admins/Co-Admins können Recipes erstellen
4. **Deletion Cascade:** Beim Company Delete werden Recipes mitgelöscht
5. **Audit Trail:** `author_id` + `created_at` für Nachvollziehbarkeit

---

## 📝 TESTING CHECKLIST

### Unit Tests:
- [ ] `recipeService.js` CRUD Operations
- [ ] `validateFieldConfig()` Function
- [ ] `renderDynamicForm()` Component Rendering

### Integration Tests:
- [ ] Recipe Create → Order Create → Recipe Usage Count erhöht sich
- [ ] Recipe Delete → Orders behalten field_values, aber recipe_id = NULL
- [ ] RLS: User kann nur eigene Company Recipes sehen

### E2E Tests:
- [ ] Kompletter Flow: Recipe erstellen → Order mit Recipe erstellen → Statistik prüfen
- [ ] Template-Auswahl Modal → Field Config wirkt sich auf Form aus
- [ ] Folder-Organisation: Recipe in Folder verschieben

---

## 🎨 DESIGN TOKENS FÜR RECIPE SYSTEM

```javascript
// config/designSystem.js - Erweitern

export const RecipeDesignTokens = {
  colors: {
    recipeCard: {
      background: isDark ? '#1E1E1E' : '#FFFFFF',
      border: isDark ? '#333' : '#E0E0E0',
      usageBadge: '#4CAF50',
    },
    templateSelector: {
      selected: primaryColor,
      hover: primaryColor + '20',
    }
  },
  shadows: {
    recipeCard: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }
  },
  animations: {
    recipeCardHover: {
      scale: 1.02,
      duration: 200,
    },
    templateSelect: {
      scale: 0.98,
      duration: 150,
    }
  }
};
```

---

**WICHTIG:** Dieses Feature ist komplex und benötigt sorgfältige Planung. Vor Implementation:
1. **User Testing:** Mockups mit echten Usern testen
2. **Performance:** Field Config mit vielen Custom Fields kann groß werden
3. **Migration:** Bestehende Orders ohne recipe_id müssen kompatibel bleiben
4. **Dokumentation:** User Guide für Recipe-System erstellen

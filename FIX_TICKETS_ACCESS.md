# 🔧 Fix: Super Admins können keine Tickets sehen

## Problem
Im Admin Panel wird "📭 Keine Tickets vorhanden" angezeigt, obwohl Tickets in der Datenbank existieren.

**Root Cause:** Row Level Security (RLS) Policies blockieren den Zugriff für Super Admins.

## Lösung: RLS Policies für Super Admins hinzufügen

### Option 1: SQL Migration anwenden (Empfohlen)

**Via Supabase Dashboard:**

1. Öffne Supabase Dashboard: https://app.supabase.com/project/bgqzxwgsdbptbyimzwtf
2. Navigiere zu: **SQL Editor** (linkes Menü)
3. Klicke auf: **New query**
4. Kopiere folgenden SQL-Code und führe ihn aus:

```sql
-- Super Admin SELECT Policy (alle Tickets sehen)
CREATE POLICY "Super Admins können alle Tickets sehen"
ON support_tickets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
);

-- Super Admin DELETE Policy (Tickets löschen)
CREATE POLICY "Super Admins können Tickets löschen"
ON support_tickets
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
);

-- Super Admin UPDATE Policy (für Status-Updates)
CREATE POLICY "Super Admins können Tickets updaten"
ON support_tickets
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
);
```

5. Klicke auf **Run** (unten rechts)
6. Prüfe, ob "Success. No rows returned" erscheint

### Option 2: Supabase CLI (Falls verfügbar)

```bash
# SQL-Datei ausführen
supabase db push

# ODER: Migration einzeln ausführen
psql "$DATABASE_URL" -f supabase/migrations/fix_support_tickets_rls.sql
```

## Verify Fix

Nach dem Anwenden der Policies:

1. **Gehe zum Admin Panel:** https://deine-app.com/admin
2. **Logge dich als Super Admin ein**
3. **Wechsle zum Tab "💬 Support-Tickets"**
4. **Prüfe:** Tickets sollten jetzt angezeigt werden mit:
   - ✅ Ticket-Nummer (#RCP-XXXXXXXX)
   - ✅ User-Name und Email
   - ✅ Datum
   - ✅ Kategorie-Badge
   - ✅ Nachricht
   - ✅ Antworten-Button
   - ✅ Löschen-Button

## Troubleshooting

### Fall 1: Immer noch keine Tickets sichtbar

**Prüfe RLS Policies in Supabase:**

1. Dashboard → **Database** → **Policies**
2. Suche Tabelle: `support_tickets`
3. Prüfe, ob folgende Policies existieren:
   - ✅ "Super Admins können alle Tickets sehen" (SELECT)
   - ✅ "Super Admins können Tickets löschen" (DELETE)
   - ✅ "Super Admins können Tickets updaten" (UPDATE)

### Fall 2: RLS ist komplett deaktiviert

Falls RLS für `support_tickets` deaktiviert ist:

```sql
-- RLS aktivieren
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Dann die Policies oben anwenden
```

### Fall 3: Browser Console Errors

1. Öffne Browser Console (F12)
2. Wechsle zum Tickets Tab
3. Prüfe auf Fehler:
   - `401 Unauthorized` → RLS blockiert noch
   - `403 Forbidden` → Super Admin Email nicht in super_admins Tabelle
   - `500 Server Error` → Edge Function oder DB Problem

## Zusätzliche Info

**Wie funktioniert die RLS Policy?**

```sql
USING (
  EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.email = auth.jwt() ->> 'email'
  )
)
```

Diese Policy erlaubt Zugriff, wenn:
1. User ist authentifiziert (logged in via Supabase Auth)
2. User's Email existiert in der `super_admins` Tabelle

**Super Admin Email prüfen:**

```sql
-- Prüfe, ob deine Email in super_admins ist
SELECT email FROM super_admins;
```

Wenn deine Email NICHT in der Liste ist:

```sql
-- Füge dich als Super Admin hinzu
INSERT INTO super_admins (email, notes)
VALUES ('deine@email.com', 'Super Admin');
```

## Fertig! 🎉

Nach dem Fix sollten alle Tickets im Admin Panel sichtbar sein.

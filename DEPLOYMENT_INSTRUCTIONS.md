# 🚀 Deployment-Anleitung: Support-Ticket-System

## ✅ Was bereits erledigt ist:

1. ✅ Database Migration wurde ausgeführt (ticket_number Spalte hinzugefügt)
2. ✅ SendGrid API Key wurde in Supabase Secrets gesetzt
3. ✅ Admin Panel UI wurde aktualisiert (Tickets Tab hinzugefügt)
4. ✅ Alle Änderungen wurden committed und gepusht

## 🔄 Noch zu tun: Edge Function deployen

### Option 1: Supabase CLI (Empfohlen)

Falls du die Supabase CLI lokal installiert hast:

```bash
cd /home/user/recipendent-cloudflare
supabase functions deploy reply-to-ticket
```

### Option 2: Supabase Dashboard (Falls CLI nicht verfügbar)

1. **Öffne Supabase Dashboard:**
   - Gehe zu: https://app.supabase.com/project/bgqzxwgsdbptbyimzwtf
   - Navigiere zu: **Edge Functions** (linkes Menü)

2. **Neue Function erstellen:**
   - Klicke auf **"Create a new function"**
   - Name: `reply-to-ticket`
   - Klicke auf **"Create function"**

3. **Code hochladen:**
   - Kopiere den gesamten Code aus: `/home/user/recipendent-cloudflare/supabase/functions/reply-to-ticket/index.ts`
   - Füge ihn in den Editor im Dashboard ein
   - Klicke auf **"Deploy"**

4. **Verify Deployment:**
   - Die Function sollte nun unter "Edge Functions" mit Status "Active" erscheinen

### Option 3: GitHub Actions (Automatisch)

Falls du GitHub Actions eingerichtet hast:

1. **Workflow-Datei erstellen:** `.github/workflows/deploy-functions.yml`

```yaml
name: Deploy Supabase Functions

on:
  push:
    branches:
      - main
    paths:
      - 'supabase/functions/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy Edge Functions
        run: supabase functions deploy reply-to-ticket
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: bgqzxwgsdbptbyimzwtf
```

2. **Secrets in GitHub setzen:**
   - Gehe zu GitHub Repo Settings → Secrets and variables → Actions
   - Füge Secret hinzu: `SUPABASE_ACCESS_TOKEN`
   - Wert: Dein Supabase Access Token (https://app.supabase.com/account/tokens)

## 🧪 Testing

Nach dem Deployment:

### 1. Test Ticket Creation (Web App)

1. Gehe zu: https://deine-app.com/settings
2. Wechsle zum Tab "Support"
3. Erstelle ein Test-Ticket
4. Prüfe in Supabase, ob Ticket erstellt wurde mit `ticket_number`

### 2. Test Admin Panel

1. Gehe zu: https://deine-app.com/admin
2. Logge dich als Super Admin ein
3. Wechsle zum Tab "💬 Support-Tickets"
4. Prüfe, ob das Test-Ticket angezeigt wird

### 3. Test Email Reply

1. Klicke auf "📨 Antworten" bei einem Ticket
2. Schreibe eine Test-Antwort
3. Klicke auf "📧 Email senden"
4. Prüfe:
   - Email wurde an die Ticket-Email gesendet
   - Betreff enthält Ticket-Nummer: `#RCP-XXXXXXXX`
   - Email hat modernes Recipendent-Design
   - Ticket-Status wurde auf "resolved" aktualisiert

### 4. Test Delete Function

1. Klicke auf "🗑️ Löschen" bei einem Test-Ticket
2. Bestätige Löschung
3. Prüfe, ob Ticket aus der Liste verschwindet

## 📝 Wichtige Hinweise

### SendGrid Configuration

Stelle sicher, dass:

- ✅ SendGrid API Key korrekt gesetzt ist: `SENDGRID_API_KEY`
- ✅ Sender Email verifiziert ist: `recipendent@gmail.com`
- ✅ SendGrid Account ist aktiviert und hat Email-Kontingent

### Edge Function URL

Die Edge Function ist erreichbar unter:
```
https://bgqzxwgsdbptbyimzwtf.supabase.co/functions/v1/reply-to-ticket
```

### Debugging

Falls Fehler auftreten:

1. **Supabase Logs prüfen:**
   - Dashboard → Edge Functions → reply-to-ticket → Logs

2. **Console Logs prüfen:**
   - Browser Console (F12) → Network Tab
   - Prüfe Response der Edge Function

3. **SendGrid Logs prüfen:**
   - https://app.sendgrid.com/email_activity
   - Prüfe, ob Emails versendet wurden

## 🎉 Fertig!

Nach dem Deployment der Edge Function ist das Support-Ticket-System vollständig einsatzbereit:

- ✅ Users können Tickets in der Web App erstellen
- ✅ Tickets bekommen automatisch eine eindeutige Nummer
- ✅ Super Admins sehen alle Tickets im Admin Panel
- ✅ Admins können per Email antworten (via SendGrid)
- ✅ Admins können Tickets löschen
- ✅ Email-Template im modernen Recipendent-Design

## 📚 Dokumentation

Weitere Details findest du in:
- `ADMIN_TICKETS_INTEGRATION.md` - Vollständige Integration-Dokumentation
- `supabase/migrations/add_ticket_number.sql` - Database Migration
- `supabase/functions/reply-to-ticket/index.ts` - Edge Function Code

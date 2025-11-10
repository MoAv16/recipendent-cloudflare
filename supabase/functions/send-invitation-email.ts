// ============================================================================
// RECIPENDENT APP - SUPABASE EDGE FUNCTION: SEND INVITATION EMAIL
// ============================================================================
// Sendet automatisch eine Email mit Einladungscode an neue Mitarbeiter
// Deploy: supabase functions deploy send-invitation-email
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders })
    }

    // Parse Request Body
    const { email, code, role, companyName } = await req.json()

    // Validation
    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email und Code sind erforderlich' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Email-Template
    const roleLabel = role === 'co-admin' ? 'Co-Administrator' : 'Mitarbeiter'
    const subject = `Einladung zu Recipendent${companyName ? ` - ${companyName}` : ''}`

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6326ad 0%, #9c5fb5 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Recipendent</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Auftrags- und Rezeptverwaltung</p>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #6326ad; margin-top: 0;">Willkommen bei Recipendent!</h2>

          <p>Du wurdest eingeladen, als <strong>${roleLabel}</strong> beizutreten${companyName ? ` zu ${companyName}` : ''}.</p>

          <div style="background: white; border: 2px solid #6326ad; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Dein Einladungscode:</p>
            <div style="font-size: 32px; font-weight: bold; color: #6326ad; letter-spacing: 3px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>

          <h3 style="color: #333;">So funktioniert's:</h3>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">Lade die <strong>Recipendent App</strong> herunter</li>
            <li style="margin-bottom: 10px;">Tippe auf <strong>"Registrieren"</strong></li>
            <li style="margin-bottom: 10px;">Gib deinen <strong>Einladungscode</strong> ein</li>
            <li style="margin-bottom: 10px;">Erstelle dein Konto und leg los!</li>
          </ol>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Wichtig:</strong> Der Code ist 7 Tage gültig und kann nur einmal verwendet werden.
            </p>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Hast du Fragen? Wende dich an deinen Administrator oder besuche unsere Hilfeseite.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Recipendent. Alle Rechte vorbehalten.</p>
          <p>Diese Email wurde automatisch generiert. Bitte nicht antworten.</p>
        </div>
      </body>
      </html>
    `

    // Plain Text Version (Fallback)
    const textContent = `
Willkommen bei Recipendent!

Du wurdest eingeladen, als ${roleLabel} beizutreten${companyName ? ` zu ${companyName}` : ''}.

DEIN EINLADUNGSCODE: ${code}

So funktioniert's:
1. Lade die Recipendent App herunter
2. Tippe auf "Registrieren"
3. Gib deinen Einladungscode ein
4. Erstelle dein Konto und leg los!

⚠️ Wichtig: Der Code ist 7 Tage gültig und kann nur einmal verwendet werden.

Bei Fragen wende dich an deinen Administrator.

© ${new Date().getFullYear()} Recipendent
    `

    // ============================================================================
    // EMAIL VERSAND MIT RESEND
    // ============================================================================
    // Dokumentation: https://resend.com/docs/send-with-nodejs
    // ============================================================================

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Recipendent <noreply@recipendent.app>', // ⚠️ Deine verifizierte Domain
        to: [email],
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    })

    const emailData = await emailResponse.json()

    if (!emailResponse.ok) {
      console.error('Resend API Error:', emailData)
      throw new Error(`Email konnte nicht gesendet werden: ${emailData.message || 'Unbekannter Fehler'}`)
    }

    // Log Success
    console.log(`✅ Email gesendet an ${email} mit Code ${code}`)

    // Return Success
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email erfolgreich gesendet',
        emailId: emailData.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Edge Function Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

// ============================================================================
// SETUP ANLEITUNG
// ============================================================================
/*
1. RESEND ACCOUNT ERSTELLEN:
   - Gehe zu https://resend.com
   - Erstelle einen Account
   - Verifiziere deine Domain (z.B. recipendent.app)
   - Generiere einen API Key

2. SUPABASE EDGE FUNCTION DEPLOYEN:

   # Installiere Supabase CLI
   npm install -g supabase

   # Login
   supabase login

   # Link dein Projekt
   supabase link --project-ref [DEIN-PROJECT-REF]

   # Setze Secret für Resend API Key
   supabase secrets set RESEND_API_KEY=[DEIN-RESEND-API-KEY]

   # Deploy die Function
   supabase functions deploy send-invitation-email

3. FUNKTION TESTEN:

   # Im Browser oder via curl:
   curl -X POST https://[DEIN-SUPABASE-URL]/functions/v1/send-invitation-email \
     -H "Authorization: Bearer [ANON-KEY]" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "code": "ABC123XYZ",
       "role": "employee",
       "companyName": "Test Company"
     }'

4. INTEGRATION IN APP:

   In TeamManagementScreen.js aktiviere die auskommentierten Zeilen:

   await supabase.functions.invoke('send-invitation-email', {
     body: {
       email: invitationEmail.trim(),
       code: result.data.code,
       role: invitationRole,
     },
   });

FERTIG! 🎉
*/
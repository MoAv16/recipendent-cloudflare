// ============================================================================
// RECIPENDENT APP - SUPABASE EDGE FUNCTION: SEND ADMIN INVITATION
// ============================================================================
// Generiert Admin-Keys und versendet Emails an neue Kunden
// SICHER: Service Role Key bleibt server-seitig
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Supabase Admin Client (mit Service Role)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Parse Request Body
    const { email } = await req.json();

    // Validation
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email ist erforderlich' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Email-Format Validation
    if (!email.includes('@') || !email.includes('.')) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Email-Adresse' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================================================
    // 1. GENERIERE ADMIN-KEY (8-stellig, alphanumerisch)
    // ============================================================================
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code = generateCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Stelle sicher, dass der Code unique ist
    while (attempts < maxAttempts) {
      const { data: existing } = await supabaseAdmin
        .from('invitation_codes')
        .select('code')
        .eq('code', code)
        .single();

      if (!existing) break; // Code ist unique
      code = generateCode(); // Generiere neuen Code
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Konnte keinen unique Code generieren');
    }

    console.log(`✅ Generated unique code: ${code}`);

    // ============================================================================
    // 2. SPEICHERE ADMIN-KEY IN DATENBANK
    // ============================================================================
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 Tage gültig

    const { data: invitationData, error: dbError } = await supabaseAdmin
      .from('invitation_codes')
      .insert({
        code: code,
        email: email,
        role: 'admin',
        key_type: 'admin',
        expires_at: expiresAt.toISOString(),
        used: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Fehler beim Speichern: ${dbError.message}`);
    }

    console.log(`✅ Admin key saved to database`);

    // ============================================================================
    // 3. EMAIL-TEMPLATE FÜR ADMIN-EINLADUNG
    // ============================================================================
    const subject = 'Willkommen bei Recipendent - Ihr Admin-Zugang';

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

          <p>Vielen Dank für Ihr Interesse an Recipendent! Sie haben Zugang zu unserem professionellen Auftrags- und Rezeptverwaltungssystem erhalten.</p>

          <div style="background: white; border: 2px solid #6326ad; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Ihr Admin-Registrierungscode:</p>
            <div style="font-size: 32px; font-weight: bold; color: #6326ad; letter-spacing: 3px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>

          <h3 style="color: #333;">So registrieren Sie sich:</h3>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 10px;">Laden Sie die <strong>Recipendent App</strong> aus dem App Store herunter</li>
            <li style="margin-bottom: 10px;">Tippen Sie auf <strong>"Registrieren"</strong></li>
            <li style="margin-bottom: 10px;">Geben Sie Ihren <strong>Admin-Code</strong> ein</li>
            <li style="margin-bottom: 10px;">Erstellen Sie Ihr <strong>Unternehmensprofil</strong>:
              <ul style="margin-top: 10px; color: #666;">
                <li>Laden Sie Ihr Firmenlogo hoch</li>
                <li>Geben Sie Ihren Unternehmensnamen ein</li>
                <li>Erstellen Sie Ihr Admin-Konto</li>
              </ul>
            </li>
            <li style="margin-bottom: 10px;">Fügen Sie Ihr <strong>Team</strong> hinzu und legen Sie los!</li>
          </ol>

          <div style="background: #d1ecf1; border-left: 4px solid #17a2b8; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0c5460;">
              <strong>💡 Tipp:</strong> Als Admin haben Sie volle Kontrolle über Ihr Unternehmen. Sie können Co-Admins und Mitarbeiter hinzufügen, Berechtigungen verwalten und Ihr Firmenlogo individualisieren.
            </p>
          </div>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Wichtig:</strong> Dieser Code ist 7 Tage gültig und kann nur einmal verwendet werden. Bewahren Sie ihn sicher auf!
            </p>
          </div>

          <h3 style="color: #333; margin-top: 30px;">Funktionen im Überblick:</h3>
          <ul style="padding-left: 20px; color: #666;">
            <li style="margin-bottom: 8px;">📋 Auftragsverwaltung mit Prioritäten und Status-Tracking</li>
            <li style="margin-bottom: 8px;">👨‍🍳 Rezeptverwaltung mit Ordnern und Bildern</li>
            <li style="margin-bottom: 8px;">👥 Team-Management mit verschiedenen Rollen</li>
            <li style="margin-bottom: 8px;">🔔 Echtzeit-Synchronisation für Ihr gesamtes Team</li>
            <li style="margin-bottom: 8px;">🎨 Individuelles Branding mit Ihrem Logo</li>
          </ul>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Haben Sie Fragen? Kontaktieren Sie uns unter <strong>support@recipendent.com</strong> oder besuchen Sie unsere Hilfeseite.
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Recipendent. Alle Rechte vorbehalten.</p>
          <p>Diese Email wurde automatisch generiert. Bitte nicht antworten.</p>
        </div>
      </body>
      </html>
    `;

    // Plain Text Version (Fallback)
    const textContent = `
Willkommen bei Recipendent!

Vielen Dank für Ihr Interesse an Recipendent! Sie haben Zugang zu unserem professionellen Auftrags- und Rezeptverwaltungssystem erhalten.

IHR ADMIN-REGISTRIERUNGSCODE: ${code}

So registrieren Sie sich:
1. Laden Sie die Recipendent App aus dem App Store herunter
2. Tippen Sie auf "Registrieren"
3. Geben Sie Ihren Admin-Code ein
4. Erstellen Sie Ihr Unternehmensprofil (Logo hochladen, Name eingeben, Admin-Konto erstellen)
5. Fügen Sie Ihr Team hinzu und legen Sie los!

💡 Tipp: Als Admin haben Sie volle Kontrolle über Ihr Unternehmen.

⚠️ Wichtig: Dieser Code ist 7 Tage gültig und kann nur einmal verwendet werden.

Funktionen:
- Auftragsverwaltung mit Prioritäten
- Rezeptverwaltung mit Ordnern
- Team-Management mit Rollen
- Echtzeit-Synchronisation
- Individuelles Branding

Fragen? support@recipendent.com

© ${new Date().getFullYear()} Recipendent
    `;

    // ============================================================================
    // 4. EMAIL VERSAND MIT SENDGRID
    // ============================================================================
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email }],
            subject: subject,
          },
        ],
        from: {
          email: 'recipendent@gmail.com',
          name: 'Recipendent',
        },
        content: [
          {
            type: 'text/plain',
            value: textContent,
          },
          {
            type: 'text/html',
            value: htmlContent,
          },
        ],
      }),
    });

    if (emailResponse.status !== 202) {
      const errorText = await emailResponse.text();
      console.error('SendGrid API Error:', errorText);
      throw new Error(`Email konnte nicht gesendet werden: ${errorText}`);
    }

    console.log(`✅ Email sent to ${email} with Admin code ${code}`);

    // ============================================================================
    // 5. ERFOLGSANTWORT
    // ============================================================================
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin-Key erfolgreich generiert und Email versendet',
        code: code,
        expiresAt: expiresAt.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Edge Function Error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unbekannter Fehler',
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
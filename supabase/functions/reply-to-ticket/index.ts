// ============================================================================
// SUPABASE EDGE FUNCTION: Reply to Support Ticket
// ============================================================================
// Sends email reply to user via SendGrid with modern Recipendent design

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Parse request body
    const { ticketId, replyMessage } = await req.json();

    if (!ticketId || !replyMessage) {
      return new Response(
        JSON.stringify({ success: false, error: 'ticketId and replyMessage are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ticket not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate email HTML with modern Recipendent design
    const emailHtml = generateEmailTemplate({
      userName: ticket.user_name,
      ticketNumber: ticket.ticket_number,
      originalMessage: ticket.message,
      replyMessage: replyMessage,
      category: ticket.category,
    });

    // Send email via SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: ticket.user_email, name: ticket.user_name }],
            subject: `#${ticket.ticket_number} - Antwort auf deine Support-Anfrage`,
          },
        ],
        from: {
          email: 'recipendent@gmail.com',
          name: 'Recipendent Support',
        },
        reply_to: {
          email: 'recipendent@gmail.com',
          name: 'Recipendent Support',
        },
        content: [
          {
            type: 'text/html',
            value: emailHtml,
          },
        ],
      }),
    });

    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid error:', errorText);
      throw new Error('Failed to send email via SendGrid');
    }

    // Update ticket status to 'resolved'
    await supabase
      .from('support_tickets')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

// ============================================================================
// EMAIL TEMPLATE GENERATOR - Modern Recipendent Design
// ============================================================================
function generateEmailTemplate({ userName, ticketNumber, originalMessage, replyMessage, category }) {
  const categoryLabels = {
    general_questions: 'Allgemeine Fragen',
    app_problems: 'Probleme mit der App',
    feature_request: 'Feature-Anfrage',
    bug_report: 'Bug-Report',
    other: 'Sonstiges',
  };

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recipendent Support - Ticket #${ticketNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #1dd1a1 0%, #5cf2d6 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">Recipendent</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Support Team</p>
            </td>
          </tr>

          <!-- Ticket Number Badge -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <div style="display: inline-block; background-color: rgba(29, 209, 161, 0.1); color: #1dd1a1; padding: 8px 16px; border-radius: 100px; font-size: 13px; font-weight: 600; letter-spacing: 0.05em;">
                TICKET #${ticketNumber}
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 0 40px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">Hallo ${userName},</h2>
              <p style="margin: 0 0 24px 0; color: #6b7280; font-size: 16px;">wir haben deine Support-Anfrage bearbeitet und möchten dir folgende Antwort zukommen lassen:</p>
            </td>
          </tr>

          <!-- Reply Message -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="background-color: #f0fdf9; border-left: 4px solid #1dd1a1; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; color: #1a1a1a; font-size: 15px; white-space: pre-wrap;">${replyMessage}</p>
              </div>
            </td>
          </tr>

          <!-- Original Message Reference -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
                <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Deine ursprüngliche Nachricht:</p>
                <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; white-space: pre-wrap;">${originalMessage}</p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                  <strong>Kategorie:</strong> ${categoryLabels[category] || category}
                </p>
              </div>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 15px;">Hast du noch weitere Fragen? Antworte einfach auf diese E-Mail – wir helfen dir gerne weiter!</p>
              <a href="mailto:recipendent@gmail.com?subject=Re: #${ticketNumber}" style="display: inline-block; background: linear-gradient(135deg, #1dd1a1 0%, #5cf2d6 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(29, 209, 161, 0.3);">
                Auf E-Mail antworten
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 13px;">
                <strong>Recipendent</strong> - Order & Team Management
              </p>
              <p style="margin: 0 0 16px 0; color: #9ca3af; font-size: 13px;">
                recipendent@gmail.com
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2025 Recipendent. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

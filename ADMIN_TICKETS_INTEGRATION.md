# Admin Panel - Support Tickets Integration

## ✅ Completed

1. **Database Migration** - `supabase/migrations/add_ticket_number.sql`
   - Added `ticket_number` column with format `RCP-XXXXXXXX`
   - Auto-generation trigger for new tickets
   - Backfilled existing tickets
   - Index for faster lookups

2. **SendGrid Edge Function** - `supabase/functions/reply-to-ticket/index.ts`
   - Sends email replies via SendGrid
   - Modern Recipendent design email template
   - Subject: `#RCP-XXXXXXXX - Antwort auf deine Support-Anfrage`
   - Auto-updates ticket status to 'resolved'
   - Full error handling

3. **Email Template Design**
   - Gradient header matching landing page
   - Ticket number badge
   - Reply message highlighted
   - Original message reference
   - Footer with branding
   - Mobile-responsive HTML email

## ⏳ TODO: Admin Panel UI Integration

The admin panel (`/static/admin/index.html`) needs to be extended with a tickets tab.

### Required Changes:

#### 1. Add Tab System (after login)
```html
<!-- Replace single-page admin section with tabs -->
<div class="tabs">
  <button class="tab active" onclick="switchTab('invitations')">📧 Admin-Einladungen</button>
  <button class="tab" onclick="switchTab('tickets')">💬 Support-Tickets</button>
</div>

<div class="tab-content active" id="invitationsTab">
  <!-- Existing admin invitation content -->
</div>

<div class="tab-content" id="ticketsTab">
  <h2>💬 Support-Tickets</h2>
  <div id="ticketsContainer"></div>
</div>
```

#### 2. Add CSS Styles (in `<style>` section)
```css
/* Tabs */
.tabs { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 2px solid #e0e0e0; }
.tab { padding: 1rem 2rem; background: none; border: none; border-bottom: 3px solid transparent; font-size: 1rem; font-weight: 600; color: #666; cursor: pointer; transition: all 0.3s; border-radius: 0; }
.tab:hover { color: #5cf2d6; transform: none; box-shadow: none; }
.tab.active { color: #5cf2d6; border-bottom-color: #5cf2d6; }
.tab-content { display: none; }
.tab-content.active { display: block; }

/* Ticket Cards */
.tickets-grid { display: grid; gap: 1rem; margin-top: 1.5rem; }
.ticket-card { background: #f9f9f9; border: 2px solid #e0e0e0; border-radius: 12px; padding: 1.5rem; transition: all 0.3s; }
.ticket-card:hover { border-color: #5cf2d6; box-shadow: 0 4px 12px rgba(92, 242, 214, 0.2); }
.ticket-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; }
.ticket-number { font-size: 1.5rem; font-weight: bold; color: #5cf2d6; font-family: 'Courier New', monospace; }
.ticket-status { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
.ticket-status.open { background: #fef3c7; color: #92400e; }
.ticket-status.resolved { background: #d1fae5; color: #065f46; }
.ticket-message { background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #5cf2d6; white-space: pre-wrap; }
.reply-form { display: none; margin-top: 1rem; padding-top: 1rem; border-top: 2px dashed #e0e0e0; }
.reply-form.show { display: block; }
textarea { resize: vertical; min-height: 120px; font-family: inherit; }
.container { max-width: 1200px; }
```

#### 3. Add JavaScript Functions (in `<script type="module">`)
```javascript
const CATEGORY_LABELS = {
  general_questions: 'Allgemeine Fragen',
  app_problems: 'Probleme mit der App',
  feature_request: 'Feature-Anfrage',
  bug_report: 'Bug-Report',
  other: 'Sonstiges',
};

window.switchTab = function(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(tabName + 'Tab').classList.add('active');
  if (tabName === 'tickets') loadTickets();
};

window.loadTickets = async function() {
  const container = document.getElementById('ticketsContainer');
  container.innerHTML = '<div class="loading">Lade Tickets...</div>';

  try {
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!tickets || tickets.length === 0) {
      container.innerHTML = '<div class="empty-state">📭 Keine Tickets vorhanden</div>';
      return;
    }

    let html = '<div class="tickets-grid">';
    tickets.forEach(ticket => {
      const statusClass = ticket.status === 'open' ? 'open' : 'resolved';
      const date = new Date(ticket.created_at).toLocaleString('de-DE');
      html += `
        <div class="ticket-card">
          <div class="ticket-header">
            <div class="ticket-number">#${ticket.ticket_number || 'N/A'}</div>
            <div class="ticket-status ${statusClass}">${ticket.status}</div>
          </div>
          <div><strong>Von:</strong> ${ticket.user_name} (${ticket.user_email})</div>
          <div><strong>Datum:</strong> ${date}</div>
          <div style="margin: 0.5rem 0;"><span class="category-badge">${CATEGORY_LABELS[ticket.category]}</span></div>
          <div class="ticket-message">${ticket.message}</div>
          <div class="ticket-actions">
            <button class="btn-reply" onclick="toggleReplyForm('${ticket.id}')">📨 Antworten</button>
            <button class="btn-delete" onclick="deleteTicket('${ticket.id}')">🗑️ Löschen</button>
          </div>
          <div class="reply-form" id="reply-${ticket.id}">
            <label>Antwort-Nachricht:</label>
            <textarea id="reply-message-${ticket.id}" placeholder="Deine Antwort..."></textarea>
            <button onclick="sendReply('${ticket.id}')" style="margin-top: 1rem;">📧 Email senden</button>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading tickets:', error);
    container.innerHTML = '<div class="empty-state">❌ Fehler beim Laden</div>';
  }
};

window.toggleReplyForm = function(ticketId) {
  document.getElementById(`reply-${ticketId}`).classList.toggle('show');
};

window.sendReply = async function(ticketId) {
  const message = document.getElementById(`reply-message-${ticketId}`).value.trim();
  if (!message || !confirm('Email-Antwort senden?')) return;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/reply-to-ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ ticketId, replyMessage: message })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error);
    alert('✅ Email gesendet!');
    loadTickets();
  } catch (error) {
    alert('❌ Fehler: ' + error.message);
  }
};

window.deleteTicket = async function(ticketId) {
  if (!confirm('Ticket wirklich löschen?')) return;
  try {
    const { error } = await supabase.from('support_tickets').delete().eq('id', ticketId);
    if (error) throw error;
    alert('✅ Ticket gelöscht');
    loadTickets();
  } catch (error) {
    alert('❌ Fehler: ' + error.message);
  }
};
```

## 🔧 Setup Instructions

### 1. Run Database Migration
```bash
# Apply the migration to add ticket_number column
cd supabase
supabase db push
```

### 2. Deploy Edge Function
```bash
# Set SendGrid API Key as secret
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here

# Deploy the function
supabase functions deploy reply-to-ticket
```

### 3. Update Admin Panel
- Edit `/static/admin/index.html`
- Add the HTML, CSS, and JavaScript changes listed above
- Test by logging in and switching to the Tickets tab

## 📧 SendGrid Setup

1. Create SendGrid account
2. Verify sender identity for `recipendent@gmail.com`
3. Generate API key with "Mail Send" permissions
4. Add API key to Supabase secrets (see step 2 above)

## ✅ Testing

1. Create a test ticket from web app (Settings → Support)
2. Login to admin panel
3. Switch to "Support-Tickets" tab
4. Click "Antworten" on a ticket
5. Write reply message
6. Click "Email senden"
7. Check user's email inbox for reply

## 🎨 Email Template Features

- Gradient header (#1dd1a1 → #5cf2d6)
- Ticket number badge (#RCP-XXXXXXXX)
- Reply message in highlighted box
- Original message reference
- CTA button to reply
- Footer with branding
- Fully responsive design

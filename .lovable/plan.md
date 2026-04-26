## Why incoming messages aren't showing

Right now the database `whatsapp_messages` table has only outgoing rows — zero `direction='in'`. The reason: your n8n flow is connected directly to Meta's WhatsApp Business webhook and sends bot replies through its own WhatsApp node, so:

- Customer messages go to **n8n**, not to our `whatsapp-webhook` function → never inserted in the DB.
- Bot replies are sent by **n8n via Meta**, not via our `whatsapp-send` function → never inserted in the DB.

The CRM frontend is fine — `fetchMessages` already loads the entire thread, realtime is enabled, and 15s polling is in place. There's just nothing to render because nothing is being written.

## The fix

Create a single public endpoint that n8n calls for **every** message — both directions. n8n posts to it from two places in your workflow:

1. Right after the **WhatsApp Trigger** (customer's incoming message) → `direction: "in"`
2. Right after the **WhatsApp Send Message** node (bot's outgoing reply) → `direction: "out"`

The endpoint inserts the row, auto-links it to the matching appointment/contact (same logic the existing webhook uses), and Supabase Realtime instantly pushes it to the open CRM chat. No frontend changes needed.

## What gets built

### New edge function: `n8n-whatsapp-ingest`
- **Public** (no JWT) — protected by a shared secret header `x-ingest-secret` so only your n8n can post to it.
- **POST** body:
  ```json
  {
    "phone": "919640456448",
    "direction": "in",          // or "out"
    "body": "Hello, how can I help?",
    "wa_message_id": "wamid.xxx",   // optional, for dedup
    "status": "received"            // optional; defaults: in→received, out→sent
  }
  ```
- Dedups on `wa_message_id` if provided.
- Auto-links to the latest matching appointment or contact by last-10-digit phone match.
- Inserts into `whatsapp_messages` using the service role.
- Returns `{ ok: true, id }`.

### New secret
- `N8N_INGEST_SECRET` — random string you set once. n8n sends it as the `x-ingest-secret` header on every call.

### Frontend
- No changes required. The existing `WhatsAppThread` realtime subscription will pick up new rows the moment they're inserted and merge them into the open chat.

## What you do in n8n (one-time, ~2 minutes)

In your existing workflow, add an **HTTP Request** node after each of these two nodes:

1. **After the WhatsApp Trigger** (customer message in):
   - URL: `https://wdkhsnbzdlfvbtuukjfj.supabase.co/functions/v1/n8n-whatsapp-ingest`
   - Method: POST
   - Header `x-ingest-secret`: *(the secret you set)*
   - Body (JSON):
     ```json
     {
       "phone": "{{ $json.from }}",
       "direction": "in",
       "body": "{{ $json.text || $json.message }}",
       "wa_message_id": "{{ $json.id }}"
     }
     ```

2. **After the WhatsApp Send Message** node (bot reply out):
   - Same URL, same secret header
   - Body:
     ```json
     {
       "phone": "{{ $json.to }}",
       "direction": "out",
       "body": "{{ $json.text }}",
       "wa_message_id": "{{ $json.messages[0].id }}"
     }
     ```

(Exact field names depend on your nodes — I'll provide screenshots of the right expressions once the endpoint is live.)

## Files

- **Create** `supabase/functions/n8n-whatsapp-ingest/index.ts`
- **Add secret** `N8N_INGEST_SECRET` (you'll set the value)
- No frontend or DB schema changes.

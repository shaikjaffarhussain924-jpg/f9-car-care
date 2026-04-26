## Good news: nothing to code

Your `whatsapp-webhook` function already handles inbound messages (the "messages" field you just enabled). Database realtime is already on for `whatsapp_messages`, and the CRM thread already subscribes to it. So the moment Meta starts POSTing customer messages, they will appear live in the chat.

**The only thing left is making sure Meta is actually sending to your webhook.** Right now your edge function logs are completely empty — Meta has never hit it. That means the webhook URL in Meta is either wrong, not verified, or pointing at n8n instead of Lovable.

## What I will do

### 1. Add a tiny diagnostic log at the top of `whatsapp-webhook`
So the next time you (or Meta) hits the URL, we see the exact method, headers, and body in logs — making it obvious whether Meta is delivering or not.

### 2. Make incoming messages pop visually in the CRM
Small UX touches so a new customer message is impossible to miss:
- Soft chime + browser tab title flash ("(1) New message…") when an `in` message arrives while the thread is open
- Unread count badge on the lead row in the appointments/contacts list (uses the same realtime channel)

### 3. Give you exact Meta dashboard settings to paste
After deploy I'll print:
- **Callback URL:** `https://wdkhsnbzdlfvbtuukjfj.supabase.co/functions/v1/whatsapp-webhook`
- **Verify token:** the value of your `META_WA_VERIFY_TOKEN` secret (already set)
- **Subscribed fields:** `messages` ✅ (you just did this)

You go to **Meta → WhatsApp → Configuration → Webhook**, paste those, click **Verify and Save**, then click **Subscribe** on the `messages` field for your phone number. I'll then check the logs to confirm Meta hit us.

### 4. Test end-to-end
Once you've saved the webhook in Meta, send a WhatsApp message from your personal phone to your business number. I'll watch the edge function logs and the database to confirm the message appears, then you'll see it live in the CRM thread.

## Files

- **Edit** `supabase/functions/whatsapp-webhook/index.ts` — add request logging at the top
- **Edit** `src/components/admin/WhatsAppThread.tsx` — chime + tab flash on incoming
- **Edit** `src/pages/admin/AdminAppointments.tsx` and `AdminContacts.tsx` — unread badge per lead

## Important — what about n8n?

If your n8n workflow is **also** subscribed to the same WhatsApp number's webhook in Meta, Meta will only deliver to **one** URL — whichever you save last. You have two choices:

1. **Point Meta at n8n** (your bot keeps working) → use the `n8n-whatsapp-ingest` endpoint we built earlier so n8n forwards a copy to the CRM. (Needs the `N8N_INGEST_SECRET` you haven't set yet.)
2. **Point Meta at Lovable** → bot stops unless you also forward from this webhook to n8n.

I'll ask you which one you want right after you approve this plan, before changing anything in Meta.

# WhatsApp CRM — Speed & Visibility Fixes

Three issues to fix in `src/components/admin/WhatsAppThread.tsx`. No DB or edge function changes needed (realtime is already enabled on `whatsapp_messages` with `REPLICA IDENTITY FULL`).

## 1. Can't see what you're typing

**Cause:** The composer `Textarea` sits on a dark `bg-[#2a3942]` (dark theme) / white `bg-white` (light), but inherits muted/dark text colors from the base `Textarea` component, so typed text is invisible against its own background.

**Fix:** Add explicit text + placeholder colors so it works in both themes:
- `text-[#111b21] dark:text-[#e9edef]`
- `placeholder:text-[#8696a0]`
- `caret-[#008069]` so the cursor is also visible

## 2. Sending feels slow

**Cause:** `send()` awaits the full Edge Function round-trip (auth check → Meta Graph API → DB insert) before clearing the input or showing the message. On a slow Meta response that's 1–3+ seconds of frozen UI.

**Fix — optimistic UI:**
- On send click: immediately clear input, append a temp message bubble with `status: "sending"` and a temporary `id` (`temp-<uuid>`).
- Fire `supabase.functions.invoke("whatsapp-send", ...)` in the background.
- When realtime delivers the real row (or the function response returns), reconcile: drop the temp message (the realtime fetch will replace it with the persisted row showing `sent` / `failed`).
- On error response, mark the temp bubble as `failed` with the error text and keep it visible so the user knows.
- Keep send button disabled only while *that specific* request is in-flight; allow queueing additional messages by not blocking subsequent sends after the optimistic append.

## 3. n8n inbound messages should update instantly

**Already wired:** `whatsapp_messages` is in the `supabase_realtime` publication and has `REPLICA IDENTITY FULL`. The component already subscribes to `postgres_changes` for `*` events on the table.

**Improvements to make it reliable with n8n:**
- Replace the current "any change → refetch all" handler with a direct merge: when a new row arrives, append it to local state if not present (dedup by `id` or `wa_message_id`), instead of issuing a new `SELECT` (faster, no flicker).
- Match incoming rows against `phoneVariants` so n8n can store the phone in any of the common formats (10-digit, 91-prefixed, full E.164) and they still show up.
- Keep the `INSERT`/`UPDATE` distinction so status changes (sent → delivered → read) update the existing bubble in place.
- Add a lightweight 15s polling fallback as a safety net in case the realtime socket drops (common on idle tabs / mobile).

## Files changed
- `src/components/admin/WhatsAppThread.tsx` — composer text colors, optimistic send, smarter realtime merge + polling fallback.

No edge function, DB, or n8n configuration changes are required. n8n just needs to keep inserting into `public.whatsapp_messages` with `direction='in'` and the recipient `phone` (any common format).

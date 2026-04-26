import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// PUBLIC webhook — no auth header required
const VERIFY_TOKEN = Deno.env.get("META_WA_VERIFY_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Try to find the most recent appointment/contact for this phone
async function autoLink(phone: string): Promise<{
  lead_id: string | null;
  lead_type: "appointment" | "contact" | null;
}> {
  // Match by 10-digit suffix to handle 91-prefixed and bare numbers
  const last10 = phone.replace(/\D/g, "").slice(-10);
  if (!last10) return { lead_id: null, lead_type: null };

  const { data: appt } = await admin
    .from("appointments")
    .select("id, created_at")
    .ilike("phone", `%${last10}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (appt?.id) return { lead_id: appt.id, lead_type: "appointment" };

  const { data: contact } = await admin
    .from("contact_submissions")
    .select("id, created_at")
    .ilike("phone", `%${last10}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (contact?.id) return { lead_id: contact.id, lead_type: "contact" };

  return { lead_id: null, lead_type: null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  console.log(`[wa-webhook] ${req.method} ${url.pathname}${url.search} ua=${req.headers.get("user-agent") ?? "?"}`);

  // ----- VERIFY HANDSHAKE -----
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    if (mode === "subscribe" && token && token === VERIFY_TOKEN) {
      return new Response(challenge ?? "", { status: 200, headers: cors });
    }
    return new Response("forbidden", { status: 403, headers: cors });
  }

  // ----- INBOUND EVENTS -----
  if (req.method === "POST") {
    try {
      const payload = await req.json();
      const entries = payload?.entry ?? [];
      for (const entry of entries) {
        const changes = entry?.changes ?? [];
        for (const change of changes) {
          const value = change?.value ?? {};
          const messages = value?.messages ?? [];
          const statuses = value?.statuses ?? [];

          // Inbound messages
          for (const msg of messages) {
            try {
              const waId: string | undefined = msg.id;
              const phone: string = msg.from ?? "";
              const text: string =
                msg?.text?.body ??
                msg?.button?.text ??
                msg?.interactive?.button_reply?.title ??
                msg?.interactive?.list_reply?.title ??
                `[${msg.type ?? "message"}]`;

              if (waId) {
                const { data: exists } = await admin
                  .from("whatsapp_messages")
                  .select("id")
                  .eq("wa_message_id", waId)
                  .maybeSingle();
                if (exists) continue;
              }

              const link = await autoLink(phone);

              await admin.from("whatsapp_messages").insert({
                phone,
                direction: "in",
                body: text,
                wa_message_id: waId ?? null,
                status: "received",
                lead_id: link.lead_id,
                lead_type: link.lead_type,
              });
            } catch (e) {
              console.error("inbound msg insert error", e);
            }
          }

          // Status updates (sent → delivered → read / failed)
          for (const st of statuses) {
            try {
              const waId: string | undefined = st.id;
              const status: string = st.status;
              if (!waId) continue;
              const update: any = { status };
              if (status === "failed") {
                update.error_message =
                  st?.errors?.[0]?.title ??
                  st?.errors?.[0]?.message ??
                  "Failed";
              }
              await admin
                .from("whatsapp_messages")
                .update(update)
                .eq("wa_message_id", waId);
            } catch (e) {
              console.error("status update error", e);
            }
          }
        }
      }
    } catch (e) {
      console.error("webhook parse error", e);
    }
    // Always 200 to prevent Meta retry storms
    return new Response("EVENT_RECEIVED", { status: 200, headers: cors });
  }

  return new Response("method not allowed", { status: 405, headers: cors });
});

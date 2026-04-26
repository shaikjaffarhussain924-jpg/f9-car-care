// PUBLIC endpoint for n8n to mirror every WhatsApp message into the CRM.
// Protected by a shared secret header `x-ingest-secret`.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const INGEST_SECRET = Deno.env.get("N8N_INGEST_SECRET");

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-ingest-secret, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

async function autoLink(phone: string): Promise<{
  lead_id: string | null;
  lead_type: "appointment" | "contact" | null;
}> {
  const last10 = phone.replace(/\D/g, "").slice(-10);
  if (!last10) return { lead_id: null, lead_type: null };

  const { data: appt } = await admin
    .from("appointments")
    .select("id")
    .ilike("phone", `%${last10}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (appt?.id) return { lead_id: appt.id, lead_type: "appointment" };

  const { data: contact } = await admin
    .from("contact_submissions")
    .select("id")
    .ilike("phone", `%${last10}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (contact?.id) return { lead_id: contact.id, lead_type: "contact" };

  return { lead_id: null, lead_type: null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { error: "method not allowed" });

  // Auth via shared secret header
  if (!INGEST_SECRET) {
    return json(500, { error: "N8N_INGEST_SECRET not configured" });
  }
  const provided = req.headers.get("x-ingest-secret");
  if (provided !== INGEST_SECRET) {
    return json(401, { error: "unauthorized" });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "invalid JSON body" });
  }

  const phoneRaw = String(payload?.phone ?? "").trim();
  const direction = String(payload?.direction ?? "").trim();
  const body = payload?.body == null ? null : String(payload.body);
  const wa_message_id = payload?.wa_message_id ? String(payload.wa_message_id) : null;
  const statusInput = payload?.status ? String(payload.status) : null;

  if (!phoneRaw) return json(400, { error: "phone is required" });
  if (direction !== "in" && direction !== "out") {
    return json(400, { error: "direction must be 'in' or 'out'" });
  }

  // Normalize: strip non-digits
  const phone = phoneRaw.replace(/\D/g, "");
  if (!phone) return json(400, { error: "phone has no digits" });

  // Dedup on wa_message_id when present
  if (wa_message_id) {
    const { data: existing } = await admin
      .from("whatsapp_messages")
      .select("id")
      .eq("wa_message_id", wa_message_id)
      .maybeSingle();
    if (existing) return json(200, { ok: true, id: existing.id, deduped: true });
  }

  const status = statusInput ?? (direction === "in" ? "received" : "sent");
  const link = await autoLink(phone);

  const { data, error } = await admin
    .from("whatsapp_messages")
    .insert({
      phone,
      direction,
      body,
      wa_message_id,
      status,
      lead_id: link.lead_id,
      lead_type: link.lead_type,
    })
    .select("id")
    .single();

  if (error) {
    console.error("ingest insert error", error);
    return json(500, { error: error.message });
  }

  return json(200, { ok: true, id: data.id });
});

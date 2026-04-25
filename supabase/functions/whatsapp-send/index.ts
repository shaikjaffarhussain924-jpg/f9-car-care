import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const META_TOKEN = Deno.env.get("META_WA_ACCESS_TOKEN");
const PHONE_NUMBER_ID = Deno.env.get("META_WA_PHONE_NUMBER_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// E.164 normalization for India default
function normalizePhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0"))
    return `91${digits.slice(1)}`;
  // already includes a country code
  return digits;
}

function friendlyMetaError(code: number | string, message: string): string {
  const c = String(code);
  if (c === "131030")
    return "Number not in allowed list. Add the recipient in Meta Business Manager (or finish app review).";
  if (c === "131026")
    return "Recipient hasn't messaged your business in 24h. They must send a message first, or use an approved template.";
  if (c === "190")
    return "Meta access token expired or invalid. Update META_WA_ACCESS_TOKEN.";
  return message || "WhatsApp send failed.";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    if (!META_TOKEN || !PHONE_NUMBER_ID) {
      return new Response(
        JSON.stringify({
          error: "WhatsApp not configured (missing META_WA_* secrets).",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Auth: must be signed-in admin/staff
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: roleOk, error: roleErr } = await admin.rpc(
      "is_admin_or_staff",
      { _user_id: userData.user.id },
    );
    if (roleErr || !roleOk) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { phone, body, leadId, leadType } = await req.json();
    if (!phone || !body) {
      return new Response(
        JSON.stringify({ error: "phone and body are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const e164 = normalizePhone(phone);
    if (!e164) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const metaResp = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: e164,
          type: "text",
          text: { body: String(body).slice(0, 4096) },
        }),
      },
    );

    const metaJson: any = await metaResp.json().catch(() => ({}));

    if (!metaResp.ok) {
      const code = metaJson?.error?.code ?? metaResp.status;
      const friendly = friendlyMetaError(code, metaJson?.error?.message);
      await admin.from("whatsapp_messages").insert({
        phone: e164,
        direction: "out",
        body,
        status: "failed",
        lead_id: leadId ?? null,
        lead_type: leadType ?? null,
        error_message: friendly,
      });
      return new Response(
        JSON.stringify({ error: friendly, code, raw: metaJson }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const waMsgId: string | undefined = metaJson?.messages?.[0]?.id;
    await admin.from("whatsapp_messages").insert({
      phone: e164,
      direction: "out",
      body,
      wa_message_id: waMsgId ?? null,
      status: "sent",
      lead_id: leadId ?? null,
      lead_type: leadType ?? null,
    });

    return new Response(
      JSON.stringify({ ok: true, wa_message_id: waMsgId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("whatsapp-send error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

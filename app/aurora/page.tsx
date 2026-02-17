"use strict";

// ===== ENV =====
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const TTS_MODEL = process.env.TTS_MODEL || "gpt-4o-mini-tts";
const TTS_VOICE = process.env.TTS_VOICE || "nova";

// Realtime model (ajustable)
const REALTIME_MODEL =
  process.env.REALTIME_MODEL || "gpt-4o-mini-realtime-preview";

// ===== Helpers =====
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Cache-Control": "no-store",
  };
}

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders() },
    body: JSON.stringify(obj),
  };
}

// ===== OpenAI Calls =====
async function openaiResponses(userText) {
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      input: [
        { role: "user", content: [{ type: "input_text", text: userText }] },
      ],
    }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`OpenAI /responses ${r.status}: ${JSON.stringify(data)}`);

  const out =
    data.output_text ??
    (Array.isArray(data.output)
      ? data.output
          .flatMap((o) => o.content || [])
          .filter((c) => c.type === "output_text" && typeof c.text === "string")
          .map((c) => c.text)
          .join("\n")
      : "");

  return out || "OK";
}

async function openaiTTS(text) {
  const r = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: TTS_MODEL,
      voice: TTS_VOICE,
      input: text,
      format: "mp3",
    }),
  });

  if (!r.ok) {
    const errTxt = await r.text().catch(() => "");
    throw new Error(`OpenAI /audio/speech ${r.status}: ${errTxt}`);
  }

  const arrayBuf = await r.arrayBuffer();
  return Buffer.from(arrayBuf).toString("base64");
}

async function openaiRealtimeCall(offerSdp) {
  // Enviamos offer (SDP) a OpenAI y recibimos answer (SDP)
  const r = await fetch("https://api.openai.com/v1/realtime/calls", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: REALTIME_MODEL,
      offer: offerSdp,
    }),
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    throw new Error(`OpenAI /realtime/calls ${r.status}: ${JSON.stringify(data)}`);
  }

  const answer = (data && (data.answer || data.sdp)) || "";
  return String(answer || "").trim();
}

// ===== Handler =====
exports.handler = async (event) => {
  const method = (event.requestContext?.http?.method || event.httpMethod || "GET").toUpperCase();
  const rawPath = event.requestContext?.http?.path || event.rawPath || event.path || "/";
  const path = rawPath.split("?")[0];

  // OPTIONS (CORS)
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  const query = event.queryStringParameters || {};

  // Root
  if (path === "/" && method === "GET") {
    return json(200, {
      ok: true,
      service: "quantum-nexus-aurora",
      endpoints: [
        "/health",
        "/chat?msg=hola",
        "/tts?text=Hola%20soy%20Aurora",
        "/realtime/session (POST SDP)",
      ],
      models: { chat: OPENAI_MODEL, tts: TTS_MODEL, voice: TTS_VOICE, realtime: REALTIME_MODEL },
      hasKey: Boolean(OPENAI_API_KEY),
    });
  }

  // Health
  if (path === "/health" && method === "GET") {
    return json(200, { ok: true, status: "healthy" });
  }

  // Chat
  if (path === "/chat" && method === "GET") {
    try {
      const msg = String(query.msg || "").trim();
      if (!msg) return json(400, { ok: false, error: "Falta query ?msg=" });
      if (!OPENAI_API_KEY) return json(500, { ok: false, error: "OPENAI_API_KEY no configurada" });

      const reply = await openaiResponses(msg);
      return json(200, { ok: true, reply });
    } catch (e) {
      return json(500, { ok: false, error: "Error chat", details: String(e?.message || e) });
    }
  }

  // TTS
  if (path === "/tts" && method === "GET") {
    try {
      const text = String(query.text || "").trim();
      if (!text) return json(400, { ok: false, error: "Falta query ?text=" });
      if (!OPENAI_API_KEY) return json(500, { ok: false, error: "OPENAI_API_KEY no configurada" });

      const audioBase64 = await openaiTTS(text);
      return json(200, { ok: true, format: "mp3", voice: TTS_VOICE, audioBase64 });
    } catch (e) {
      return json(500, { ok: false, error: "Error tts", details: String(e?.message || e) });
    }
  }

  // ✅ Realtime WebRTC (POST /realtime/session) — body = SDP (texto), response = SDP (texto)
  if (path === "/realtime/session" && method === "POST") {
    try {
      if (!OPENAI_API_KEY) return json(500, { ok: false, error: "OPENAI_API_KEY no configurada" });

      const offerSdp = event.isBase64Encoded
        ? Buffer.from(event.body || "", "base64").toString("utf8")
        : (event.body || "");

      const cleanOffer = String(offerSdp || "").trim();
      if (!cleanOffer) return json(400, { ok: false, error: "Offer SDP vacío (EOF). El frontend no está enviando offer.sdp" });

      const answerSdp = await openaiRealtimeCall(cleanOffer);
      if (!answerSdp) return json(500, { ok: false, error: "OpenAI no devolvió SDP answer" });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/sdp; charset=utf-8", ...corsHeaders() },
        body: answerSdp,
      };
    } catch (e) {
      return json(500, { ok: false, error: "Error realtime", details: String(e?.message || e) });
    }
  }

  // Unknown
  return json(404, { ok: false, error: `Ruta no encontrada: ${method} ${path}` });
};

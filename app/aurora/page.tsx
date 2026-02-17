"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Role = "user" | "assistant";
type Msg = { role: Role; text: string };

const LAMBDA_BASE =
  "https://lpaaocstqbrsx23qspv222ippa0zlptl.lambda-url.eu-north-1.on.aws";
const STORAGE_KEY = "qnc_aurora_msgs_v1";

function isRole(x: any): x is Role {
  return x === "user" || x === "assistant";
}

function normalizeMsgs(input: any): Msg[] {
  if (!Array.isArray(input)) return [];
  const out: Msg[] = [];
  for (const m of input) {
    if (!m) continue;
    const role = (m as any).role;
    const text = (m as any).text;
    if (isRole(role) && typeof text === "string") out.push({ role, text });
  }
  return out;
}

export default function AuroraChatPage() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ttsOn, setTtsOn] = useState<boolean>(false);

  // ✅ Clave: el estado queda SIEMPRE tipado como Msg[]
  const [msgs, setMsgs] = useState<Msg[]>(
    [
      {
        role: "assistant",
        text: "Hola Álvaro. Soy Aurora. Estoy lista. ¿Qué hacemos ahora?",
      },
    ] as Msg[]
  );

  // Cargar memoria local (si existe)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const normalized: Msg[] = normalizeMsgs(parsed);
      if (normalized.length > 0) setMsgs(normalized.slice(-50));
    } catch {}
  }, []);

  // Guardar memoria local
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-50)));
    } catch {}
  }, [msgs]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function speak(text: string) {
    const r = await fetch(`${LAMBDA_BASE}/tts?text=${encodeURIComponent(text)}`);
    const data = await r.json();
    if (!data?.ok) throw new Error(data?.error || "TTS error");

    const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
    await audio.play();
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);

    // ✅ MUY IMPORTANTE: usamos setMsgs(prev => ...) para que prev sea Msg[] SIEMPRE
    let payload: Msg[] = [];
    setMsgs((prev) => {
      const next: Msg[] = [...prev, { role: "user", text }].slice(-20);
      payload = next;
      return next;
    });

    try {
      const r = await fetch(`${LAMBDA_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });

      const data = await r.json();
      if (!data?.ok) throw new Error(data?.error || "Chat error");

      const reply = String(data.reply || "");

      setMsgs((prev) => {
        const next: Msg[] = [...prev, { role: "assistant", text: reply }].slice(
          -50
        );
        return next;
      });

      if (ttsOn && reply) {
        try {
          await speak(reply);
        } catch {}
      }
    } catch (e: any) {
      const err = `❌ Error: ${String(e?.message || e)}`;
      setMsgs((prev) => [...prev, { role: "assistant", text: err }]);
    } finally {
      setLoading(false);
    }
  }

  async function speakLastAssistant() {
    const last = [...msgs].reverse().find((m) => m.role === "assistant")?.text;
    if (!last) return;
    try {
      await speak(last);
    } catch (e: any) {
      alert(`Error TTS: ${String(e?.message || e)}`);
    }
  }

  function resetMemory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setMsgs([
      {
        role: "assistant",
        text: "Memoria borrada. Estoy lista otra vez. ¿Qué hacemos?",
      },
    ]);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #6b46c1, #4c1d95)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ margin: 0 }}>Aurora</h1>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setTtsOn((v) => !v)}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                cursor: "pointer",
              }}
            >
              Voz: {ttsOn ? "encendida" : "apagada"}
            </button>

            <button
              onClick={speakLastAssistant}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                cursor: "pointer",
              }}
            >
              🔊 Repetir
            </button>

            <button
              onClick={resetMemory}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                cursor: "pointer",
              }}
            >
              🧠 Borrar memoria
            </button>

            <Link
              href="/"
              style={{
                background: "rgba(255,255,255,0.12)",
                padding: "10px 14px",
                borderRadius: 10,
                color: "white",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 14,
            padding: 16,
            minHeight: 420,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  background: m.role === "user" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.12)",
                  padding: "10px 12px",
                  borderRadius: 12,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe aquí..."
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              outline: "none",
            }}
          />
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: canSend ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.15)",
              color: "white",
              cursor: canSend ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.85, fontSize: 12 }}>
          Backend: {LAMBDA_BASE}
        </div>
      </div>
    </main>
  );
}

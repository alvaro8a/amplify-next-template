"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; text: string };

const LAMBDA_BASE = "https://lpaaocstqbrsx23qspv222ippa0zlptl.lambda-url.eu-north-1.on.aws";

const PERSONAS = [
  { key: "female_es", label: "Femenina (Aurora)" },
  { key: "male_es", label: "Masculina" },
  { key: "neutral_es", label: "Neutra" },
  { key: "young_es", label: "Juvenil" },
  { key: "senior_es", label: "Más adulta" },
];

const VOICES = [
  { key: "shimmer", label: "Shimmer" },
  { key: "coral", label: "Coral" },
  { key: "fable", label: "Fable" },
  { key: "nova", label: "Nova" },
  { key: "alloy", label: "Alloy" },
  { key: "echo", label: "Echo" },
  { key: "onyx", label: "Onyx" },
];

export default function AuroraChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState("female_es");
  const [voice, setVoice] = useState("shimmer");

  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hola Álvaro. Soy Aurora. Dime algo y te respondo con IA real." },
  ]);

  useEffect(() => {
    try {
      const p = localStorage.getItem("qnc_persona");
      const v = localStorage.getItem("qnc_voice");
      if (p) setPersona(p);
      if (v) setVoice(v);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("qnc_persona", persona);
      localStorage.setItem("qnc_voice", voice);
    } catch {}
  }, [persona, voice]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMsgs((m) => [...m, { role: "user", text }]);

    try {
      const url = `${LAMBDA_BASE}/chat?msg=${encodeURIComponent(text)}&persona=${encodeURIComponent(persona)}`;
      const r = await fetch(url);
      const data = await r.json();

      if (!data?.ok) throw new Error(data?.error || "Chat error");

      const reply = String(data.reply || "");
      setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    } catch (e: any) {
      setMsgs((m) => [...m, { role: "assistant", text: `❌ Error: ${String(e?.message || e)}` }]);
    } finally {
      setLoading(false);
    }
  }

  async function speakLastAssistant() {
    const last = [...msgs].reverse().find((m) => m.role === "assistant")?.text;
    if (!last) return;

    try {
      const url = `${LAMBDA_BASE}/tts?text=${encodeURIComponent(last)}&voice=${encodeURIComponent(voice)}`;
      const r = await fetch(url);
      const data = await r.json();
      if (!data?.ok) throw new Error(data?.error || "TTS error");

      const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
      await audio.play();
    } catch (e: any) {
      alert(`Error TTS: ${String(e?.message || e)}`);
    }
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
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
          <h1 style={{ margin: 0 }}>Aurora</h1>
          <Link
            href="/"
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.12)",
              padding: "10px 14px",
              borderRadius: 10,
              color: "white",
              textDecoration: "none",
            }}
          >
            Volver a Home
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 12,
            opacity: 0.95,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Modo:</div>
            <select
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              style={{ padding: 8, borderRadius: 10, border: "none", outline: "none" }}
            >
              {PERSONAS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Voz:</div>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              style={{ padding: 8, borderRadius: 10, border: "none", outline: "none" }}
            >
              {VOICES.map((v) => (
                <option key={v.key} value={v.key}>
                  {v.label}
                </option>
              ))}
            </select>
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
            style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", outline: "none" }}
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

          <button
            onClick={speakLastAssistant}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
            }}
          >
            🔊 Voz
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.85, fontSize: 12 }}>Backend: {LAMBDA_BASE}</div>
      </div>
    </main>
  );
}

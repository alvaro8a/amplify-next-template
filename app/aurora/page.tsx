"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; text: string };

const LAMBDA_BASE = "https://lpaaocstqbrsx23qspv222ippa0zlptl.lambda-url.eu-north-1.on.aws";

export default function AuroraChatPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hola Álvaro. Soy Aurora. Dime algo y te respondo desde Lambda." },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  // WebRTC refs
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const [rtcStatus, setRtcStatus] = useState<"off" | "connecting" | "on" | "error">("off");

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setLoading(true);
    setMsgs((m) => [...m, { role: "user", text }]);

    try {
      const r = await fetch(`${LAMBDA_BASE}/chat?msg=${encodeURIComponent(text)}`);
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

  async function speakLastAssistantMp3() {
    const last = [...msgs].reverse().find((m) => m.role === "assistant")?.text;
    if (!last) return;

    try {
      const r = await fetch(`${LAMBDA_BASE}/tts?text=${encodeURIComponent(last)}`);
      const data = await r.json();
      if (!data?.ok) throw new Error(data?.error || "TTS error");

      const audio = new Audio(`data:audio/mpeg;base64,${data.audioBase64}`);
      await audio.play();
    } catch (e: any) {
      alert(`Error TTS: ${String(e?.message || e)}`);
    }
  }

  // ✅ VOZ STREAMING (WebRTC Realtime)
  async function startStreamingVoice() {
    if (rtcStatus === "connecting" || rtcStatus === "on") return;

    setRtcStatus("connecting");

    try {
      // 1) PeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 2) Remote audio playback
      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      remoteAudioRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // 3) Mic input
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = ms;
      pc.addTrack(ms.getTracks()[0]);

      // 4) Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 5) Send offer SDP to your Lambda, get answer SDP back
      const sdpResp = await fetch(`${LAMBDA_BASE}/realtime/session`, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: offer.sdp || "",
      });

      const contentType = sdpResp.headers.get("content-type") || "";
      if (!sdpResp.ok) {
        const err = contentType.includes("application/json")
          ? JSON.stringify(await sdpResp.json())
          : await sdpResp.text();
        throw new Error(err || `HTTP ${sdpResp.status}`);
      }

      const answerSdp = await sdpResp.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setRtcStatus("on");
      setMsgs((m) => [...m, { role: "assistant", text: "✅ Voz streaming activada. Habla y te respondo en tiempo real." }]);
    } catch (e: any) {
      setRtcStatus("error");
      setMsgs((m) => [...m, { role: "assistant", text: `❌ Streaming: ${String(e?.message || e)}` }]);
      stopStreamingVoice();
    }
  }

  function stopStreamingVoice() {
    try {
      pcRef.current?.getSenders()?.forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}

    pcRef.current = null;

    try {
      micStreamRef.current?.getTracks()?.forEach((t) => t.stop());
    } catch {}

    micStreamRef.current = null;
    remoteAudioRef.current = null;
    setRtcStatus("off");
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

          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <button
              onClick={rtcStatus === "on" ? stopStreamingVoice : startStreamingVoice}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: rtcStatus === "on" ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.12)",
                color: "white",
                cursor: "pointer",
              }}
            >
              {rtcStatus === "on" ? "🛑 Parar streaming" : rtcStatus === "connecting" ? "Conectando..." : "🎙️ Streaming"}
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
              Volver a Home
            </Link>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, minHeight: 420 }}>
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
            onClick={speakLastAssistantMp3}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
            }}
          >
            🔊 Voz (mp3)
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.85, fontSize: 12 }}>
          Backend: {LAMBDA_BASE} | Streaming: {rtcStatus}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

type Msg = { role: "user" | "assistant"; text: string };

// ✅ Tu Lambda base (SIN barra final)
const LAMBDA_BASE =
  "https://lpaaocstqbrsx23qspv222ippa0zlptl.lambda-url.eu-north-1.on.aws";

export default function AuroraPage() {
  // Chat normal
  const [input, setInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hola Álvaro. Soy Aurora. Escríbeme o pulsa Voz (streaming) para hablar en tiempo real.",
    },
  ]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loadingChat,
    [input, loadingChat]
  );

  async function sendChat() {
    const text = input.trim();
    if (!text || loadingChat) return;

    setInput("");
    setLoadingChat(true);
    setMsgs((m) => [...m, { role: "user", text }]);

    try {
      const r = await fetch(`${LAMBDA_BASE}/chat?msg=${encodeURIComponent(text)}`);
      const data = await r.json();
      if (!data?.ok) throw new Error(data?.error || "Chat error");
      const reply = String(data.reply || "");
      setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    } catch (e: any) {
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: `❌ Error chat: ${String(e?.message || e)}` },
      ]);
    } finally {
      setLoadingChat(false);
    }
  }

  // ====== VOZ STREAMING (WebRTC) ======
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [rtStatus, setRtStatus] = useState<
    "idle" | "starting" | "live" | "stopping" | "error"
  >("idle");
  const [rtError, setRtError] = useState<string>("");

  function safeStopTracks(stream: MediaStream | null) {
    if (!stream) return;
    for (const t of stream.getTracks()) t.stop();
  }

  async function startRealtimeVoice() {
    if (rtStatus === "starting" || rtStatus === "live") return;

    setRtError("");
    setRtStatus("starting");

    try {
      // 1) Micro
      const local = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = local;

      // 2) PeerConnection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // 3) Remote audio
      const remote = new MediaStream();
      remoteStreamRef.current = remote;

      pc.ontrack = (ev) => {
        for (const track of ev.streams[0].getTracks()) {
          remote.addTrack(track);
        }
        if (audioRef.current) {
          audioRef.current.srcObject = remote;
          // autoplay puede bloquearse; el click del botón ayuda
          audioRef.current.play().catch(() => {});
        }
      };

      // 4) Añadir micro al PC
      for (const track of local.getTracks()) {
        pc.addTrack(track, local);
      }

      // 5) Crear OFFER SDP
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(offer);

      const offerSdp = pc.localDescription?.sdp || "";
      if (!offerSdp.trim()) throw new Error("Offer SDP vacío (frontend)");

      // 6) Enviar SDP a tu Lambda → recibir ANSWER SDP
      const resp = await fetch(`${LAMBDA_BASE}/realtime/session`, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: offerSdp,
      });

      const answerSdp = await resp.text();
      if (!resp.ok) {
        throw new Error(`Lambda /realtime/session ${resp.status}: ${answerSdp}`);
      }
      if (!answerSdp.trim()) throw new Error("Answer SDP vacío (backend)");

      // 7) Set remote description
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setRtStatus("live");
    } catch (e: any) {
      setRtStatus("error");
      setRtError(String(e?.message || e));
      // limpieza
      await stopRealtimeVoice();
    }
  }

  async function stopRealtimeVoice() {
    if (rtStatus === "stopping") return;
    setRtStatus("stopping");

    try {
      if (pcRef.current) {
        pcRef.current.ontrack = null;
        pcRef.current.close();
      }
      pcRef.current = null;

      safeStopTracks(localStreamRef.current);
      localStreamRef.current = null;

      if (audioRef.current) {
        audioRef.current.pause();
        // @ts-ignore
        audioRef.current.srcObject = null;
      }

      remoteStreamRef.current = null;

      setRtStatus("idle");
    } catch {
      setRtStatus("idle");
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
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
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

        {/* Chat box */}
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

        {/* Inputs */}
        <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe aquí..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendChat();
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
            onClick={sendChat}
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
            {loadingChat ? "..." : "Enviar"}
          </button>

          <button
            onClick={rtStatus === "live" ? stopRealtimeVoice : startRealtimeVoice}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: rtStatus === "live" ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
              minWidth: 160,
            }}
          >
            {rtStatus === "live"
              ? "🛑 Parar voz"
              : rtStatus === "starting"
              ? "🎙️ Conectando..."
              : "🎙️ Voz streaming"}
          </button>
        </div>

        {/* Hidden audio output */}
        <audio ref={audioRef} autoPlay />

        {/* Status */}
        <div style={{ marginTop: 10, opacity: 0.9, fontSize: 12, lineHeight: 1.4 }}>
          Backend: {LAMBDA_BASE}
          <br />
          Voz:{" "}
          {rtStatus === "idle"
            ? "apagada"
            : rtStatus === "starting"
            ? "conectando..."
            : rtStatus === "live"
            ? "ACTIVA (deberías oír respuesta)"
            : rtStatus === "stopping"
            ? "parando..."
            : "error"}
          {rtError ? <div style={{ marginTop: 6 }}>❌ {rtError}</div> : null}
        </div>
      </div>
    </main>
  );
}

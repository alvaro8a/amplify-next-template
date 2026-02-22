"use client";

import { useEffect, useMemo, useState } from "react";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"idle" | "working" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const params = useMemo(() => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      setStatus("error");
      setMessage(`${error}${errorDescription ? `: ${errorDescription}` : ""}`);
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("No se recibió código de autorización (code).");
      return;
    }

    (async () => {
      try {
        setStatus("working");
        setMessage("Validando acceso...");

        const r = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        const data = await r.json().catch(() => ({}));

        if (!r.ok || !data?.ok) {
          const details = data?.error || data?.details || "Error desconocido";
          throw new Error(details);
        }

        setStatus("ok");
        setMessage("Acceso correcto. Entrando...");

        const next = typeof data?.redirect === "string" && data.redirect ? data.redirect : "/aurora/";
        window.location.replace(next);
      } catch (e: any) {
        setStatus("error");
        setMessage(String(e?.message || e));
      }
    })();
  }, [params]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #6b46c1, #4c1d95)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 20,
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26 }}>Quantum Nexus</h1>

        <div style={{ marginTop: 14, fontSize: 16, opacity: 0.95 }}>
          {status === "working" ? "Procesando..." : status === "ok" ? "Listo" : status === "error" ? "Error" : "Cargando..."}
        </div>

        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 12,
            background: "rgba(0,0,0,0.20)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: 14,
          }}
        >
          {message}
        </div>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.12)",
            color: "white",
            textDecoration: "none",
          }}
        >
          Volver a Home
        </a>
      </div>
    </main>
  );
}

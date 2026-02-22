"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CallbackClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [msg, setMsg] = useState("Conectando con tu cuenta...");

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code");
      if (!code) {
        setMsg("Falta el parámetro ?code=");
        return;
      }

      const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "";
      const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";
      const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || "";

      if (!domain || !clientId || !redirectUri) {
        setMsg(
          `Missing env vars\n` +
            `NEXT_PUBLIC_COGNITO_DOMAIN: ${domain ? "OK" : "MISSING"}\n` +
            `NEXT_PUBLIC_COGNITO_CLIENT_ID: ${clientId ? "OK" : "MISSING"}\n` +
            `NEXT_PUBLIC_COGNITO_REDIRECT_URI: ${redirectUri ? "OK" : "MISSING"}\n`
        );
        return;
      }

      try {
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok || data?.error) {
          setMsg(
            `Error token exchange\nHTTP: ${res.status}\nDETAILS: ${JSON.stringify(
              data
            )}`
          );
          return;
        }

        localStorage.setItem("access_token", data.access_token || "");
        localStorage.setItem("id_token", data.id_token || "");
        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

        setMsg("Login OK. Entrando...");
        router.replace("/welcome");
      } catch (e: any) {
        setMsg(`Error de red/código. ${e?.message || String(e)}`);
      }
    };

    run();
  }, [searchParams, router]);

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
        padding: 20,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: 36, marginBottom: 10 }}>Quantum Nexus</h1>
        <pre style={{ whiteSpace: "pre-wrap", opacity: 0.95 }}>{msg}</pre>

        <button
          onClick={() => router.replace("/")}
          style={{
            marginTop: 18,
            padding: "12px 22px",
            borderRadius: 24,
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.18)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Volver a Home
        </button>
      </div>
    </main>
  );
}

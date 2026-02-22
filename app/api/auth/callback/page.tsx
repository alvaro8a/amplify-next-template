"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Procesando inicio de sesión...");

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const error = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");

        if (error) {
          setMsg(`Error OAuth: ${error}${errorDescription ? " - " + errorDescription : ""}`);
          return;
        }

        if (!code) {
          setMsg("No se recibió 'code' de autorización.");
          return;
        }

        // Intercambio code -> tokens (server)
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!res.ok) {
          const t = await res.text();
          setMsg(`Fallo intercambiando token. Status ${res.status}: ${t}`);
          return;
        }

        // Si todo OK, el server habrá puesto cookies de sesión
        setMsg("✅ Sesión iniciada. Redirigiendo...");
        router.replace("/app/login");
      } catch (e: any) {
        setMsg(`Error inesperado: ${String(e?.message || e)}`);
      }
    };

    run();
  }, [router]);

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 720, padding: 20, textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ marginBottom: 10 }}>Quantum Nexus</h1>
        <p>{msg}</p>
      </div>
    </main>
  );
}

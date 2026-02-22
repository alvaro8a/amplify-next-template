 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (!code) return;

      setLoading(true);

      try {
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Token exchange error:", data);
          alert("Error canjeando el código. Mira consola.");
          setLoading(false);
          return;
        }

        // Guardar tokens
        localStorage.setItem("id_token", data.id_token);
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token) localStorage.setItem("refresh_token", data.refresh_token);

        // Limpia URL
        window.history.replaceState({}, document.title, "/");

        // Ir al panel /welcome (o /app/dashboard cuando exista)
        router.push("/welcome");
      } catch (err) {
        console.error(err);
        alert("Error de red/código. Mira consola.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router]);

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
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 720, width: "100%" }}>
        <h1 style={{ fontSize: 48, marginBottom: 10 }}>
          ¡Bienvenido a Quantum Nexus!
        </h1>

        {loading ? (
          <p style={{ fontSize: 18, opacity: 0.9 }}>
            Conectando con tu cuenta...
          </p>
        ) : (
          <p style={{ fontSize: 18, opacity: 0.9 }}>
            Accede a tu panel, herramientas y futuras funciones del ecosistema Quantum Nexus.
          </p>
        )}

        <div style={{ marginTop: 30 }}>
          <a href="/login/">
            <button
              style={{
                padding: "14px 28px",
                borderRadius: 30,
                border: "none",
                background: "rgba(255,255,255,0.18)",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                cursor: "pointer",
                minWidth: 260,
              }}
            >
              Entrar al Club
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}

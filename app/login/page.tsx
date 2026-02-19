"use client";

import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  function goLogin() {
    setLoading(true);

    const clientId = "35o8q5lh3pl7hulf3svch8jk7v";
    const domain =
      "https://quantum-nexus-login.auth.eu-north-1.amazoncognito.com";
    const redirect =
      "https://main.dkjwy846paczl.amplifyapp.com/auth/callback";

    const url =
      domain +
      "/oauth2/authorize" +
      "?client_id=" +
      clientId +
      "&response_type=code" +
      "&scope=email+openid+phone" +
      "&redirect_uri=" +
      encodeURIComponent(redirect);

    window.location.href = url;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #6b46c1, #4c1d95)",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: 40,
          borderRadius: 12,
          width: 360,
          textAlign: "center",
          color: "white",
        }}
      >
        <h2>Acceso Quantum Nexus</h2>

        <button
          onClick={goLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            marginTop: 25,
            borderRadius: 8,
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Conectando..." : "Entrar"}
        </button>

        <p style={{ marginTop: 20, fontSize: 13 }}>
          ¿No tienes cuenta?{" "}
          <a href="/register" style={{ color: "#ddd" }}>
            Crear cuenta
          </a>
        </p>
      </div>
    </main>
  );
}

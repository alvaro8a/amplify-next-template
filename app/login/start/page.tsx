"use client";

import { useEffect } from "react";

export default function StartLogin() {
  useEffect(() => {
    const authorizeUrl =
      "https://quantum-nexus-login.auth.eu-north-1.amazoncognito.com/oauth2/authorize" +
      "?client_id=35o8q5lh3pl7hulf3svch8jk7v" +
      "&response_type=code" +
      "&scope=openid+email+phone" +
      "&redirect_uri=" +
      encodeURIComponent("https://main.dkjwy846paczl.amplifyapp.com/auth/callback");

    window.location.href = authorizeUrl;
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 520, padding: 24 }}>
        <h2>Redirigiendo a inicio de sesión seguro…</h2>
        <p style={{ opacity: 0.7 }}>
          Si no avanza,{" "}
          <a
            href="https://quantum-nexus-login.auth.eu-north-1.amazoncognito.com/oauth2/authorize?client_id=35o8q5lh3pl7hulf3svch8jk7v&response_type=code&scope=openid+email+phone&redirect_uri=https%3A%2F%2Fmain.dkjwy846paczl.amplifyapp.com%2Fauth%2Fcallback"
            style={{ textDecoration: "underline" }}
          >
            haz clic aquí
          </a>
          .
        </p>
      </div>
    </main>
  );
}

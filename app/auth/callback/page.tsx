"use client";

import { useEffect, useState } from "react";

export default function CallbackPage() {
  const [status, setStatus] = useState("Procesando login...");

  useEffect(() => {
    async function handleLogin() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          setStatus("No se recibió código de autorización");
          return;
        }

        const clientId = "35o8q5lh3pl7hulf3svch8jk7v";
        const redirectUri =
          "https://main.dkjwy846paczl.amplifyapp.com/auth/callback";

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri,
        });

        const response = await fetch(
          "https://quantum-nexus-login.auth.eu-north-1.amazoncognito.com/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
          }
        );

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem("qn_access", data.access_token);
          localStorage.setItem("qn_id", data.id_token);

          window.location.href = "/welcome";
        } else {
          setStatus("Error obteniendo token");
          console.error(data);
        }
      } catch (err) {
        console.error(err);
        setStatus("Error en login");
      }
    }

    handleLogin();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div>
        <h2>{status}</h2>
      </div>
    </main>
  );
}

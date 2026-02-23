"use client";

export default function RegisterPage() {
  const clientId = "35o8q5lh3pl7hulf3svch8jk7v";
  const domain = "https://quantum-nexus-login.auth.eu-north-1.amazoncognito.com";
  const redirectUri = "https://main.d2hbx9fr1fvkud.amplifyapp.com/auth/callback";
  const scope = "openid+email+phone";
  const responseType = "code";

  const signupUrl =
    `${domain}/signup?client_id=${encodeURIComponent(clientId)}` +
    `&response_type=${encodeURIComponent(responseType)}` +
    `&scope=${scope}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

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
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: 40,
          borderRadius: 12,
          width: 360,
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <h2>Crear cuenta</h2>

        <button
          onClick={() => (window.location.href = signupUrl)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 20,
            borderRadius: 8,
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Crear cuenta
        </button>

        <p style={{ marginTop: 20, fontSize: 13 }}>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" style={{ color: "#ddd" }}>
            Iniciar sesión
          </a>
        </p>
      </div>
    </main>
  );
}

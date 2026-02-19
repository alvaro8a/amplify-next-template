export default function LoginPage() {
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
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: 40,
          borderRadius: 12,
          width: 340,
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <h2>Acceso al Club</h2>

        <p style={{ marginTop: 12, fontSize: 13, opacity: 0.9 }}>
          Acceso seguro mediante Cognito (AWS).
        </p>

        {/* Botón REAL: manda a /app/login/start que redirige a Cognito */}
        <a
          href="/app/login/start"
          style={{
            display: "block",
            width: "100%",
            padding: 12,
            marginTop: 18,
            borderRadius: 8,
            border: "none",
            background: "#7c3aed",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Entrar
        </a>

        <p style={{ marginTop: 18, fontSize: 13 }}>
          ¿No tienes cuenta?{" "}
          <a href="/register" style={{ color: "#ddd" }}>
            Regístrate
          </a>
        </p>

        <p style={{ marginTop: 10, fontSize: 11, opacity: 0.7 }}>
          Si vienes de cerrar sesión, esta página existe para evitar errores 404.
        </p>
      </div>
    </main>
  );
}

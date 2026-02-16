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

        <input
          placeholder="Email"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 15,
            borderRadius: 6,
            border: "none",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          style={{
            width: "100%",
            padding: 10,
            marginTop: 10,
            borderRadius: 6,
            border: "none",
          }}
        />

        <button
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
          Entrar
        </button>

        <p style={{ marginTop: 20, fontSize: 13 }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: "#ddd" }}>Regístrate</a>
        </p>
      </div>
    </main>
  );
}

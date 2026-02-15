export const dynamic = "force-static";

export default function Welcome() {
  return (
    <main
      style={{
        background: "linear-gradient(to right, #6b46c1, #4c1d95)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontWeight: 900 }}>
        ✅ Bienvenido a Quantum Nexus
      </h1>

      <p style={{ maxWidth: 850, fontSize: "1.2rem", opacity: 0.95 }}>
        El pago se ha completado correctamente.
        <br />
        Ahora inicia sesión para acceder al Club.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <a
          href="/app/login"
          style={{
            backgroundColor: "#7c3aed",
            color: "white",
            fontWeight: 900,
            padding: "1rem 2rem",
            borderRadius: "9999px",
            textDecoration: "none",
          }}
        >
          Iniciar sesión
        </a>

        <a
          href="/register"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            fontWeight: 900,
            padding: "1rem 2rem",
            borderRadius: "9999px",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          Crear cuenta
        </a>
      </div>
    </main>
  );
}

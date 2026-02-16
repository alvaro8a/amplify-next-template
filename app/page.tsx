export const dynamic = "force-static";

const MONTHLY_LINK = "https://buy.stripe.com/test_cNifZj1nB3R71u3bJn1B600";
const YEARLY_LINK = "https://buy.stripe.com/test_28EcN78Q32N3c8HaFj1B601";

export default function Home() {
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
      <h1 style={{ fontSize: "3.5rem", fontWeight: 800, marginBottom: "1rem" }}>
        ¡Bienvenido a Quantum Nexus!
      </h1>

      <p style={{ maxWidth: 820, fontSize: "1.25rem", opacity: 0.95, lineHeight: 1.6 }}>
        Accede a tu panel, herramientas y futuras funciones del ecosistema Quantum Nexus.
        <br />
        Suscripción: 39€/mes o 399€/año.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <a
          href="/app/login"
          style={{
            backgroundColor: "#7c3aed",
            color: "white",
            fontWeight: 800,
            padding: "1rem 2rem",
            borderRadius: "9999px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Entrar al Club
        </a>

        <a
          href={MONTHLY_LINK}
          target="_blank"
          rel="noreferrer"
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            color: "white",
            fontWeight: 800,
            padding: "1rem 2rem",
            borderRadius: "9999px",
            textDecoration: "none",
            display: "inline-block",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          Suscribirme 39€/mes
        </a>

        <a
          href={YEARLY_LINK}
          target="_blank"
          rel="noreferrer"
          style={{
            backgroundColor: "rgba(255,255,255,0.10)",
            color: "white",
            fontWeight: 800,
            padding: "1rem 2rem",
            borderRadius: "9999px",
            textDecoration: "none",
            display: "inline-block",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          Suscribirme 399€/año
        </a>
      </div>

      <p style={{ marginTop: "1.5rem", opacity: 0.9 }}>
        ¿Aún no tienes cuenta?{" "}
        <a href="/register" style={{ color: "white", fontWeight: 800, textDecoration: "underline" }}>
          Regístrate aquí
        </a>
      </p>
    </main>
  );
}

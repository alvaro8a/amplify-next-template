export default function Home() {
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
          textAlign: "center",
          maxWidth: 720,
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: 48, marginBottom: 10 }}>
          ¡Bienvenido a Quantum Nexus!
        </h1>

        <p style={{ fontSize: 18, opacity: 0.9 }}>
          Accede a tu panel, herramientas y futuras funciones del ecosistema Quantum Nexus.
        </p>

        <p style={{ marginTop: 10, marginBottom: 30 }}>
          Suscripción: 39€/mes o 399€/año.
        </p>

        {/* BOTONES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
            alignItems: "center",
          }}
        >
          {/* ENTRAR AL CLUB */}
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

          {/* SUSCRIPCION MENSUAL */}
          <a href="/register/">
            <button
              style={{
                padding: "14px 28px",
                borderRadius: 30,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                fontSize: 16,
                cursor: "pointer",
                minWidth: 260,
              }}
            >
              Suscribirme 39€/mes
            </button>
          </a>

          {/* SUSCRIPCION ANUAL */}
          <a href="/register/">
            <button
              style={{
                padding: "14px 28px",
                borderRadius: 30,
                border: "none",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                fontSize: 16,
                cursor: "pointer",
                minWidth: 260,
              }}
            >
              Suscribirme 399€/año
            </button>
          </a>

          {/* LINK REGISTRO */}
          <p style={{ marginTop: 15 }}>
            ¿Aún no tienes cuenta?{" "}
            <a
              href="/register/"
              style={{
                color: "white",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Regístrate aquí
            </a>
          </p>

          {/* BOTON AURORA */}
          <a href="/aurora/">
            <button
              style={{
                marginTop: 20,
                padding: "12px 24px",
                borderRadius: 25,
                border: "none",
                background: "#ffffff",
                color: "#4c1d95",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Abrir Aurora
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}

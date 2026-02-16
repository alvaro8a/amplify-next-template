export const dynamic = "force-static";

export default function AuroraPage() {
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
        padding: 24,
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 24,
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>Aurora</h1>
        <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
          Página de prueba de Aurora. Aquí conectaremos el chat con tu Lambda.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.18)",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Volver a Home
        </a>
      </div>
    </main>
  );
}

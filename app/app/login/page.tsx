export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <h1>LOGIN</h1>
        <p>Esta es la página real de login (ya no debería dar 404).</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          <a href="/" style={btn}>Volver a Home</a>
          <a href="/register" style={btnOutline}>Ir a Registro</a>
          <a href="/aurora" style={btnOutline}>Ir a Aurora</a>
        </div>
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 999,
  background: "#4c1d95",
  color: "white",
  textDecoration: "none",
  fontWeight: 700,
};

const btnOutline: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 999,
  border: "1px solid #4c1d95",
  color: "#4c1d95",
  textDecoration: "none",
  fontWeight: 700,
};

export default function Login() {
  return (
    <main style={{ background: 'linear-gradient(to right, #6b46c1, #4c1d95)', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Entrar al Club</h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
        Ingresa tu email y contraseña para acceder a tus superpoderes AI.
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <input type="email" placeholder="Tu email" style={{ padding: '1rem', borderRadius: '8px', border: 'none' }} />
        <input type="password" placeholder="Contraseña" style={{ padding: '1rem', borderRadius: '8px', border: 'none' }} />
        <button type="submit" style={{ backgroundColor: '#7c3aed', color: 'white', padding: '1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
          Iniciar sesión
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>¿No tienes cuenta? Regístrate aquí</p>
    </main>
  );
}

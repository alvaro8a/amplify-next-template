export default function Login() {
  return (
    <main style={{ background: 'linear-gradient(to right, #6b46c1, #4c1d95)', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Entrar al Quantum Nexus Club</h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '2rem' }}>
        Ingresa tus datos para acceder a tus superpoderes AI y empezar a ganar.
      </p>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '350px' }}>
        <input 
          type="email" 
          placeholder="Tu email" 
          style={{ padding: '1rem', borderRadius: '12px', border: 'none', fontSize: '1.1rem' }} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          style={{ padding: '1rem', borderRadius: '12px', border: 'none', fontSize: '1.1rem' }} 
        />
        <button 
          type="submit" 
          style={{ backgroundColor: '#7c3aed', color: 'white', padding: '1rem', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          Iniciar sesión
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
        ¿Aún no estás en el Club? <a href="/register" style={{ color: '#c084fc', textDecoration: 'underline' }}>Regístrate aquí</a>
      </p>
    </main>
  );
}

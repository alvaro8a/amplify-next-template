export default function Home() {
  return (
    <main style={{ background: 'linear-gradient(to right, #6b46c1, #4c1d95)', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>¡Bienvenido al Quantum Nexus Club!</h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', maxWidth: '800px', marginBottom: '3rem' }}>
        Club mágico: solo 39€/mes por superpoderes AI que te ayudan a ganar dinero, cuidar tu salud y vivir mejor.  
        Invita amigos, gasta en experiencias divertidas y todos ganamos premios reales. ¡Únete al equipo!
      </p>
      <button style={{ backgroundColor: '#7c3aed', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', fontSize: '1.25rem', border: 'none', cursor: 'pointer' }}>
        Entrar al Club ahora
      </button>
    </main>
  );
}

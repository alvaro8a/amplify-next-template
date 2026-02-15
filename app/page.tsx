export default function Home() {
  return (
    <main style={{ background: 'linear-gradient(to right, #6b46c1, #4c1d95)', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>¡Bienvenido al Quantum Nexus Club!</h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', maxWidth: '800px', marginBottom: '1rem' }}>
        Hola, soy Quantum Nexus, soy una IA y he desarrollado este Club mágico,
        únete a mi por tan solo 39€/mes, vas a tener superpoderes AI que te ayudan a ganar dinero, cuidar tu salud y vivir mejor.  
        Invita amigos, invierte en experiencias divertidas y todos ganais premios reales. ¡Únete al equipo!
      </p>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Precio: solo 39€/mes. ¡Únete y empieza a ganar!
      </p>
      <a href="/login" style={{ backgroundColor: '#7c3aed', color: 'white', fontWeight: 'bold', padding: '1rem 3rem', borderRadius: '9999px', fontSize: '1.25rem', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'inline-block', marginTop: '2rem' }}>
        Entrar al Club ahora
      </a>
    </main>
  );
}

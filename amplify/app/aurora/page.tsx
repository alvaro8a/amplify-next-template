export const dynamic = 'force-static';

type Msg = { role: 'user' | 'assistant'; content: string };

function auroraReply(input: string): string {
  const t = input.toLowerCase();

  // Respuestas demo: luego lo cambiaremos por IA real
  if (t.includes('precio') || t.includes('cuesta') || t.includes('39') || t.includes('399')) {
    return "Tenemos dos planes: 39€/mes o 399€/año. Si me dices tu objetivo (ingreso extra o negocio), te recomiendo el mejor.";
  }
  if (t.includes('registro') || t.includes('registr')) {
    return "Perfecto. Para registrarte, ve a /register/. Tras registrarte, te llevaremos a /welcome/ y recibirás un email de confirmación (lo implementamos en la fase IA real).";
  }
  if (t.includes('ayuda') || t.includes('soporte')) {
    return "Estoy aquí. Dime exactamente qué quieres conseguir y te doy pasos claros, uno a uno.";
  }
  if (t.includes('mlm') || t.includes('referidos') || t.includes('afiliad')) {
    return "Sí: vamos a montar un sistema de referidos simple y global. Lo haremos con enlaces únicos, tracking y niveles (sin líos). Dime si quieres 1 nivel o varios.";
  }

  return "Entendido. Dime tu objetivo exacto (en una frase) y te doy el camino más corto para lograrlo.";
}

export default function AuroraChatPage() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatarWrap}>
            {/* Imagen en /public/aurora.png */}
            <img
              src="/aurora.png"
              alt="Aurora"
              style={styles.avatar}
              onError={(e) => {
                // fallback si aún no existe el archivo
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml;charset=utf-8," +
                  encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
                    <rect width='100%' height='100%' fill='#1f1f2b'/>
                    <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='18'>AURORA</text>
                  </svg>`);
              }}
            />
          </div>

          <div style={styles.titleWrap}>
            <h1 style={styles.h1}>Aurora</h1>
            <p style={styles.sub}>Asistente del Quantum Nexus Club</p>
          </div>
        </div>

        <ChatBox />
        <div style={styles.note}>
          Demo local (sin IA real). En el siguiente paso lo conectamos a IA real con un endpoint.
        </div>
      </div>
    </main>
  );
}

function ChatBox() {
  // Estado simple sin dependencias
  const initial: Msg[] = [
    { role: 'assistant', content: 'Hola Álvaro. Soy Aurora. ¿Qué quieres conseguir hoy con Quantum Nexus?' }
  ];

  return (
    <ChatState initial={initial} />
  );
}

// Componente separado para mantener el estado en el cliente
function ChatState({ initial }: { initial: Msg[] }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const React = require('react');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [msgs, setMsgs] = React.useState<Msg[]>(initial);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [text, setText] = React.useState<string>('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [busy, setBusy] = React.useState<boolean>(false);

  async function send() {
    const v = text.trim();
    if (!v || busy) return;

    setMsgs((m: Msg[]) => [...m, { role: 'user', content: v }]);
    setText('');
    setBusy(true);

    // Simula “pensar”
    await new Promise((r) => setTimeout(r, 350));

    const reply = auroraReply(v);
    setMsgs((m: Msg[]) => [...m, { role: 'assistant', content: reply }]);
    setBusy(false);
  }

  return (
    <div>
      <div style={styles.chat}>
        {msgs.map((m, i) => (
          <div key={i} style={m.role === 'user' ? styles.userRow : styles.botRow}>
            <div style={m.role === 'user' ? styles.userBubble : styles.botBubble}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div style={styles.botRow}>
            <div style={styles.botBubble}>…</div>
          </div>
        )}
      </div>

      <div style={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe aquí..."
          style={styles.input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
        />
        <button onClick={send} style={styles.btn}>
          Enviar
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    background: 'linear-gradient(90deg, #6b46c1, #4c1d95)',
    color: 'white',
  },
  card: {
    width: 'min(920px, 96vw)',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.18)',
    backdropFilter: 'blur(10px)',
    padding: '1.25rem',
  },
  header: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 9999,
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.35)',
    background: 'rgba(0,0,0,0.25)',
    flexShrink: 0,
  },
  avatar: { width: '100%', height: '100%', objectFit: 'cover' },
  titleWrap: { display: 'flex', flexDirection: 'column', gap: 2 },
  h1: { margin: 0, fontSize: '1.6rem', fontWeight: 900 },
  sub: { margin: 0, opacity: 0.9 },
  chat: {
    height: 420,
    overflowY: 'auto',
    padding: '0.75rem',
    borderRadius: 14,
    background: 'rgba(0,0,0,0.18)',
    border: '1px solid rgba(255,255,255,0.10)',
  },
  userRow: { display: 'flex', justifyContent: 'flex-end', margin: '0.35rem 0' },
  botRow: { display: 'flex', justifyContent: 'flex-start', margin: '0.35rem 0' },
  userBubble: {
    maxWidth: '78%',
    padding: '0.7rem 0.85rem',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.22)',
    border: '1px solid rgba(255,255,255,0.18)',
    lineHeight: 1.35,
  },
  botBubble: {
    maxWidth: '78%',
    padding: '0.7rem 0.85rem',
    borderRadius: 14,
    background: 'rgba(0,0,0,0.28)',
    border: '1px solid rgba(255,255,255,0.12)',
    lineHeight: 1.35,
  },
  inputRow: { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  input: {
    flex: 1,
    padding: '0.85rem 0.9rem',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.22)',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
  },
  btn: {
    padding: '0.85rem 1rem',
    borderRadius: 12,
    border: 'none',
    background: '#7c3aed',
    color: 'white',
    fontWeight: 800,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  note: { marginTop: '0.75rem', opacity: 0.85, fontSize: '0.9rem' },
};

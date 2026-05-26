import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';

const challenges = [
  { id: 'processo', label: '⚙️ Processos', agents: ['Leonardo Silva'] },
  { id: 'produto', label: '🚀 Novo Produto', agents: ['Ana Costa'] },
  { id: 'cliente', label: '💬 Experiência Cliente', agents: ['Mariana Ramos'] },
  { id: 'pessoas', label: '🤝 Pessoas & Cultura', agents: ['Carlos Mendes'] },
  { id: 'tech', label: '💻 Tecnologia', agents: ['Sofia Neves'] },
  { id: 'outro', label: '✨ Outro / Não sei', agents: ['Rui Ferreira'] },
];

const agents = [
  {
    name: 'Leonardo Silva',
    title: 'agente_pmo · melhoria_processo',
    specialty: 'Melhoria de Processo',
    photo: 'https://i.pravatar.cc/150?img=12',
    avatarBg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    color: '#3126b4',
    accentLight: '#eff4ff',
    bio: 'Especialista em gestão de projectos e optimização de processos.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    questions: [
      'Qual é o maior ponto de fricção no teu processo actual?',
      'Que métricas usas para medir o desempenho operacional?',
      'Que parte do processo gostarias de automatizar primeiro?',
    ],
    challengeId: 'processo',
  },
  {
    name: 'Ana Costa',
    title: 'agente_produto · novo_produto',
    specialty: 'Novo Produto',
    photo: 'https://i.pravatar.cc/150?img=47',
    avatarBg: 'linear-gradient(135deg, #FF0066, #87007F)',
    color: '#FF0066',
    accentLight: '#fdf2f8',
    bio: 'Product manager com mindset de startup. Transforma ideias brutas em conceitos com proposta de valor clara.',
    skills: ['Design Thinking', 'MVP', 'User Research'],
    questions: [
      'Quem é o utilizador e qual o seu maior problema diário?',
      'O que tornaria este produto indispensável em 30 dias?',
      'Qual é o menor MVP que valida a hipótese central?',
    ],
    challengeId: 'produto',
  },
  {
    name: 'Mariana Ramos',
    title: 'agente_cx · experiência_cliente',
    specialty: 'Experiência do Cliente',
    photo: 'https://i.pravatar.cc/150?img=36',
    avatarBg: 'linear-gradient(135deg, #4294F8, #15803d)',
    color: '#0891b2',
    accentLight: '#ecfeff',
    bio: 'Especialista em CX e service design. Transforma fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    questions: [
      'Em que momento da jornada os clientes ficam mais frustrados?',
      'O que dizem os teus detractores no NPS?',
      'Como descreveria o cliente ideal a sua experiência perfeita?',
    ],
    challengeId: 'cliente',
  },
  {
    name: 'Carlos Mendes',
    title: 'agente_rh · cultura_pessoas',
    specialty: 'Cultura & Pessoas',
    photo: 'https://i.pravatar.cc/150?img=53',
    avatarBg: 'linear-gradient(135deg, #9437FF, #b45309)',
    color: '#9437FF',
    accentLight: '#e6dfff',
    bio: 'People & culture specialist. Cria ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    questions: [
      'O que faria os teus colaboradores saírem da cama mais motivados?',
      'Que comportamento queres ver mais (ou menos) na equipa?',
      'Como medes o sucesso de uma iniciativa de cultura?',
    ],
    challengeId: 'pessoas',
  },
  {
    name: 'Sofia Neves',
    title: 'agente_tech · tecnologia_digital',
    specialty: 'Tecnologia & Digital',
    photo: 'https://i.pravatar.cc/150?img=25',
    avatarBg: 'linear-gradient(135deg, #036ef2, #3126b4)',
    color: '#036ef2',
    accentLight: '#eff4ff',
    bio: 'Tech lead e arquitecta de soluções digitais. Define âmbito técnico com clareza e rigor.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    questions: [
      'Que sistema legado é o maior obstáculo à digitalização?',
      'A solução precisa de correr on-premise ou pode ser cloud?',
      'Qual é a tua maior preocupação: custo, velocidade ou segurança?',
    ],
    challengeId: 'tech',
  },
  {
    name: 'Rui Ferreira',
    title: 'agente_geral · outros',
    specialty: 'Generalista',
    photo: 'https://i.pravatar.cc/150?img=8',
    avatarBg: 'linear-gradient(135deg, #87007f, #15803d)',
    color: '#87007f',
    accentLight: '#f4ecff',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda problemas com curiosidade sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    questions: [
      'Se pudesses resolver apenas uma coisa, qual seria?',
      'Que empresa de outro sector resolveria este problema de forma diferente?',
      'Quais os pressupostos que estamos a assumir que podem estar errados?',
    ],
    challengeId: 'outro',
  },
];

type Agent = typeof agents[0];

function AgentCard({ agent, highlighted, dimmed }: {
  agent: Agent;
  highlighted: boolean;
  dimmed: boolean;
}) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: dimmed ? 0.35 : 1,
        y: 0,
        scale: highlighted ? 1.03 : 1,
      }}
      transition={{ duration: 0.35 }}
      style={{
        perspective: '1200px',
        height: 320,
        cursor: 'pointer',
        position: 'relative',
      }}
      onClick={() => setFlipped((v) => !v)}
    >
      {/* Highlight ring */}
      {highlighted && (
        <div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: 22,
            border: `2px solid ${agent.color}`,
            boxShadow: `0 0 20px ${agent.color}30`,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 160 }}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* FRONT */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--surface)',
            border: '1.5px solid var(--border-light)',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: highlighted
              ? `0 8px 32px ${agent.color}20`
              : '0 2px 10px rgba(30,50,140,0.05)',
          }}
        >
          {/* Gradient banner */}
          <div
            style={{
              height: 90,
              background: agent.avatarBg,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {highlighted && (
              <div
                style={{
                  position: 'absolute', top: 10, right: 12,
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 12, padding: '3px 10px',
                  fontSize: 9, color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                ★ recomendado
              </div>
            )}
          </div>

          {/* Photo */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={agent.photo}
              alt={agent.name}
              style={{
                width: 64, height: 64,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid var(--surface)',
                position: 'absolute',
                top: -32, left: 20,
                boxShadow: `0 4px 16px ${agent.color}35`,
              }}
            />
            <div
              style={{
                width: 14, height: 14,
                borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid var(--surface)',
                position: 'absolute',
                top: 20, left: 60,
              }}
            />
          </div>

          {/* Content */}
          <div style={{ padding: '36px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 2 }}>
              {agent.name}
            </div>
            <div
              style={{
                fontSize: 10, color: 'var(--text-sub)',
                fontFamily: 'var(--font-mono)', marginBottom: 10,
              }}
            >
              {agent.title}
            </div>
            <p
              style={{
                fontSize: 12, color: 'var(--text-muted)',
                lineHeight: 1.65, flex: 1, marginBottom: 14,
              }}
            >
              {agent.bio}
            </p>
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 5, fontSize: 11, color: 'var(--text-sub)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <RotateCcw size={11} />
              clica para ver as perguntas
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: agent.accentLight,
            border: `1.5px solid ${agent.color}35`,
            borderRadius: 20,
            padding: '22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            boxShadow: `0 8px 32px ${agent.color}18`,
          }}
        >
          {/* Back header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <img
              src={agent.photo}
              alt={agent.name}
              style={{
                width: 38, height: 38,
                borderRadius: '50%', objectFit: 'cover',
                border: `2px solid ${agent.color}40`,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--text)' }}>
                {agent.name.split(' ')[0]} vai perguntar…
              </div>
              <div
                style={{
                  fontSize: 9, color: agent.color,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {agent.specialty}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {agent.questions.map((q, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: `1px solid ${agent.color}20`,
                  borderLeft: `3px solid ${agent.color}`,
                  borderRadius: 8,
                  padding: '9px 12px',
                  fontSize: 12, color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}
              >
                "{q}"
              </div>
            ))}
          </div>

          {/* Skills + CTA */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
              {agent.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    background: `${agent.color}18`,
                    color: agent.color,
                    fontSize: 9, padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/criar');
              }}
              style={{
                width: '100%', padding: '10px',
                background: agent.color,
                border: 'none', borderRadius: 10,
                cursor: 'pointer', color: '#fff',
                fontWeight: 700, fontSize: 12,
                fontFamily: 'var(--font-outfit)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                boxShadow: `0 4px 14px ${agent.color}40`,
              }}
            >
              Iniciar com {agent.name.split(' ')[0]} <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AgentsPageV3() {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const recommendedAgents = activeChallenge
    ? (challenges.find((c) => c.id === activeChallenge)?.agents ?? [])
    : [];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingTop: '62px',
      }}
    >
      {/* Hero */}
      <div style={{ padding: '36px 40px 0', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 36, fontWeight: 800, letterSpacing: -0.6,
            color: 'var(--text)', marginBottom: 10,
          }}
        >
          Agentes IA do IdeaLab
        </h1>
        <p
          style={{
            fontSize: 15, color: 'var(--text-muted)',
            maxWidth: 460, margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          Para que tipo de desafio precisas de ajuda?
        </p>

        {/* Challenge selector */}
        <div
          style={{
            display: 'flex', gap: 10, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 12,
          }}
        >
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setActiveChallenge((prev) => (prev === c.id ? null : c.id))
              }
              style={{
                padding: '9px 20px',
                borderRadius: 24,
                border: `1.5px solid ${activeChallenge === c.id ? 'var(--blue)' : 'var(--border-light)'}`,
                background: activeChallenge === c.id ? 'var(--blue-light)' : 'var(--surface)',
                color: activeChallenge === c.id ? 'var(--blue)' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontFamily: 'var(--font-outfit)',
                boxShadow: activeChallenge === c.id
                  ? '0 2px 12px rgba(3,110,242,0.15)'
                  : 'none',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {activeChallenge ? (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              style={{
                fontSize: 13, color: 'var(--blue)',
                fontFamily: 'var(--font-mono)',
                marginBottom: 32,
              }}
            >
              ↓ agente recomendado destacado · clica no card para ver as perguntas
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 12, color: 'var(--text-sub)',
                fontFamily: 'var(--font-mono)',
                marginBottom: 32,
              }}
            >
              selecciona um desafio acima ou explora todos os agentes
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          padding: '0 40px 56px',
          maxWidth: 1160,
          margin: '0 auto',
        }}
      >
        {agents.map((agent) => {
          const highlighted =
            activeChallenge !== null && recommendedAgents.includes(agent.name);
          const dimmed =
            activeChallenge !== null && !recommendedAgents.includes(agent.name);
          return (
            <AgentCard
              key={agent.name}
              agent={agent}
              highlighted={highlighted}
              dimmed={dimmed}
            />
          );
        })}
      </div>
    </div>
  );
}

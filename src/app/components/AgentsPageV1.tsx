import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Terminal, ArrowRight } from 'lucide-react';

const agents = [
  {
    name: 'Leonardo Silva',
    title: 'agente_pmo · melhoria_processo',
    specialty: 'Melhoria de Processo',
    avatar: '⬡',
    photo: 'https://i.pravatar.cc/150?img=12',
    avatarBg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    color: '#4294F8',
    bio: 'Especialista em gestão de projectos e optimização de processos. Analisa problemas operacionais com rigor metodológico e ajuda a estruturar propostas com métricas claras.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    examplePrompts: [
      '"Mapeia o processo actual e identifica os maiores bottlenecks."',
      '"Define 3 KPIs para medir o sucesso desta iniciativa."',
      '"Propõe um plano de implementação por fases com milestones."',
    ],
  },
  {
    name: 'Ana Costa',
    title: 'agente_produto · novo_produto',
    specialty: 'Novo Produto',
    avatar: '⚡',
    photo: 'https://i.pravatar.cc/150?img=47',
    avatarBg: 'linear-gradient(135deg, #FF0066, #87007F)',
    color: '#FF0066',
    bio: 'Product manager com mindset de startup. Faz as perguntas certas para transformar uma ideia bruta num conceito de produto com proposta de valor clara.',
    skills: ['Design Thinking', 'MVP', 'User Research'],
    examplePrompts: [
      '"Quem é o utilizador principal e qual o seu maior pain point?"',
      '"Define o MVP mínimo para validar esta ideia em 4 semanas."',
      '"Qual a proposta de valor diferenciadora face à concorrência?"',
    ],
  },
  {
    name: 'Mariana Ramos',
    title: 'agente_cx · experiência_cliente',
    specialty: 'Experiência do Cliente',
    avatar: '◉',
    photo: 'https://i.pravatar.cc/150?img=36',
    avatarBg: 'linear-gradient(135deg, #4294F8, #15803d)',
    color: '#0891b2',
    bio: 'Especialista em CX e service design. Analisa a jornada do cliente com empatia e dados, transformando fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    examplePrompts: [
      '"Mapeia a jornada do cliente e identifica os principais pontos de fricção."',
      '"Como podemos melhorar o NPS neste touchpoint crítico?"',
      '"Cria uma persona representativa do cliente-alvo desta solução."',
    ],
  },
  {
    name: 'Carlos Mendes',
    title: 'agente_rh · cultura_pessoas',
    specialty: 'Cultura & Pessoas',
    avatar: '◎',
    photo: 'https://i.pravatar.cc/150?img=53',
    avatarBg: 'linear-gradient(135deg, #9437FF, #b45309)',
    color: '#9437FF',
    bio: 'People & culture specialist. Ajuda a pensar em iniciativas que criam ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    examplePrompts: [
      '"Como medir e melhorar o engagement da equipa nesta iniciativa?"',
      '"Define OKRs para esta área cultural nos próximos 6 meses."',
      '"Que competências precisamos de desenvolver internamente?"',
    ],
  },
  {
    name: 'Sofia Neves',
    title: 'agente_tech · tecnologia_digital',
    specialty: 'Tecnologia & Digital',
    avatar: '◈',
    photo: 'https://i.pravatar.cc/150?img=25',
    avatarBg: 'linear-gradient(135deg, #036ef2, #3126b4)',
    color: '#036ef2',
    bio: 'Tech lead e arquitecta de soluções digitais. Define o âmbito técnico com clareza — viabilidade, integrações, escalabilidade, segurança.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    examplePrompts: [
      '"Avalia a viabilidade técnica e identifica os principais riscos."',
      '"Que integrações com sistemas existentes são necessárias?"',
      '"Define a arquitectura de alto nível desta solução digital."',
    ],
  },
  {
    name: 'Rui Ferreira',
    title: 'agente_geral · outros',
    specialty: 'Generalista',
    avatar: '✦',
    photo: 'https://i.pravatar.cc/150?img=8',
    avatarBg: 'linear-gradient(135deg, #87007f, #15803d)',
    color: '#87007f',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda o problema com curiosidade e sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    examplePrompts: [
      '"Explora 5 ângulos completamente diferentes para abordar este problema."',
      '"Que pressupostos estamos a assumir que podem estar errados?"',
      '"Como poderia uma empresa de outro sector resolver isto?"',
    ],
  },
];

type Agent = typeof agents[0];

function TypewriterText({ text, speed = 16 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, ++i));
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span style={{ animation: 'termBlink 0.8s step-end infinite' }}>▋</span>
      )}
    </span>
  );
}

export default function AgentsPageV1() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06091a',
        paddingTop: '62px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(66,148,248,0.13) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }}
      />
      {/* Top glow */}
      <div
        style={{
          position: 'absolute',
          top: 62,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 260,
          background:
            'radial-gradient(ellipse, rgba(3,110,242,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* System header bar */}
      <div style={{ padding: '28px 40px 0', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(66,148,248,0.7)',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            marginBottom: 10,
          }}
        >
          <Terminal size={11} />
          <span>IDEALAB_OS v2.4 · SISTEMA OPERACIONAL</span>
          <span style={{ marginLeft: 'auto', color: '#22c55e', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                animation: 'termBlink 2s infinite',
              }}
            />
            6/6 AGENTES ACTIVOS
          </span>
        </div>
        <div
          style={{
            height: 1,
            background: 'rgba(66,148,248,0.15)',
            marginBottom: 28,
          }}
        />
        <h1
          style={{
            color: '#e8eeff',
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -0.5,
            marginBottom: 8,
            fontFamily: 'var(--font-outfit)',
          }}
        >
          Agentes IA do IdeaLab
        </h1>
        <p
          style={{
            color: 'rgba(180,200,255,0.45)',
            fontSize: 13,
            marginBottom: 36,
            fontFamily: 'var(--font-mono)',
          }}
        >
          Selecciona um agente para ver o seu protocolo de operação.
        </p>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          padding: '0 40px 48px',
          position: 'relative',
        }}
      >
        {agents.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 + 0.1, duration: 0.4 }}
            onClick={() => setSelected(agent)}
            whileHover={{ y: -3, boxShadow: `0 0 28px ${agent.color}28` }}
            style={{
              background: 'rgba(8,18,50,0.85)',
              border: `1px solid rgba(66,148,248,0.12)`,
              borderTop: `2px solid ${agent.color}`,
              borderRadius: 14,
              padding: '20px 22px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(12px)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            {/* Traffic lights */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 16,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#dc2626', opacity: 0.7 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#b45309', opacity: 0.7 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#15803d', opacity: 0.7 }} />
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 9,
                  color: 'rgba(150,180,255,0.35)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {agent.title}
              </span>
            </div>

            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={agent.photo}
                  alt={agent.name}
                  style={{
                    width: 46, height: 46, borderRadius: 11,
                    objectFit: 'cover',
                    border: `2px solid ${agent.color}55`,
                    boxShadow: `0 0 18px ${agent.color}44`,
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 13, height: 13, borderRadius: '50%',
                  background: '#22c55e', border: '2px solid #06091a',
                }} />
              </div>
              <div>
                <div
                  style={{
                    color: '#e8eeff',
                    fontWeight: 800,
                    fontSize: 15,
                    fontFamily: 'var(--font-outfit)',
                  }}
                >
                  {agent.name}
                </div>
                <div
                  style={{
                    color: agent.color,
                    fontSize: 10,
                    marginTop: 3,
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: agent.color,
                      display: 'inline-block',
                      animation: 'termBlink 2s infinite',
                    }}
                  />
                  online agora
                </div>
              </div>
            </div>

            {/* Terminal bio */}
            <div
              style={{
                fontSize: 11,
                color: 'rgba(150,180,255,0.55)',
                marginBottom: 14,
                lineHeight: 1.75,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: 'rgba(66,148,248,0.55)' }}>$ </span>
              {agent.bio.slice(0, 88)}…
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
              {agent.skills.map((s) => (
                <span
                  key={s}
                  style={{
                    background: `${agent.color}12`,
                    border: `1px solid ${agent.color}30`,
                    color: agent.color,
                    fontSize: 9,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {/* CTA */}
            <button
              style={{
                width: '100%',
                padding: '9px',
                background: 'transparent',
                border: `1px solid rgba(66,148,248,0.18)`,
                borderRadius: 8,
                cursor: 'pointer',
                color: 'rgba(180,200,255,0.55)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = agent.color;
                (e.currentTarget as HTMLButtonElement).style.color = agent.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(66,148,248,0.18)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(180,200,255,0.55)';
              }}
            >
              ver protocolo <ArrowRight size={11} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Slide panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,8,0.6)',
                zIndex: 40,
                backdropFilter: 'blur(2px)',
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: 440,
                background: '#06091a',
                borderLeft: `1px solid rgba(66,148,248,0.18)`,
                zIndex: 50,
                padding: '36px 32px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Dot grid inside panel */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(circle, rgba(66,148,248,0.08) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                  pointerEvents: 'none',
                }}
              />

              <button
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'rgba(66,148,248,0.08)',
                  border: '1px solid rgba(66,148,248,0.2)',
                  borderRadius: 6,
                  padding: '5px',
                  cursor: 'pointer',
                  color: 'rgba(66,148,248,0.7)',
                  display: 'flex',
                  zIndex: 1,
                }}
              >
                <X size={14} />
              </button>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={selected.photo}
                      alt={selected.name}
                      style={{
                        width: 68, height: 68, borderRadius: 16,
                        objectFit: 'cover',
                        border: `2.5px solid ${selected.color}55`,
                        boxShadow: `0 0 36px ${selected.color}55`,
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#22c55e', border: '2.5px solid #06091a',
                    }} />
                  </div>
                  <div>
                    <div
                      style={{
                        color: '#e8eeff',
                        fontWeight: 800,
                        fontSize: 22,
                        fontFamily: 'var(--font-outfit)',
                      }}
                    >
                      {selected.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(180,200,255,0.4)',
                        fontSize: 10,
                        marginTop: 2,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {selected.title}
                    </div>
                    <div
                      style={{
                        color: '#22c55e',
                        fontSize: 10,
                        marginTop: 5,
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: '#22c55e',
                          display: 'inline-block',
                          animation: 'termBlink 2s infinite',
                        }}
                      />
                      online agora
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    height: 1,
                    background: 'rgba(66,148,248,0.1)',
                    marginBottom: 24,
                  }}
                />

                {/* Bio */}
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(66,148,248,0.6)',
                    marginBottom: 10,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  $ cat bio.md
                </div>
                <div
                  style={{
                    color: 'rgba(200,220,255,0.75)',
                    fontSize: 13,
                    lineHeight: 1.85,
                    marginBottom: 28,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <TypewriterText text={selected.bio} key={selected.name} />
                </div>

                {/* Skills */}
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(66,148,248,0.6)',
                    marginBottom: 12,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  $ ls skills/
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                  {selected.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: `${selected.color}18`,
                        border: `1px solid ${selected.color}45`,
                        color: selected.color,
                        fontSize: 11,
                        padding: '5px 13px',
                        borderRadius: 6,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Example prompts */}
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(66,148,248,0.6)',
                    marginBottom: 12,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  $ exemplo_prompts.txt
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                  {selected.examplePrompts.map((prompt, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(66,148,248,0.05)',
                        border: '1px solid rgba(66,148,248,0.1)',
                        borderLeft: `2px solid ${selected.color}60`,
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: 'rgba(180,210,255,0.55)',
                        fontSize: 11,
                        lineHeight: 1.65,
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {prompt}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate('/criar')}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: `linear-gradient(135deg, ${selected.color}ee, ${selected.color}99)`,
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: 'var(--font-outfit)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: `0 4px 20px ${selected.color}40`,
                  }}
                >
                  Iniciar brainstorming com {selected.name.split(' ')[0]} →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes termBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}

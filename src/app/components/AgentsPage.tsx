import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* ── Raridade ── */
const RARITY = {
  lendario: { label: 'LENDÁRIO', color: '#FF0066', glow: 'rgba(255,0,102,0.55)',   bg: 'rgba(255,0,102,0.12)'  },
  epico:    { label: 'ÉPICO',    color: '#9437ff', glow: 'rgba(148,55,255,0.55)',  bg: 'rgba(148,55,255,0.12)' },
  raro:     { label: 'RARO',     color: '#4294F8', glow: 'rgba(66,148,248,0.55)',  bg: 'rgba(66,148,248,0.12)' },
};

/* ── Dados dos agentes ── */
const agents = [
  {
    name: 'Armindo Kapessa',
    agentLabel: 'Agente PMO',
    specialty: 'Melhoria de Processos',
    category: 'Processos',
    photo: '/labinovacaotis-react/agents/armindo.png',
    avatarBg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    color: '#4294F8',
    rarity: RARITY.raro,
    type: 'ANALÍTICO',
    skills: ['Mapeamento BPMN', 'Gestão de KPIs', 'Automação RPA', 'Lean Six Sigma'],
    stats: [
      { label: 'Lean Six Sigma',  value: 95 },
      { label: 'Mapeamento BPMN', value: 92 },
      { label: 'Gestão de KPIs',  value: 90 },
      { label: 'Automação RPA',   value: 84 },
    ],
    superPower: 'Process Optimizer',
    bio: 'Transforma processos caóticos em sistemas de alta performance.',
  },
  {
    name: 'Esperança Ngunga',
    agentLabel: 'Agente Produto',
    specialty: 'Novo Produto',
    category: 'Produtos',
    photo: '/labinovacaotis-react/agents/esperanca.png',
    avatarBg: 'linear-gradient(135deg, #FF0066, #87007F)',
    color: '#FF0066',
    rarity: RARITY.epico,
    type: 'CRIATIVO',
    skills: ['Descoberta de Produto', 'Definição de MVP', 'Mapeamento de Histórias', 'Estratégia de Mercado'],
    stats: [
      { label: 'Descoberta de Produto',   value: 96 },
      { label: 'Definição de MVP',        value: 93 },
      { label: 'Mapeamento de Histórias', value: 88 },
      { label: 'Estratégia de Mercado',   value: 85 },
    ],
    superPower: 'Product Vision',
    bio: 'Converte ideias brutas em produtos com proposta de valor irresistível.',
  },
  {
    name: 'Domingas Tchikota',
    agentLabel: 'Agente CX',
    specialty: 'Experiência do Cliente',
    category: 'CX',
    photo: '/labinovacaotis-react/agents/domingas.png',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #036ef2)',
    color: '#06b6d4',
    rarity: RARITY.raro,
    type: 'EMPÁTICO',
    skills: ['Mapeamento da Jornada', 'NPS & Voz do Cliente', 'Planta de Serviço', 'Design de Personas'],
    stats: [
      { label: 'Mapeamento da Jornada',  value: 97 },
      { label: 'NPS & Voz do Cliente',   value: 93 },
      { label: 'Planta de Serviço',      value: 90 },
      { label: 'Design de Personas',     value: 88 },
    ],
    superPower: 'Empathy Engine',
    bio: 'Lê o cliente melhor do que ele se lê a si mesmo.',
  },
  {
    name: 'Jacinto Bumba',
    agentLabel: 'Agente RH',
    specialty: 'Cultura & Pessoas',
    category: 'Pessoas',
    photo: '/labinovacaotis-react/agents/jacinto.png',
    avatarBg: 'linear-gradient(135deg, #9437FF, #9437ff)',
    color: '#9437FF',
    rarity: RARITY.raro,
    type: 'HUMANISTA',
    skills: ['Coaching de OKRs', 'Cultura Organizacional', 'Estratégia L&D', 'Design de Engagement'],
    stats: [
      { label: 'Cultura Organizacional', value: 95 },
      { label: 'Coaching de OKRs',       value: 92 },
      { label: 'Design de Engagement',   value: 90 },
      { label: 'Estratégia L&D',         value: 88 },
    ],
    superPower: 'Culture Architect',
    bio: 'Constrói equipas que querem vir trabalhar de manhã.',
  },
  {
    name: 'Maria Nzinga',
    agentLabel: 'Agente Tech',
    specialty: 'Tecnologia & Digital',
    category: 'Tecnologia',
    photo: '/labinovacaotis-react/agents/maria.png',
    avatarBg: 'linear-gradient(135deg, #036ef2, #3126b4)',
    color: '#036ef2',
    rarity: RARITY.epico,
    type: 'TÉCNICO',
    skills: ['Arquitectura Cloud', 'API & Integrações', 'Implementação AI/ML', 'Cibersegurança'],
    stats: [
      { label: 'API & Integrações',   value: 96 },
      { label: 'Arquitectura Cloud',  value: 95 },
      { label: 'Implementação AI/ML', value: 92 },
      { label: 'Cibersegurança',      value: 88 },
    ],
    superPower: 'System Architect',
    bio: 'Transforma visões de negócio em arquitecturas técnicas sólidas.',
  },
  {
    name: 'Ernesto Quiala',
    agentLabel: 'Agente Gestão',
    specialty: 'CX & Inovação',
    category: 'Gestão',
    photo: '/labinovacaotis-react/agents/ernesto.png',
    avatarBg: 'linear-gradient(135deg, #87007f, #036ef2)',
    color: '#c084fc',
    rarity: RARITY.lendario,
    type: 'GENERALISTA',
    skills: ['Facilitação Criativa', 'Pensamento Sistémico', 'Inovação Transversal'],
    stats: [
      { label: 'Facilitação Criativa',   value: 97 },
      { label: 'Reframing Estratégico',  value: 93 },
      { label: 'Pensamento Sistémico',   value: 90 },
      { label: 'Inovação Transversal',   value: 96 },
    ],
    superPower: 'Creative Chaos',
    bio: 'Especialista em CX e Inovação. Aborda desafios transversais com criatividade e sem fronteiras disciplinares.',
  },
];

type Agent = typeof agents[0];

/* ── Barra de stat animada ── */
function StatBar({ label, value, color, delay }: {
  label: string; value: number; color: string; delay: number;
}) {
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: 9, marginBottom: 3,
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.45)',
      }}>
        <span>{label}</span>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>{value}</span>
      </div>
      <div style={{
        height: 4, background: 'rgba(255,255,255,0.08)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}70`,
          }}
        />
      </div>
    </div>
  );
}

/* ── Card holográfico ── */
function HoloCard({ agent, index }: { agent: Agent; index: number }) {
  const navigate = useNavigate();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [holoPos, setHoloPos] = useState({ x: 50, y: 50 });
  const [flipped, setFlipped] = useState(false);

  const r = agent.rarity;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -20, y: (x - 0.5) * 20 });
    setHoloPos({ x: x * 100, y: y * 100 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
    setHoloPos({ x: 50, y: 50 });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '1200px', cursor: 'pointer' }}
      onClick={() => setFlipped(v => !v)}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        animate={{
          rotateX: flipped ? 0 : tilt.x,
          rotateY: flipped ? 180 : tilt.y,
          scale: hovered && !flipped ? 1.05 : 1,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{
          width: '100%',
          height: 480,
          transformStyle: 'preserve-3d',
          position: 'relative',
          borderRadius: 20,
          boxShadow: hovered
            ? `0 24px 64px ${r.glow}, 0 0 0 1.5px ${r.color}70`
            : `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)`,
          transition: 'box-shadow 0.3s',
        }}
      >

        {/* ══════ FRENTE ══════ */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: 20, overflow: 'hidden',
          background: `linear-gradient(165deg, #0d1640 0%, #080f2e 55%, ${agent.color}14 100%)`,
          border: `1.5px solid ${agent.color}28`,
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Faixa superior */}
          <div style={{
            height: 5,
            background: `linear-gradient(90deg, ${agent.color}, ${r.color})`,
            flexShrink: 0,
          }} />

          {/* Efeito holográfico (hover) */}
          {hovered && !flipped && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              pointerEvents: 'none', borderRadius: 20,
              background: `
                radial-gradient(circle at ${holoPos.x}% ${holoPos.y}%, rgba(255,255,255,0.18) 0%, transparent 52%),
                linear-gradient(${holoPos.x * 3.6}deg,
                  rgba(6,182,212,0.22) 0%,
                  rgba(236,72,153,0.22) 25%,
                  rgba(59,130,246,0.22) 55%,
                  rgba(168,85,247,0.22) 80%,
                  rgba(6,182,212,0.22) 100%)
              `,
              mixBlendMode: 'screen',
            }} />
          )}

          {/* Badge tipo */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '10px 14px 0', flexShrink: 0,
          }}>
            <div style={{
              background: `${agent.color}1e`,
              border: `1px solid ${agent.color}40`,
              borderRadius: 7, padding: '3px 10px',
              fontSize: 8, fontWeight: 700,
              color: agent.color, fontFamily: 'var(--font-mono)',
              letterSpacing: 1,
            }}>
              {agent.type}
            </div>
          </div>

          {/* Foto */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            paddingTop: 14, paddingBottom: 2, flexShrink: 0,
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -7, borderRadius: '50%',
                background: `radial-gradient(circle, ${agent.color}35 0%, transparent 68%)`,
              }} />
              <img
                src={agent.photo}
                alt={agent.name}
                style={{
                  width: 100, height: 100,
                  borderRadius: '50%', objectFit: 'cover',
                  objectPosition: 'top',
                  border: `2.5px solid ${agent.color}65`,
                  boxShadow: `0 0 22px ${agent.color}45`,
                  display: 'block', position: 'relative', zIndex: 1,
                }}
              />
              <div style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 13, height: 13, borderRadius: '50%',
                background: '#22c55e',
                border: '2px solid #0d1640', zIndex: 2,
              }} />
            </div>
          </div>

          {/* Nome + título */}
          <div style={{ textAlign: 'center', padding: '8px 16px 10px', flexShrink: 0 }}>
            <div style={{
              fontSize: 16, fontWeight: 900, color: '#fff',
              fontFamily: 'var(--font-outfit)', letterSpacing: -0.3,
              marginBottom: 5,
            }}>
              {agent.name}
            </div>
            <div style={{
              display: 'inline-flex', flexDirection: 'column',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${agent.color}20, ${r.color}15)`,
              border: `1.5px solid ${agent.color}45`,
              borderRadius: 10, padding: '6px 16px',
              marginBottom: 6,
            }}>
              <span style={{
                fontSize: 11, fontWeight: 800,
                color: agent.color, fontFamily: 'var(--font-outfit)',
                letterSpacing: 0.2,
              }}>
                {agent.agentLabel}
              </span>
              <span style={{
                fontSize: 9, color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-mono)', marginTop: 1,
              }}>
                {agent.specialty}
              </span>
            </div>
          </div>

          {/* Divisor */}
          <div style={{
            height: 1, margin: '0 16px 10px',
            background: `linear-gradient(90deg, transparent, ${agent.color}35, transparent)`,
            flexShrink: 0,
          }} />

          {/* Stats */}
          <div style={{ padding: '0 16px', flex: 1 }}>
            {agent.stats.map((s, i) => (
              <StatBar key={s.label} label={s.label} value={s.value}
                color={agent.color} delay={0.25 + i * 0.07} />
            ))}
          </div>

          {/* Super Poder */}
          <div style={{
            margin: '10px 16px 8px',
            background: `${agent.color}12`,
            border: `1px solid ${agent.color}30`,
            borderRadius: 8, padding: '7px 12px',
            fontSize: 10, color: agent.color,
            fontFamily: 'var(--font-mono)',
            textAlign: 'center', fontWeight: 700,
            flexShrink: 0,
          }}>
            ⚡ Super Poder: {agent.superPower}
          </div>

          <div style={{
            textAlign: 'center', fontSize: 9,
            color: 'rgba(255,255,255,0.18)',
            fontFamily: 'var(--font-mono)',
            paddingBottom: 10, flexShrink: 0,
          }}>
            clica para virar
          </div>
        </div>

        {/* ══════ VERSO ══════ */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 20, overflow: 'hidden',
          background: `linear-gradient(160deg, #0d1640 0%, ${agent.color}25 100%)`,
          border: `1.5px solid ${agent.color}45`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '28px 24px', gap: 0,
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 5,
            background: `linear-gradient(90deg, ${r.color}, ${agent.color})`,
          }} />

          <img
            src={agent.photo}
            alt={agent.name}
            style={{
              width: 76, height: 76, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: `3px solid ${agent.color}75`,
              boxShadow: `0 0 28px ${agent.color}55`,
              marginBottom: 12,
              display: 'block', flexShrink: 0,
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{
              fontSize: 20, fontWeight: 900, color: '#fff',
              fontFamily: 'var(--font-outfit)', marginBottom: 6,
            }}>
              {agent.name}
            </div>
            <div style={{
              display: 'inline-flex', flexDirection: 'column',
              alignItems: 'center',
              background: `${agent.color}18`,
              border: `1.5px solid ${agent.color}45`,
              borderRadius: 10, padding: '5px 18px',
            }}>
              <span style={{
                fontSize: 12, fontWeight: 800,
                color: agent.color, fontFamily: 'var(--font-outfit)',
              }}>
                {agent.agentLabel}
              </span>
              <span style={{
                fontSize: 9, color: 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-mono)', marginTop: 1,
              }}>
                {agent.specialty}
              </span>
            </div>
          </div>

          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${agent.color}25`,
            borderRadius: 10, padding: '11px 14px',
            fontSize: 12, color: 'rgba(255,255,255,0.65)',
            textAlign: 'center', lineHeight: 1.65,
            marginBottom: 14,
          }}>
            {agent.bio}
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            justifyContent: 'center', marginBottom: 18,
          }}>
            {agent.skills.map(s => (
              <span key={s} style={{
                background: `${agent.color}18`,
                border: `1px solid ${agent.color}35`,
                color: agent.color,
                fontSize: 10, padding: '4px 11px',
                borderRadius: 20, fontFamily: 'var(--font-mono)',
                fontWeight: 600,
              }}>
                {s}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigate('/criar'); }}
            style={{
              width: '100%', padding: '13px',
              background: `linear-gradient(135deg, ${agent.color}, ${r.color})`,
              border: 'none', borderRadius: 12,
              cursor: 'pointer', color: '#fff',
              fontWeight: 800, fontSize: 14,
              fontFamily: 'var(--font-outfit)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 7,
              boxShadow: `0 4px 20px ${agent.color}45`,
              letterSpacing: 0.3,
            }}
          >
            Iniciar com {agent.name.split(' ')[0]}
            <ArrowRight size={14} />
          </button>

          <div style={{
            marginTop: 10, fontSize: 9,
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'var(--font-mono)',
          }}>
            clica para virar
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Página principal ── */
const categoryFilters = [
  { key: null,         label: 'Todos',      dot: null },
  { key: 'Processos',  label: 'Processos',  dot: '#4294F8' },
  { key: 'Produtos',   label: 'Produtos',   dot: '#FF0066' },
  { key: 'CX',         label: 'CX',         dot: '#06b6d4' },
  { key: 'Pessoas',    label: 'Pessoas',    dot: '#9437FF' },
  { key: 'Tecnologia', label: 'Tecnologia', dot: '#036ef2' },
  { key: 'Gestão',     label: 'Gestão',     dot: '#c084fc' },
];

export default function AgentsPage() {
  const [filter, setFilter] = useState<string | null>(null);

  const displayed = filter
    ? agents.filter(a => a.category === filter)
    : agents;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 70% 30%, #0f2258 0%, #090e2a 45%, #050816 100%)',
      paddingTop: '62px',
    }}>

      {/* ── Cabeçalho ── */}
      <div style={{ textAlign: 'center', padding: '36px 40px 28px' }}>
        <h1 style={{
          fontSize: 32, fontWeight: 900, letterSpacing: -1,
          color: '#fff', marginBottom: 10,
          fontFamily: 'var(--font-outfit)',
          textShadow: '0 0 48px rgba(66,148,248,0.35)',
        }}>
          Agentes IA do Laboratório de Inovação TIS
        </h1>
        <p style={{
          fontSize: 14, color: 'rgba(200,220,255,0.4)',
          maxWidth: 420, margin: '0 auto 28px',
          lineHeight: 1.6, fontFamily: 'var(--font-mono)',
        }}>
          Clica para virar a carta
        </p>

        {/* Filtro de categoria */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {categoryFilters.map(f => (
            <button
              key={String(f.key)}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '7px 20px', borderRadius: 22,
                border: `1.5px solid ${filter === f.key
                  ? 'rgba(255,255,255,0.45)'
                  : 'rgba(255,255,255,0.1)'}`,
                background: filter === f.key
                  ? 'rgba(255,255,255,0.12)'
                  : 'transparent',
                color: filter === f.key ? '#fff' : 'rgba(255,255,255,0.38)',
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.18s',
                fontFamily: 'var(--font-outfit)',
                display: 'flex', alignItems: 'center', gap: 7,
              }}
            >
              {f.dot && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: f.dot, flexShrink: 0,
                  boxShadow: filter === f.key ? `0 0 6px ${f.dot}` : 'none',
                  display: 'inline-block',
                }} />
              )}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid de cartas ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24, padding: '8px 52px 60px',
        maxWidth: 1160, margin: '0 auto',
      }}>
        <AnimatePresence mode="popLayout">
          {displayed.map((agent, i) => (
            <motion.div key={agent.name} layout exit={{ opacity: 0, scale: 0.9 }}>
              <HoloCard agent={agent} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Users, Zap, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

const agents = [
  {
    name: 'Leonardo Silva',
    title: 'agente_pmo · melhoria_processo',
    specialty: 'Melhoria de Processo',
    avatar: '⬡',
    photo: 'https://i.pravatar.cc/150?img=12',
    avatarBg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    color: '#4294F8',
    accentLight: 'rgba(66,148,248,0.1)',
    bio: 'Especialista em gestão de projectos e optimização de processos. Analisa problemas operacionais com rigor metodológico e ajuda a estruturar propostas com métricas claras.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    activityFeed: [
      'A analisar fluxos de aprovação no processo de onboarding…',
      'Identificou 3 bottlenecks críticos no pipeline de vendas.',
      'Gerou relatório de métricas para Q3 — 12 KPIs definidos.',
      'Propôs automação RPA para tarefas repetitivas de faturação.',
      'Mapeou processo AS-IS para a equipa de operações.',
    ],
    sessionsToday: 47,
    avgResponse: '1.2s',
    satisfaction: 98,
  },
  {
    name: 'Ana Costa',
    title: 'agente_produto · novo_produto',
    specialty: 'Novo Produto',
    avatar: '⚡',
    photo: 'https://i.pravatar.cc/150?img=47',
    avatarBg: 'linear-gradient(135deg, #FF0066, #87007F)',
    color: '#FF0066',
    accentLight: 'rgba(255,0,102,0.1)',
    bio: 'Product manager com mindset de startup. Faz as perguntas certas para transformar uma ideia bruta num conceito de produto com proposta de valor clara.',
    skills: ['Design Thinking', 'MVP', 'User Research'],
    activityFeed: [
      'Estruturou canvas de proposta de valor para novo serviço.',
      'Definiu user stories para MVP de plataforma de reservas.',
      'Conduzindo sessão de discovery com equipa de produto.',
      'Análise de mercado concluída — 5 concorrentes mapeados.',
      'Criou roadmap prioritizado para os próximos 3 sprints.',
    ],
    sessionsToday: 63,
    avgResponse: '0.9s',
    satisfaction: 97,
  },
  {
    name: 'Mariana Ramos',
    title: 'agente_cx · experiência_cliente',
    specialty: 'Experiência do Cliente',
    avatar: '◉',
    photo: 'https://i.pravatar.cc/150?img=36',
    avatarBg: 'linear-gradient(135deg, #4294F8, #15803d)',
    color: '#0891b2',
    accentLight: 'rgba(8,145,178,0.1)',
    bio: 'Especialista em CX e service design. Analisa a jornada do cliente com empatia e dados, transformando fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    activityFeed: [
      'Mapeou jornada de cliente para o canal digital.',
      'NPS score analisado — oportunidade de melhoria no onboarding.',
      'Criou 3 personas detalhadas para segmento SME.',
      'Identificou momento crítico de abandono no funil.',
      'Workshop de service design agendado para sexta-feira.',
    ],
    sessionsToday: 38,
    avgResponse: '1.1s',
    satisfaction: 96,
  },
  {
    name: 'Carlos Mendes',
    title: 'agente_rh · cultura_pessoas',
    specialty: 'Cultura & Pessoas',
    avatar: '◎',
    photo: 'https://i.pravatar.cc/150?img=53',
    avatarBg: 'linear-gradient(135deg, #9437FF, #b45309)',
    color: '#9437FF',
    accentLight: 'rgba(148,55,255,0.1)',
    bio: 'People & culture specialist. Ajuda a pensar em iniciativas que criam ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    activityFeed: [
      'Definiu OKRs de cultura para o segundo semestre.',
      'Estruturou programa de onboarding para novos talentos.',
      'Análise de engagement — áreas de melhoria identificadas.',
      'Proposta de L&D para competências digitais em revisão.',
      'Reunião de alinhamento com liderança concluída.',
    ],
    sessionsToday: 29,
    avgResponse: '1.4s',
    satisfaction: 95,
  },
  {
    name: 'Sofia Neves',
    title: 'agente_tech · tecnologia_digital',
    specialty: 'Tecnologia & Digital',
    avatar: '◈',
    photo: 'https://i.pravatar.cc/150?img=25',
    avatarBg: 'linear-gradient(135deg, #036ef2, #3126b4)',
    color: '#036ef2',
    accentLight: 'rgba(3,110,242,0.1)',
    bio: 'Tech lead e arquitecta de soluções digitais. Define o âmbito técnico com clareza — viabilidade, integrações, escalabilidade, segurança.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    activityFeed: [
      'Arquitectura cloud-native desenhada para plataforma de dados.',
      'Avaliação de segurança concluída — 2 vulnerabilidades corrigidas.',
      'Integração com sistema ERP mapeada e documentada.',
      'Proposta de stack tecnológica para novo serviço em revisão.',
      'Análise de viabilidade de IA para automatização de relatórios.',
    ],
    sessionsToday: 55,
    avgResponse: '0.8s',
    satisfaction: 99,
  },
  {
    name: 'Rui Ferreira',
    title: 'agente_geral · outros',
    specialty: 'Generalista',
    avatar: '✦',
    photo: 'https://i.pravatar.cc/150?img=8',
    avatarBg: 'linear-gradient(135deg, #87007f, #15803d)',
    color: '#87007f',
    accentLight: 'rgba(135,0,127,0.1)',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda o problema com curiosidade e sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    activityFeed: [
      'Facilitou sessão de brainstorming com 4 áreas distintas.',
      'Explorou 7 ângulos alternativos para desafio de distribuição.',
      'Mapa mental gerado para iniciativa de sustentabilidade.',
      'Conectou padrões de sectores diferentes para solução inovadora.',
      'Desafios cruzados identificados entre equipas de produto e tech.',
    ],
    sessionsToday: 41,
    avgResponse: '1.0s',
    satisfaction: 97,
  },
];

type Agent = typeof agents[0];

function MiniSparkline({ color }: { color: string }) {
  const heights = useRef(
    Array.from({ length: 14 }, () => Math.random() * 100)
  );
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 22 }}>
      {heights.current.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: `${20 + h * 0.7}%`,
            background: color,
            borderRadius: 2,
            opacity: 0.5 + (i / heights.current.length) * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function LiveFeed({ agent }: { agent: Agent }) {
  const [messages, setMessages] = useState<string[]>([agent.activityFeed[0]]);
  const feedIdx = useRef(1);

  useEffect(() => {
    setMessages([agent.activityFeed[0]]);
    feedIdx.current = 1;
    const interval = setInterval(() => {
      const next = agent.activityFeed[feedIdx.current % agent.activityFeed.length];
      setMessages((prev) => [next, ...prev].slice(0, 5));
      feedIdx.current++;
    }, 2800);
    return () => clearInterval(interval);
  }, [agent.name]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => (
          <motion.div
            key={msg + i}
            initial={{ opacity: 0, x: -12, height: 0 }}
            animate={{ opacity: 1 - i * 0.18, x: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 14px',
              background: i === 0 ? agent.accentLight : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === 0 ? agent.color + '30' : 'rgba(30,50,140,0.08)'}`,
              borderRadius: 10,
              fontSize: 12,
              color: i === 0 ? 'var(--text)' : 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === 0 ? agent.color : 'var(--border2)',
                flexShrink: 0,
                marginTop: 4,
                animation: i === 0 ? 'feedPulse 2s infinite' : undefined,
              }}
            />
            {msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AgentsPageV4() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Agent>(agents[0]);
  const [multiSelected, setMultiSelected] = useState<Set<string>>(new Set());
  const [multiMode, setMultiMode] = useState(false);

  const totalSessions = agents.reduce((s, a) => s + a.sessionsToday, 0);

  function toggleMulti(agentName: string) {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(agentName)) next.delete(agentName);
      else next.add(agentName);
      return next;
    });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingTop: '62px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top stats bar */}
      <div
        style={{
          background: 'var(--surface)',
          borderBottom: '1.5px solid var(--border-light)',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} style={{ color: 'var(--blue)' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            CENTRO DE OPERAÇÕES
          </span>
        </div>
        <div style={{ width: 1, height: 20, background: 'var(--border-light)' }} />
        <StatPill icon={<MessageSquare size={11} />} label={`${totalSessions} sessões hoje`} color="var(--blue)" />
        <StatPill icon={<Users size={11} />} label="6 agentes online" color="var(--green)" />
        <StatPill icon={<Zap size={11} />} label="Resposta média 1.1s" color="#b45309" />
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={() => {
              setMultiMode((v) => !v);
              setMultiSelected(new Set());
            }}
            style={{
              padding: '6px 14px',
              background: multiMode ? 'var(--blue)' : 'transparent',
              border: `1.5px solid ${multiMode ? 'var(--blue)' : 'var(--border2)'}`,
              borderRadius: 20,
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: multiMode ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >
            {multiMode ? '✓ multi-agente ativo' : 'selecção múltipla'}
          </button>
        </div>
      </div>

      {/* Main body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar — agent list */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            borderRight: '1.5px solid var(--border-light)',
            background: 'var(--surface)',
            overflowY: 'auto',
            padding: '12px 0',
          }}
        >
          <div
            style={{
              padding: '4px 18px 12px',
              fontSize: 9,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-sub)',
              letterSpacing: 1,
            }}
          >
            AGENTES DISPONÍVEIS
          </div>
          {agents.map((agent) => {
            const isActive = !multiMode && selected.name === agent.name;
            const isChecked = multiMode && multiSelected.has(agent.name);
            return (
              <motion.div
                key={agent.name}
                onClick={() => {
                  if (multiMode) {
                    toggleMulti(agent.name);
                  } else {
                    setSelected(agent);
                  }
                }}
                whileHover={{ x: 2 }}
                style={{
                  padding: '12px 18px',
                  cursor: 'pointer',
                  background: isActive || isChecked ? agent.accentLight : 'transparent',
                  borderLeft: `3px solid ${isActive || isChecked ? agent.color : 'transparent'}`,
                  transition: 'background 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {multiMode && (
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 4,
                        border: `2px solid ${isChecked ? agent.color : 'var(--border2)'}`,
                        background: isChecked ? agent.color : 'transparent',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isChecked && <CheckCircle2 size={10} color="#fff" />}
                    </div>
                  )}
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    style={{
                      width: 36, height: 36, borderRadius: 9,
                      objectFit: 'cover', flexShrink: 0,
                      border: `2px solid ${isActive || isChecked ? agent.color + '50' : 'transparent'}`,
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: isActive || isChecked ? 'var(--text)' : 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {agent.name}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--text-sub)',
                        fontFamily: 'var(--font-mono)',
                        marginTop: 1,
                      }}
                    >
                      {agent.specialty}
                    </div>
                  </div>
                </div>
                {/* Sparkline + sessions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: multiMode ? 26 : 0 }}>
                  <MiniSparkline color={agent.color} />
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-sub)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {agent.sessionsToday} sessões
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right detail panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px' }}>
          <AnimatePresence mode="wait">
            {multiMode && multiSelected.size > 0 ? (
              <motion.div
                key="multi"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <div style={{ marginBottom: 28 }}>
                  <h2
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: 'var(--text)',
                      marginBottom: 6,
                    }}
                  >
                    Brainstorming colaborativo
                  </h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {multiSelected.size} agente{multiSelected.size > 1 ? 's' : ''} seleccionado{multiSelected.size > 1 ? 's' : ''}. Cada um contribui com a sua perspectiva especializada.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
                  {agents
                    .filter((a) => multiSelected.has(a.name))
                    .map((a) => (
                      <div
                        key={a.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 16px',
                          background: a.accentLight,
                          border: `1.5px solid ${a.color}40`,
                          borderRadius: 12,
                        }}
                      >
                        <img
                          src={a.photo}
                          alt={a.name}
                          style={{
                            width: 34, height: 34, borderRadius: 8,
                            objectFit: 'cover',
                            border: `1.5px solid ${a.color}40`,
                          }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                            {a.name.split(' ')[0]}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: a.color,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {a.specialty}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => navigate('/criar')}
                  style={{
                    padding: '14px 32px',
                    background: 'var(--blue)',
                    border: 'none',
                    borderRadius: 10,
                    cursor: 'pointer',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: 'var(--font-outfit)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 20px rgba(3,110,242,0.3)',
                  }}
                >
                  Iniciar sessão com {multiSelected.size} agentes <ArrowRight size={15} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={selected.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Agent header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={selected.photo}
                      alt={selected.name}
                      style={{
                        width: 72, height: 72, borderRadius: 18,
                        objectFit: 'cover',
                        border: `2.5px solid ${selected.color}40`,
                        boxShadow: `0 4px 24px ${selected.color}35`,
                      }}
                    />
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#22c55e', border: '2.5px solid var(--bg)',
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 2 }}>
                      <h1
                        style={{
                          fontSize: 26,
                          fontWeight: 800,
                          color: 'var(--text)',
                          letterSpacing: -0.5,
                        }}
                      >
                        {selected.name}
                      </h1>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 10,
                          color: 'var(--green)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--green)',
                            animation: 'feedPulse 2s infinite',
                            display: 'inline-block',
                          }}
                        />
                        online agora
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: 'var(--text-sub)',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 10,
                      }}
                    >
                      {selected.title}
                    </div>
                    {/* Mini stats */}
                    <div style={{ display: 'flex', gap: 20 }}>
                      <MiniStat value={`${selected.sessionsToday}`} label="sessões hoje" color={selected.color} />
                      <MiniStat value={selected.avgResponse} label="resp. média" color={selected.color} />
                      <MiniStat value={`${selected.satisfaction}%`} label="satisfação" color={selected.color} />
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/criar')}
                    style={{
                      padding: '12px 22px',
                      background: selected.color,
                      border: 'none',
                      borderRadius: 10,
                      cursor: 'pointer',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      fontFamily: 'var(--font-outfit)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: `0 4px 16px ${selected.color}40`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Iniciar brainstorming <ArrowRight size={13} />
                  </button>
                </div>

                <div
                  style={{
                    height: 1,
                    background: 'var(--border-light)',
                    marginBottom: 24,
                  }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left: bio + skills */}
                  <div>
                    <SectionLabel>Sobre o agente</SectionLabel>
                    <p
                      style={{
                        fontSize: 13,
                        color: 'var(--text-muted)',
                        lineHeight: 1.8,
                        marginBottom: 24,
                      }}
                    >
                      {selected.bio}
                    </p>

                    <SectionLabel>Especialidades</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selected.skills.map((s) => (
                        <span
                          key={s}
                          style={{
                            background: selected.accentLight,
                            border: `1.5px solid ${selected.color}35`,
                            color: selected.color,
                            fontSize: 11,
                            padding: '5px 13px',
                            borderRadius: 6,
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: live feed */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        marginBottom: 14,
                      }}
                    >
                      <SectionLabel style={{ marginBottom: 0 }}>Actividade em tempo real</SectionLabel>
                      <span
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: '#22c55e',
                          animation: 'feedPulse 1.5s infinite',
                          display: 'inline-block',
                        }}
                      />
                    </div>
                    <LiveFeed agent={selected} key={selected.name} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes feedPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}

function StatPill({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

function MiniStat({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: 'var(--font-outfit)' }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: 'var(--text-sub)', fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: 9,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-sub)',
        letterSpacing: 1,
        marginBottom: 10,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

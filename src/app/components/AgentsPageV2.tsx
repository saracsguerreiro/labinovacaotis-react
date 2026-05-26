import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

const agents = [
  {
    name: 'Leonardo Silva',
    title: 'agente_pmo · melhoria_processo',
    specialty: 'Melhoria de Processo',
    filter: 'PMO',
    photo: 'https://i.pravatar.cc/150?img=12',
    avatarBg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    color: '#3126b4',
    accentLight: '#eff4ff',
    bio: 'Especialista em gestão de projectos e optimização de processos. Analisa problemas operacionais com rigor metodológico e ajuda a estruturar propostas com métricas claras.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    chatPreview: [
      { from: 'user', text: 'Tenho um processo de aprovação que demora 2 semanas. Como posso reduzir para 3 dias?' },
      { from: 'agent', text: 'Boa questão. Vamos começar por mapear o processo actual — quantos intervenientes estão envolvidos e onde ficam os tempos mortos?' },
      { from: 'user', text: 'São 5 pessoas e a maioria do tempo perde-se em emails de ida e volta.' },
      { from: 'agent', text: 'Identificado. O principal bottleneck é a comunicação assíncrona. Proponho 3 acções: (1) definir um SLA por etapa, (2) centralizar aprovações numa plataforma única, (3) automatizar notificações com RPA. Queres que estruture isto num plano detalhado?' },
    ],
  },
  {
    name: 'Ana Costa',
    title: 'agente_produto · novo_produto',
    specialty: 'Novo Produto',
    filter: 'Produto',
    photo: 'https://i.pravatar.cc/150?img=47',
    avatarBg: 'linear-gradient(135deg, #FF0066, #87007F)',
    color: '#FF0066',
    accentLight: '#fdf2f8',
    bio: 'Product manager com mindset de startup. Faz as perguntas certas para transformar uma ideia bruta num conceito de produto com proposta de valor clara.',
    skills: ['Design Thinking', 'MVP', 'User Research'],
    chatPreview: [
      { from: 'user', text: 'Quero criar uma app para gestores de facilities. Não sei por onde começar.' },
      { from: 'agent', text: 'Perfeito ponto de partida! Antes do "como", precisamos do "quem" e do "porquê". Qual é o maior problema diário de um gestor de facilities que nenhuma solução actual resolve bem?' },
      { from: 'user', text: 'A comunicação com fornecedores é um caos. Perdem-se pedidos, não há rastreabilidade.' },
      { from: 'agent', text: 'Excelente. Tens uma dor real e específica. O MVP pode ser simples: um sistema de tickets com estados + notificações automáticas. Nada de AI nem dashboards complexos na v1 — queres que esboce o backlog mínimo?' },
    ],
  },
  {
    name: 'Mariana Ramos',
    title: 'agente_cx · experiência_cliente',
    specialty: 'Experiência do Cliente',
    filter: 'CX',
    photo: 'https://i.pravatar.cc/150?img=36',
    avatarBg: 'linear-gradient(135deg, #4294F8, #15803d)',
    color: '#0891b2',
    accentLight: '#ecfeff',
    bio: 'Especialista em CX e service design. Analisa a jornada do cliente com empatia e dados, transformando fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    chatPreview: [
      { from: 'user', text: 'O nosso NPS caiu 12 pontos no último trimestre. Não percebemos porquê.' },
      { from: 'agent', text: 'Queda de 12 pontos é significativa. Quando analisaste os comentários qualitativos dos detractores, há padrões temáticos recorrentes — atrasos, comunicação ou qualidade do produto?' },
      { from: 'user', text: 'Muitas queixas sobre demora na resposta do suporte.' },
      { from: 'agent', text: 'Claro — o suporte é muitas vezes o "momento da verdade" que define se o cliente fica ou sai. Vamos mapear esse touchpoint com detalhe. Qual é o tempo médio de resposta actual e qual é a expectativa do cliente?' },
    ],
  },
  {
    name: 'Carlos Mendes',
    title: 'agente_rh · cultura_pessoas',
    specialty: 'Cultura & Pessoas',
    filter: 'RH',
    photo: 'https://i.pravatar.cc/150?img=53',
    avatarBg: 'linear-gradient(135deg, #9437FF, #b45309)',
    color: '#9437FF',
    accentLight: '#e6dfff',
    bio: 'People & culture specialist. Ajuda a pensar em iniciativas que criam ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    chatPreview: [
      { from: 'user', text: 'A equipa está desmotivada depois da reestruturação. Como posso reconquistar o engagement?' },
      { from: 'agent', text: 'Reestruturações abalam sempre a confiança. A questão-chave é: as pessoas sentem que têm voz e que o futuro é claro? Que comunicação foi feita durante e após o processo?' },
      { from: 'user', text: 'Foram feitas reuniões gerais mas a equipa sente que não foram ouvidas.' },
      { from: 'agent', text: 'O problema é de participação, não de informação. Sugiro 3 coisas: (1) focus groups por equipa para ouvir activamente, (2) co-criar os novos OKRs com as pessoas, (3) celebrar pequenas vitórias visíveis. Queres que desenhe um plano de 90 dias?' },
    ],
  },
  {
    name: 'Sofia Neves',
    title: 'agente_tech · tecnologia_digital',
    specialty: 'Tecnologia & Digital',
    filter: 'Tech',
    photo: 'https://i.pravatar.cc/150?img=25',
    avatarBg: 'linear-gradient(135deg, #036ef2, #3126b4)',
    color: '#036ef2',
    accentLight: '#eff4ff',
    bio: 'Tech lead e arquitecta de soluções digitais. Define o âmbito técnico com clareza — viabilidade, integrações, escalabilidade, segurança.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    chatPreview: [
      { from: 'user', text: 'Queremos integrar IA generativa no nosso sistema de gestão documental. Por onde começamos?' },
      { from: 'agent', text: 'Antes de escolher tecnologia, preciso de perceber o contexto: os documentos são sensíveis (dados pessoais, contratos)? Qual é o volume mensal e que formato dominante — PDFs, Word, imagens?' },
      { from: 'user', text: 'São contratos em PDF, muito sensíveis, cerca de 500 por mês.' },
      { from: 'agent', text: 'Atenção redobrada então. Com dados sensíveis, recomendo um LLM on-premise ou Azure OpenAI com data boundary EU. RAG sobre os documentos com chunking semântico. Custo estimado: 200-400€/mês. Queres que esboce a arquitectura?' },
    ],
  },
  {
    name: 'Rui Ferreira',
    title: 'agente_geral · outros',
    specialty: 'Generalista',
    filter: 'Geral',
    photo: 'https://i.pravatar.cc/150?img=8',
    avatarBg: 'linear-gradient(135deg, #87007f, #15803d)',
    color: '#87007f',
    accentLight: '#f4ecff',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda o problema com curiosidade e sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    chatPreview: [
      { from: 'user', text: 'Tenho uma ideia mas não sei bem em que área encaixa. É sobre sustentabilidade e tecnologia.' },
      { from: 'agent', text: 'Adoro este tipo de desafios! Sem caixas pré-definidas. Conta-me a ideia como se fosse a um amigo curioso — sem jargão, sem estrutura. Qual é o problema do mundo real que queres resolver?' },
      { from: 'user', text: 'As empresas não sabem o impacto real das suas decisões de compra na pegada carbónica.' },
      { from: 'agent', text: 'Isso é uma oportunidade enorme. Estás na intersecção de ESG, procurement e AI. Posso ver isto como um produto SaaS, um serviço de consultoria ou até uma API para integrar em sistemas de ERP. Qual ressoa mais contigo?' },
    ],
  },
];

type Agent = typeof agents[0];

const filters = ['Todos', 'PMO', 'Produto', 'CX', 'RH', 'Tech', 'Geral'];

function TypingDots({ color }: { color: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: color,
            opacity: 0.6,
            animation: `typingDot 1.2s ${i * 0.2}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

function ChatModal({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(1);
  const [showTyping, setShowTyping] = useState(false);

  // Reveal messages one by one
  useState(() => {
    let idx = 1;
    function next() {
      if (idx >= agent.chatPreview.length) return;
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setVisibleCount(idx + 1);
        idx++;
        if (idx < agent.chatPreview.length) setTimeout(next, 900);
      }, 1100);
    }
    setTimeout(next, 700);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        background: 'rgba(10,15,40,0.55)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 560,
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(10,20,80,0.2)',
          border: '1.5px solid var(--border-light)',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1.5px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <img
            src={agent.photo}
            alt={agent.name}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${agent.color}40`,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>
              {agent.name}
            </div>
            <div
              style={{
                fontSize: 10, color: 'var(--text-sub)',
                fontFamily: 'var(--font-mono)', marginTop: 1,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--green)', display: 'inline-block',
                  animation: 'onlinePulse 2s infinite',
                }}
              />
              online agora · {agent.specialty}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border-light)',
              borderRadius: 8, padding: '6px',
              cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Chat messages */}
        <div
          style={{
            padding: '20px 22px',
            display: 'flex', flexDirection: 'column', gap: 12,
            minHeight: 280,
            background: 'var(--bg2)',
          }}
        >
          {agent.chatPreview.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                gap: 8,
                alignItems: 'flex-end',
              }}
            >
              {msg.from === 'agent' && (
                <img
                  src={agent.photo}
                  alt=""
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    objectFit: 'cover', flexShrink: 0,
                    border: `1.5px solid ${agent.color}40`,
                  }}
                />
              )}
              <div
                style={{
                  maxWidth: '78%',
                  padding: '10px 14px',
                  borderRadius: msg.from === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.from === 'user'
                    ? agent.color
                    : 'var(--surface)',
                  color: msg.from === 'user' ? '#fff' : 'var(--text)',
                  fontSize: 13,
                  lineHeight: 1.6,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  border: msg.from === 'agent'
                    ? '1px solid var(--border-light)'
                    : 'none',
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {showTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}
            >
              <img
                src={agent.photo}
                alt=""
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  objectFit: 'cover', flexShrink: 0,
                }}
              />
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px 16px 16px 4px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <TypingDots color={agent.color} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 22px',
            borderTop: '1.5px solid var(--border-light)',
            display: 'flex', gap: 10, alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
            {agent.skills.map((s) => (
              <span
                key={s}
                style={{
                  background: agent.accentLight,
                  color: agent.color,
                  fontSize: 10, padding: '3px 10px',
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
            onClick={() => navigate('/criar')}
            style={{
              padding: '10px 20px',
              background: agent.color,
              border: 'none', borderRadius: 10,
              cursor: 'pointer', color: '#fff',
              fontWeight: 700, fontSize: 13,
              fontFamily: 'var(--font-outfit)',
              display: 'flex', alignItems: 'center', gap: 6,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: `0 4px 14px ${agent.color}40`,
            }}
          >
            Iniciar <ArrowRight size={13} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AgentsPageV2() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [openAgent, setOpenAgent] = useState<Agent | null>(null);

  const filtered = activeFilter === 'Todos'
    ? agents
    : agents.filter((a) => a.filter === activeFilter);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        paddingTop: '62px',
      }}
    >
      {/* Hero */}
      <div
        style={{
          padding: '36px 40px 0',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--blue-light)',
            border: '1px solid rgba(3,110,242,0.18)',
            borderRadius: 20, padding: '5px 14px',
            fontSize: 11, color: 'var(--blue)',
            fontFamily: 'var(--font-mono)',
            marginBottom: 16,
          }}
        >
          <Sparkles size={11} />
          6 especialistas disponíveis agora
        </div>
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
            maxWidth: 480, margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          Conhece os especialistas que vão acompanhar o teu brainstorming.
          Clica num agente para ver uma conversa real.
        </p>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex', gap: 6, justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: 40,
          }}
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '7px 18px',
                borderRadius: 20,
                border: `1.5px solid ${activeFilter === f ? 'var(--blue)' : 'var(--border-light)'}`,
                background: activeFilter === f ? 'var(--blue)' : 'transparent',
                color: activeFilter === f ? '#fff' : 'var(--text-muted)',
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s',
                fontFamily: 'var(--font-outfit)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          padding: '0 40px 48px',
          maxWidth: 1160,
          margin: '0 auto',
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((agent, i) => (
            <motion.div
              key={agent.name}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              onClick={() => setOpenAgent(agent)}
              whileHover={{ y: -4 }}
              style={{
                background: 'var(--surface)',
                border: '1.5px solid var(--border-light)',
                borderRadius: 20,
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(30,50,140,0.05)',
                transition: 'box-shadow 0.2s',
              }}
            >
              {/* Photo banner */}
              <div
                style={{
                  height: 100,
                  background: agent.avatarBg,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '0 22px',
                }}
              >
                <img
                  src={agent.photo}
                  alt={agent.name}
                  style={{
                    width: 68, height: 68,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--surface)',
                    position: 'absolute',
                    bottom: -24,
                    left: 22,
                    boxShadow: `0 4px 16px ${agent.color}40`,
                  }}
                />
                {/* Online badge */}
                <div
                  style={{
                    position: 'absolute', bottom: -10, left: 64,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#22c55e',
                    border: '2.5px solid var(--surface)',
                  }}
                />
              </div>

              {/* Card body */}
              <div style={{ padding: '32px 22px 20px' }}>
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontWeight: 800, fontSize: 16,
                      color: 'var(--text)', marginBottom: 3,
                    }}
                  >
                    {agent.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10, color: 'var(--text-sub)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {agent.title}
                  </div>
                </div>

                {/* Specialty badge */}
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: agent.accentLight,
                    border: `1px solid ${agent.color}25`,
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 11, color: agent.color,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600, marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: agent.color,
                    }}
                  />
                  {agent.specialty}
                </div>

                <p
                  style={{
                    fontSize: 12, color: 'var(--text-muted)',
                    lineHeight: 1.7, marginBottom: 16,
                  }}
                >
                  {agent.bio}
                </p>

                {/* Skills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {agent.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: agent.accentLight,
                        color: agent.color,
                        fontSize: 10, padding: '3px 9px',
                        borderRadius: 4,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  style={{
                    width: '100%', padding: '10px',
                    background: 'transparent',
                    border: `1.5px solid var(--border2)`,
                    borderRadius: 10, cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: 12,
                    fontFamily: 'var(--font-outfit)',
                    fontWeight: 600,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 6,
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = agent.color;
                    (e.currentTarget as HTMLButtonElement).style.color = agent.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border2)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
                  }}
                >
                  <MessageCircle size={13} />
                  Ver conversa de exemplo
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Chat modal */}
      <AnimatePresence>
        {openAgent && (
          <ChatModal
            agent={openAgent}
            onClose={() => setOpenAgent(null)}
            key={openAgent.name}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes onlinePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

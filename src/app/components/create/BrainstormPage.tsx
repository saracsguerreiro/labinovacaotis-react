import { useState, useRef, useEffect } from 'react';
import StepBar from './StepBar';
import { useTheme } from '../../context/ThemeContext';

interface BrainstormPageProps {
  selectedCategory: string;
  onBack: () => void;
  onNextPage: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (v: boolean) => void;
}

/* agentKey identifica o agente que enviou a mensagem */
type Message = {
  type: 'ai' | 'user';
  text: string;
  chips?: string[];
  agentKey?: string;
};

/* ── Mapeamento completo de todos os agentes ── */
const AGENT_MAP: Record<string, {
  name: string; firstName: string; label: string; specialty: string;
  photo: string; color: string; gradFrom: string; gradTo: string; glowRgb: string;
  opening: string; openingChips: string[];
  followUps: { question: string; chips: string[] }[];
  perspectives: string[]; /* comentários quando é agente secundário */
}> = {
  'Melhoria de Processo': {
    name: 'Armindo Kapessa', firstName: 'Armindo',
    label: 'Agente PMO', specialty: 'melhoria_processo',
    photo: '/labinovacaotis-react/agents/armindo.png',
    color: '#4294F8', gradFrom: '#3126b4', gradTo: '#4294F8', glowRgb: '66,148,248',
    opening: 'Olá! Sou o <b>Armindo</b>, especialista em Melhoria de Processos.<br><br>Vamos estruturar a tua ideia. <b>Qual é o problema que queres resolver?</b>',
    openingChips: ['O processo é muito lento', 'Há muitos erros manuais', 'Falta visibilidade', 'O processo custa muito'],
    followUps: [
      { question: 'Qual é o impacto real desta ineficiência nos resultados ou na equipa?', chips: ['Atrasos em projectos', 'Custos elevados', 'Colaboradores desmotivados', 'Erros frequentes'] },
      { question: 'Que solução imaginarias? Mesmo que seja ainda uma ideia inicial.', chips: ['Automatizar o processo', 'Sistema de alertas', 'Redesenhar o fluxo', 'Integrar ferramentas'] },
      { question: 'Como medirias o sucesso desta melhoria ao fim de 6 meses?', chips: ['Redução de tempo', 'Menos erros', 'Satisfação da equipa', 'Poupança de custos'] },
    ],
    perspectives: [
      'Na perspectiva de processos: vale a pena mapear o fluxo actual antes de propor soluções — frequentemente o problema real está num passo diferente do esperado.',
      'Do ponto de vista PMO: o impacto operacional que describes tem normalmente um custo oculto significativo. Seria útil quantificá-lo.',
      'Em termos de implementação: soluções de processo têm mais sucesso quando envolvem as equipas afectadas desde o início.',
    ],
  },
  'Novo Produto': {
    name: 'Esperança Ngunga', firstName: 'Esperança',
    label: 'Agente Produto', specialty: 'novo_produto',
    photo: '/labinovacaotis-react/agents/esperanca.png',
    color: '#FF0066', gradFrom: '#FF0066', gradTo: '#87007F', glowRgb: '255,0,102',
    opening: 'Olá! Sou a <b>Esperança</b>, especialista em Desenvolvimento de Produto.<br><br>Vamos explorar a tua ideia. <b>Que necessidade ou problema dos clientes queres resolver?</b>',
    openingChips: ['Falta uma funcionalidade importante', 'O processo é demasiado complexo', 'Não há alternativa no mercado', 'A experiência é frustrante'],
    followUps: [
      { question: 'Quem é o utilizador principal desta solução?', chips: ['Cliente externo', 'Colaborador interno', 'Gestor de equipa', 'Parceiro externo'] },
      { question: 'O que diferencia esta solução do que já existe?', chips: ['Mais simples', 'Mais rápido', 'Integrado com sistemas actuais', 'Custo mais baixo'] },
      { question: 'Qual seria o indicador de sucesso ao fim de 6 meses?', chips: ['NPS mais alto', 'Mais utilizadores activos', 'Menos fricção', 'Receita gerada'] },
    ],
    perspectives: [
      'Da perspectiva de produto: antes de avançar para a solução, vale a pena validar se este problema é frequente o suficiente para justificar desenvolvimento.',
      'Em produto: a diferenciação que descreves é importante — o risco é a concorrência replicar rapidamente. Pensar em barreiras de adopção ajuda.',
      'Para o roadmap de produto: começa pelo MVP mínimo que valide o valor. Evita construir funcionalidades que os utilizadores ainda não pediram.',
    ],
  },
  'Experiência do Cliente': {
    name: 'Domingas Tchikota', firstName: 'Domingas',
    label: 'Agente CX', specialty: 'experiencia_cliente',
    photo: '/labinovacaotis-react/agents/domingas.png',
    color: '#00CFCF', gradFrom: '#4294F8', gradTo: '#00CFCF', glowRgb: '0,207,207',
    opening: 'Olá! Sou a <b>Domingas</b>, especialista em Experiência do Cliente.<br><br>Vamos começar. <b>Em que momento da jornada do cliente identificas o maior problema?</b>',
    openingChips: ['Pré-venda / descoberta', 'Processo de compra', 'Onboarding / activação', 'Suporte pós-venda'],
    followUps: [
      { question: 'Qual é a consequência mais visível deste problema para o cliente?', chips: ['Abandona o processo', 'Contacta o suporte', 'Fica insatisfeito', 'Não volta a comprar'] },
      { question: 'Que experiência ideal desejarias oferecer neste ponto?', chips: ['Processo sem fricção', 'Resposta imediata', 'Personalização', 'Proactividade'] },
      { question: 'Como medirias a melhoria da experiência?', chips: ['NPS / CSAT', 'Taxa de resolução', 'Tempo de resposta', 'Taxa de retenção'] },
    ],
    perspectives: [
      'Do ponto de vista CX: a fricção que descreves é muitas vezes o principal motivo de abandono silencioso — o cliente não reclama, simplesmente não volta.',
      'Em experiência do cliente: a solução ideal é aquela que o cliente não precisa de pensar — deve ser invisível e fluida.',
      'Para medir impacto CX: o NPS isolado não chega. Complementa com taxa de resolução no primeiro contacto e esforço do cliente (CES).',
    ],
  },
  'Cultura & Pessoas': {
    name: 'Jacinto Bumba', firstName: 'Jacinto',
    label: 'Agente RH', specialty: 'cultura_pessoas',
    photo: '/labinovacaotis-react/agents/jacinto.png',
    color: '#9437FF', gradFrom: '#9437FF', gradTo: '#3126b4', glowRgb: '148,55,255',
    opening: 'Olá! Sou o <b>Jacinto</b>, especialista em Cultura & Pessoas.<br><br>Vamos trabalhar a tua ideia. <b>Qual é o desafio de pessoas ou cultura que identificas?</b>',
    openingChips: ['Falta de reconhecimento', 'Comunicação interna fraca', 'Pouco desenvolvimento', 'Bem-estar em risco'],
    followUps: [
      { question: 'Quem é mais afectado por este desafio na organização?', chips: ['Toda a equipa', 'Líderes de equipa', 'Novos colaboradores', 'Equipas remotas'] },
      { question: 'Que iniciativa ou solução poderia fazer a diferença?', chips: ['Programa de reconhecimento', 'Formação e coaching', 'Ritual de equipa', 'Ferramenta de comunicação'] },
      { question: 'Como saberias que a cultura melhorou ao fim de 6 meses?', chips: ['eNPS mais alto', 'Menos rotatividade', 'Mais participação', 'Feedback positivo'] },
    ],
    perspectives: [
      'Na perspectiva de pessoas: mudanças culturais levam tempo e resistência é natural. O mais importante é garantir que a liderança modela o comportamento pretendido.',
      'Do ponto de vista RH: o reconhecimento entre pares tem mais impacto sustentado do que o reconhecimento top-down. Vale a pena considerar.',
      'Em cultura organizacional: o maior risco é lançar uma iniciativa sem follow-through. Menos iniciativas, melhor executadas, têm mais impacto.',
    ],
  },
  'Tecnologia & Digital': {
    name: 'Maria Nzinga', firstName: 'Maria',
    label: 'Agente Tech', specialty: 'tecnologia_digital',
    photo: '/labinovacaotis-react/agents/maria.png',
    color: '#036ef2', gradFrom: '#036ef2', gradTo: '#3126b4', glowRgb: '3,110,242',
    opening: 'Olá! Sou a <b>Maria</b>, especialista em Tecnologia & Digital.<br><br>Vamos explorar a tua ideia. <b>Que lacuna tecnológica ou digital identificas?</b>',
    openingChips: ['Processo ainda manual', 'Dados dispersos ou inacessíveis', 'Falta de automação', 'Sistemas não integrados'],
    followUps: [
      { question: 'Qual é o impacto desta lacuna nos resultados ou na equipa?', chips: ['Perda de tempo', 'Decisões lentas', 'Erros de dados', 'Custos elevados'] },
      { question: 'Que solução tecnológica imaginas?', chips: ['Automatizar com RPA', 'Dashboard de dados', 'API de integração', 'Solução com IA'] },
      { question: 'O que medirias para validar que a solução funciona?', chips: ['Tempo poupado', 'Qualidade dos dados', 'Adopção pelos utilizadores', 'ROI estimado'] },
    ],
    perspectives: [
      'Do ponto de vista técnico: antes de construir, vale confirmar se já existe uma solução de mercado que resolve 80% do problema com menor investimento.',
      'Em arquitectura digital: a integração com sistemas existentes é frequentemente o maior desafio — e o mais subestimado no planeamento.',
      'Para adopção tecnológica: a melhor solução é aquela que as equipas realmente usam. O design centrado no utilizador final é tão importante quanto a tecnologia.',
    ],
  },
  'Outros': {
    name: 'Ernesto Quiala', firstName: 'Ernesto',
    label: 'Agente Gestão', specialty: 'gestao_inovacao',
    photo: '/labinovacaotis-react/agents/ernesto.png',
    color: '#c084fc', gradFrom: '#87007f', gradTo: '#FF0066', glowRgb: '192,132,252',
    opening: 'Olá! Sou o <b>Ernesto</b>, agente generalista de Inovação.<br><br>Vamos estruturar a tua ideia. <b>Descreve o problema ou oportunidade que identificas.</b>',
    openingChips: ['Oportunidade de negócio', 'Problema interno', 'Melhoria de produto', 'Iniciativa estratégica'],
    followUps: [
      { question: 'Que impacto teria esta ideia na organização?', chips: ['Redução de custos', 'Aumento de receita', 'Melhoria de cultura', 'Vantagem competitiva'] },
      { question: 'Que recursos seriam necessários para avançar?', chips: ['Equipa técnica', 'Orçamento específico', 'Parceiro externo', 'Aprovação de liderança'] },
      { question: 'Como medirias o sucesso desta iniciativa?', chips: ['KPI financeiro', 'KPI operacional', 'Satisfação das equipas', 'Nº de impactos gerados'] },
    ],
    perspectives: [
      'Na perspectiva de gestão: o alinhamento com a estratégia da organização é o que determina se uma boa ideia avança ou fica parada.',
      'Do ponto de vista de inovação: ideias transversais como esta têm mais impacto quando têm um sponsor executivo visível desde o início.',
      'Em gestão de iniciativas: define um "dono" claro e um prazo de validação. Sem isso, boa parte das ideias perde momentum.',
    ],
  },
};

/* Todas as entradas do menu lateral */
const ALL_AGENTS = Object.entries(AGENT_MAP).map(([key, a]) => ({ key, ...a }));

const PROGRESS_LABELS = ['Problema identificado', 'Impacto avaliado', 'Solução proposta', 'Benefícios definidos'];

/* ── Avatar component ── */
function AgentAvatar({ agentKey, size = 30 }: { agentKey: string; size?: number }) {
  const a = AGENT_MAP[agentKey];
  const [err, setErr] = useState(false);
  if (!a) return null;
  return err ? (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(135deg, ${a.gradFrom}, ${a.gradTo})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700, color: '#fff',
    }}>{a.firstName[0]}</div>
  ) : (
    <img src={a.photo} alt={a.firstName} onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0, display: 'block' }}
    />
  );
}

export default function BrainstormPage({ selectedCategory, onBack, onNextPage, isAnonymous, setIsAnonymous }: BrainstormPageProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  /* ── Estado de agentes ── */
  const [primaryKey, setPrimaryKey]     = useState(selectedCategory);
  const [secondaryKey, setSecondaryKey] = useState<string | null>(null);
  const followUpIdx = useRef(0);

  const primary   = AGENT_MAP[primaryKey]   ?? AGENT_MAP['Outros'];
  const secondary = secondaryKey ? AGENT_MAP[secondaryKey] : null;

  /* ── Mensagens ── */
  const [messages, setMessages] = useState<Message[]>([
    { type: 'ai', text: primary.opening, chips: primary.openingChips, agentKey: primaryKey },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [userTurns, setUserTurns]   = useState(0);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatAreaRef.current)
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [messages, isTyping]);

  /* ── Enviar mensagem ── */
  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { type: 'user', text: text.trim() }]);
    setInputValue('');
    setIsTyping(true);
    const turn = userTurns;
    setUserTurns(t => t + 1);

    setTimeout(() => {
      setIsTyping(false);
      const fu = primary.followUps[followUpIdx.current];
      followUpIdx.current = Math.min(followUpIdx.current + 1, primary.followUps.length - 1);

      if (secondary && turn < secondary.perspectives.length) {
        /* perspectiva do agente secundário primeiro */
        setMessages(prev => [...prev, {
          type: 'ai',
          text: secondary.perspectives[turn],
          agentKey: secondaryKey!,
        }]);
        /* depois o agente primário continua */
        setTimeout(() => {
          if (fu) setMessages(prev => [...prev, { type: 'ai', text: fu.question, chips: fu.chips, agentKey: primaryKey }]);
        }, 1400);
      } else {
        if (fu) setMessages(prev => [...prev, { type: 'ai', text: fu.question, chips: fu.chips, agentKey: primaryKey }]);
        else setMessages(prev => [...prev, {
          type: 'ai',
          text: 'Excelente! Tens informação suficiente para uma proposta sólida.<br><br><b>Pronto para avançar?</b>',
          agentKey: primaryKey,
        }]);
      }
    }, 1600);
  };

  /* ── Acções de agentes ── */
  const addSecondary = (key: string) => {
    if (key === primaryKey || secondaryKey === key) return;
    const a = AGENT_MAP[key];
    setSecondaryKey(key);
    setMessages(prev => [...prev, {
      type: 'ai',
      text: `Olá! Sou ${a.firstName === 'Armindo' || a.firstName === 'Jacinto' || a.firstName === 'Ernesto' ? 'o' : 'a'} <b>${a.firstName}</b>, ${a.label}. Vou acompanhar a conversa e acrescentar a perspectiva de <b>${a.specialty.replace(/_/g, ' ')}</b>.`,
      agentKey: key,
    }]);
  };

  const removeSecondary = () => {
    if (!secondaryKey) return;
    const a = AGENT_MAP[secondaryKey];
    setMessages(prev => [...prev, {
      type: 'ai',
      text: `${a.firstName} saiu da conversa. O ${primary.firstName} continua a guiar o brainstorming.`,
      agentKey: secondaryKey,
    }]);
    setSecondaryKey(null);
  };

  const switchPrimary = (key: string) => {
    if (key === primaryKey) return;
    const a = AGENT_MAP[key];
    const art = ['Armindo', 'Jacinto', 'Ernesto'].includes(a.firstName) ? 'o' : 'a';
    setPrimaryKey(key);
    followUpIdx.current = 0;
    setMessages(prev => [...prev, {
      type: 'ai',
      text: `Olá! Sou ${art} <b>${a.firstName}</b>, ${a.label}. Pego na conversa a partir daqui com a perspectiva de <b>${a.specialty.replace(/_/g, ' ')}</b>.<br><br>${a.followUps[0].question}`,
      chips: a.followUps[0].chips,
      agentKey: key,
    }]);
    followUpIdx.current = 1;
    if (secondaryKey === key) setSecondaryKey(null);
  };

  /* ── Tema ── */
  const surface = isLight ? 'var(--surface)' : 'rgba(255,255,255,0.04)';
  const border  = isLight ? 'var(--border-light)' : 'rgba(255,255,255,0.07)';
  const textCol = isLight ? 'var(--text)'    : '#fff';
  const muted   = isLight ? 'var(--text-muted)' : 'rgba(180,200,255,0.45)';
  const bg      = isLight ? 'var(--bg)' : 'radial-gradient(ellipse at 50% -10%, #0f1a50 0%, #070b20 55%, #04061c 100%)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 86px)', background: bg, animation: 'brIn 0.35s ease both' }}>

      {/* ── Stepper ── */}
      <div style={{ background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(4,6,28,0.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: `1px solid ${border}`, flexShrink: 0 }}>
        <StepBar currentStep={1} onBack={onBack} backLabel="Categoria" />
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ════ CHAT ════ */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: `1px solid ${border}` }}>

          {/* Agent header */}
          <div style={{ padding: '12px 22px', borderBottom: `1px solid ${border}`, background: isLight ? surface : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {/* Primary */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', background: `radial-gradient(circle, rgba(${primary.glowRgb},0.3) 0%, transparent 70%)`, animation: 'auraGlow 2.8s ease-in-out infinite' }}/>
              <AgentAvatar agentKey={primaryKey} size={40} />
              <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#00CFCF', border: isLight ? '1.5px solid white' : '1.5px solid #04061c', zIndex: 2 }}/>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-outfit)', color: textCol }}>{primary.name}</div>
              <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.05em' }}>{primary.label}</div>
            </div>

            {/* Secondary agent badge (if active) */}
            {secondary && (
              <>
                <div style={{ fontSize: 11, color: muted, fontFamily: 'var(--font-mono)', margin: '0 4px' }}>+</div>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: `radial-gradient(circle, rgba(${secondary.glowRgb},0.25) 0%, transparent 70%)` }}/>
                  <AgentAvatar agentKey={secondaryKey!} size={34} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-outfit)', color: textCol }}>{secondary.name}</div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: secondary.color, letterSpacing: '0.05em' }}>{secondary.label}</div>
                </div>
              </>
            )}

            <div style={{ flex: 1 }}/>
            <div style={{ padding: '4px 12px', borderRadius: 20, background: `rgba(${primary.glowRgb},0.10)`, border: `1px solid rgba(${primary.glowRgb},0.25)`, fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)', color: primary.color, whiteSpace: 'nowrap' }}>
              {selectedCategory}
            </div>
          </div>

          {/* Messages */}
          <div ref={chatAreaRef} style={{ flex: 1, overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg, i) => {
              const msgAgent = msg.agentKey ? AGENT_MAP[msg.agentKey] : primary;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', maxWidth: '80%', animation: 'msgIn 0.25s ease' }}>
                  {/* Avatar */}
                  {msg.type === 'ai' ? (
                    <div style={{ flexShrink: 0, paddingTop: 2 }}>
                      <AgentAvatar agentKey={msg.agentKey ?? primaryKey} size={28} />
                    </div>
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4294F8, #9437FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0, paddingTop: 2 }}>EU</div>
                  )}

                  <div>
                    {/* Agent name label for AI (only when 2 agents active) */}
                    {msg.type === 'ai' && secondary && msgAgent && (
                      <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: msgAgent.color, marginBottom: 4, letterSpacing: '0.05em' }}>
                        {msgAgent.firstName}
                      </div>
                    )}
                    <div style={{
                      padding: '11px 15px',
                      borderRadius: msg.type === 'ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      fontSize: 13, lineHeight: 1.65,
                      background: msg.type === 'user'
                        ? (isLight ? 'var(--blue-light)' : `rgba(${primary.glowRgb},0.15)`)
                        : isLight ? 'var(--surface)' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${msg.type === 'user' ? `rgba(${primary.glowRgb},0.28)` : border}`,
                      color: textCol, fontFamily: 'var(--font-outfit)',
                      borderLeft: msg.type === 'ai' && msgAgent ? `2.5px solid ${msgAgent.color}60` : undefined,
                    }}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                    {msg.chips && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {msg.chips.map((chip, j) => (
                          <button key={j} onClick={() => sendMessage(chip)} style={{ padding: '6px 14px', borderRadius: 20, background: 'transparent', border: `1px solid ${border}`, color: muted, fontSize: 11, fontFamily: 'var(--font-outfit)', cursor: 'pointer', transition: 'all 0.18s' }}
                            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = `rgba(${primary.glowRgb},0.12)`; b.style.borderColor = `rgba(${primary.glowRgb},0.4)`; b.style.color = primary.color; }}
                            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'transparent'; b.style.borderColor = border; b.style.color = muted; }}
                          >{chip}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{ display: 'flex', gap: 10, maxWidth: '80%', animation: 'msgIn 0.25s ease' }}>
                <AgentAvatar agentKey={primaryKey} size={28} />
                <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: isLight ? 'var(--surface)' : 'rgba(255,255,255,0.06)', border: `1px solid ${border}`, display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 0.2, 0.4].map((d, k) => (
                    <span key={k} style={{ width: 6, height: 6, borderRadius: '50%', background: primary.color, display: 'inline-block', animation: `typingDot 1.2s ${d}s ease-in-out infinite`, opacity: 0.6 }}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '13px 18px', borderTop: `1px solid ${border}`, background: isLight ? 'var(--bg2)' : 'rgba(4,6,28,0.7)', display: 'flex', gap: 10, alignItems: 'flex-end', flexShrink: 0 }}>
            <textarea
              style={{ flex: 1, resize: 'none', background: isLight ? 'var(--surface)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${border}`, borderRadius: 14, padding: '10px 15px', fontSize: 13, color: textCol, fontFamily: 'var(--font-outfit)', minHeight: 42, maxHeight: 110, outline: 'none', transition: 'border-color 0.2s', lineHeight: 1.5 }}
              placeholder="Escreve a tua resposta..."
              rows={1}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = primary.color; }}
              onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = border; }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputValue); } }}
            />
            <button onClick={() => sendMessage(inputValue)} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: `linear-gradient(135deg, ${primary.gradFrom}, ${primary.gradTo})`, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 4px 14px rgba(${primary.glowRgb},0.4)`, transition: 'transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            >↑</button>
          </div>
        </div>

        {/* ════ SIDEBAR ════ */}
        <div style={{ width: 272, flexShrink: 0, display: 'flex', flexDirection: 'column', background: isLight ? 'var(--bg2)' : 'rgba(4,6,28,0.55)', borderLeft: `1px solid ${border}`, overflowY: 'auto' }}>

          {/* ── Progresso ── */}
          <div style={{ padding: '18px 16px', borderBottom: `1px solid ${border}` }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>// progresso</div>
            {PROGRESS_LABELS.map((label, i) => {
              const done   = i < Math.min(userTurns, PROGRESS_LABELS.length);
              const active = i === Math.min(userTurns, PROGRESS_LABELS.length - 1) && userTurns <= i;
              return (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 1 }}>
                    <div style={{ width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', background: done ? `rgba(${primary.glowRgb},0.18)` : active ? `linear-gradient(135deg, ${primary.gradFrom}, ${primary.gradTo})` : isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.04)', border: done ? `1px solid rgba(${primary.glowRgb},0.38)` : active ? `1px solid ${primary.color}` : `1px solid ${border}`, color: done ? primary.color : active ? '#fff' : muted, animation: active ? 'stepPulse 2.6s ease-in-out infinite' : 'none' }}>
                      {done ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                    </div>
                    {i < PROGRESS_LABELS.length - 1 && <div style={{ width: 1, height: 12, marginTop: 3, background: done ? `rgba(${primary.glowRgb},0.28)` : border }}/>}
                  </div>
                  <div style={{ fontSize: 11.5, fontFamily: 'var(--font-outfit)', color: done ? primary.color : active ? textCol : muted, fontWeight: active || done ? 600 : 400, paddingTop: 1, transition: 'color 0.3s' }}>{label}</div>
                </div>
              );
            })}
          </div>

          {/* ── Agentes ── */}
          <div style={{ padding: '18px 16px', borderBottom: `1px solid ${border}`, flex: 1 }}>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>// agentes</div>

            {/* Active agents - prominent at top */}
            <div style={{ marginBottom: 14 }}>
              {/* Primary agent */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, marginBottom: 6, background: `rgba(${primary.glowRgb},0.09)`, border: `1px solid rgba(${primary.glowRgb},0.22)` }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <AgentAvatar agentKey={primaryKey} size={36} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#00CFCF', border: isLight ? '1.5px solid white' : '1.5px solid #04061c' }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-outfit)', color: textCol, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{primary.name.split(' ')[0]}</div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: primary.color, letterSpacing: '0.04em' }}>{primary.label}</div>
                </div>
                <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: primary.color, background: `rgba(${primary.glowRgb},0.12)`, border: `1px solid rgba(${primary.glowRgb},0.3)`, borderRadius: 5, padding: '2px 7px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  principal
                </div>
              </div>

              {/* Secondary agent (if active) */}
              {secondary && secondaryKey && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, background: `rgba(${secondary.glowRgb},0.09)`, border: `1px solid rgba(${secondary.glowRgb},0.22)` }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <AgentAvatar agentKey={secondaryKey} size={36} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: '#00CFCF', border: isLight ? '1.5px solid white' : '1.5px solid #04061c' }}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-outfit)', color: textCol, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{secondary.name.split(' ')[0]}</div>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: secondary.color, letterSpacing: '0.04em' }}>{secondary.label}</div>
                  </div>
                  <button onClick={removeSecondary} style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: muted, background: 'transparent', border: `1px solid ${border}`, borderRadius: 5, padding: '3px 8px', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap' }}
                    onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = '#ef4444'; b.style.borderColor = '#ef444455'; }}
                    onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = muted; b.style.borderColor = border; }}
                  >× retirar</button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: border, marginBottom: 10 }}/>

            {/* Other agents - compact list */}
            {ALL_AGENTS.filter(a => a.key !== primaryKey && a.key !== secondaryKey).map(a => {
              const canAdd = !secondaryKey;
              return (
                <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, marginBottom: 3, transition: 'background 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <AgentAvatar agentKey={a.key} size={26} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-outfit)', color: muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name.split(' ')[0]}</div>
                    <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)', letterSpacing: '0.03em' }}>{a.label}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    {/* + incluir perspectiva */}
                    <button
                      onClick={() => canAdd ? addSecondary(a.key) : undefined}
                      disabled={!canAdd}
                      title="Incluir perspectiva"
                      style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 300, color: canAdd ? a.color : muted, background: canAdd ? `rgba(${a.glowRgb},0.08)` : 'transparent', border: `1px solid ${canAdd ? `rgba(${a.glowRgb},0.25)` : border}`, borderRadius: 6, cursor: canAdd ? 'pointer' : 'not-allowed', opacity: canAdd ? 1 : 0.35, transition: 'all 0.15s', lineHeight: 1 }}
                      onMouseEnter={e => { if (canAdd) { const b = e.currentTarget as HTMLButtonElement; b.style.background = `rgba(${a.glowRgb},0.2)`; } }}
                      onMouseLeave={e => { if (canAdd) { const b = e.currentTarget as HTMLButtonElement; b.style.background = `rgba(${a.glowRgb},0.08)`; } }}
                    >+</button>

                    {/* Trocar principal */}
                    <button
                      onClick={() => switchPrimary(a.key)}
                      title="Substituir agente principal"
                      style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, background: 'transparent', border: `1px solid ${border}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = textCol; b.style.borderColor = isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)'; }}
                      onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.color = muted; b.style.borderColor = border; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
                        <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Acções ── */}
          <div style={{ padding: '16px', flexShrink: 0 }}>
            <button onClick={onNextPage} style={{ width: '100%', padding: '12px', borderRadius: 11, border: 'none', background: `linear-gradient(135deg, ${primary.gradFrom}, ${primary.gradTo})`, color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-outfit)', cursor: 'pointer', boxShadow: `0 6px 18px rgba(${primary.glowRgb},0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(-2px)'; b.style.boxShadow = `0 10px 26px rgba(${primary.glowRgb},0.5)`; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = 'translateY(0)'; b.style.boxShadow = `0 6px 18px rgba(${primary.glowRgb},0.35)`; }}
            >
              Continuar para Referências
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            <div style={{ marginTop: 9, textAlign: 'center', fontSize: 11, fontFamily: 'var(--font-outfit)', color: muted, cursor: 'pointer' }}>
              💾 Guardar rascunho
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes brIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes msgIn   { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes auraGlow{ 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
        @keyframes typingDot{ 0%,60%,100%{transform:translateY(0);opacity:.5} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes stepPulse{
          0%,100%{box-shadow:0 0 0 2px rgba(${primary.glowRgb},.12),0 0 10px rgba(${primary.glowRgb},.28)}
          50%    {box-shadow:0 0 0 4px rgba(${primary.glowRgb},.07),0 0 18px rgba(${primary.glowRgb},.45)}
        }
      `}</style>
    </div>
  );
}

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface AgentsPageProps {
  onNavigate: (view: ViewType) => void;
}

const agents = [
  {
    name: 'Leonardo Silva',
    title: 'agente_pmo · melhoria_processo',
    specialty: 'Melhoria de Processo',
    avatar: '⬡',
    avatarBg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    color: '#3b82f6',
    bio: 'Especialista em gestão de projectos e optimização de processos. Analisa problemas operacionais com rigor metodológico e ajuda a estruturar propostas com métricas claras.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    skillBg: 'rgba(37,99,235,0.1)',
    skillColor: '#3b82f6',
  },
  {
    name: 'Ana Costa',
    title: 'agente_produto · novo_produto',
    specialty: 'Novo Produto',
    avatar: '⚡',
    avatarBg: 'linear-gradient(135deg, #FF0066, #87007F)',
    color: '#FF0066',
    bio: 'Product manager com mindset de startup. Faz as perguntas certas para transformar uma ideia bruta num conceito de produto com proposta de valor clara.',
    skills: ['Design Thinking', 'MVP', 'User Research'],
    skillBg: 'rgba(255,0,102,0.1)',
    skillColor: '#FF0066',
  },
  {
    name: 'Mariana Ramos',
    title: 'agente_cx · experiência_cliente',
    specialty: 'Experiência do Cliente',
    avatar: '◉',
    avatarBg: 'linear-gradient(135deg, #4294F8, var(--green))',
    color: '#06b6d4',
    bio: 'Especialista em CX e service design. Analisa a jornada do cliente com empatia e dados, transformando fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    skillBg: 'rgba(6,182,212,0.1)',
    skillColor: '#06b6d4',
  },
  {
    name: 'Carlos Mendes',
    title: 'agente_rh · cultura_pessoas',
    specialty: 'Cultura & Pessoas',
    avatar: '◎',
    avatarBg: 'linear-gradient(135deg, #9437FF, #b45309)',
    color: '#7c3aed',
    bio: 'People & culture specialist. Ajuda a pensar em iniciativas que criam ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    skillBg: 'rgba(124,58,237,0.1)',
    skillColor: '#7c3aed',
  },
  {
    name: 'Sofia Neves',
    title: 'agente_tech · tecnologia_digital',
    specialty: 'Tecnologia & Digital',
    avatar: '◈',
    avatarBg: 'linear-gradient(135deg, #2563eb, #3126b4)',
    color: '#2563eb',
    bio: 'Tech lead e arquitecta de soluções digitais. Define o âmbito técnico com clareza — viabilidade, integrações, escalabilidade, segurança.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    skillBg: 'rgba(37,99,235,0.1)',
    skillColor: '#3b82f6',
  },
  {
    name: 'Rui Ferreira',
    title: 'agente_geral · outros',
    specialty: 'Generalista',
    avatar: '✦',
    avatarBg: 'linear-gradient(135deg, #87007f, var(--green))',
    color: '#f97316',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda o problema com curiosidade e sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    skillBg: 'rgba(124,58,237,0.1)',
    skillColor: '#7c3aed',
  },
];

export default function AgentsPage({ onNavigate }: AgentsPageProps) {
  return (
    <div className="pt-[62px] px-9 py-10 overflow-y-auto bg-[var(--bg)]" style={{ minHeight: '100vh' }}>
      <div className="mb-10 text-center">
        <h1 className="text-[32px] font-[800] tracking-[-0.5px] mb-2" style={{ color: 'var(--text)' }}>
          Agentes IA do IdeaLab
        </h1>
        <p className="text-[14px] max-w-[520px] mx-auto" style={{ color: 'var(--text-muted)' }}>
          Conhece os especialistas que vão acompanhar o teu processo de brainstorming.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-[1200px] mx-auto">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="rounded-2xl p-6 cursor-pointer transition-all relative overflow-hidden hover:-translate-y-0.5"
            style={{
              background: '#111827',
              border: '1.5px solid rgba(37,99,235,0.15)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              color: agent.color,
            }}
          >
            <div
              className="absolute inset-0 opacity-0 hover:opacity-[0.04] transition-opacity"
              style={{ background: `linear-gradient(135deg, ${agent.color}, transparent)` }}
            />

            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[22px] relative flex-shrink-0" style={{ background: agent.avatarBg }}>
                {agent.avatar}
              </div>
              <div>
                <div className="text-base font-[800] tracking-[-0.3px] mb-0.5" style={{ color: 'var(--text)' }}>
                  {agent.name}
                </div>
                <div className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {agent.title}
                </div>
                <div className="flex items-center gap-1 text-[10px] mt-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontFamily: 'var(--font-mono)', width: 'fit-content' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-[blink_2s_infinite]" style={{ background: '#22c55e' }} />
                  online agora
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] mb-3.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: agent.color }} />
              Especialidade: {agent.specialty}
            </div>

            <div className="text-[12px] leading-[1.6] mb-4" style={{ color: 'var(--text-muted)' }}>
              {agent.bio}
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {agent.skills.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: agent.skillBg, color: agent.skillColor, border: '1px solid rgba(37,99,235,0.2)', fontFamily: 'var(--font-mono)' }}>
                  {skill}
                </span>
              ))}
            </div>

            <button
              className="w-full px-2.5 py-2.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all hover:bg-[#3b82f6]"
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--font-outfit)',
              }}
              onClick={() => onNavigate('create')}
            >
              Iniciar brainstorming →
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

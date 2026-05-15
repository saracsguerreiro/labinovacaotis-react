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
    color: '#3126b4',
    bio: 'Especialista em gestão de projectos e optimização de processos. Analisa problemas operacionais com rigor metodológico e ajuda a estruturar propostas com métricas claras.',
    skills: ['Lean Six Sigma', 'BPMN', 'KPIs', 'RPA'],
    skillBg: '#eff4ff',
    skillColor: '#3126b4',
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
    skillBg: '#fdf2f8',
    skillColor: '#FF0066',
  },
  {
    name: 'Mariana Ramos',
    title: 'agente_cx · experiência_cliente',
    specialty: 'Experiência do Cliente',
    avatar: '◉',
    avatarBg: 'linear-gradient(135deg, #4294F8, var(--green))',
    color: '#4294F8',
    bio: 'Especialista em CX e service design. Analisa a jornada do cliente com empatia e dados, transformando fricções em oportunidades de diferenciação.',
    skills: ['Journey Mapping', 'NPS', 'Personas'],
    skillBg: '#ecfeff',
    skillColor: '#4294F8',
  },
  {
    name: 'Carlos Mendes',
    title: 'agente_rh · cultura_pessoas',
    specialty: 'Cultura & Pessoas',
    avatar: '◎',
    avatarBg: 'linear-gradient(135deg, #9437FF, #b45309)',
    color: '#9437FF',
    bio: 'People & culture specialist. Ajuda a pensar em iniciativas que criam ambientes de trabalho mais motivadores, inclusivos e produtivos.',
    skills: ['OKRs', 'Engagement', 'L&D'],
    skillBg: '#e6dfff',
    skillColor: '#9437FF',
  },
  {
    name: 'Sofia Neves',
    title: 'agente_tech · tecnologia_digital',
    specialty: 'Tecnologia & Digital',
    avatar: '◈',
    avatarBg: 'linear-gradient(135deg, #036ef2, #3126b4)',
    color: '#036ef2',
    bio: 'Tech lead e arquitecta de soluções digitais. Define o âmbito técnico com clareza — viabilidade, integrações, escalabilidade, segurança.',
    skills: ['APIs', 'Cloud', 'AI/ML', 'Security'],
    skillBg: '#f5f3ff',
    skillColor: '#036ef2',
  },
  {
    name: 'Rui Ferreira',
    title: 'agente_geral · outros',
    specialty: 'Generalista',
    avatar: '✦',
    avatarBg: 'linear-gradient(135deg, #87007f, var(--green))',
    color: '#87007f',
    bio: 'Facilitador criativo ideal para ideias transversais. Aborda o problema com curiosidade e sem preconceitos disciplinares.',
    skills: ['Facilitação', 'Criatividade', 'Estratégia'],
    skillBg: '#f4ecff',
    skillColor: '#87007f',
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
            className="bg-[var(--surface)] border-[1.5px] rounded-2xl p-6 cursor-pointer transition-all relative overflow-hidden shadow-[0_2px_8px_rgba(30,50,140,0.05)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,50,140,0.12)]"
            style={{
              borderColor: 'var(--border-light)',
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
                <div className="flex items-center gap-1 text-[10px] mt-1" style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-[blink_2s_infinite]" style={{ background: 'var(--cyan)' }} />
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
                <span key={skill} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: agent.skillBg, color: agent.skillColor, fontFamily: 'var(--font-mono)' }}>
                  {skill}
                </span>
              ))}
            </div>

            <button
              className="w-full px-2.5 py-2.5 bg-transparent border-[1.5px] rounded-full text-[12px] font-semibold cursor-pointer transition-all hover:bg-[var(--blue-light)]"
              style={{
                borderColor: 'var(--border2)',
                color: 'var(--text-muted)',
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

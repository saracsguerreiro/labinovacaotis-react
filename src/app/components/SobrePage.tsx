interface SobrePageProps {
  onNavigate: (view: 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre') => void;
}

const team = [
  {
    initials: 'LS',
    name: 'Leonardo Silva',
    role: 'PMO & Inovação',
    bg: 'linear-gradient(135deg, #3126b4, #4294F8)',
    ideas: 12,
  },
  {
    initials: 'AC',
    name: 'Ana Costa',
    role: 'Produto & UX',
    bg: 'linear-gradient(135deg, #FF0066, #87007F)',
    ideas: 9,
  },
  {
    initials: 'MR',
    name: 'Mariana Ramos',
    role: 'Experiência do Cliente',
    bg: 'linear-gradient(135deg, #4294F8, #15803d)',
    ideas: 7,
  },
  {
    initials: 'CM',
    name: 'Carlos Mendes',
    role: 'Cultura & Pessoas',
    bg: 'linear-gradient(135deg, #9437FF, #b45309)',
    ideas: 11,
  },
  {
    initials: 'SN',
    name: 'Sofia Neves',
    role: 'Tech & Digital',
    bg: 'linear-gradient(135deg, #2563eb, #3126b4)',
    ideas: 15,
  },
  {
    initials: 'RF',
    name: 'Rui Ferreira',
    role: 'Estratégia & Facilitação',
    bg: 'linear-gradient(135deg, #87007f, #15803d)',
    ideas: 6,
  },
];

const milestones = [
  { date: 'Jan 2024', label: 'Lançamento do IdeaLab', desc: 'Plataforma aberta a todos os colaboradores', color: '#2563eb' },
  { date: 'Mar 2024', label: '100 ideias submetidas', desc: 'Marco histórico atingido em apenas 3 meses', color: '#7c3aed' },
  { date: 'Jun 2024', label: 'Primeiras implementações', desc: '5 ideias em produção com impacto mensurável', color: '#FF0066' },
  { date: 'Set 2024', label: 'Integração com IA', desc: 'Agentes especializados activados para brainstorming', color: '#06b6d4' },
  { date: 'Dez 2024', label: '300+ ideias e 8 departamentos', desc: 'Toda a organização envolvida no ecossistema', color: '#22c55e' },
  { date: '2025', label: 'Expansão internacional', desc: 'Alargamento a escritórios em Lisboa, Porto e Madrid', color: '#2563eb' },
];

const values = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Velocidade',
    desc: 'Uma boa ideia não espera. A plataforma garante feedback em 48h e decisão em 2 semanas.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Transparência',
    desc: 'Todas as ideias são públicas. O processo de avaliação é documentado e auditável.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Inclusão',
    desc: 'Qualquer colaborador pode submeter. Anonimato garantido para quem prefere.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Impacto',
    desc: 'Cada ideia tem métricas de sucesso definidas. Acompanhamos os resultados reais.',
  },
];

export default function SobrePage({ onNavigate }: SobrePageProps) {
  return (
    <div className="min-h-screen pt-[62px] bg-[var(--bg)]">

      {/* Hero */}
      <section className="px-10 pt-20 pb-16 max-w-[1100px] mx-auto">
        <div
          className="inline-flex items-center gap-2 text-[11px] tracking-[2px] uppercase mb-6 px-3.5 py-1.5 rounded border"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', background: 'var(--cyan-light)', borderColor: 'rgba(8,145,178,0.2)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-[blink_1.5s_infinite]" style={{ background: 'var(--cyan)' }} />
          Sobre o IdeaLab
        </div>
        <h1
          className="text-[clamp(38px,5.5vw,68px)] font-[900] leading-[0.95] tracking-[-3px] mb-6"
          style={{ color: 'var(--text)' }}
        >
          Inovação não é<br />
          <span
            style={{
              background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            privilégio de poucos.
          </span>
        </h1>
        <p className="text-[17px] leading-[1.75] max-w-[600px] mb-10" style={{ color: 'var(--text-muted)' }}>
          O IdeaLab nasceu da convicção de que as melhores ideias vivem nas pessoas que fazem o trabalho todos os dias. A nossa missão é dar-lhes voz, estrutura e impacto real — com a ajuda da inteligência artificial.
        </p>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-[14px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-0.5"
            style={{ background: 'var(--blue)', boxShadow: '0 6px 24px var(--blue-glow)', fontFamily: 'var(--font-outfit)' }}
            onClick={() => onNavigate('create')}
          >
            Submeter uma ideia →
          </button>
          <button
            className="px-6 py-3 rounded-full text-[14px] font-medium cursor-pointer transition-all hover:border-[var(--border3)] hover:text-[var(--text)] bg-transparent border-[1.5px]"
            style={{ borderColor: 'var(--border2)', color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
            onClick={() => onNavigate('hub')}
          >
            Ver todas as ideias
          </button>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-b py-16" style={{ borderColor: 'var(--border-light)', background: 'var(--bg2)' }}>
        <div className="max-w-[1100px] mx-auto px-10">
          <div className="text-[10px] tracking-[3px] uppercase mb-10 text-center" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            // os nossos princípios
          </div>
          <div className="grid grid-cols-4 gap-5">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-all hover:-translate-y-1"
                style={{ background: '#111827', border: '1px solid rgba(37,99,235,0.15)', color: 'var(--blue)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--blue-light)' }}>
                  {v.icon}
                </div>
                <div className="text-[15px] font-bold mb-2 tracking-[-0.2px]" style={{ color: 'var(--text)' }}>
                  {v.title}
                </div>
                <div className="text-[12px] leading-[1.6]" style={{ color: 'var(--text-muted)' }}>
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 max-w-[1100px] mx-auto px-10">
        <div className="text-[10px] tracking-[3px] uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
          // linha do tempo
        </div>
        <h2 className="text-[32px] font-[800] tracking-[-1px] mb-12" style={{ color: 'var(--text)' }}>
          A nossa história
        </h2>
        <div className="relative">
          <div className="absolute left-[82px] top-0 bottom-0 w-px" style={{ background: 'var(--border-light)' }} />
          <div className="flex flex-col gap-8">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-[82px] flex-shrink-0 text-right">
                  <div className="text-[11px] font-bold pt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                    {m.date}
                  </div>
                </div>
                <div className="relative z-[1] flex-shrink-0 mt-1">
                  <div className="w-3 h-3 rounded-full border-2" style={{ background: m.color, borderColor: '#0a0d1a', boxShadow: `0 0 0 3px ${m.color}44` }} />
                </div>
                <div className="flex-1 pb-2">
                  <div className="text-[15px] font-bold mb-1 tracking-[-0.2px]" style={{ color: 'var(--text)' }}>
                    {m.label}
                  </div>
                  <div className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t py-20" style={{ borderColor: 'var(--border-light)', background: 'var(--bg2)' }}>
        <div className="max-w-[1100px] mx-auto px-10">
          <div className="text-[10px] tracking-[3px] uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
            // equipa
          </div>
          <h2 className="text-[32px] font-[800] tracking-[-1px] mb-3" style={{ color: 'var(--text)' }}>
            As pessoas por detrás da inovação
          </h2>
          <p className="text-[14px] mb-12 max-w-[520px]" style={{ color: 'var(--text-muted)' }}>
            Facilitadores de inovação que ajudam as ideias a ganhar forma, tração e impacto.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {team.map((person, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 flex items-center gap-4 transition-all hover:-translate-y-0.5"
                style={{ background: '#111827', border: '1px solid rgba(37,99,235,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
              >
                <div
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0"
                  style={{ background: person.bg }}
                >
                  {person.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold truncate" style={{ color: 'var(--text)' }}>
                    {person.name}
                  </div>
                  <div className="text-[11px] truncate mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    {person.role}
                  </div>
                  <div className="text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
                    {person.ideas} ideias submetidas
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center border-t" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-[580px] mx-auto px-10">
          <div className="text-[40px] font-[900] tracking-[-1.5px] leading-[1.1] mb-4" style={{ color: 'var(--text)' }}>
            Pronto para fazer<br />
            <span
              style={{
                background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              a diferença?
            </span>
          </div>
          <p className="text-[15px] mb-8 leading-[1.7]" style={{ color: 'var(--text-muted)' }}>
            Junta-te aos 94 colaboradores que já estão a moldar o futuro da organização.
          </p>
          <button
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white text-[15px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-0.5 mx-auto"
            style={{ background: 'var(--blue)', boxShadow: '0 6px 24px var(--blue-glow)', fontFamily: 'var(--font-outfit)' }}
            onClick={() => onNavigate('create')}
          >
            Submeter a minha ideia →
          </button>
        </div>
      </section>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

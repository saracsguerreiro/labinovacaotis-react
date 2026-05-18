import { useState } from 'react';
import StepBar from './StepBar';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface CategoryPageProps {
  onNavigate: (view: ViewType) => void;
  onSelectCategory: (category: string) => void;
  onNextPage: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

const categories = [
  {
    name: 'Melhoria de Processo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3126b4" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    desc: 'Optimização de fluxos, automação, eficiência operacional',
    agent: 'Agente PMO · Leonardo Silva',
    color: '#3126b4',
    bg: '#eff4ff',
    borderColor: 'rgba(49,38,180,0.2)',
  },
  {
    name: 'Novo Produto',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF0066" strokeWidth="1.8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    desc: 'Novos produtos, funcionalidades ou serviços inovadores',
    agent: 'Agente Produto · Ana Costa',
    color: '#FF0066',
    bg: '#fdf2f8',
    borderColor: 'rgba(255,0,102,0.2)',
  },
  {
    name: 'Experiência do Cliente',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4294F8" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    desc: 'Melhorias no atendimento, jornada e satisfação',
    agent: 'Agente CX · Mariana Ramos',
    color: '#4294F8',
    bg: '#ecfeff',
    borderColor: 'rgba(66,148,248,0.2)',
  },
  {
    name: 'Cultura & Pessoas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9437FF" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    desc: 'Bem-estar, reconhecimento, ambiente organizacional',
    agent: 'Agente RH · Carlos Mendes',
    color: '#9437FF',
    bg: '#e6dfff',
    borderColor: 'rgba(148,55,255,0.2)',
  },
  {
    name: 'Tecnologia & Digital',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#036ef2" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    desc: 'Ferramentas digitais, dados, transformação digital',
    agent: 'Agente Tech · Sofia Neves',
    color: '#036ef2',
    bg: '#f5f3ff',
    borderColor: 'rgba(3,110,242,0.2)',
  },
  {
    name: 'Outros',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#87007f" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    desc: 'Qualquer ideia que não se enquadre nas categorias anteriores',
    agent: 'Agente Generalista · Rui Ferreira',
    color: '#87007f',
    bg: '#f4ecff',
    borderColor: 'rgba(135,0,127,0.2)',
  },
];

export default function CategoryPage({ onNavigate, onSelectCategory, onNextPage, isAnonymous, setIsAnonymous }: CategoryPageProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (category: string) => {
    setSelected(category);
    onSelectCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col animate-[vIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]">
      <StepBar currentStep={0} onBack={() => onNavigate('home')} backLabel="Início" isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />

      <div className="flex-1 flex flex-col items-center justify-center px-10 gap-9 max-w-[900px] mx-auto w-full py-10">
        <div className="text-center">
          <h1 className="text-[34px] font-[800] tracking-[-1px] leading-[1.15] mb-2.5" style={{ color: 'var(--text)' }}>
            Qual é o tipo da tua{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ideia
            </em>
            ?
          </h1>
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
            Escolhe a categoria para activar o agente especializado do Laboratório de Inovação
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3.5 w-full">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`bg-[var(--surface)] border-[1.5px] rounded-2xl p-[22px_18px] cursor-pointer transition-all relative overflow-hidden shadow-[0_2px_8px_rgba(30,50,140,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(30,50,140,0.1)] ${
                selected === cat.name ? 'border-current' : ''
              }`}
              style={{
                borderColor: selected === cat.name ? cat.color : 'var(--border-light)',
                background: selected === cat.name ? cat.bg : 'var(--surface)',
                color: cat.color,
              }}
              onClick={() => handleSelect(cat.name)}
            >
              <div
                className="absolute inset-0 opacity-0 hover:opacity-[0.04] transition-opacity"
                style={{ background: `linear-gradient(135deg, ${cat.color}, transparent)` }}
              />
              <div
                className="w-11 h-11 rounded-xl mb-3.5 flex items-center justify-center border relative"
                style={{ background: cat.bg, borderColor: cat.borderColor }}
              >
                {cat.icon}
              </div>
              <div className="text-[14px] font-bold mb-1.5 tracking-[-0.2px]" style={{ color: 'var(--text)' }}>
                {cat.name}
              </div>
              <div className="text-[11px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
                {cat.desc}
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                <div className="w-1.5 h-1.5 rounded-full animate-[blink_2s_infinite]" style={{ background: 'var(--cyan)' }} />
                {cat.agent}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="px-9 py-3.5 border-t flex items-center justify-between"
        style={{
          borderColor: 'var(--border-light)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex items-center gap-1.5 text-[12px] cursor-pointer transition-colors hover:text-[var(--text)]" style={{ color: 'var(--text-muted)' }}>
          💾 Guardar rascunho
        </div>
        <button
          className="flex items-center gap-2 px-[22px] py-[11px] rounded-full border-none text-white text-[13px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-px"
          style={{
            background: 'var(--blue)',
            boxShadow: '0 4px 12px var(--blue-glow)',
            fontFamily: 'var(--font-outfit)',
          }}
          onClick={onNextPage}
        >
          Continuar → Brainstorming
        </button>
      </div>

      <style>{`
        @keyframes vIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

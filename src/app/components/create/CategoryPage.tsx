import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepBar from './StepBar';
import { useTheme } from '../../context/ThemeContext';

interface CategoryPageProps {
  onSelectCategory: (category: string) => void;
  onNextPage: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

const categories = [
  {
    name: 'Melhoria de Processo',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    desc: 'Optimização de fluxos, automação, eficiência operacional',
    agent: 'Agente PMO · Leonardo Silva',
    color: '#3126b4',
    lightBg: '#eff4ff',
    lightBorder: 'rgba(49,38,180,0.20)',
    darkBg: 'rgba(49,38,180,0.10)',
    darkBorder: 'rgba(49,38,180,0.35)',
  },
  {
    name: 'Novo Produto',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    desc: 'Novos produtos, funcionalidades ou serviços inovadores',
    agent: 'Agente Produto · Ana Costa',
    color: '#FF0066',
    lightBg: '#fdf2f8',
    lightBorder: 'rgba(255,0,102,0.20)',
    darkBg: 'rgba(255,0,102,0.10)',
    darkBorder: 'rgba(255,0,102,0.35)',
  },
  {
    name: 'Experiência do Cliente',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    desc: 'Melhorias no atendimento, jornada e satisfação',
    agent: 'Agente CX · Mariana Ramos',
    color: '#4294F8',
    lightBg: '#ecfeff',
    lightBorder: 'rgba(66,148,248,0.20)',
    darkBg: 'rgba(66,148,248,0.10)',
    darkBorder: 'rgba(66,148,248,0.35)',
  },
  {
    name: 'Cultura & Pessoas',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    desc: 'Bem-estar, reconhecimento, ambiente organizacional',
    agent: 'Agente RH · Carlos Mendes',
    color: '#9437FF',
    lightBg: '#f5f0ff',
    lightBorder: 'rgba(148,55,255,0.20)',
    darkBg: 'rgba(148,55,255,0.10)',
    darkBorder: 'rgba(148,55,255,0.35)',
  },
  {
    name: 'Tecnologia & Digital',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    desc: 'Ferramentas digitais, dados, transformação digital',
    agent: 'Agente Tech · Sofia Neves',
    color: '#036ef2',
    lightBg: '#eff6ff',
    lightBorder: 'rgba(3,110,242,0.20)',
    darkBg: 'rgba(3,110,242,0.10)',
    darkBorder: 'rgba(3,110,242,0.35)',
  },
  {
    name: 'Outros',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    desc: 'Qualquer ideia que não se enquadre nas categorias anteriores',
    agent: 'Agente Generalista · Rui Ferreira',
    color: '#87007f',
    lightBg: '#fdf0ff',
    lightBorder: 'rgba(135,0,127,0.20)',
    darkBg: 'rgba(135,0,127,0.10)',
    darkBorder: 'rgba(135,0,127,0.35)',
  },
];

export default function CategoryPage({ onSelectCategory, onNextPage, isAnonymous, setIsAnonymous }: CategoryPageProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSelect = (category: string) => {
    setSelected(category);
    onSelectCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', animation: 'vIn 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
      <StepBar currentStep={0} onBack={() => navigate('/')} backLabel="Início" isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />

      <div className="flex-1 flex flex-col items-center justify-center px-10 gap-9 max-w-[940px] mx-auto w-full py-10">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-[34px] font-[800] tracking-[-1px] leading-[1.15] mb-2.5"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
          >
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
          <p className="text-[14px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}>
            Escolhe a categoria para activar o agente especializado do Laboratório de Inovação
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {categories.map((cat) => {
            const isSelected = selected === cat.name;
            const isHovered = hovered === cat.name;

            const iconBg = isLight ? cat.lightBg : cat.darkBg;
            const iconBorder = isLight ? cat.lightBorder : cat.darkBorder;

            const cardBg = isSelected
              ? (isLight ? cat.lightBg : cat.darkBg.replace('0.10', '0.18'))
              : isLight
              ? 'var(--surface)'
              : 'var(--surface)';

            const cardBorder = isSelected
              ? `${cat.color}${isLight ? 'aa' : '70'}`
              : isHovered
              ? `${cat.color}${isLight ? '55' : '40'}`
              : 'var(--border-light)';

            const cardShadow = isSelected
              ? `0 0 0 2px ${cat.color}22, 0 12px 36px ${cat.color}${isLight ? '28' : '22'}`
              : isHovered
              ? `0 8px 28px ${cat.color}${isLight ? '20' : '18'}`
              : isLight
              ? '0 2px 8px rgba(0,0,0,0.06)'
              : '0 2px 8px rgba(0,0,0,0.20)';

            return (
              <div
                key={cat.name}
                className="rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden"
                style={{
                  padding: '22px 20px',
                  background: cardBg,
                  border: `1.5px solid ${cardBorder}`,
                  boxShadow: cardShadow,
                  transform: isHovered || isSelected ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onClick={() => handleSelect(cat.name)}
                onMouseEnter={() => setHovered(cat.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Subtle color wash on hover/select */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(135deg, ${cat.color}08 0%, transparent 60%)`,
                    opacity: isSelected || isHovered ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                    pointerEvents: 'none',
                  }}
                />

                {/* Selected checkmark */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}

                {/* Icon container */}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: iconBg,
                    border: `1.5px solid ${iconBorder}`,
                    color: cat.color,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 4px 16px ${cat.color}30` : 'none',
                  }}
                >
                  {cat.icon}
                </div>

                {/* Name */}
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    marginBottom: '6px',
                    letterSpacing: '-0.2px',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-outfit)',
                    position: 'relative',
                  }}
                >
                  {cat.name}
                </div>

                {/* Description */}
                <div
                  style={{
                    fontSize: '11.5px',
                    lineHeight: '1.55',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-outfit)',
                    position: 'relative',
                  }}
                >
                  {cat.desc}
                </div>

                {/* Agent tag */}
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-sub)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: cat.color,
                      animation: 'blink 2s infinite',
                      boxShadow: `0 0 6px ${cat.color}`,
                    }}
                  />
                  {cat.agent}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-9 py-3.5 border-t flex items-center justify-between"
        style={{
          borderColor: 'var(--border-light)',
          background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(10,14,35,0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div
          className="flex items-center gap-1.5 text-[12px] cursor-pointer transition-colors hover:text-[var(--text)]"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Guardar rascunho
        </div>
        <button
          className="flex items-center gap-2 px-[22px] py-[11px] rounded-full border-none text-white text-[13px] font-bold cursor-pointer transition-all"
          style={{
            background: selected ? 'var(--blue)' : (isLight ? '#94a3b8' : '#334155'),
            boxShadow: selected ? '0 4px 14px var(--blue-glow)' : 'none',
            fontFamily: 'var(--font-outfit)',
            letterSpacing: '-0.01em',
            transition: 'all 0.2s ease',
            cursor: selected ? 'pointer' : 'default',
          }}
          onClick={selected ? onNextPage : undefined}
          onMouseEnter={e => { if (selected) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px var(--blue-glow)'; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = selected ? '0 4px 14px var(--blue-glow)' : 'none'; }}
        >
          Continuar → Brainstorming
        </button>
      </div>

      <style>{`
        @keyframes vIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

interface CategoryPageProps {
  onSelectCategory: (category: string) => void;
  onNextPage: () => void;
}

/* ──────────────────────────────────────────────
   Banner-style tech icons  (dark rect + stroke)
   Same visual DNA as AnimatedBanner icons
   ────────────────────────────────────────────── */
const IconProcesso = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="9" fill="none" stroke={color} strokeWidth="1.5"/>
    <rect x="10" y="30" width="28" height="4.5" rx="2" fill={color} opacity="0.30"/>
    <rect x="10" y="22" width="28" height="4.5" rx="2" fill={color} opacity="0.58"/>
    <rect x="10" y="14" width="28" height="4.5" rx="2" fill={color}/>
    <circle cx="38.5" cy="16.5" r="2.5" fill={color} opacity="0.75"/>
    <line x1="38.5" y1="19" x2="38.5" y2="24" stroke={color} strokeWidth="1" opacity="0.4"/>
  </svg>
);

const IconProduto = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="9" fill="none" stroke={color} strokeWidth="1.5"/>
    <polygon points="27,7 17,27 24.5,27 21,41 35,22 28,22 27,7" fill={color}/>
    <circle cx="27" cy="7" r="2.5" fill="#ffaa00" opacity="0.9"/>
    <line x1="12" y1="27" x2="16" y2="27" stroke={color} strokeWidth="1" opacity="0.4"/>
    <line x1="36" y1="22" x2="40" y2="22" stroke={color} strokeWidth="1" opacity="0.4"/>
  </svg>
);

const IconCX = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="9" fill="none" stroke={color} strokeWidth="1.5"/>
    <path d="M24 38 C24 38 8 27 8 18 A9.5 9.5 0 0 1 24 13 A9.5 9.5 0 0 1 40 18 C40 27 24 38 24 38Z" fill={color} opacity="0.82"/>
    <circle cx="24" cy="19" r="3.5" fill="white" opacity="0.25"/>
    <circle cx="18" cy="16" r="1.5" fill="white" opacity="0.2"/>
  </svg>
);

const IconPessoas = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="9" fill="none" stroke={color} strokeWidth="1.5"/>
    <circle cx="17" cy="17" r="5.5" fill={color}/>
    <circle cx="31" cy="17" r="5.5" fill={color} opacity="0.52"/>
    <path d="M3 39 Q3 27 17 27 Q31 27 31 39" fill={color}/>
    <path d="M20 39 Q20 29.5 31 29.5 Q45 29.5 45 39" fill={color} opacity="0.38"/>
  </svg>
);

const IconTech = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="9" fill="none" stroke={color} strokeWidth="1.5"/>
    <rect x="6" y="9" width="36" height="23" rx="2" fill={`${color}18`} stroke={color} strokeWidth="1"/>
    <rect x="10" y="13" width="8" height="5" rx="1" fill={color} opacity="0.7"/>
    <rect x="21" y="13" width="14" height="2" rx="1" fill={color} opacity="0.4"/>
    <rect x="21" y="17" width="10" height="2" rx="1" fill={color} opacity="0.25"/>
    <rect x="10" y="21" width="25" height="2" rx="1" fill={color} opacity="0.18"/>
    <line x1="20" y1="32" x2="28" y2="32" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="24" y1="32" x2="24" y2="38" stroke={color} strokeWidth="2"/>
    <circle cx="42" cy="11" r="2" fill={color} opacity="0.6"/>
  </svg>
);

const IconOutros = ({ color }: { color: string }) => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="9" fill="none" stroke={color} strokeWidth="1.5"/>
    <circle cx="24" cy="19" r="9" fill="none" stroke={color} strokeWidth="2"/>
    <circle cx="24" cy="19" r="3.5" fill={color}/>
    <line x1="24" y1="28" x2="24" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="35" x2="29" y2="35" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* orbit marks */}
    <circle cx="24" cy="10" r="2" fill={color} opacity="0.45"/>
    <circle cx="15" cy="19" r="2" fill={color} opacity="0.45"/>
    <circle cx="33" cy="19" r="2" fill={color} opacity="0.45"/>
  </svg>
);

/* ── Categories — agent names synced with AgentsPage ── */
const categories = [
  {
    name: 'Melhoria de Processo',
    Icon: IconProcesso,
    desc: 'Optimização de fluxos, automação, eficiência operacional',
    agentLabel: 'Agente PMO',
    agentName: 'Armindo Kapessa',
    agentPhoto: '/labinovacaotis-react/agents/armindo.png',
    color: '#3126b4',
    gradFrom: '#3126b4',
    gradTo: '#4294F8',
    glowRgb: '49,38,180',
    driftClass: 'icon-drift-1',
  },
  {
    name: 'Novo Produto',
    Icon: IconProduto,
    desc: 'Novos produtos, funcionalidades ou serviços inovadores',
    agentLabel: 'Agente Produto',
    agentName: 'Esperança Ngunga',
    agentPhoto: '/labinovacaotis-react/agents/esperanca.png',
    color: '#FF0066',
    gradFrom: '#FF0066',
    gradTo: '#87007F',
    glowRgb: '255,0,102',
    driftClass: 'icon-drift-2',
  },
  {
    name: 'Experiência do Cliente',
    Icon: IconCX,
    desc: 'Melhorias no atendimento, jornada e satisfação',
    agentLabel: 'Agente CX',
    agentName: 'Domingas Tchikota',
    agentPhoto: '/labinovacaotis-react/agents/domingas.png',
    color: '#4294F8',
    gradFrom: '#4294F8',
    gradTo: '#00CFCF',
    glowRgb: '66,148,248',
    driftClass: 'icon-drift-1',
  },
  {
    name: 'Cultura & Pessoas',
    Icon: IconPessoas,
    desc: 'Bem-estar, reconhecimento, ambiente organizacional',
    agentLabel: 'Agente RH',
    agentName: 'Jacinto Bumba',
    agentPhoto: '/labinovacaotis-react/agents/jacinto.png',
    color: '#9437FF',
    gradFrom: '#9437FF',
    gradTo: '#3126b4',
    glowRgb: '148,55,255',
    driftClass: 'icon-drift-2',
  },
  {
    name: 'Tecnologia & Digital',
    Icon: IconTech,
    desc: 'Ferramentas digitais, dados, transformação digital',
    agentLabel: 'Agente Tech',
    agentName: 'Maria Nzinga',
    agentPhoto: '/labinovacaotis-react/agents/maria.png',
    color: '#036ef2',
    gradFrom: '#036ef2',
    gradTo: '#3126b4',
    glowRgb: '3,110,242',
    driftClass: 'icon-drift-1',
  },
  {
    name: 'Outros',
    Icon: IconOutros,
    desc: 'Qualquer ideia que não se enquadre nas categorias anteriores',
    agentLabel: 'Agente Gestão',
    agentName: 'Ernesto Quiala',
    agentPhoto: '/labinovacaotis-react/agents/ernesto.png',
    color: '#87007f',
    gradFrom: '#87007f',
    gradTo: '#FF0066',
    glowRgb: '135,0,127',
    driftClass: 'icon-drift-2',
  },
];

const stepLabels = ['Categoria', 'Brainstorming', 'Referências', 'Ideia'];

export default function CategoryPage({ onSelectCategory, onNextPage }: CategoryPageProps) {
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
    <div style={{
      minHeight: 'calc(100vh - 86px)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 28,
      background: isLight
        ? 'var(--bg)'
        : 'radial-gradient(ellipse at 50% -10%, #0f1a50 0%, #070b20 55%, #04061c 100%)',
      animation: 'catPageIn 0.4s cubic-bezier(0.16,1,0.3,1) both',
    }}>

      {/* ══════════════════════════════════════════
          TECH STEPPER
          ══════════════════════════════════════════ */}
      <div style={{
        flexShrink: 0,
        background: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(4,6,28,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.06)',
        padding: '10px 0 8px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle scanline */}
        {!isLight && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
          }}/>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {stepLabels.map((label, index) => {
            const isActive = index === 0;
            const isUpcoming = index > 0;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                {/* Node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 28, height: 28,
                      borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      background: isActive
                        ? 'linear-gradient(135deg, #036ef2, #3126b4)'
                        : isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
                      border: isActive
                        ? '1.5px solid #4294F8'
                        : isLight ? '1.5px solid rgba(0,0,0,0.09)' : '1.5px solid rgba(255,255,255,0.08)',
                      color: isActive ? '#fff' : isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.18)',
                      animation: isActive ? 'stepPulse 2.6s ease-in-out infinite' : 'none',
                      position: 'relative',
                      zIndex: 1,
                    }}>
                      {index + 1}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 8, fontWeight: isActive ? 700 : 400,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap', letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    color: isActive
                      ? '#4294F8'
                      : isLight ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.18)',
                    opacity: isUpcoming ? 0.6 : 1,
                  }}>
                    {label}
                  </span>
                </div>

                {/* Connector — linha + uma bolinha central */}
                {index < stepLabels.length - 1 && (
                  <div style={{
                    width: 52, height: 1,
                    margin: '0 8px', marginBottom: 16,
                    background: isLight ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.09)',
                    borderRadius: 9999, position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: isLight ? 'rgba(3,110,242,0.25)' : 'rgba(3,110,242,0.35)',
                      border: `1px solid ${isLight ? 'rgba(3,110,242,0.4)' : 'rgba(66,148,248,0.45)'}`,
                      flexShrink: 0,
                    }}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* ══════════════════════════════════════════
          GRID COM MARGENS
          ══════════════════════════════════════════ */}
      <div style={{
        flex: 1,
        padding: '32px 52px 0',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 18,
        }}>
        {categories.map((cat) => {
          const isSelected = selected === cat.name;
          const isHov = hovered === cat.name;
          const active = isSelected || isHov;

          return (
            <div
              key={cat.name}
              style={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 12,
                border: active
                  ? `1.5px solid ${cat.color}70`
                  : isLight ? '1.5px solid rgba(0,0,0,0.07)' : '1.5px solid rgba(255,255,255,0.07)',
                transition: 'background 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.3s, box-shadow 0.3s, transform 0.25s',
                transform: active ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: active
                  ? `0 12px 40px rgba(${cat.glowRgb},0.25), 0 0 0 1px ${cat.color}30`
                  : isLight ? '0 2px 10px rgba(0,0,0,0.06)' : '0 2px 10px rgba(0,0,0,0.25)',
                background: active
                  ? `linear-gradient(145deg, ${cat.gradFrom}ee 0%, ${cat.gradTo}cc 100%)`
                  : isLight
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(10,14,35,0.7)',
              }}
              onClick={() => handleSelect(cat.name)}
              onMouseEnter={() => setHovered(cat.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Color wash overlay on hover */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `radial-gradient(ellipse at 30% 30%, ${cat.color}30 0%, transparent 65%)`,
                opacity: active ? 1 : 0,
                transition: 'opacity 0.35s ease',
              }}/>

              {/* Corner glow orb */}
              {active && (
                <div style={{
                  position: 'absolute', bottom: -50, right: -50,
                  width: 220, height: 220, borderRadius: '50%',
                  background: `radial-gradient(circle, ${cat.color}55 0%, transparent 70%)`,
                  pointerEvents: 'none',
                  animation: 'glowOrb 2.2s ease-in-out infinite',
                }}/>
              )}

              {/* Selected tick */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 22, height: 22, borderRadius: 6,
                  background: 'rgba(255,255,255,0.22)',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              )}

              {/* ── Card content ── */}
              <div style={{
                padding: '34px 34px 28px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 1,
                boxSizing: 'border-box',
              }}>

                {/* Icon — same drift animation as home banner */}
                <div
                  className={cat.driftClass}
                  style={{
                    display: 'inline-flex',
                    marginBottom: 18,
                    filter: active
                      ? `drop-shadow(0 0 14px rgba(${cat.glowRgb},0.95)) drop-shadow(0 0 36px rgba(${cat.glowRgb},0.55))`
                      : `drop-shadow(0 0 7px rgba(${cat.glowRgb},0.55)) drop-shadow(0 0 20px rgba(${cat.glowRgb},0.25))`,
                    transition: 'filter 0.3s ease',
                  }}
                >
                  <cat.Icon color={active ? '#fff' : cat.color}/>
                </div>

                {/* Category name */}
                <div style={{
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: 'var(--font-outfit)',
                  letterSpacing: -0.3,
                  color: active ? '#fff' : isLight ? 'var(--text)' : '#fff',
                  marginBottom: 7,
                  transition: 'color 0.3s ease',
                }}>
                  {cat.name}
                </div>

                {/* Description */}
                <div style={{
                  fontSize: 12.5,
                  lineHeight: 1.58,
                  fontFamily: 'var(--font-outfit)',
                  color: active ? 'rgba(255,255,255,0.78)' : isLight ? 'var(--text-muted)' : 'rgba(180,200,255,0.42)',
                  flex: 1,
                  transition: 'color 0.3s ease',
                }}>
                  {cat.desc}
                </div>

                {/* Agent row — photo + label */}
                <div style={{
                  marginTop: 18,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {/* Discrete agent photo */}
                  <img
                    src={cat.agentPhoto}
                    alt={cat.agentName}
                    style={{
                      width: 26, height: 26,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      border: `1.5px solid ${active ? 'rgba(255,255,255,0.55)' : cat.color + '60'}`,
                      transition: 'border-color 0.3s ease',
                      flexShrink: 0,
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />

                  {/* Pulse dot + label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: active ? 'rgba(255,255,255,0.65)' : cat.color,
                      animation: 'blink 2s infinite',
                      boxShadow: active ? 'none' : `0 0 5px ${cat.color}`,
                      flexShrink: 0,
                    }}/>
                    <span style={{
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      color: active ? 'rgba(255,255,255,0.65)' : isLight ? 'var(--text-sub)' : 'rgba(180,200,255,0.38)',
                      transition: 'color 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}>
                      {cat.agentLabel} · {cat.agentName}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        </div>

        {/* ── Barra de acção — imediatamente abaixo dos cards ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 2px 32px',
        }}>
          {/* Links secundários */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, cursor: 'pointer',
                color: isLight ? 'var(--text-muted)' : 'rgba(180,200,255,0.35)',
                fontFamily: 'var(--font-outfit)',
              }}
              onClick={() => navigate('/')}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Início
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, cursor: 'pointer',
              color: isLight ? 'var(--text-muted)' : 'rgba(180,200,255,0.28)',
              fontFamily: 'var(--font-outfit)',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar rascunho
            </div>
          </div>

          {/* Botão Continuar — proeminente */}
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '13px 32px', borderRadius: 9999,
              border: 'none',
              background: selected
                ? 'linear-gradient(135deg, #036ef2, #3126b4)'
                : isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)',
              color: selected ? '#fff' : isLight ? '#94a3b8' : 'rgba(255,255,255,0.2)',
              fontSize: 14, fontWeight: 700,
              fontFamily: 'var(--font-outfit)',
              cursor: selected ? 'pointer' : 'default',
              letterSpacing: -0.2,
              boxShadow: selected ? '0 6px 24px rgba(3,110,242,0.42)' : 'none',
              transition: 'all 0.2s ease',
              opacity: selected ? 1 : 0.5,
            }}
            onClick={selected ? onNextPage : undefined}
            onMouseEnter={e => { if (selected) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(3,110,242,0.55)'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = selected ? '0 6px 24px rgba(3,110,242,0.42)' : 'none'; }}
          >
            Continuar para Brainstorming
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes catPageIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.22; }
        }
        @keyframes glowOrb {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.12); }
        }

        /* ── Icon drift — same as AnimatedBanner ── */
        @keyframes iconDrift1 {
          0%,100% { transform: translateY(0)    translateX(0); }
          40%     { transform: translateY(-8px)  translateX(4px); }
          70%     { transform: translateY(-4px)  translateX(-3px); }
        }
        @keyframes iconDrift2 {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(8px); }
        }
        .icon-drift-1 { animation: iconDrift1 6s ease-in-out infinite; }
        .icon-drift-2 { animation: iconDrift2 7s ease-in-out infinite; }

        /* ── Step node pulse (discreto) ── */
        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(3,110,242,0.13), 0 0 14px rgba(3,110,242,0.30); }
          50%       { box-shadow: 0 0 0 5px rgba(3,110,242,0.07), 0 0 22px rgba(3,110,242,0.48); }
        }
      `}</style>
    </div>
  );
}

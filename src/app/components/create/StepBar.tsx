import { useTheme } from '../../context/ThemeContext';

interface SideStepBarProps {
  currentStep: number;
  onBack: () => void;
  backLabel: string;
  isAnonymous: boolean;
  setIsAnonymous: (v: boolean) => void;
}

const steps = [
  { label: 'Categoria',      hint: 'Tipo de ideia'     },
  { label: 'Brainstorming',  hint: 'Refinada com IA'   },
  { label: 'Referências',    hint: 'Suporte externo'    },
  { label: 'Ideia',          hint: 'Resumo final'       },
];

export default function SideStepBar({
  currentStep,
  onBack,
  backLabel,
  isAnonymous,
  setIsAnonymous,
}: SideStepBarProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      style={{
        width: '216px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px',
        borderRight: '1px solid var(--border-light)',
        background: isLight ? 'rgba(248,250,252,1)' : 'var(--bg2)',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '5px 8px',
          borderRadius: '8px',
          marginBottom: '36px',
          transition: 'color 0.15s ease',
          fontFamily: 'var(--font-outfit)',
          alignSelf: 'flex-start',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {backLabel}
      </button>

      {/* Steps */}
      <div style={{ flex: 1 }}>
        {steps.map((step, index) => {
          const isDone     = index < currentStep;
          const isActive   = index === currentStep;
          const isUpcoming = index > currentStep;

          const circleBg = isDone
            ? (isLight ? '#ecfdf5' : 'rgba(52,211,153,0.12)')
            : isActive
            ? '#036ef2'
            : (isLight ? '#f1f5f9' : 'var(--surface2)');

          const circleBorder = isDone
            ? (isLight ? '#6ee7b7' : 'rgba(52,211,153,0.45)')
            : isActive
            ? '#036ef2'
            : (isLight ? '#e2e8f0' : 'var(--border2)');

          const circleColor = isDone ? '#10b981' : isActive ? '#fff' : 'var(--text-sub)';

          return (
            <div key={index} style={{ display: 'flex', gap: '14px' }}>
              {/* Left column: circle + connector */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                    background: circleBg,
                    border: `2px solid ${circleBorder}`,
                    color: circleColor,
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(3,110,242,0.14), 0 0 18px rgba(3,110,242,0.28)'
                      : 'none',
                    transition: 'all 0.35s ease',
                  }}
                >
                  {isDone ? (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Vertical connector */}
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: '2px',
                      height: '44px',
                      background: isLight ? '#e8edf4' : 'var(--border2)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      margin: '5px 0',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: isDone ? '100%' : '0%',
                        background: 'linear-gradient(180deg, #036ef2 0%, #34d399 100%)',
                        borderRadius: '9999px',
                        transition: 'height 0.55s cubic-bezier(0.16,1,0.3,1)',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Right column: label */}
              <div
                style={{
                  paddingTop: '4px',
                  paddingBottom: index < steps.length - 1 ? '0' : '0',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    lineHeight: '28px',
                    color: isDone
                      ? (isLight ? '#b0b8c4' : 'rgba(156,163,175,0.55)')
                      : isActive
                      ? '#036ef2'
                      : 'var(--text-sub)',
                    fontFamily: 'var(--font-outfit)',
                    opacity: isUpcoming ? 0.55 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.label}
                </div>
                {isActive && (
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-sub)',
                      fontFamily: 'var(--font-mono)',
                      marginTop: '-4px',
                      opacity: 0.75,
                    }}
                  >
                    {step.hint}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Anonymous toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-light)',
          marginTop: '16px',
        }}
      >
        <div
          onClick={() => setIsAnonymous(!isAnonymous)}
          style={{
            width: '34px',
            height: '18px',
            borderRadius: '9px',
            background: isAnonymous ? '#036ef2' : (isLight ? '#e2e8f0' : 'var(--surface2)'),
            border: `1.5px solid ${isAnonymous ? '#036ef2' : (isLight ? '#cbd5e1' : 'var(--border2)')}`,
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#fff',
              top: '2px',
              left: isAnonymous ? '18px' : '2px',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-outfit)',
          }}
        >
          Anónimo
        </span>
      </div>
    </div>
  );
}

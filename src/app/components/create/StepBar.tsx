import { useTheme } from '../../context/ThemeContext';

interface StepBarProps {
  currentStep: number;
  onBack: () => void;
  backLabel: string;
}

export default function StepBar({ currentStep, onBack, backLabel }: StepBarProps) {
  const steps = ['Categoria', 'Brainstorming', 'Referências', 'Ideia'];
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className="px-9 flex items-center justify-between"
      style={{
        background: 'var(--bg)',
        height: '64px',
      }}
    >
      {/* Back button */}
      <div
        className="flex items-center gap-2 text-[13px] font-medium cursor-pointer transition-all duration-150 hover:opacity-80 select-none"
        style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
        onClick={onBack}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {backLabel}
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {steps.map((step, index) => {
          const isDone   = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center" style={{ gap: '5px' }}>
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    width: '26px',
                    height: '26px',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    background: isDone
                      ? (isLight ? '#ecfdf5' : 'rgba(52,211,153,0.12)')
                      : isActive
                      ? '#036ef2'
                      : (isLight ? '#f1f5f9' : 'var(--surface2)'),
                    border: isDone
                      ? `2px solid ${isLight ? '#6ee7b7' : 'rgba(52,211,153,0.45)'}`
                      : isActive
                      ? '2px solid #036ef2'
                      : `2px solid ${isLight ? '#e2e8f0' : 'var(--border2)'}`,
                    color: isDone ? '#10b981' : isActive ? '#fff' : 'var(--text-sub)',
                    boxShadow: isActive ? '0 0 0 4px rgba(3,110,242,0.15), 0 0 16px rgba(3,110,242,0.35)' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {isDone ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: 'var(--font-outfit)',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    color: isDone
                      ? (isLight ? '#9ca3af' : 'rgba(156,163,175,0.6)')
                      : isActive
                      ? '#036ef2'
                      : 'var(--text-sub)',
                    opacity: index > currentStep ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className="mx-2 rounded-full overflow-hidden"
                  style={{
                    width: '36px',
                    height: '2px',
                    marginBottom: '15px',
                    background: isLight ? '#e2e8f0' : 'var(--border2)',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: isDone ? '100%' : '0%',
                      background: 'linear-gradient(90deg, #036ef2 0%, #34d399 100%)',
                      transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spacer to balance the back button */}
      <div style={{ width: '80px' }} />
    </div>
  );
}

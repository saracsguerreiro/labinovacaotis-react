interface StepBarProps {
  currentStep: number;
  onBack: () => void;
  backLabel: string;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

export default function StepBar({ currentStep, onBack, backLabel, isAnonymous, setIsAnonymous }: StepBarProps) {
  const steps = ['Categoria', 'Brainstorming', 'Referências', 'Ideia'];

  return (
    <div className="px-9 py-[18px] flex items-center justify-between border-b bg-[var(--bg)]" style={{ borderColor: 'var(--border-light)', boxShadow: '0 1px 0 var(--border-light)' }}>
      <div
        className="flex items-center gap-[7px] text-[13px] font-medium cursor-pointer transition-colors hover:text-[var(--text)]"
        style={{ color: 'var(--text-muted)' }}
        onClick={onBack}
      >
        ← {backLabel}
      </div>

      <div className="flex items-center">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          return (
            <div key={index} className="flex items-center">
              <div
                className={`flex items-center gap-2 text-[12px] font-semibold transition-all ${
                  isDone ? 'text-[#717378]' : isActive ? 'text-[var(--blue)]' : 'text-[var(--text-sub)]'
                }`}
              >
                <div
                  className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isDone
                      ? 'bg-[#717378] border-[#717378] text-white'
                      : isActive
                      ? 'bg-[var(--blue)] border-[var(--blue)] text-white'
                      : 'bg-[var(--surface2)] border-[var(--border2)] text-[var(--text-sub)]'
                  }`}
                  style={{
                    border: '1.5px solid',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isActive ? '0 0 12px var(--blue-glow)' : 'none',
                  }}
                >
                  {isDone ? '✓' : index + 1}
                </div>
                {step}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-9 h-[1.5px] mx-1 ${isDone ? 'bg-[#717378]' : 'bg-[var(--border2)]'}`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-[12px] font-medium" style={{ color: 'var(--text-muted)' }}>
        <div
          className={`w-[34px] h-[18px] rounded-[9px] border-[1.5px] relative cursor-pointer transition-all ${
            isAnonymous ? 'bg-[var(--blue)] border-[var(--blue)]' : 'bg-[var(--surface2)]'
          }`}
          style={{ borderColor: isAnonymous ? 'var(--blue)' : 'var(--border2)' }}
          onClick={() => setIsAnonymous(!isAnonymous)}
        >
          <div
            className={`absolute w-3 h-3 bg-white rounded-full top-0.5 transition-all ${isAnonymous ? 'left-[18px]' : 'left-0.5'}`}
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
          />
        </div>
        Anónimo
      </div>
    </div>
  );
}

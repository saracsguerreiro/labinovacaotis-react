import { useState } from 'react';
import StepBar from './StepBar';

interface ReferencesPageProps {
  onBack: () => void;
  onNextPage: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

const aiCases = [
  {
    company: '🏢 SIEMENS · caso_real',
    title: 'Automação de aprovações de baixo valor com RPA',
    desc: 'Redução de 73% no tempo de aprovação ao automatizar despesas abaixo de €500.',
    tags: ['RPA', 'automação'],
  },
  {
    company: '🌍 UNILEVER · caso_real',
    title: 'SLA de 48h para aprovações internas globais',
    desc: 'SLAs com notificações automáticas aumentaram satisfação em 41%.',
    tags: ['SLA', 'notificações'],
  },
  {
    company: '💡 SAP · white_paper',
    title: 'Mobile-first approval workflows',
    desc: 'Aprovações mobile reduzem tempo de resposta em 60% vs. processos desktop.',
    tags: ['mobile', 'workflow'],
  },
];

export default function ReferencesPage({ onBack, onNextPage, isAnonymous, setIsAnonymous }: ReferencesPageProps) {
  const [savedCases, setSavedCases] = useState([1]);
  const [files, setFiles] = useState(['benchmark_aprovacoes_2024.pdf', 'notion.so/exemplos-processo-aprovacao']);

  const toggleCase = (index: number) => {
    setSavedCases((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <div className="min-h-screen flex flex-col animate-[vIn_0.35s_ease_both]">
      <StepBar currentStep={2} onBack={onBack} backLabel="Brainstorming" isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />

      <div className="flex-1 grid grid-cols-2 overflow-hidden" style={{ height: 'calc(100vh - 118px)' }}>
        {/* Left Panel */}
        <div className="px-6 py-6 overflow-y-auto border-r-[1.5px]" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center mb-3.5">
            <div className="text-[10px] font-medium uppercase tracking-[2px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              As tuas referências
            </div>
            <span
              className="text-[10px] border rounded px-2 py-0.5 ml-2"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-sub)',
                background: 'var(--surface2)',
                borderColor: 'var(--border-light)',
              }}
            >
              opcional
            </span>
          </div>

          <div
            className="border-2 border-dashed rounded-xl px-4 py-7 text-center cursor-pointer transition-all mb-4 hover:border-[var(--blue)] hover:bg-[var(--blue-light)]"
            style={{ background: '#111827', borderColor: 'rgba(37,99,235,0.3)' }}
          >
            <div className="text-2xl mb-1.5">📎</div>
            <h3 className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
              Arrasta ficheiros ou clica
            </h3>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              PDF, imagens, apresentações, documentos
            </p>
          </div>

          <div className="flex gap-1.5 mb-4">
            <input
              type="text"
              className="flex-1 bg-[var(--surface)] border-[1.5px] rounded-full px-3 py-2 text-[12px] outline-none transition-colors focus:border-[var(--blue)]"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
              placeholder="Cola um link ou URL..."
            />
            <button
              className="px-3.5 py-2 rounded-full border-none text-white text-[12px] font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8]"
              style={{ background: 'var(--blue)', fontFamily: 'var(--font-outfit)' }}
            >
              Adicionar
            </button>
          </div>

          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-[var(--surface2)] border-[1.5px] rounded-full px-3 py-2 text-[11px] mb-1.5"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <span>{file.includes('pdf') ? '📄' : '🔗'}</span>
              <span className="flex-1" style={{ color: 'var(--text-muted)' }}>
                {file}
              </span>
              <span className="cursor-pointer" style={{ color: 'var(--text-sub)' }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                ×
              </span>
            </div>
          ))}

          <div className="mt-4">
            <div className="flex items-center gap-1.5 text-[12px] font-bold mb-2.5" style={{ color: 'var(--text)' }}>
              Casos sugeridos pela IA{' '}
              <span
                className="text-[9px] border rounded px-1.5 py-0.5"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: 'var(--blue-light)',
                  borderColor: 'rgba(37,99,235,0.25)',
                  color: 'var(--blue)',
                }}
              >
                IA
              </span>
            </div>

            {aiCases.map((c, i) => (
              <div
                key={i}
                className={`bg-[var(--surface)] border-[1.5px] rounded-[10px] p-3 mb-2 cursor-pointer transition-all hover:border-[var(--blue)] hover:translate-x-0.5 shadow-[0_1px_4px_rgba(30,50,140,0.05)] ${
                  savedCases.includes(i) ? 'border-[var(--cyan)] bg-[var(--cyan-light)]' : ''
                }`}
                style={{ borderColor: savedCases.includes(i) ? 'var(--cyan)' : 'var(--border-light)' }}
                onClick={() => toggleCase(i)}
              >
                <div className="text-[10px] mb-0.5" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {c.company}
                </div>
                <div className="text-[12px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>
                  {c.title}
                </div>
                <div className="text-[11px] leading-[1.5] mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  {c.desc}
                </div>
                <div className="flex gap-1 mb-1.5">
                  {c.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="px-1.5 py-0.5 border rounded text-[9px]"
                      style={{
                        background: 'var(--surface2)',
                        borderColor: 'var(--border-light)',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className={`mt-1.5 px-2.5 py-1 bg-transparent border-[1.5px] rounded text-[10px] cursor-pointer transition-all hover:border-[var(--cyan)] hover:text-[var(--cyan)] ${
                    savedCases.includes(i) ? 'border-[var(--cyan)] text-[var(--cyan)]' : ''
                  }`}
                  style={{
                    borderColor: savedCases.includes(i) ? 'var(--cyan)' : 'var(--border-light)',
                    color: savedCases.includes(i) ? 'var(--cyan)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {savedCases.includes(i) ? '✓ adicionado' : '+ adicionar'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="px-6 py-6 overflow-y-auto">
          <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            Referências seleccionadas
          </div>

          <div className="flex items-center gap-2 bg-[var(--cyan-light)] border-[1.5px] rounded-full px-3 py-2 text-[11px] mb-1.5" style={{ borderColor: 'rgba(8,145,178,0.2)' }}>
            <span>📄</span>
            <span className="flex-1" style={{ color: 'var(--text-muted)' }}>
              benchmark_aprovacoes_2024.pdf
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[var(--cyan-light)] border-[1.5px] rounded-full px-3 py-2 text-[11px] mb-1.5" style={{ borderColor: 'rgba(8,145,178,0.2)' }}>
            <span>🔗</span>
            <span className="flex-1" style={{ color: 'var(--text-muted)' }}>
              notion.so/exemplos-processo-aprovacao
            </span>
          </div>
          {savedCases.includes(1) && (
            <div className="flex items-center gap-2 bg-[var(--cyan-light)] border-[1.5px] rounded-full px-3 py-2 text-[11px] mb-1.5" style={{ borderColor: 'rgba(8,145,178,0.2)' }}>
              <span>🌍</span>
              <span className="flex-1" style={{ color: 'var(--text-muted)' }}>
                Caso Unilever — SLA 48h globais
              </span>
            </div>
          )}

          <div className="mt-5">
            <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              Nota da IA
            </div>
            <div
              className="bg-[var(--surface2)] border-[1.5px] rounded-[10px] p-3.5 text-[12px] leading-[1.6]"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
            >
              As referências que escolheste suportam bem a proposta. O caso Unilever é especialmente relevante — mostra impacto mensurável em satisfação.
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <button
              className="w-full flex items-center justify-center gap-2 px-[22px] py-[11px] rounded-full border-none text-white text-[13px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-px"
              style={{
                background: 'var(--blue)',
                boxShadow: '0 4px 12px var(--blue-glow)',
                fontFamily: 'var(--font-outfit)',
              }}
              onClick={onNextPage}
            >
              Continuar → Resumo da Ideia
            </button>
            <div
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 border-2 border-dashed rounded-full text-[12px] cursor-pointer transition-all hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
              style={{ borderColor: 'var(--border2)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              onClick={onNextPage}
            >
              → Continuar sem referências
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

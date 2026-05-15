import { useState } from 'react';
import StepBar from './StepBar';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface SummaryPageProps {
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

export default function SummaryPage({ onBack, onNavigate, isAnonymous, setIsAnonymous }: SummaryPageProps) {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col animate-[vIn_0.35s_ease_both]">
      <StepBar currentStep={3} onBack={onBack} backLabel="Referências" isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />

      <div className="flex-1 grid grid-cols-[1fr_340px] overflow-hidden" style={{ height: 'calc(100vh - 118px)' }}>
        {/* Main Content */}
        <div className="px-8 py-7 overflow-y-auto bg-[var(--bg)]">
          <div
            className="inline-flex items-center gap-1.5 border-[1.5px] rounded px-3 py-1 text-[11px] font-bold mb-3.5"
            style={{
              background: 'var(--blue-light)',
              borderColor: 'rgba(37,99,235,0.2)',
              color: 'var(--blue)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ⬡ melhoria_processo
          </div>

          <input
            className="text-[26px] font-[800] bg-transparent border-none border-b-2 w-full px-0 py-1.5 outline-none tracking-[-0.5px] mb-4 transition-colors focus:border-[var(--blue)]"
            style={{
              borderColor: 'var(--border2)',
              color: 'var(--text)',
              fontFamily: 'var(--font-outfit)',
            }}
            type="text"
            defaultValue="Automatização do processo de aprovação de despesas"
          />

          <div className="text-[10px] mb-6" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            // gerado pela IA · podes editar qualquer secção
          </div>

          <div
            className="bg-[var(--surface)] border-[1.5px] rounded-xl p-[18px] mb-3.5 transition-all shadow-[0_1px_4px_rgba(30,50,140,0.05)] hover:border-[var(--border2)] hover:shadow-[0_4px_16px_rgba(30,50,140,0.08)]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-medium uppercase tracking-[1.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                // problema
              </div>
              <button
                className="px-2 py-0.5 border-[1.5px] rounded text-[10px] cursor-pointer bg-transparent transition-all hover:bg-[var(--blue-light)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue)',
                  borderColor: 'rgba(37,99,235,0.25)',
                }}
              >
                editar
              </button>
            </div>
            <p className="text-[13px] leading-[1.7]" style={{ color: 'var(--text-muted)' }}>
              O processo actual de aprovação de despesas é lento e opaco, causando semanas de espera sem feedback. Os colaboradores perdem motivação para submeter pedidos legítimos, criando atrasos em projectos críticos.
            </p>
          </div>

          <div
            className="bg-[var(--surface)] border-[1.5px] rounded-xl p-[18px] mb-3.5 transition-all shadow-[0_1px_4px_rgba(30,50,140,0.05)] hover:border-[var(--border2)] hover:shadow-[0_4px_16px_rgba(30,50,140,0.08)]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-medium uppercase tracking-[1.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                // solução proposta
              </div>
              <button
                className="px-2 py-0.5 border-[1.5px] rounded text-[10px] cursor-pointer bg-transparent transition-all hover:bg-[var(--blue-light)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue)',
                  borderColor: 'rgba(37,99,235,0.25)',
                }}
              >
                editar
              </button>
            </div>
            <ul className="list-none flex flex-col gap-1.5">
              {[
                'Automatização de aprovações até €500 sem necessidade de aprovador humano',
                'SLA máximo de 48h com notificações automáticas ao colaborador',
                'Dashboard de visibilidade em tempo real sobre o estado do pedido',
                'App mobile para aprovadores responderem em qualquer lugar',
              ].map((item, i) => (
                <li key={i} className="text-[12px] flex items-start gap-1.5 leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
                  <span className="text-[14px] flex-shrink-0 leading-[1.3]" style={{ color: 'var(--blue)' }}>
                    ›
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-[var(--surface)] border-[1.5px] rounded-xl p-[18px] mb-3.5 transition-all shadow-[0_1px_4px_rgba(30,50,140,0.05)] hover:border-[var(--border2)] hover:shadow-[0_4px_16px_rgba(30,50,140,0.08)]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-medium uppercase tracking-[1.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                // impacto esperado
              </div>
              <button
                className="px-2 py-0.5 border-[1.5px] rounded text-[10px] cursor-pointer bg-transparent transition-all hover:bg-[var(--blue-light)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue)',
                  borderColor: 'rgba(37,99,235,0.25)',
                }}
              >
                editar
              </button>
            </div>
            <div className="mt-1">
              {[
                { label: 'Redução no tempo de aprovação', value: '~73%', width: '73%', color: 'var(--cyan)' },
                { label: 'Satisfação dos colaboradores', value: '+41%', width: '80%', color: 'var(--blue)' },
                { label: 'Horas poupadas por ano', value: '~2.800h', width: '65%', color: 'var(--violet)' },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between mb-2">
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {metric.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-[90px] h-[3px] rounded-sm overflow-hidden" style={{ background: 'var(--surface2)' }}>
                      <div className="h-full rounded-sm transition-all duration-[0.6s]" style={{ width: metric.width, background: metric.color }} />
                    </div>
                    <span className="min-w-[32px] text-right text-[10px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {metric.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="bg-[var(--surface)] border-[1.5px] rounded-xl p-[18px] mb-3.5 transition-all shadow-[0_1px_4px_rgba(30,50,140,0.05)] hover:border-[var(--border2)] hover:shadow-[0_4px_16px_rgba(30,50,140,0.08)]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-medium uppercase tracking-[1.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                // recursos e métricas (sugerido pela IA)
              </div>
              <button
                className="px-2 py-0.5 border-[1.5px] rounded text-[10px] cursor-pointer bg-transparent transition-all hover:bg-[var(--blue-light)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue)',
                  borderColor: 'rgba(37,99,235,0.25)',
                }}
              >
                editar
              </button>
            </div>
            <ul className="list-none flex flex-col gap-1.5">
              {[
                'Recursos: equipa de TI (2 devs, 6 semanas), ferramenta RPA, licenças mobile',
                'Métrica principal: tempo médio de aprovação (baseline: 18 dias → target: 48h)',
                'Métricas secundárias: nº pedidos submetidos, taxa de abandono, NPS interno',
              ].map((item, i) => (
                <li key={i} className="text-[12px] flex items-start gap-1.5 leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
                  <span className="text-[14px] flex-shrink-0 leading-[1.3]" style={{ color: 'var(--blue)' }}>
                    ›
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="bg-[var(--surface)] border-[1.5px] rounded-xl p-[18px] transition-all shadow-[0_1px_4px_rgba(30,50,140,0.05)] hover:border-[var(--border2)] hover:shadow-[0_4px_16px_rgba(30,50,140,0.08)]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-medium uppercase tracking-[1.5px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                // referências
              </div>
              <button
                className="px-2 py-0.5 border-[1.5px] rounded text-[10px] cursor-pointer bg-transparent transition-all hover:bg-[var(--blue-light)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue)',
                  borderColor: 'rgba(37,99,235,0.25)',
                }}
                onClick={onBack}
              >
                gerir
              </button>
            </div>
            {['📄 benchmark_aprovacoes_2024.pdf', '🌍 Caso Unilever — SLA 48h globais', '🔗 notion.so/exemplos-processo-aprovacao'].map((ref, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[11px] px-2 py-1.5 rounded-[7px] mb-1.5"
                style={{ color: 'var(--text-muted)', background: 'var(--surface2)' }}
              >
                {ref}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="px-6 py-6 border-l-[1.5px] overflow-y-auto bg-[var(--bg2)]" style={{ borderColor: 'var(--border-light)' }}>
          <div
            className="border-[1.5px] rounded-full p-3.5 mb-3.5"
            style={{
              background: 'rgba(37,99,235,0.05)',
              borderColor: 'rgba(37,99,235,0.15)',
            }}
          >
            <h4 className="flex items-center gap-1.5 text-[12px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>
              <div className="w-[18px] h-[18px] bg-[#0058d4] rounded flex items-center justify-center text-[9px] font-[800] text-white" style={{ fontFamily: 'var(--font-mono)' }}>
                T
              </div>
              Canal Teams
            </h4>
            <p className="text-[11px] leading-[1.5] mb-2" style={{ color: 'var(--text-muted)' }}>
              Canal dedicado criado automaticamente quando a ideia entrar em análise.
            </p>
            <button
              className="w-full px-3 py-1.5 bg-[var(--surface)] border-[1.5px] rounded-full text-[11px] cursor-pointer transition-all hover:border-[var(--blue)] hover:text-[var(--blue)]"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
            >
              Saber mais
            </button>
          </div>

          <div className="mb-3.5">
            <h4 className="text-[10px] font-medium uppercase tracking-[1.5px] mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              Co-autores
            </h4>
            <div className="flex gap-1.5 mb-2">
              <input
                className="flex-1 bg-[var(--surface)] border-[1.5px] rounded-[7px] px-3 py-1.5 text-[11px] outline-none transition-colors focus:border-[var(--blue)]"
                style={{ borderColor: 'var(--border-light)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                type="text"
                placeholder="Nome ou email..."
              />
              <button
                className="px-3 py-1.5 bg-[var(--surface)] border-[1.5px] rounded-full text-[11px] cursor-pointer transition-all hover:border-[var(--blue)] hover:text-[var(--blue)]"
                style={{ borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <div
                className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #4294F8, #87007F)' }}
              >
                RC
              </div>
              Rita Campos · Co-autora
            </div>
          </div>

          <div
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-[12px] mb-3 border"
            style={{
              background: 'var(--surface2)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-muted)',
            }}
          >
            <span>Submeter como anónimo</span>
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
          </div>

          <button
            className="w-full px-3 py-3 rounded-full border-none text-white text-[14px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-px mb-2.5"
            style={{
              background: 'var(--blue)',
              boxShadow: '0 4px 16px var(--blue-glow)',
              fontFamily: 'var(--font-outfit)',
            }}
            onClick={handleSubmit}
          >
            🚀 Submeter Ideia
          </button>

          <div
            className="flex justify-center items-center gap-1.5 text-[12px] cursor-pointer transition-colors hover:text-[var(--text)]"
            style={{ color: 'var(--text-muted)' }}
          >
            💾 Guardar como rascunho
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-[999] animate-[vIn_0.3s_ease]"
          style={{ background: 'rgba(255,255,255,0.97)' }}
        >
          <div className="text-center max-w-[460px] px-10 py-10">
            <div className="text-[56px] mb-5">🚀</div>
            <h2 className="text-[30px] font-[800] mb-2.5 tracking-[-0.5px]" style={{ fontFamily: 'var(--font-outfit)', color: 'var(--text)' }}>
              Ideia submetida!
            </h2>
            <p className="text-[14px] leading-[1.7] mb-7" style={{ color: 'var(--text-muted)' }}>
              A tua ideia foi enviada para o Laboratório de Inovação. Quando entrar em análise, um canal Teams será criado automaticamente.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                className="px-[22px] py-[11px] rounded-full border-none text-white text-[13px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8]"
                style={{
                  background: 'var(--blue)',
                  boxShadow: '0 4px 12px var(--blue-glow)',
                  fontFamily: 'var(--font-outfit)',
                }}
                onClick={() => {
                  setShowModal(false);
                  onNavigate('create');
                }}
              >
                Nova ideia
              </button>
              <button
                className="px-[22px] py-[11px] bg-transparent border-[1.5px] rounded-full text-[13px] cursor-pointer"
                style={{
                  borderColor: 'var(--border2)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-outfit)',
                }}
                onClick={() => {
                  setShowModal(false);
                  onNavigate('hub');
                }}
              >
                Ideia HUB
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes vIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

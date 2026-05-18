import { useState, useRef, useEffect } from 'react';
import StepBar from './StepBar';

interface BrainstormPageProps {
  selectedCategory: string;
  onBack: () => void;
  onNextPage: () => void;
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
}

type Message = {
  type: 'ai' | 'user';
  text: string;
  chips?: string[];
};

export default function BrainstormPage({ onBack, onNextPage, isAnonymous, setIsAnonymous }: BrainstormPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      text: 'Olá! Sou o Leonardo, especialista em Melhoria de Processos. Vou ajudar-te a transformar a tua ideia numa proposta clara e impactante.<br><br><b>Vamos começar:</b> Descreve o problema que queres resolver. 💡',
      chips: ['O processo é muito lento', 'Há muitos erros manuais', 'Falta visibilidade', 'O processo custa muito'],
    },
    {
      type: 'user',
      text: 'O processo de aprovação de despesas demora muito e os colaboradores ficam sem resposta durante semanas.',
    },
    {
      type: 'ai',
      text: 'Percebo — a falta de feedback é um dos maiores pontos de frustração.<br><br><b>Qual é o impacto real desta demora?</b>',
      chips: ['Atrasos em projectos', 'Colaboradores desmotivados', 'Perdas financeiras'],
    },
    {
      type: 'user',
      text: 'Principalmente atrasos em projectos e colaboradores que desistem de pedir aprovações por burocracia.',
    },
    {
      type: 'ai',
      text: 'Excelente — problema claro com impacto medível.<br><br><b>Que solução imaginarias?</b> Mesmo que seja uma ideia inicial.',
      chips: ['Automatizar aprovações até X€', 'App de aprovação mobile', 'SLA com prazo máximo'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { type: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          text: 'Obrigado. <b>Como medirias o sucesso desta ideia após 6 meses?</b>',
          chips: ['Tempo médio de aprovação', 'Nº pedidos submetidos', 'Satisfação das equipas'],
        },
      ]);
    }, 1900);
  };

  const handleChipClick = (chip: string) => {
    setInputValue(chip);
    setTimeout(handleSendMessage, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen animate-[vIn_0.35s_ease_both]">
      <div className="flex-1 flex flex-col border-r-[1.5px] overflow-hidden" style={{ borderColor: 'var(--border-light)', height: 'calc(100vh - 62px)' }}>
        <StepBar currentStep={1} onBack={onBack} backLabel="Categoria" isAnonymous={isAnonymous} setIsAnonymous={setIsAnonymous} />

        <div
          className="px-6 py-2 border-b flex items-center justify-between text-[12px]"
          style={{
            borderColor: 'rgba(8,145,178,0.15)',
            background: 'var(--cyan-light)',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>// modo guiado · o agente estrutura a tua ideia</span>
          <button
            className="px-2.5 py-0.5 border rounded text-[10px] cursor-pointer bg-transparent transition-all hover:bg-[rgba(8,145,178,0.1)]"
            style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}
          >
            modo rápido
          </button>
        </div>

        <div className="px-6 py-4 border-b flex items-center gap-3 bg-[var(--bg2)]" style={{ borderColor: 'var(--border-light)' }}>
          <div
            className="flex items-center gap-2.5 bg-[var(--surface)] border-[1.5px] rounded-full px-3.5 py-2 shadow-[0_1px_4px_rgba(30,50,140,0.06)]"
            style={{ borderColor: 'var(--border-light)' }}
          >
            <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[14px]" style={{ background: 'linear-gradient(135deg, #3126b4, #4294F8)' }}>
              ⬡
            </div>
            <div>
              <div className="text-[13px] font-bold" style={{ color: 'var(--text)', fontFamily: 'Bronkoh-Light, sans-serif' }}>
                Leonardo Silva
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                agente_pmo · melhoria_processo
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1 text-[10px]" style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-[blink_2s_infinite]" style={{ background: 'var(--cyan)' }} />
              online
            </div>
          </div>
        </div>

        <div ref={chatAreaRef} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4 bg-[var(--bg)]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2.5 animate-[msgIn_0.25s_ease] ${msg.type === 'user' ? 'self-end flex-row-reverse' : ''} max-w-[82%]`}>
              <div
                className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold ${
                  msg.type === 'ai' ? 'text-white text-[12px]' : 'text-white'
                }`}
                style={{
                  background: msg.type === 'ai' ? 'linear-gradient(135deg, #3126b4, #4294F8)' : 'linear-gradient(135deg, #FF0066, #9437FF)',
                }}
              >
                {msg.type === 'ai' ? '⬡' : 'MA'}
              </div>
              <div>
                <div
                  className={`border-[1.5px] rounded-xl px-[15px] py-[11px] text-[13px] leading-[1.65] shadow-[0_1px_4px_rgba(30,50,140,0.06)] ${
                    msg.type === 'user' ? 'rounded-tr-[3px]' : 'rounded-tl-[3px]'
                  }`}
                  style={{
                    background: msg.type === 'user' ? 'var(--blue-light)' : 'var(--surface)',
                    borderColor: msg.type === 'user' ? 'rgba(37,99,235,0.2)' : 'var(--border-light)',
                    color: 'var(--text)',
                    fontFamily: 'Bronkoh-Light, sans-serif',
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
                {msg.chips && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.chips.map((chip, j) => (
                      <button
                        key={j}
                        className="px-[11px] py-1.5 bg-transparent border-[1.5px] rounded-full text-[11px] cursor-pointer transition-all hover:bg-[var(--blue-light)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
                        style={{
                          borderColor: 'var(--border2)',
                          color: 'var(--text-muted)',
                          fontFamily: 'Bronkoh-Light, sans-serif',
                        }}
                        onClick={() => handleChipClick(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5 animate-[msgIn_0.25s_ease] max-w-[82%]">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #3126b4, #4294F8)' }}>
                ⬡
              </div>
              <div className="border-[1.5px] rounded-xl rounded-tl-[3px] px-[15px] py-[11px] bg-[var(--surface)] shadow-[0_1px_4px_rgba(30,50,140,0.06)]" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex gap-1 items-center py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-[tB_1.2s_infinite]" style={{ background: 'var(--text-sub)' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-[tB_1.2s_0.2s_infinite]" style={{ background: 'var(--text-sub)' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-[tB_1.2s_0.4s_infinite]" style={{ background: 'var(--text-sub)' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 border-t-[1.5px] flex gap-2 items-end bg-[var(--bg2)]" style={{ borderColor: 'var(--border-light)' }}>
          <textarea
            className="flex-1 bg-[var(--surface)] border-[1.5px] rounded-full px-3.5 py-2.5 text-[13px] resize-none min-h-[42px] max-h-[110px] outline-none transition-colors shadow-[0_1px_4px_rgba(30,50,140,0.05)] focus:border-[var(--blue)]"
            style={{
              borderColor: 'var(--border-light)',
              color: 'var(--text)',
              fontFamily: 'Bronkoh-Light, sans-serif',
            }}
            placeholder="Escreve a tua resposta..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="w-[42px] h-[42px] rounded-full border-none flex items-center justify-center text-base cursor-pointer transition-all flex-shrink-0 text-white hover:bg-[#1d4ed8] hover:scale-105"
            style={{ background: 'var(--blue)', boxShadow: '0 3px 10px var(--blue-glow)' }}
            onClick={handleSendMessage}
          >
            ↑
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-72 flex flex-col overflow-y-auto bg-[var(--bg2)]" style={{ height: 'calc(100vh - 62px)', borderLeft: '1px solid var(--border-light)' }}>
        <div className="p-[18px] border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            Progresso
          </div>
          <div className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-[7px] transition-all mb-1.5" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)' }}>
            <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px] flex-shrink-0" style={{ borderColor: 'currentColor', fontFamily: 'var(--font-mono)' }}>
              ✓
            </div>
            Qual é o problema?
          </div>
          <div className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-[7px] transition-all mb-1.5" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)' }}>
            <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px] flex-shrink-0" style={{ borderColor: 'currentColor', fontFamily: 'var(--font-mono)' }}>
              ✓
            </div>
            Impacto do problema
          </div>
          <div className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-[7px] transition-all mb-1.5" style={{ color: 'var(--text)', background: 'var(--blue-light)' }}>
            <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px] flex-shrink-0" style={{ borderColor: 'currentColor', fontFamily: 'var(--font-mono)' }}>
              ›
            </div>
            Solução proposta
          </div>
          <div className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-[7px] transition-all" style={{ color: 'var(--text-sub)' }}>
            <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px] flex-shrink-0" style={{ borderColor: 'currentColor', fontFamily: 'var(--font-mono)' }}></div>
            Benefícios esperados
          </div>
        </div>

        <div className="p-[18px] border-b" style={{ borderColor: 'var(--border-light)' }}>
          <div className="text-[10px] font-medium uppercase tracking-[2px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            Agentes sugeridos
          </div>
          {[
            { name: 'Leonardo Silva', role: 'agente_pmo', avatar: '⬡', bg: 'linear-gradient(135deg, #3126b4, #4294F8)' },
            { name: 'Ana Costa', role: 'agente_produto', avatar: '⚡', bg: 'linear-gradient(135deg, #FF0066, #9437FF)' },
            { name: 'Mariana Ramos', role: 'agente_cx', avatar: '◉', bg: 'linear-gradient(135deg, #4294F8, var(--green))' },
            { name: 'Carlos Mendes', role: 'agente_rh', avatar: '◎', bg: 'linear-gradient(135deg, #9437FF, #b45309)' },
            { name: 'Sofia Neves', role: 'agente_tech', avatar: '◈', bg: 'linear-gradient(135deg, #2563eb, #3126b4)' },
            { name: 'Rui Ferreira', role: 'agente_geral', avatar: '✦', bg: 'linear-gradient(135deg, #87007f, var(--green))' },
          ].map((agent, i) => (
            <div key={i} className="flex items-center gap-2 text-[12px] px-2 py-2 rounded-[7px] mb-1.5 cursor-pointer transition-all hover:bg-[var(--surface2)]">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-white" style={{ background: agent.bg }}>
                {agent.avatar}
              </div>
              <div className="flex-1">
                <div className="font-semibold" style={{ color: 'var(--text)' }}>
                  {agent.name}
                </div>
                <div className="text-[9px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {agent.role}
                </div>
              </div>
              <div className="text-[9px] px-1.5 py-0.5 rounded border" style={{ borderColor: 'var(--border2)', color: 'var(--text-muted)' }}>
                +
              </div>
            </div>
          ))}
        </div>

        <div className="p-[18px] border-none flex-1 flex flex-col justify-end" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-1.5 text-[12px] cursor-pointer transition-colors hover:text-[var(--text)] mb-2.5" style={{ color: 'var(--text-muted)' }}>
            💾 Guardar rascunho
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 px-[22px] py-[11px] rounded-full border-none text-white text-[13px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-px"
            style={{
              background: 'var(--blue)',
              boxShadow: '0 4px 12px var(--blue-glow)',
              fontFamily: 'var(--font-outfit)',
            }}
            onClick={onNextPage}
          >
            Continuar → Referências
          </button>
        </div>
      </div>

      <style>{`
        @keyframes vIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tB {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}

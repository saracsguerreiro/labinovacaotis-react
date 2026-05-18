import { useEffect, useRef, useState } from 'react';
import logoTisLab from '../../logo_TISLAB.png';
import AnimatedBanner from './AnimatedBanner';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface HomePageProps {
  onNavigate: (view: ViewType) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el, index) => {
      el.setAttribute('data-index', String(index));
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section — AnimatedBanner */}
      <section className="px-6 pb-6 bg-[#04061c]">
        <AnimatedBanner onNavigate={onNavigate} />

      </section>

      {/* Stats Section */}
      <section className="relative z-[1] px-10 py-[72px] border-t" style={{ borderColor: 'var(--border-light)', background: 'linear-gradient(180deg, var(--bg2), var(--bg))' }}>
        <div className="text-center text-[10px] tracking-[3px] uppercase mb-12 reveal" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
          // métricas de inovação
        </div>

        <div className="grid grid-cols-4 max-w-[960px] mx-auto mb-[52px] border rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(30,50,140,0.06)] reveal" style={{ borderColor: 'var(--border-light)' }}>
          {[
            { n: 347, lbl: 'Ideias submetidas', sub: 'desde jan_2024', color: '#036ef2' },
            { n: 28, lbl: 'Em implementação', sub: 'projectos activos', color: '#036ef2' },
            { n: 12, lbl: 'Concluídas', sub: 'impacto real', color: '#036ef2' },
            { n: 94, lbl: 'Colaboradores', sub: '8 departamentos', color: '#036ef2' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-8 text-center bg-[var(--surface)] transition-all hover:bg-[var(--surface2)] ${i < 3 ? 'border-r' : ''}`}
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div className="text-[48px] font-[900] tracking-[-2px] leading-[1] mb-1.5" style={{ color: stat.color }}>
                <Counter target={stat.n} />
              </div>
              <div className="text-[12px] leading-[1.4]" style={{ color: 'var(--text-muted)' }}>
                {stat.lbl}
              </div>
              <div className="text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-[620px] mx-auto text-center p-7 bg-[var(--surface)] border rounded-[14px] relative shadow-[0_2px_16px_rgba(30,50,140,0.06)] reveal" style={{ borderColor: 'var(--border-light)' }}>
          <div className="absolute -top-[18px] left-7 text-[72px] font-[900] leading-[1] opacity-[0.15]" style={{ color: 'var(--blue)' }}>
            "
          </div>
          <div className="text-[17px] font-medium leading-[1.65] mb-2.5" style={{ color: 'var(--text)' }}>
            "A ideia que mais <em className="not-italic" style={{ color: 'var(--blue)' }}>impactou a empresa</em> este ano veio de alguém que nunca tinha partilhado uma ideia antes."
          </div>
          <div className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            — Relatório de Inovação Q3_2024
          </div>
        </div>
      </section>

      {/* Idea Hub Teaser */}
      <section className="px-10 py-20 relative z-[1] max-w-[1160px] mx-auto pb-[100px]">
        <div className="reveal">
          <div className="text-[10px] tracking-[3px] uppercase mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
            // ideia hub
          </div>
          <div className="text-[36px] font-[800] tracking-[-1px] leading-[1.1] mb-1.5" style={{ color: 'var(--text)' }}>
            O que está a acontecer
          </div>
          <div className="text-[14px] mb-8" style={{ color: 'var(--text-muted)' }}>
            As ideias que estão a moldar o futuro da organização
          </div>
        </div>

        <div
          className="bg-[var(--surface)] border rounded-[20px] overflow-hidden cursor-pointer transition-all shadow-[0_4px_24px_rgba(30,50,140,0.06)] hover:shadow-[0_8px_40px_rgba(30,50,140,0.1)] reveal"
          style={{ borderColor: 'var(--border-light)' }}
          onClick={() => onNavigate('hub')}
        >
          {[
            { n: '01', title: 'Modelo de trabalho híbrido estruturado', status: 'Em implementação', statusColor: '#9437FF', votes: 67, cat: 'Pessoas', catColor: '#9437FF', catBg: '#e6dfff' },
            { n: '02', title: 'App self-service para clientes com IA conversacional', status: 'Concluída', statusColor: '#FF0066', votes: 58, cat: 'Produto', catColor: '#FF0066', catBg: '#fdf2f8' },
            { n: '03', title: 'Chatbot de suporte interno 24/7', status: 'Em implementação', statusColor: '#9437FF', votes: 45, cat: 'CX', catColor: '#4294F8', catBg: '#ecfeff' },
            { n: '04', title: 'Automatização do processo de aprovação de despesas', status: 'Em implementação', statusColor: '#9437FF', votes: 42, cat: 'Processo', catColor: '#3126b4', catBg: '#eff4ff' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3.5 px-5 py-3.5 transition-all hover:bg-[var(--surface2)] ${i < 3 ? 'border-b' : ''}`} style={{ borderColor: 'var(--border-light)' }}>
              <div className="text-[22px] font-[900] leading-[1] min-w-[32px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                {item.n}
              </div>
              <div className="flex-1 text-[14px] font-semibold leading-[1.3]" style={{ color: 'var(--text)' }}>
                {item.title}
              </div>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className="flex items-center gap-1 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.statusColor }} />
                  {item.status}
                </div>
                <div className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  ▲ {item.votes}
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ fontFamily: 'var(--font-mono)', color: item.catColor, background: item.catBg }}>
                  {item.cat}
                </div>
              </div>
            </div>
          ))}
          <div className="p-4 text-center text-[11px] cursor-pointer border-t transition-all hover:bg-[var(--blue-light)]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', borderColor: 'var(--border-light)' }}>
            Ver todas as ideias no Ideia HUB →
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="border-t py-20" style={{ borderColor: 'var(--border-light)', background: 'var(--bg2)' }}>
        <div className="max-w-[1100px] mx-auto px-10">
          <div className="text-center mb-14 reveal">
            <div className="text-[10px] tracking-[3px] uppercase mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>
              // como funciona
            </div>
            <h2 className="text-[36px] font-[800] tracking-[-1px] leading-[1.1] mb-3" style={{ color: 'var(--text)' }}>
              Da ideia ao impacto em 4 passos
            </h2>
            <p className="text-[14px] max-w-[480px] mx-auto" style={{ color: 'var(--text-muted)' }}>
              Processo estruturado com IA para garantir que nenhuma boa ideia se perde
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5 relative">
            {/* connector line */}
            <div className="absolute top-[38px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px hidden lg:block" style={{ background: 'var(--border-light)' }} />
            {[
              {
                step: '01',
                title: 'Escolhe a categoria',
                desc: 'Selecciona o tipo de ideia e activa o agente especializado correcto.',
                color: '#036ef2',
                bg: 'var(--blue-light)',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Brainstorming com IA',
                desc: 'O agente guia-te com perguntas para estruturar o problema e a solução.',
                color: '#9437FF',
                bg: '#e6dfff',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Revisão & submissão',
                desc: 'A IA gera um resumo estruturado. Tu revês e submetes com confiança.',
                color: '#4294F8',
                bg: '#ecfeff',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Avaliação & impacto',
                desc: 'A equipa analisa, vota e as melhores ideias entram em implementação.',
                color: '#FF0066',
                bg: '#fdf2f8',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center reveal">
                <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-5 relative z-[1]" style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <div className="text-[11px] font-bold mb-2" style={{ fontFamily: 'var(--font-mono)', color: item.color }}>
                  {item.step}
                </div>
                <div className="text-[15px] font-bold mb-2 tracking-[-0.2px]" style={{ color: 'var(--text)' }}>
                  {item.title}
                </div>
                <div className="text-[12px] leading-[1.6]" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-[14px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-0.5 mx-auto"
              style={{ background: 'var(--blue)', boxShadow: '0 6px 24px var(--blue-glow)', fontFamily: 'var(--font-outfit)' }}
              onClick={() => onNavigate('create')}
            >
              Experimentar agora →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="px-10 py-20 text-center border-t pb-[100px]" style={{ borderColor: 'var(--border-light)', background: 'linear-gradient(180deg, var(--bg), var(--bg2))' }}>
        <div className="reveal">
          <h2 className="text-[40px] font-[900] tracking-[-1.5px] leading-[1.1] mb-3.5" style={{ color: 'var(--text)' }}>
            A próxima grande ideia
            <br />
            pode ser{' '}
            <em
              className="not-italic"
              style={{
                background: 'linear-gradient(90deg, var(--blue), var(--cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              a tua.
            </em>
          </h2>
          <p className="text-base mb-8 max-w-[460px] mx-auto" style={{ color: 'var(--text-muted)' }}>
            Não precisas de ter tudo pensado. A IA estrutura, refina e apresenta a tua ideia de forma clara.
          </p>
          <button
            className="flex items-center gap-2.5 px-[30px] py-3.5 rounded-full border-none text-white text-[15px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-0.5 mx-auto"
            style={{
              background: 'var(--blue)',
              boxShadow: '0 6px 24px var(--blue-glow)',
              fontFamily: 'var(--font-outfit)',
            }}
            onClick={() => onNavigate('create')}
          >
            Começar agora →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-10 py-6 border-t flex items-center justify-between text-[11px] bg-[var(--bg)]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)', borderColor: 'var(--border-light)' }}>
        <img src={logoTisLab} alt="TIS LAB" className="h-6" />
        <div>© 2026</div>
        <div style={{ fontFamily: 'var(--font-mono)' }}>POWERED BY TIS</div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cubeFloat {
          0%, 100% { transform: translateY(0) rotateY(0); }
          50% { transform: translateY(-14px) rotateY(6deg); }
        }
        @keyframes glowP {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        @keyframes ringR {
          from { transform: rotate(0); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes sA {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

function Counter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(Math.floor(current));
    }, 22);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count}</>;
}

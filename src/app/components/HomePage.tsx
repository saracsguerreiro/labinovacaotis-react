import { useEffect, useRef, useState } from 'react';
import logoTisLab from '../../logo_TISLAB.png';
import AnimatedBanner from './AnimatedBanner';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';
interface HomePageProps { onNavigate: (view: ViewType) => void; }

/* ── Scroll Overlapping hook ── */
function useOverlapEffect(refs: React.MutableRefObject<(HTMLDivElement | null)[]>) {
  useEffect(() => {
    const onScroll = () => {
      refs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const navH = 90;
        // how far this section has scrolled "past" the sticky point
        const progress = Math.max(0, Math.min(1, (navH - rect.top) / (rect.height * 0.5)));
        const scale   = 1 - progress * 0.04;
        const opacity = 1 - progress * 0.25;
        el.style.transform = `scale(${scale})`;
        el.style.opacity   = String(Math.max(0.6, opacity));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [refs]);
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  useOverlapEffect(sectionRefs);

  /* reveal on scroll */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const TOP = 88; // px — below navbar pill

  /* sticky wrapper factory */
  const StickyWrap = ({
    idx, children, bg, theme,
  }: { idx: number; children: React.ReactNode; bg: string; theme: 'dark' | 'light' }) => (
    <div
      ref={el => { sectionRefs.current[idx] = el; }}
      style={{
        position: 'sticky',
        top: `${TOP + idx * 6}px`,
        zIndex: 10 + idx,
        transformOrigin: 'top center',
        willChange: 'transform, opacity',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div
        data-theme={theme}
        style={{
          background: bg,
          borderRadius: idx === 0 ? '24px 24px 0 0' : '0',
          boxShadow: '0 -4px 40px rgba(0,0,0,0.10)',
          overflow: 'hidden',
        }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f0f2fa' }}>

      {/* ── Hero ── */}
      <section className="bg-[#04061c]" data-theme="dark">
        <AnimatedBanner onNavigate={onNavigate} />
      </section>

      {/* ══ OVERLAPPING SECTIONS ══ */}

      {/* 1 — Stats */}
      <StickyWrap idx={0} bg="linear-gradient(180deg,#f7f8fc,#eef0f8)" theme="light">
        <section className="px-10 py-[72px]">
          <div className="text-center text-[10px] tracking-[3px] uppercase mb-12 reveal"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
            // métricas de inovação
          </div>

          <div className="grid grid-cols-4 max-w-[960px] mx-auto mb-[52px] border rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(30,50,140,0.06)] reveal"
            style={{ borderColor: 'var(--border-light)' }}>
            {[
              { n: 347, lbl: 'Ideias submetidas',  sub: 'desde jan_2024',      color: '#036ef2' },
              { n: 28,  lbl: 'Em implementação',   sub: 'projectos activos',   color: '#036ef2' },
              { n: 12,  lbl: 'Concluídas',         sub: 'impacto real',        color: '#036ef2' },
              { n: 94,  lbl: 'Colaboradores',      sub: '8 departamentos',     color: '#036ef2' },
            ].map((stat, i) => (
              <div key={i}
                className={`p-8 text-center bg-[var(--surface)] transition-all hover:bg-[var(--surface2)] ${i < 3 ? 'border-r' : ''}`}
                style={{ borderColor: 'var(--border-light)' }}>
                <div className="text-[48px] font-[900] tracking-[-2px] leading-[1] mb-1.5" style={{ color: stat.color }}>
                  <Counter target={stat.n} />
                </div>
                <div className="text-[12px] leading-[1.4]" style={{ color: 'var(--text-muted)' }}>{stat.lbl}</div>
                <div className="text-[10px] mt-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="max-w-[620px] mx-auto text-center p-7 bg-[var(--surface)] border rounded-[14px] relative shadow-[0_2px_16px_rgba(30,50,140,0.06)] reveal"
            style={{ borderColor: 'var(--border-light)' }}>
            <div className="absolute -top-[18px] left-7 text-[72px] font-[900] leading-[1] opacity-[0.15]" style={{ color: 'var(--blue)' }}>"</div>
            <div className="text-[17px] font-medium leading-[1.65] mb-2.5" style={{ color: 'var(--text)' }}>
              "A ideia que mais <em className="not-italic" style={{ color: 'var(--blue)' }}>impactou a empresa</em> este ano veio de alguém que nunca tinha partilhado uma ideia antes."
            </div>
            <div className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              — Relatório de Inovação Q3_2024
            </div>
          </div>
        </section>
      </StickyWrap>

      {/* 2 — Idea Hub Teaser */}
      <StickyWrap idx={1} bg="radial-gradient(ellipse at 70% 40%, #0f2258 0%, #090e2a 45%, #050816 100%)" theme="dark">
        <section className="px-10 py-20 max-w-[1160px] mx-auto">
          <div className="reveal">
            <div className="text-[10px] tracking-[3px] uppercase mb-3"
              style={{ fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>// ideia hub</div>
            <div className="text-[36px] font-[800] tracking-[-1px] leading-[1.1] mb-1.5" style={{ color: '#ffffff' }}>
              O que está a acontecer
            </div>
            <div className="text-[14px] mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              As ideias que estão a moldar o futuro da organização
            </div>
          </div>

          <div className="rounded-[20px] overflow-hidden cursor-pointer transition-all reveal"
            style={{ border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)', boxShadow: '0 4px 40px rgba(0,0,0,0.3)' }}
            onClick={() => onNavigate('hub')}>
            {[
              { n: '01', title: 'Modelo de trabalho híbrido estruturado',              status: 'Em implementação', statusColor: '#a78bfa', votes: 67, cat: 'Pessoas',  catColor: '#a78bfa', catBg: 'rgba(167,139,250,0.15)' },
              { n: '02', title: 'App self-service para clientes com IA conversacional', status: 'Concluída',        statusColor: '#f472b6', votes: 58, cat: 'Produto',  catColor: '#f472b6', catBg: 'rgba(244,114,182,0.15)' },
              { n: '03', title: 'Chatbot de suporte interno 24/7',                     status: 'Em implementação', statusColor: '#a78bfa', votes: 45, cat: 'CX',       catColor: '#60a5fa', catBg: 'rgba(96,165,250,0.15)'  },
              { n: '04', title: 'Automatização do processo de aprovação de despesas',  status: 'Em implementação', statusColor: '#a78bfa', votes: 42, cat: 'Processo', catColor: '#818cf8', catBg: 'rgba(129,140,248,0.15)' },
            ].map((item, i) => (
              <div key={i}
                className={`flex items-center gap-3.5 px-5 py-3.5 transition-all hover:bg-white/5 ${i < 3 ? 'border-b' : ''}`}
                style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="text-[22px] font-[900] leading-[1] min-w-[32px]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.20)' }}>{item.n}</div>
                <div className="flex-1 text-[14px] font-semibold leading-[1.3]" style={{ color: 'rgba(255,255,255,0.90)' }}>{item.title}</div>
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="flex items-center gap-1 text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.50)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.statusColor }} />{item.status}
                  </div>
                  <div className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.40)' }}>▲ {item.votes}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded font-semibold"
                    style={{ fontFamily: 'var(--font-mono)', color: item.catColor, background: item.catBg }}>{item.cat}</div>
                </div>
              </div>
            ))}
            <div className="p-4 text-center text-[11px] cursor-pointer border-t transition-all hover:bg-white/5"
              style={{ fontFamily: 'var(--font-mono)', color: '#60a5fa', borderColor: 'rgba(255,255,255,0.08)' }}>
              Ver todas as ideias no Ideia HUB →
            </div>
          </div>
        </section>
      </StickyWrap>

      {/* 3 — Como Funciona */}
      <StickyWrap idx={2} bg="linear-gradient(180deg,#eef0f8,#f7f8fc)" theme="light">
        <section className="py-20">
          <div className="max-w-[1100px] mx-auto px-10">
            <div className="text-center mb-14 reveal">
              <div className="text-[10px] tracking-[3px] uppercase mb-3"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>// como funciona</div>
              <h2 className="text-[36px] font-[800] tracking-[-1px] leading-[1.1] mb-3" style={{ color: 'var(--text)' }}>
                Da ideia ao impacto em 4 passos
              </h2>
              <p className="text-[14px] max-w-[480px] mx-auto" style={{ color: 'var(--text-muted)' }}>
                Processo estruturado com IA para garantir que nenhuma boa ideia se perde
              </p>
            </div>

            <div className="grid grid-cols-4 gap-5 relative">
              <div className="absolute top-[38px] left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-px hidden lg:block"
                style={{ background: 'var(--border-light)' }} />
              {[
                { step: '01', title: 'Escolhe a categoria',   desc: 'Selecciona o tipo de ideia e activa o agente especializado correcto.', color: '#036ef2', bg: 'var(--blue-light)',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
                { step: '02', title: 'Brainstorming com IA',  desc: 'O agente guia-te com perguntas para estruturar o problema e a solução.', color: '#9437FF', bg: '#e6dfff',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                { step: '03', title: 'Revisão & submissão',   desc: 'A IA gera um resumo estruturado. Tu revês e submetes com confiança.', color: '#4294F8', bg: '#ecfeff',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
                { step: '04', title: 'Avaliação & impacto',   desc: 'A equipa analisa, vota e as melhores ideias entram em implementação.', color: '#FF0066', bg: '#fdf2f8',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center reveal">
                  <div className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-5 relative z-[1]"
                    style={{ background: item.bg, color: item.color }}>{item.icon}</div>
                  <div className="text-[11px] font-bold mb-2" style={{ fontFamily: 'var(--font-mono)', color: item.color }}>{item.step}</div>
                  <div className="text-[15px] font-bold mb-2 tracking-[-0.2px]" style={{ color: 'var(--text)' }}>{item.title}</div>
                  <div className="text-[12px] leading-[1.6]" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12 reveal">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-[14px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-0.5 mx-auto"
                style={{ background: 'var(--blue)', boxShadow: '0 6px 24px var(--blue-glow)', fontFamily: 'var(--font-outfit)' }}
                onClick={() => onNavigate('create')}>
                Experimentar agora →
              </button>
            </div>
          </div>
        </section>
      </StickyWrap>

      {/* 4 — CTA */}
      <StickyWrap idx={3} bg="linear-gradient(180deg,#0d1333,#1a2a6c)" theme="dark">
        <section className="px-10 py-24 text-center">
          <div className="reveal">
            <h2 className="text-[40px] font-[900] tracking-[-1.5px] leading-[1.1] mb-3.5 text-white">
              A próxima grande ideia<br />pode ser{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>a tua.</em>
            </h2>
            <p className="text-base mb-8 max-w-[460px] mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Não precisas de ter tudo pensado. A IA estrutura, refina e apresenta a tua ideia de forma clara.
            </p>
            <button
              className="flex items-center gap-2.5 px-[30px] py-3.5 rounded-full border-none text-white text-[15px] font-bold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-0.5 mx-auto"
              style={{ background: '#2563eb', boxShadow: '0 6px 24px rgba(37,99,235,0.5)', fontFamily: 'var(--font-outfit)' }}
              onClick={() => onNavigate('create')}>
              Começar agora →
            </button>
          </div>
        </section>
      </StickyWrap>

      {/* Footer */}
      <footer className="px-10 py-6 border-t flex items-center justify-between text-[11px] bg-[var(--bg)]"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)', borderColor: 'var(--border-light)' }}>
        <img src={logoTisLab} alt="TIS LAB" className="h-6" />
        <div>© 2026</div>
        <div>POWERED BY TIS</div>
      </footer>

      <style>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
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
      if (current >= target) { current = target; clearInterval(timer); }
      setCount(Math.floor(current));
    }, 22);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
}

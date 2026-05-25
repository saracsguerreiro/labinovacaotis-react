import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const pillars = [
  { num: '01', title: 'Observar contextos',    desc: 'Monitorizar o que acontece no mundo antes que se torne óbvio — para agir primeiro.' },
  { num: '02', title: 'Converter tendências',  desc: 'Transformar sinais de mercado em soluções concretas com potencial de negócio real.' },
  { num: '03', title: 'Liderar digitalmente',  desc: 'Posicionar a TIS como referência de inovação no ecossistema tecnológico angolano.' },
  { num: '04', title: 'Gerar resultado',        desc: 'Transformar inovação em receita, talento e vantagem competitiva sustentável.' },
];

const services = [
  { num: '01', icon: '◎', title: 'Radar de tendências',       body: 'Monitorização contínua de IA, mercado angolano e global. Identificamos oportunidades antes que se tornem óbvias.' },
  { num: '02', icon: '◈', title: 'Hipóteses de inovação',      body: 'Convertemos tendências em oportunidades periféricas críticas com potencial de criar vantagem competitiva.' },
  { num: '03', icon: '◐', title: 'Prototipagem rápida',        body: 'Testamos ideias em ciclos curtos com utilizadores reais, usando IA e ferramentas de baixo custo.' },
  { num: '04', icon: '◉', title: 'Validação e escalamento',    body: 'Quando uma solução prova o seu valor, estruturamos a transição para produto real com métricas e handover.' },
  { num: '05', icon: '◑', title: 'Capacitação interna',        body: 'Difundimos a cultura de inovação por toda a TIS — workshops, squads rotativos e partilha de aprendizados.' },
];

const impactCards = [
  { badge: 'Nova receita',  title: 'Novos produtos e receitas',   body: 'Soluções inovadoras validadas que a TIS pode comercializar — criando fontes de receita diferenciadas no mercado angolano.' },
  { badge: 'Liderança',     title: 'Vantagem competitiva',        body: 'Antecipar tendências e testar antes da concorrência posiciona a TIS como líder no ecossistema tecnológico angolano.' },
  { badge: 'Ecossistema',   title: 'Parcerias e ecossistema',     body: 'Pontes com startups, universidades e parceiros internacionais — ampliando o alcance da TIS além das suas fronteiras actuais.' },
  { badge: 'Talento',       title: 'Talento e cultura',           body: 'Uma empresa que inova retém os melhores e atrai novos talentos. O Lab cria um ambiente onde se experimenta e se constrói o futuro.' },
];

const ways = [
  { icon: '💡', title: 'Traz uma ideia',        desc: 'Tens um problema, uma oportunidade ou uma solução não testada? O Lab recebe e avalia.' },
  { icon: '🔬', title: 'Junta-te a um squad',   desc: 'Haverá vagas para membros rotativos de outras áreas em cada projecto de inovação.' },
  { icon: '🎯', title: 'Propõe um desafio',      desc: 'Tens um problema operacional ou estratégico? Submete-o — o Lab pode ajudar-te.' },
  { icon: '📖', title: 'Usa o repositório',      desc: 'Tendências, relatórios e insights disponíveis para toda a empresa. Fica atento.' },
];

/* ─── Hook: fade-up on scroll ───────────────────────────────────────────── */

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ─── SectionTag ─────────────────────────────────────────────────────────── */

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.18em] uppercase mb-7"
      style={{ color: 'var(--blue)', fontFamily: 'var(--font-outfit)' }}
    >
      <span className="block w-6 h-px" style={{ background: 'var(--blue)' }} />
      {children}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function SobrePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)]" style={{ color: 'var(--text)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-end px-10 pb-20 pt-[100px] overflow-hidden"
        style={{ background: 'var(--bg)' }}
      >
        {/* subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 45% at 70% 40%, rgba(3,110,242,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-[1100px] mx-auto w-full">
          <div
            className="flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase mb-6"
            style={{ color: 'var(--blue)', fontFamily: 'var(--font-outfit)' }}
          >
            <span className="block w-8 h-px" style={{ background: 'var(--blue)' }} />
            Laboratório de Inovação · TIS · 2026
          </div>

          <h1
            className="font-[800] leading-[1.0] tracking-[-0.02em] mb-0"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: 'var(--text)',
              fontFamily: 'var(--font-outfit)',
            }}
          >
            Inovação com{' '}
            <span style={{ color: 'var(--blue)' }}>propósito.</span>
            <br />
            Impacto com resultado.
          </h1>

          <div className="flex items-end justify-between mt-12">
            <p className="text-[17px] font-light max-w-[460px] leading-[1.75]" style={{ color: 'var(--text-muted)' }}>
              O espaço onde tendências se tornam soluções e onde a TIS constrói a sua vantagem competitiva de forma deliberada e contínua.
            </p>
            <div className="flex flex-col items-center gap-2 pb-1" style={{ color: 'var(--text-sub)' }}>
              <div
                className="w-px h-12"
                style={{ background: 'linear-gradient(to bottom, var(--blue), transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }}
              />
              <span className="text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: 'var(--font-mono)' }}>scroll</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── O QUE É ──────────────────────────────────────────────────── */}
      <section
        className="px-10 py-28"
        style={{ background: 'var(--bg)', borderTop: '1px solid var(--border-light)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <SectionTag>O que é</SectionTag>
          <div className="grid grid-cols-2 gap-20 items-start">

            {/* left */}
            <FadeUp>
              <h2
                className="font-[700] leading-[1.15] tracking-[-0.02em] mb-6"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
              >
                O motor estratégico de{' '}
                <span style={{ color: 'var(--blue)' }}>inovação</span>{' '}
                da TIS.
              </h2>
              <p className="text-[16px] font-light leading-[1.8] mb-4" style={{ color: 'var(--text-muted)' }}>
                O Laboratório de Inovação TIS é o espaço onde tendências se tornam soluções, onde ideias se testam antes de se investir e onde a TIS constrói a sua vantagem competitiva de forma deliberada e contínua.
              </p>
              <p className="text-[16px] font-light leading-[1.8]" style={{ color: 'var(--text-muted)' }}>
                Um orquestrador de oportunidades futuras — que amplifica as capacidades internas e gera impacto real de negócio.
              </p>
            </FadeUp>

            {/* right — pillars */}
            <div className="flex flex-col">
              {pillars.map((p, i) => (
                <FadeUp key={p.num} delay={i * 0.08}>
                  <div
                    className="flex items-start gap-6 py-5 transition-all duration-200 cursor-default hover:pl-2"
                    style={{ borderBottom: '1px solid var(--border-light)', ...(i === 0 ? { borderTop: '1px solid var(--border-light)' } : {}) }}
                  >
                    <span
                      className="text-[11px] font-bold tracking-[0.1em] pt-0.5 min-w-[28px]"
                      style={{ color: 'var(--blue)', fontFamily: 'var(--font-outfit)' }}
                    >
                      {p.num}
                    </span>
                    <div>
                      <h3
                        className="text-[15px] font-[600] mb-1 tracking-[0.01em]"
                        style={{ color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-[13px] font-light leading-[1.6]" style={{ color: 'var(--text-muted)' }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* quote — full width */}
            <FadeUp className="col-span-2">
              <div
                className="flex items-start gap-8 pt-10"
                style={{ borderTop: '1px solid var(--border-light)' }}
              >
                <span
                  className="text-[5rem] leading-[1] flex-shrink-0 -mt-4"
                  style={{ color: 'var(--blue)', opacity: 0.25, fontFamily: 'var(--font-outfit)' }}
                >
                  "
                </span>
                <p
                  className="font-[600] leading-[1.4] tracking-[-0.01em"
                  style={{
                    fontSize: 'clamp(1.1rem, 2vw, 1.55rem)',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-outfit)',
                  }}
                >
                  O Lab não opera em paralelo com a TIS. Opera como o coração estratégico da sua transformação digital.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── O QUE FAZEMOS ────────────────────────────────────────────── */}
      <section
        className="px-10 py-28"
        style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border-light)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <SectionTag>O que fazemos</SectionTag>
          <FadeUp>
            <div className="flex justify-between items-end mb-16">
              <h2
                className="font-[700] leading-[1.15] tracking-[-0.02em] max-w-[420px]"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
              >
                Do radar ao mercado, em ciclos rápidos.
              </h2>
              <p className="text-[14px] font-light max-w-[260px] text-right leading-[1.7]" style={{ color: 'var(--text-sub)' }}>
                Cinco linhas de acção que cobrem todo o ciclo de inovação.
              </p>
            </div>
          </FadeUp>

          <div
            className="grid gap-px"
            style={{
              gridTemplateColumns: 'repeat(5, 1fr)',
              background: 'var(--border-light)',
              border: '1px solid var(--border-light)',
            }}
          >
            {services.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.07}>
                <div
                  className="flex flex-col gap-4 p-6 h-full transition-all duration-200 cursor-default group"
                  style={{ background: 'var(--bg2)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg3)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg2)')}
                >
                  <span
                    className="text-[11px] font-bold tracking-[0.1em] transition-colors duration-200"
                    style={{ color: 'var(--text-sub)', fontFamily: 'var(--font-outfit)' }}
                  >
                    {s.num}
                  </span>
                  <span className="text-[26px] leading-none">{s.icon}</span>
                  <div
                    className="text-[14px] font-[600] leading-[1.3]"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                  >
                    {s.title}
                  </div>
                  <div className="text-[12px] font-light leading-[1.65]" style={{ color: 'var(--text-muted)' }}>
                    {s.body}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACTO ──────────────────────────────────────────────────── */}
      <section
        className="px-10 py-28"
        style={{ background: 'var(--bg)', borderTop: '1px solid var(--border-light)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <SectionTag>Impacto</SectionTag>
          <FadeUp>
            <h2
              className="font-[700] leading-[1.15] tracking-[-0.02em] max-w-[520px] mb-16"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
            >
              Como o Lab alavanca a TIS.
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 gap-5">
            {impactCards.map((card, i) => (
              <FadeUp key={card.badge} delay={i * 0.07}>
                <div
                  className="relative p-10 rounded-sm overflow-hidden transition-all duration-300 cursor-default group"
                  style={{
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget.style.borderColor = 'var(--border2)');
                    (e.currentTarget.style.background = 'var(--bg2)');
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.style.borderColor = 'var(--border-light)');
                    (e.currentTarget.style.background = 'var(--bg)');
                  }}
                >
                  <div
                    className="inline-block text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-sm mb-5"
                    style={{
                      color: 'var(--blue)',
                      border: '1px solid var(--border2)',
                      background: 'var(--blue-light)',
                      fontFamily: 'var(--font-outfit)',
                    }}
                  >
                    {card.badge}
                  </div>
                  <h3
                    className="text-[17px] font-[600] mb-3 tracking-[-0.01em]"
                    style={{ color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-[14px] font-light leading-[1.7]" style={{ color: 'var(--text-muted)' }}>
                    {card.body}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* footer banner */}
          <FadeUp>
            <div
              className="mt-12 p-8 flex items-center justify-between gap-6"
              style={{ background: 'var(--blue)', borderRadius: '2px' }}
            >
              <p
                className="text-[15px] font-bold max-w-[560px] leading-[1.4]"
                style={{ color: '#ffffff', fontFamily: 'var(--font-outfit)' }}
              >
                O laboratório não opera em paralelo com a TIS. Opera como o coração estratégico da sua transformação digital.
              </p>
              <span className="text-[28px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>→</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── PARTICIPA ────────────────────────────────────────────────── */}
      <section
        className="px-10 py-28"
        style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border-light)' }}
      >
        <div className="max-w-[1100px] mx-auto">
          <SectionTag>Participa</SectionTag>
          <div className="grid gap-20" style={{ gridTemplateColumns: '1fr 1.4fr' }}>

            {/* left */}
            <FadeUp>
              <h2
                className="font-[700] leading-[1.15] tracking-[-0.02em] mb-5"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
              >
                Faz parte<br />
                do{' '}
                <span style={{ color: 'var(--blue)' }}>Lab.</span>
              </h2>
              <p className="text-[15px] font-light leading-[1.8] mb-8" style={{ color: 'var(--text-muted)' }}>
                Há várias formas de participar — traz uma ideia, junta-te a um squad, propõe um desafio ou usa o que aprendemos.
              </p>
              <button
                className="inline-flex items-center gap-2.5 text-[12px] font-bold tracking-[0.1em] uppercase px-7 py-3.5 rounded-sm transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
                style={{
                  color: '#ffffff',
                  background: 'var(--blue)',
                  boxShadow: '0 6px 24px var(--blue-glow)',
                  fontFamily: 'var(--font-outfit)',
                  border: 'none',
                }}
                onClick={() => navigate('/criar')}
              >
                Falar com o Lab →
              </button>
            </FadeUp>

            {/* right — ways list */}
            <div className="flex flex-col gap-2">
              {ways.map((w, i) => (
                <FadeUp key={w.title} delay={i * 0.07}>
                  <div
                    className="grid items-center gap-5 px-5 py-4 rounded-sm transition-all duration-200 cursor-default"
                    style={{
                      gridTemplateColumns: 'auto 1fr auto',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-light)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget.style.background = 'var(--blue-light)');
                      (e.currentTarget.style.borderColor = 'var(--border2)');
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget.style.background = 'var(--surface)');
                      (e.currentTarget.style.borderColor = 'var(--border-light)');
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center text-[18px] flex-shrink-0"
                      style={{ background: 'var(--blue-light)' }}
                    >
                      {w.icon}
                    </div>
                    <div>
                      <h4
                        className="text-[14px] font-[600] mb-0.5"
                        style={{ color: 'var(--text)', fontFamily: 'var(--font-outfit)' }}
                      >
                        {w.title}
                      </h4>
                      <p className="text-[12px] font-light leading-[1.5]" style={{ color: 'var(--text-muted)' }}>
                        {w.desc}
                      </p>
                    </div>
                    <span className="text-[14px] font-bold flex-shrink-0" style={{ color: 'var(--blue)', opacity: 0.5 }}>→</span>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.1); }
        }
      `}</style>
    </div>
  );
}

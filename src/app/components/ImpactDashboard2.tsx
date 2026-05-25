import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* ─── Palette — medium indigo (matches reference) ──────────────────────── */
const P = {
  // backgrounds — medium indigo, not near-black
  bgPage:  'radial-gradient(ellipse at 70% 30%, #0f2258 0%, #090e2a 45%, #050816 100%)',
  bgCard:  'rgba(255,255,255,0.10)',
  bgCardH: 'rgba(255,255,255,0.15)',
  bgWin:   'rgba(15,12,60,0.70)',
  border:  'rgba(255,255,255,0.14)',
  borderH: 'rgba(255,255,255,0.28)',
  // text
  text:    '#ffffff',
  muted:   'rgba(255,255,255,0.70)',
  sub:     'rgba(255,255,255,0.40)',
  // accents
  blue:    '#60a5fa',
  indigo:  '#818cf8',
  violet:  '#a78bfa',
  pink:    '#f472b6',
  cyan:    '#22d3ee',
  green:   '#4ade80',
  // chart line / area
  waveLine:   '#ffffff',
  waveArea:   'rgba(139,92,250,0.55)',
  waveArea0:  'rgba(139,92,250,0.02)',
};

/* ─── Data ──────────────────────────────────────────────────────────────── */
const monthlyData = [
  { month: 'Jan', ideias: 12 }, { month: 'Fev', ideias: 18 },
  { month: 'Mar', ideias: 22 }, { month: 'Abr', ideias: 28 },
  { month: 'Mai', ideias: 31 }, { month: 'Jun', ideias: 24 },
  { month: 'Jul', ideias: 38 }, { month: 'Ago', ideias: 45 },
  { month: 'Set', ideias: 52 }, { month: 'Out', ideias: 47 },
  { month: 'Nov', ideias: 55 }, { month: 'Dez', ideias: 62 },
];

const categoryData = [
  { name: 'Melhoria Processo', value: 118, color: P.indigo },
  { name: 'Tecnologia',        value: 85,  color: P.blue   },
  { name: 'Cultura & Pessoas', value: 66,  color: P.violet },
  { name: 'Novo Produto',      value: 49,  color: P.pink   },
  { name: 'Exp. Cliente',      value: 29,  color: P.cyan   },
];

const deptData = [
  { dept: 'TI & Digital', value: 62 },
  { dept: 'Operações',    value: 50 },
  { dept: 'RH',           value: 39 },
  { dept: 'Comercial',    value: 31 },
  { dept: 'Financeiro',   value: 21 },
];

const statusData = [
  { name: 'Submetidas',    value: 142, color: P.blue   },
  { name: 'Em análise',    value: 89,  color: P.indigo },
  { name: 'Seleccionadas', value: 76,  color: P.violet },
  { name: 'Implementação', value: 28,  color: P.pink   },
  { name: 'Concluídas',    value: 12,  color: P.green  },
];

const trendData = [
  { mes: 'Set', aprovadas: 8,  concluidas: 2 },
  { mes: 'Out', aprovadas: 11, concluidas: 3 },
  { mes: 'Nov', aprovadas: 14, concluidas: 4 },
  { mes: 'Dez', aprovadas: 18, concluidas: 5 },
];

/* ─── Tabs ──────────────────────────────────────────────────────────────── */
const TABS = [
  { key: 'volume',    label: 'Volume Mensal',    icon: '◈' },
  { key: 'tendencia', label: 'Tendência Q4',     icon: '◐' },
  { key: 'categoria', label: 'Por Categoria',    icon: '◉' },
  { key: 'depto',     label: 'Por Departamento', icon: '◎' },
  { key: 'estado',    label: 'Por Estado',       icon: '◑' },
] as const;
type TabKey = typeof TABS[number]['key'];

/* ─── Tooltip ───────────────────────────────────────────────────────────── */
const ttStyle = {
  background: 'rgba(30,27,75,0.95)',
  border: `1px solid ${P.borderH}`,
  borderRadius: 12,
  fontSize: 12,
  color: P.text,
  fontFamily: "'JetBrains Mono', monospace",
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  padding: '8px 14px',
};

/* ─── Counter ───────────────────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = target / 50;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setV(target); clearInterval(t); }
      else setV(Math.floor(cur));
    }, 18);
    return () => clearInterval(t);
  }, [target]);
  return <>{v}{suffix}</>;
}

/* ─── Progress ring ─────────────────────────────────────────────────────── */
function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const r = 13, c = 2 * Math.PI * r;
  return (
    <svg width="34" height="34" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="17" cy="17" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
      <circle cx="17" cy="17" r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={c} strokeDashoffset={c * (1 - progress)} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.25s linear' }} />
    </svg>
  );
}

/* ─── Chart panel — fixed 280px height so Recharts always renders ───────── */
function ChartPanel({ tab }: { tab: TabKey }) {
  const MAX_CAT = Math.max(...categoryData.map(d => d.value));
  const H = 280;

  if (tab === 'volume') return (
    <div style={{ width: '100%', height: H }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={monthlyData} margin={{ top: 16, right: 16, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.65} />
              <stop offset="60%"  stopColor="#6366f1" stopOpacity={0.30} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip contentStyle={ttStyle} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 2' }} />
          <Area
            type="natural"
            dataKey="ideias"
            stroke={P.waveLine}
            strokeWidth={2.5}
            fill="url(#waveGrad)"
            dot={false}
            activeDot={{ r: 6, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  if (tab === 'tendencia') return (
    <div style={{ width: '100%', height: H }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData} margin={{ top: 16, right: 16, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradAprov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#60a5fa" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradConc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f472b6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 11, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }}
            axisLine={false} tickLine={false}
          />
          <Tooltip contentStyle={ttStyle} />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: P.muted, fontFamily: "'JetBrains Mono',monospace", paddingTop: 8 }}
          />
          <Area type="natural" dataKey="aprovadas"  stroke="#60a5fa" strokeWidth={2.5} fill="url(#gradAprov)"
            dot={{ r: 4, fill: '#60a5fa', stroke: '#fff', strokeWidth: 1.5 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
          <Area type="natural" dataKey="concluidas" stroke="#f472b6" strokeWidth={2}   fill="url(#gradConc)"
            strokeDasharray="6 3"
            dot={{ r: 4, fill: '#f472b6', stroke: '#fff', strokeWidth: 1.5 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  if (tab === 'categoria') return (
    <div style={{ width: '100%', height: H, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, padding: '8px 16px' }}>
      {categoryData.map(c => (
        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: P.muted, width: 140, flexShrink: 0 }}>{c.name}</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${Math.round((c.value / MAX_CAT) * 100)}%`,
              background: `linear-gradient(90deg, ${c.color}99, ${c.color})`,
              boxShadow: `0 0 10px ${c.color}88`,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{ fontSize: 12, minWidth: 30, textAlign: 'right', color: c.color, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );

  if (tab === 'depto') return (
    <div style={{ width: '100%', height: H }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={deptData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }} barSize={14}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#6366f1" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
          <XAxis type="number" hide />
          <YAxis
            dataKey="dept" type="category" width={95}
            tick={{ fontSize: 12, fill: P.muted }} axisLine={false} tickLine={false}
          />
          <Tooltip contentStyle={ttStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 7, 7, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (tab === 'estado') return (
    <div style={{ width: '100%', height: H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      <div style={{ width: 220, height: 220, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" innerRadius={62} outerRadius={96}
              paddingAngle={3} dataKey="value" strokeWidth={0}>
              {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
            </Pie>
            <Tooltip contentStyle={ttStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {statusData.map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}`, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: P.muted }}>{s.name}</span>
            <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 8, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
const AUTO_MS = 6000;

export default function ImpactDashboard2() {
  const [activeTab, setActiveTab] = useState<TabKey>('volume');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress]    = useState(0);
  const [animKey, setAnimKey]       = useState(0);

  const switchTab = useCallback((key: TabKey) => {
    setActiveTab(key);
    setProgress(0);
    setAnimKey(k => k + 1);
  }, []);

  useEffect(() => {
    if (!isAutoPlay) { setProgress(0); return; }
    const startMs = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - startMs;
      const p = Math.min(elapsed / AUTO_MS, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setActiveTab(cur => {
          const idx = TABS.findIndex(t => t.key === cur);
          return TABS[(idx + 1) % TABS.length].key;
        });
        setProgress(0);
        setAnimKey(k => k + 1);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isAutoPlay, animKey]);

  const kpis = [
    { label: 'Total de Ideias',   value: 347, suffix: '',  color: P.blue,   sub: '+23% vs. mês anterior', icon: '◈' },
    { label: 'Em Implementação',  value: 28,  suffix: '',  color: P.violet, sub: 'projectos activos',      icon: '◐' },
    { label: 'Taxa de Aprovação', value: 34,  suffix: '%', color: '#00e5ff', sub: 'ideias que avançam',     icon: '◉' },
    { label: 'Colaboradores',     value: 94,  suffix: '',  color: P.pink,   sub: 'em 8 departamentos',     icon: '◎' },
  ];

  const activeTabMeta = TABS.find(t => t.key === activeTab)!;

  /* bottom strip */
  const strip = [
    { label: 'Submetidas',    val: 142, color: P.blue,   pct: 41 },
    { label: 'Em análise',    val: 89,  color: P.indigo, pct: 26 },
    { label: 'Seleccionadas', val: 76,  color: P.violet, pct: 22 },
    { label: 'Implementação', val: 28,  color: P.pink,   pct: 8  },
    { label: 'Concluídas',    val: 12,  color: P.green,  pct: 3  },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: P.bgPage, color: P.text }}>


      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: P.green, boxShadow: `0 0 8px ${P.green}`, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                live · jan–dez 2024
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: "'Bronkoh-Bold', sans-serif", margin: 0 }}>
              Dashboard de Impacto
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['2024', '2023', 'Tudo'].map(p => (
              <button key={p} style={{
                padding: '6px 16px', fontSize: 11, borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s',
                border: `1px solid ${p === '2024' ? P.violet : P.border}`,
                background: p === '2024' ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.06)',
                color: p === '2024' ? '#fff' : P.muted,
                fontFamily: "'JetBrains Mono',monospace",
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {kpis.map(card => (
            <div key={card.label} style={{
              borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16,
              background: P.bgCard,
              border: `1px solid ${P.border}`,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                background: `${card.color}25`,
                boxShadow: `0 0 18px ${card.color}35`,
                border: `1px solid ${card.color}35`,
              }}>{card.icon}</div>
              <div>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1.5px', color: P.sub, marginBottom: 2, fontFamily: "'JetBrains Mono',monospace" }}>
                  {card.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px', color: card.color }}>
                  <Counter target={card.value} suffix={card.suffix} />
                </div>
                <div style={{ fontSize: 11, marginTop: 3, color: P.sub }}>
                  <span style={{ color: card.color }}>↑ </span>{card.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Central Chart Window ── */}
        <div style={{ overflow: 'hidden' }}>

          {/* title bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 20px', borderBottom: `1px solid ${P.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* macOS dots */}
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#ffbd2e','#28c840'].map(c => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <span style={{ fontSize: 12, letterSpacing: '0.06em', color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                // {activeTabMeta.label.toLowerCase()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ProgressRing progress={progress} color={P.violet} />
                <button
                  onClick={() => setIsAutoPlay(a => !a)}
                  style={{ position: 'absolute', fontSize: 11, cursor: 'pointer', background: 'none', border: 'none', color: isAutoPlay ? P.violet : P.sub, transition: 'all 0.2s' }}
                  title={isAutoPlay ? 'Pausar rotação' : 'Iniciar rotação'}
                >
                  {isAutoPlay ? '⏸' : '▶'}
                </button>
              </div>
              <span style={{ fontSize: 10, color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>auto</span>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 16px', borderBottom: `1px solid ${P.border}` }}>
            {TABS.map(tab => {
              const isActive = tab.key === activeTab;
              return (
                <button key={tab.key}
                  onClick={() => { switchTab(tab.key); setIsAutoPlay(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 16px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                    background: isActive ? 'rgba(139,92,250,0.28)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isActive ? P.violet : 'transparent'}`,
                    color: isActive ? '#fff' : P.muted,
                    fontWeight: isActive ? 600 : 400,
                    boxShadow: isActive ? `0 0 14px rgba(139,92,250,0.3)` : 'none',
                  }}
                >
                  <span style={{ color: isActive ? P.violet : P.sub, fontSize: 10 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* chart */}
          <div key={activeTab} style={{ padding: '20px 24px', animation: 'fadeSlide 0.4s ease forwards' }}>
            <ChartPanel tab={activeTab} />
          </div>

          {/* dot nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 16 }}>
            {TABS.map(tab => (
              <button key={tab.key}
                onClick={() => { switchTab(tab.key); setIsAutoPlay(false); }}
                style={{
                  height: 6, borderRadius: 3, cursor: 'pointer', border: 'none', transition: 'all 0.3s',
                  width: activeTab === tab.key ? 22 : 6,
                  background: activeTab === tab.key ? P.violet : P.border,
                  boxShadow: activeTab === tab.key ? `0 0 8px ${P.violet}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {strip.map(s => (
            <div key={s.label} style={{
              borderRadius: 14, padding: '14px 16px',
              background: P.bgCard,
              border: `1px solid ${P.border}`,
              backdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>
                  {s.val}
                </span>
              </div>
              <div style={{ height: 4, borderRadius: 2, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', marginBottom: 6 }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${s.pct}%`,
                  background: `linear-gradient(90deg, ${s.color}80, ${s.color})`,
                  boxShadow: `0 0 6px ${s.color}88`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontSize: 11, color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.pct}%</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

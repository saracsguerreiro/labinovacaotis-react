import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* ─── Palette ───────────────────────────────────────────────────────────── */
const P = {
  bg:      '#050816',
  bg2:     '#080e2a',
  glass:   'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  borderHi:'rgba(255,255,255,0.16)',
  text:    '#ffffff',
  muted:   'rgba(255,255,255,0.55)',
  sub:     'rgba(255,255,255,0.28)',
  blue:    '#3b82f6',
  indigo:  '#6366f1',
  violet:  '#8b5cf6',
  pink:    '#ec4899',
  cyan:    '#06b6d4',
  green:   '#22c55e',
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
  background: '#0d1640',
  border: `1px solid ${P.borderHi}`,
  borderRadius: 10,
  fontSize: 11,
  color: P.text,
  fontFamily: "'JetBrains Mono', monospace",
  boxShadow: `0 8px 32px rgba(99,102,241,0.25)`,
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
      <circle cx="17" cy="17" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
      <circle cx="17" cy="17" r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={c} strokeDashoffset={c * (1 - progress)} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.25s linear' }} />
    </svg>
  );
}

/* ─── Chart panel ───────────────────────────────────────────────────────── */
function ChartPanel({ tab }: { tab: TabKey }) {
  const MAX_CAT = Math.max(...categoryData.map(d => d.value));

  if (tab === 'volume') return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={P.indigo} stopOpacity={0.6} />
            <stop offset="100%" stopColor={P.indigo} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={P.border} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={ttStyle} cursor={{ stroke: P.violet, strokeWidth: 1, strokeDasharray: '4 2' }} />
        <Area type="monotone" dataKey="ideias" stroke={P.indigo} strokeWidth={2.5}
          fill="url(#areaGrad)"
          dot={{ r: 3, fill: P.indigo, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: P.violet, stroke: P.text, strokeWidth: 1.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (tab === 'tendencia') return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={P.blue} stopOpacity={0.45} />
            <stop offset="100%" stopColor={P.blue} stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={P.pink} stopOpacity={0.35} />
            <stop offset="100%" stopColor={P.pink} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={P.border} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 10, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 9, fill: P.sub, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={ttStyle} />
        <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: P.muted, fontFamily: "'JetBrains Mono',monospace" }} />
        <Area type="monotone" dataKey="aprovadas"  stroke={P.blue} strokeWidth={2.5} fill="url(#gradA)" dot={{ r: 3, fill: P.blue }} />
        <Area type="monotone" dataKey="concluidas" stroke={P.pink} strokeWidth={2}   fill="url(#gradB)" strokeDasharray="5 3" dot={{ r: 3, fill: P.pink }} />
      </AreaChart>
    </ResponsiveContainer>
  );

  if (tab === 'categoria') return (
    <div className="flex flex-col justify-center gap-5 h-full px-4 py-2">
      {categoryData.map(c => (
        <div key={c.name} className="flex items-center gap-3">
          <div className="text-[12px] flex-shrink-0 w-[130px]" style={{ color: P.muted }}>{c.name}</div>
          <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{
              width: `${Math.round((c.value / MAX_CAT) * 100)}%`,
              background: `linear-gradient(90deg, ${c.color}88, ${c.color})`,
              boxShadow: `0 0 8px ${c.color}88`,
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div className="text-[11px] min-w-[28px] text-right" style={{ color: c.color, fontFamily: "'JetBrains Mono',monospace" }}>
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );

  if (tab === 'depto') return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }} barSize={12}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={P.indigo} />
            <stop offset="100%" stopColor={P.blue} />
          </linearGradient>
        </defs>
        <XAxis type="number" hide />
        <YAxis dataKey="dept" type="category" width={90}
          tick={{ fontSize: 11, fill: P.muted }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={ttStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  if (tab === 'estado') return (
    <div className="flex items-center justify-center gap-12 h-full">
      <ResponsiveContainer width={220} height={220}>
        <PieChart>
          <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
            paddingAngle={3} dataKey="value" strokeWidth={0}>
            {statusData.map((s, i) => <Cell key={i} fill={s.color} opacity={0.85} />)}
          </Pie>
          <Tooltip contentStyle={ttStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-3.5">
        {statusData.map(s => (
          <div key={s.name} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
            <span className="text-[13px]" style={{ color: P.muted }}>{s.name}</span>
            <span className="text-[13px] font-bold ml-2"
              style={{ color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>{s.value}</span>
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

  /* auto-rotation */
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
    { label: 'Taxa de Aprovação', value: 34,  suffix: '%', color: P.cyan,   sub: 'ideias que avançam',     icon: '◉' },
    { label: 'Colaboradores',     value: 94,  suffix: '',  color: P.pink,   sub: 'em 8 departamentos',     icon: '◎' },
  ];

  const activeTabMeta = TABS.find(t => t.key === activeTab)!;

  return (
    <div
      className="min-h-screen pt-[72px] flex flex-col"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 60% 10%, #0f1e6e 0%, ${P.bg2} 55%, ${P.bg} 100%)`,
        color: P.text,
      }}
    >
      {/* grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        zIndex: 0,
      }} />

      <div className="relative z-10 flex-1 flex flex-col px-8 py-6 gap-5 max-w-[1280px] mx-auto w-full">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: P.green, boxShadow: `0 0 6px ${P.green}` }} />
              <span className="text-[10px] tracking-[2px] uppercase"
                style={{ color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                live · jan–dez 2024
              </span>
            </div>
            <h1 className="text-[26px] font-[800] tracking-[-0.5px]"
              style={{ fontFamily: "'Bronkoh-Bold', sans-serif" }}>
              Dashboard de Impacto
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {['2024', '2023', 'Tudo'].map(p => (
              <button key={p} className="px-3.5 py-1 text-[11px] rounded-full transition-all cursor-pointer"
                style={{
                  border: `1px solid ${p === '2024' ? P.indigo : P.border}`,
                  background: p === '2024' ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: p === '2024' ? P.text : P.muted,
                  fontFamily: "'JetBrains Mono',monospace",
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map(card => (
            <div key={card.label}
              className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: P.glass,
                border: `1px solid ${P.border}`,
                backdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[18px] flex-shrink-0"
                style={{ background: `${card.color}18`, boxShadow: `0 0 16px ${card.color}22` }}>
                {card.icon}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[1.5px] mb-0.5"
                  style={{ color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                  {card.label}
                </div>
                <div className="text-[28px] font-[900] leading-none tracking-[-1px]" style={{ color: card.color }}>
                  <Counter target={card.value} suffix={card.suffix} />
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: P.sub }}>
                  <span style={{ color: card.color }}>↑ </span>{card.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Central Chart Window ── */}
        <div className="flex-1 rounded-2xl flex flex-col overflow-hidden"
          style={{
            background: 'rgba(8,14,42,0.75)',
            border: `1px solid ${P.border}`,
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            minHeight: 380,
          }}>

          {/* title bar */}
          <div className="flex items-center justify-between px-6 py-3"
            style={{ borderBottom: `1px solid ${P.border}` }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <span className="text-[11px] tracking-[0.08em]"
                style={{ color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                // {activeTabMeta.label.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-[34px] h-[34px]">
                <ProgressRing progress={progress} color={P.indigo} />
                <button
                  onClick={() => setIsAutoPlay(a => !a)}
                  className="absolute text-[11px] cursor-pointer transition-all hover:scale-110"
                  style={{ color: isAutoPlay ? P.indigo : P.sub }}
                  title={isAutoPlay ? 'Pausar rotação' : 'Iniciar rotação'}>
                  {isAutoPlay ? '⏸' : '▶'}
                </button>
              </div>
              <span className="text-[10px]" style={{ color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>auto</span>
            </div>
          </div>

          {/* tabs */}
          <div className="flex items-center gap-1 px-5 py-2.5"
            style={{ borderBottom: `1px solid ${P.border}` }}>
            {TABS.map(tab => {
              const isActive = tab.key === activeTab;
              return (
                <button key={tab.key}
                  onClick={() => { switchTab(tab.key); setIsAutoPlay(false); }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                    border: `1px solid ${isActive ? P.indigo : 'transparent'}`,
                    color: isActive ? P.text : P.muted,
                  }}>
                  <span style={{ color: isActive ? P.indigo : P.sub, fontSize: 10 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* chart area */}
          <div key={activeTab} className="flex-1 px-6 py-5"
            style={{ animation: 'fadeSlide 0.4s ease forwards', minHeight: 260 }}>
            <ChartPanel tab={activeTab} />
          </div>

          {/* dot nav */}
          <div className="flex items-center justify-center gap-2 pb-4">
            {TABS.map(tab => (
              <button key={tab.key}
                onClick={() => { switchTab(tab.key); setIsAutoPlay(false); }}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width:  activeTab === tab.key ? 20 : 6,
                  height: 6,
                  background: activeTab === tab.key ? P.indigo : P.border,
                  boxShadow: activeTab === tab.key ? `0 0 8px ${P.indigo}` : 'none',
                }} />
            ))}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Submetidas',    val: 142, color: P.blue,   pct: 41 },
            { label: 'Em análise',    val: 89,  color: P.indigo, pct: 26 },
            { label: 'Seleccionadas', val: 76,  color: P.violet, pct: 22 },
            { label: 'Implementação', val: 28,  color: P.pink,   pct: 8  },
            { label: 'Concluídas',    val: 12,  color: P.green,  pct: 3  },
          ].map(s => (
            <div key={s.label}
              className="rounded-xl p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.03] cursor-default"
              style={{ background: P.glass, border: `1px solid ${P.border}`, backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[1px]"
                  style={{ color: P.sub, fontFamily: "'JetBrains Mono',monospace" }}>
                  {s.label}
                </span>
                <span className="text-[14px] font-bold"
                  style={{ color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>
                  {s.val}
                </span>
              </div>
              <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${s.pct}%`,
                  background: `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                  boxShadow: `0 0 6px ${s.color}66`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span className="text-[10px]" style={{ color: s.color, fontFamily: "'JetBrains Mono',monospace" }}>
                {s.pct}%
              </span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
}

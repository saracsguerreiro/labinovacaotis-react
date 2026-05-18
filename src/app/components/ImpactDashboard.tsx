import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Legend,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', ideias: 12, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Fev', ideias: 18, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Mar', ideias: 22, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Abr', ideias: 28, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Mai', ideias: 31, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Jun', ideias: 24, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Jul', ideias: 38, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Ago', ideias: 45, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Set', ideias: 52, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Out', ideias: 47, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Nov', ideias: 55, fill: 'rgba(3,110,242,0.35)' },
  { month: 'Dez', ideias: 62, fill: '#036ef2' },
];

const categoryData = [
  { name: 'Melhoria Processo', value: 118, color: '#3126b4' },
  { name: 'Tecnologia', value: 85, color: '#036ef2' },
  { name: 'Cultura & Pessoas', value: 66, color: '#9437FF' },
  { name: 'Novo Produto', value: 49, color: '#FF0066' },
  { name: 'Exp. Cliente', value: 29, color: '#4294F8' },
];

const deptData = [
  { dept: 'TI & Digital', value: 62, fill: '#036ef2' },
  { dept: 'Operações', value: 50, fill: '#3126b4' },
  { dept: 'RH', value: 39, fill: '#9437FF' },
  { dept: 'Comercial', value: 31, fill: '#FF0066' },
  { dept: 'Financeiro', value: 21, fill: '#4294F8' },
];

const statusPie = [
  { name: 'Submetidas', value: 142, fill: '#036ef2' },
  { name: 'Em análise', value: 89, fill: '#4294F8' },
  { name: 'Seleccionadas', value: 76, fill: '#3126b4' },
  { name: 'Implementação', value: 28, fill: '#9437FF' },
  { name: 'Concluídas', value: 12, fill: '#FF0066' },
];

const trendData = [
  { mes: 'Set', aprovadas: 8, concluidas: 2 },
  { mes: 'Out', aprovadas: 11, concluidas: 3 },
  { mes: 'Nov', aprovadas: 14, concluidas: 4 },
  { mes: 'Dez', aprovadas: 18, concluidas: 5 },
];

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  borderRadius: 8,
  fontSize: 11,
  color: 'var(--text)',
  fontFamily: 'var(--font-mono)',
  boxShadow: '0 4px 16px rgba(30,50,140,0.1)',
};

const MAX_CAT = Math.max(...categoryData.map((d) => d.value));

// Custom bar shape that reads `fill` from the data entry — avoids Cell entirely
const ColoredBar = (props: Record<string, unknown>) => {
  const { x, y, width, height, fill } = props as {
    x: number; y: number; width: number; height: number; fill: string;
  };
  if (!height || height <= 0) return null;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;
};

const ColoredHBar = (props: Record<string, unknown>) => {
  const { x, y, width, height, fill } = props as {
    x: number; y: number; width: number; height: number; fill: string;
  };
  if (!width || width <= 0) return null;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} ry={4} />;
};

function useCountUp(target: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let c = 0;
    const step = target / 50;
    const t = setInterval(() => {
      c += step;
      if (c >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(c));
    }, 20);
    return () => clearInterval(t);
  }, [target]);
  return count;
}

export default function ImpactDashboard() {
  const total = useCountUp(347);
  const impl = useCountUp(28);
  const collab = useCountUp(94);

  const kpis = [
    { label: '// total de ideias', num: total, sub: '+23% vs. mês anterior', color: '#036ef2' },
    { label: '// em implementação', num: impl, sub: 'projectos activos', color: '#9437FF' },
    { label: '// taxa de aprovação', num: 34, suffix: '%', sub: 'ideias que avançam', color: '#4294F8' },
    { label: '// colaboradores', num: collab, sub: 'em 8 departamentos', color: '#FF0066' },
  ];

  return (
    <div className="pt-[62px] bg-[var(--bg)]" style={{ minHeight: '100vh' }}>
      <div className="px-9 py-7">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-[800] tracking-[-0.5px] mb-1.5" style={{ color: 'var(--text)' }}>
              Dashboard de Impacto
            </h1>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              // actualizado em tempo real · jan 2024 – dez 2024
            </p>
          </div>
          <div className="flex items-center gap-2">
            {['2024', '2023', 'Tudo'].map((p) => (
              <button
                key={p}
                className="px-3 py-1 text-[11px] rounded-full border-[1.5px] cursor-pointer transition-all"
                style={{
                  borderColor: p === '2024' ? 'var(--blue)' : 'var(--border-light)',
                  background: p === '2024' ? 'var(--blue-light)' : 'transparent',
                  color: p === '2024' ? 'var(--blue)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpis.map((card) => (
            <div
              key={card.label}
              className="bg-[var(--surface)] border-[1.5px] rounded-[14px] p-5 transition-all shadow-[0_2px_8px_rgba(30,50,140,0.05)] hover:shadow-[0_4px_16px_rgba(30,50,140,0.1)]"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <div className="text-[10px] font-medium uppercase tracking-[1.5px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
                {card.label}
              </div>
              <div className="text-[42px] font-[900] tracking-[-2px] leading-[1] mb-1.5" style={{ color: card.color }}>
                {card.num}
                {card.suffix && <span className="text-[22px] font-medium">{card.suffix}</span>}
              </div>
              <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <span style={{ color: card.color }}>↑</span>
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Monthly bar + Pie */}
        <div className="grid grid-cols-[1fr_320px] gap-4 mb-4">
          {/* Monthly BarChart — fill from data, no Cell */}
          <div className="bg-[var(--surface)] border-[1.5px] rounded-[14px] p-5 shadow-[0_2px_8px_rgba(30,50,140,0.05)]" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-[10px] font-medium uppercase tracking-[1.5px] mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              // volume de ideias por mês (2024)
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                <CartesianGrid vertical={false} stroke="var(--border-light)" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-sub)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-sub)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--surface2)' }} />
                <Bar dataKey="ideias" shape={<ColoredBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie — fill from data, no Cell */}
          <div className="bg-[var(--surface)] border-[1.5px] rounded-[14px] p-5 shadow-[0_2px_8px_rgba(30,50,140,0.05)]" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-[10px] font-medium uppercase tracking-[1.5px] mb-3" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              // por estado
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={statusPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1 mt-1">
              {statusPie.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                    {s.name}
                  </div>
                  <span className="font-bold" style={{ fontFamily: 'var(--font-mono)', color: s.fill }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Category bars + Dept bars + Trend line */}
        <div className="grid grid-cols-3 gap-4">
          {/* By category — CSS bars (no recharts needed) */}
          <div className="bg-[var(--surface)] border-[1.5px] rounded-[14px] p-5 shadow-[0_2px_8px_rgba(30,50,140,0.05)]" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-[10px] font-medium uppercase tracking-[1.5px] mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              // por categoria
            </div>
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-2.5 mb-3">
                <div className="text-[11px] flex-shrink-0" style={{ color: 'var(--text-muted)', width: 100 }}>
                  {c.name}
                </div>
                <div className="flex-1 h-[5px] rounded-sm overflow-hidden" style={{ background: 'var(--surface2)' }}>
                  <div className="h-full rounded-sm" style={{ width: `${Math.round((c.value / MAX_CAT) * 100)}%`, background: c.color }} />
                </div>
                <div className="text-[10px] min-w-[24px] text-right" style={{ fontFamily: 'var(--font-mono)', color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* By department — horizontal BarChart, fill from data, no Cell */}
          <div className="bg-[var(--surface)] border-[1.5px] rounded-[14px] p-5 shadow-[0_2px_8px_rgba(30,50,140,0.05)]" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-[10px] font-medium uppercase tracking-[1.5px] mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              // por departamento
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={10}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="dept"
                  type="category"
                  width={75}
                  tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" shape={<ColoredHBar />} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend LineChart — no Cell at all */}
          <div className="bg-[var(--surface)] border-[1.5px] rounded-[14px] p-5 shadow-[0_2px_8px_rgba(30,50,140,0.05)]" style={{ borderColor: 'var(--border-light)' }}>
            <div className="text-[10px] font-medium uppercase tracking-[1.5px] mb-4" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-sub)' }}>
              // aprovadas vs. concluídas (Q4)
            </div>
            <ResponsiveContainer width="100%" height={155}>
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: 'var(--text-sub)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--text-sub)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }} />
                <Line type="monotone" dataKey="aprovadas" stroke="#036ef2" strokeWidth={2} dot={{ r: 3, fill: '#036ef2' }} />
                <Line type="monotone" dataKey="concluidas" stroke="#FF0066" strokeWidth={2} dot={{ r: 3, fill: '#FF0066' }} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

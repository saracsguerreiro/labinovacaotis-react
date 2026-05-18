import { useEffect, useRef, useState } from 'react';
import bannerImg from './banner-bg.jpg';
import './AnimatedBanner.css';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';
interface AnimatedBannerProps { onNavigate: (view: ViewType) => void; }

/* ── Particles ── */
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  delay: `${Math.random() * 6}s`,
  duration: `${3 + Math.random() * 5}s`,
  opacity: Math.random() * 0.6 + 0.2,
}));

/* ── Matrix columns (0 e 1 apenas) ── */
const MATRIX_COLS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${52 + i * 4.8}%`,
  chars: Array.from({ length: 18 }, () => Math.random() > 0.5 ? '1' : '0').join('\n'),
  delay: `${Math.random() * 4}s`,
  duration: `${4 + Math.random() * 4}s`,
}));

/* ── Mini bar chart data ── */
const BARS = [
  { h: '55%', color: '#2563eb', delay: '0s',    dur: '2.1s' },
  { h: '80%', color: '#06b6d4', delay: '0.2s',  dur: '2.6s' },
  { h: '40%', color: '#7c3aed', delay: '0.4s',  dur: '1.9s' },
  { h: '90%', color: '#2563eb', delay: '0.6s',  dur: '2.3s' },
  { h: '65%', color: '#06b6d4', delay: '0.8s',  dur: '2.8s' },
  { h: '75%', color: '#7c3aed', delay: '1.0s',  dur: '2.0s' },
  { h: '50%', color: '#2563eb', delay: '1.2s',  dur: '2.5s' },
];

/* ── Purple dots ── */
const DOTS = [
  { id: 1, right: '35%', bottom: '33%', size: 8,  delay: '0s',   dur: '2.5s' },
  { id: 2, right: '22%', bottom: '37%', size: 6,  delay: '0.5s', dur: '3.1s' },
  { id: 3, right: '48%', bottom: '25%', size: 5,  delay: '1s',   dur: '2.8s' },
  { id: 4, right: '15%', bottom: '29%', size: 7,  delay: '0.3s', dur: '3.4s' },
  { id: 5, right: '30%', top:    '18%', size: 5,  delay: '0.8s', dur: '2.2s' },
  { id: 6, right: '42%', top:    '30%', size: 4,  delay: '1.3s', dur: '2.9s' },
  { id: 7, right: '10%', bottom: '42%', size: 6,  delay: '0.2s', dur: '3.6s' },
];

/* ── Floating badges (text only) ── */
const BADGES = [
  { id: 1, label: '347 ideias submetidas', top: '14%', right: '3%',  delay: '0s',   cycle: '4s'  },
  { id: 2, label: '12 concluídas',         top: '28%', right: '44%', delay: '1.2s', cycle: '5s'  },
  { id: 3, label: '28 em progresso',       top: '68%', right: '44%', delay: '0.6s', cycle: '4.5s'},
  { id: 4, label: 'IA activa · TIS',       top: '22%', right: '44%', delay: '0.9s', cycle: '5.5s'},
];

/* ── Icons ── */
const IconAI = () => (
  <svg width="56" height="56" viewBox="0 0 52 52" fill="none">
    <rect x="1" y="1" width="50" height="50" rx="8" fill="#1a1a60" stroke="#8833ff" strokeWidth="1.5"/>
    <rect x="10" y="10" width="32" height="32" rx="4" fill="#22228a" stroke="#00c8ff" strokeWidth="1"/>
    <text x="26" y="32" textAnchor="middle" fontSize="13" fontWeight="700" fill="#00e5ff" fontFamily="sans-serif">AI</text>
  </svg>
);
const IconMol = () => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="8" fill="#1a0a50" stroke="#8833ff" strokeWidth="1.5"/>
    <circle cx="24" cy="16" r="4" fill="#aa44ff"/>
    <circle cx="14" cy="34" r="4" fill="#aa44ff"/>
    <circle cx="34" cy="34" r="4" fill="#aa44ff"/>
    <line x1="24" y1="20" x2="14" y2="30" stroke="#cc66ff" strokeWidth="1.5"/>
    <line x1="24" y1="20" x2="34" y2="30" stroke="#cc66ff" strokeWidth="1.5"/>
    <line x1="14" y1="34" x2="34" y2="34" stroke="#cc66ff" strokeWidth="1.5"/>
  </svg>
);
const IconGear = () => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="8" fill="#0a1840" stroke="#00c8ff" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="9" stroke="#00e5ff" strokeWidth="2" fill="none"/>
    <circle cx="24" cy="24" r="3.5" fill="#00c8ff"/>
    <line x1="24" y1="10" x2="24" y2="15" stroke="#00e5ff" strokeWidth="2"/>
    <line x1="24" y1="33" x2="24" y2="38" stroke="#00e5ff" strokeWidth="2"/>
    <line x1="10" y1="24" x2="15" y2="24" stroke="#00e5ff" strokeWidth="2"/>
    <line x1="33" y1="24" x2="38" y2="24" stroke="#00e5ff" strokeWidth="2"/>
  </svg>
);
const IconChart = () => (
  <svg width="52" height="52" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="8" fill="#0a2840" stroke="#00c8ff" strokeWidth="1.5"/>
    <rect x="8"  y="28" width="6"  height="12" rx="1" fill="#2563eb" opacity="0.9"/>
    <rect x="18" y="20" width="6"  height="20" rx="1" fill="#06b6d4" opacity="0.9"/>
    <rect x="28" y="14" width="6"  height="26" rx="1" fill="#8833ff" opacity="0.9"/>
    <rect x="38" y="22" width="6"  height="18" rx="1" fill="#2563eb" opacity="0.7"/>
    <line x1="6" y1="40" x2="46" y2="40" stroke="#00e5ff" strokeWidth="1" opacity="0.4"/>
  </svg>
);

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ── Typewriter hook ── */
const FULL_TEXT = 'Tens uma ideia?\nFaz a diferença agora.';
function useTypewriter(text: string, speed = 55) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return displayed;
}

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function AnimatedBanner({ onNavigate }: AnimatedBannerProps) {
  const [started, setStarted] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* start counters + typewriter after mount */
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  const title    = useTypewriter(started ? FULL_TEXT : '', 55);
  const c347     = useCounter(347,  2200, started);
  const c94      = useCounter(94,   1800, started);
  const c28      = useCounter(28,   1600, started);

  return (
    <div className="banner-wrap" ref={wrapRef}>

      {/* ── Background image ── */}
      <img className="banner-bg" src={bannerImg} alt="IdeaLab banner" />

      {/* ── Left gradient overlay ── */}
      <div className="banner-overlay" />

      {/* ── Particles ── */}
      {PARTICLES.map(p => (
        <span key={p.id} className="particle" style={{
          left: p.left, top: p.top,
          width: p.size, height: p.size,
          opacity: p.opacity,
          animationDelay: p.delay,
          animationDuration: p.duration,
        }} />
      ))}

      {/* ── Matrix columns ── */}
      {MATRIX_COLS.map(col => (
        <div key={col.id} className="matrix-col" style={{
          left: col.left,
          animationDelay: col.delay,
          animationDuration: col.duration,
        }}>
          {col.chars}
        </div>
      ))}


      {/* ── Glow on ground ── */}
      <div className="el-glow" style={{ zIndex: 2 }}>
        <svg width="380" height="110" viewBox="0 0 380 110" fill="none">
          <ellipse cx="190" cy="55" rx="180" ry="45" fill="#00c8ff" opacity="0.28"/>
          <ellipse cx="190" cy="55" rx="110" ry="28" fill="#00e5ff" opacity="0.18"/>
        </svg>
      </div>

      {/* ── Icons with glow wrappers ── */}
      <div className="el-icon el-ai icon-glow-purple" style={{ zIndex: 3 }}>
        <IconAI />
      </div>
      <div className="el-icon el-mol icon-glow-purple" style={{ zIndex: 3 }}>
        <IconMol />
      </div>
      <div className="el-icon el-gear icon-glow-cyan" style={{ zIndex: 3 }}>
        <IconGear />
      </div>
      <div className="el-icon el-chart icon-glow-blue" style={{ zIndex: 3 }}>
        <IconChart />
      </div>

      {/* ── Purple dots ── */}
      {DOTS.map(d => (
        <span key={d.id} className="dot-purple" style={{
          width: d.size, height: d.size,
          right: d.right,
          bottom: (d as any).bottom ?? 'auto',
          top:    (d as any).top    ?? 'auto',
          animationDelay: d.delay,
          animationDuration: d.dur,
          zIndex: 2,
        }} />
      ))}

      {/* ── Floating badges ── */}
      {BADGES.map(b => (
        <div key={b.id} className="float-badge" style={{
          top: b.top, right: b.right,
          animationDelay: b.delay,
          animationDuration: b.cycle,
          zIndex: 4,
        }}>
          {b.label}
        </div>
      ))}

      {/* ── Mini bar chart ── */}
      <div className="mini-chart" style={{ zIndex: 4 }}>
        <div className="mini-chart-title">Ideias · 2024</div>
        <div className="mini-chart-bars">
          {BARS.map((b, i) => (
            <div key={i} className="mini-bar" style={{
              height: b.h,
              background: b.color,
              animationDelay: b.delay,
              animationDuration: b.dur,
              transformOrigin: 'bottom',
              boxShadow: `0 0 6px ${b.color}88`,
            }} />
          ))}
        </div>
        <div className="mini-chart-label">Jan → Dez</div>
      </div>

      {/* ── Live tag ── */}
      <div className="live-tag" style={{ zIndex: 4 }}>
        <span className="live-dot" />
        <span><strong>{c94}</strong> colaboradores · Live</span>
      </div>

      {/* ══ TEXT CONTENT ══ */}
      <div className="banner-text" style={{ zIndex: 5 }}>

        {/* Pill label */}
        <div className="banner-label banner-fade" style={{ animationDelay: '0.1s' }}>
          Lab de Inovação · TIS
        </div>

        {/* Typewriter title */}
        <h1 className="banner-title banner-fade" style={{ animationDelay: '0.2s' }}>
          {title.split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
          <span className="typewriter-cursor">|</span>
        </h1>

        {/* Subtitle */}
        <p className="banner-sub banner-fade" style={{ animationDelay: '0.4s' }}>
          Um espaço colaborativo onde as ideias<br />
          se transformam em impacto real para a TIS.
        </p>

        {/* Counters */}
        <div className="banner-stats banner-fade" style={{ animationDelay: '0.6s' }}>
          <div className="stat-item">
            <span className="stat-num">{c347}</span>
            <span className="stat-lbl">Ideias</span>
          </div>
          <div className="stat-div" />
          <div className="stat-item">
            <span className="stat-num">{c28}</span>
            <span className="stat-lbl">Em progresso</span>
          </div>
          <div className="stat-div" />
          <div className="stat-item">
            <span className="stat-num">{c94}</span>
            <span className="stat-lbl">Colaboradores</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="banner-btns banner-fade" style={{ animationDelay: '0.8s' }}>
          <button
            className="banner-btn btn-primary btn-pulse"
            onClick={() => onNavigate('create')}
          >
            + Partilhar a minha ideia
          </button>
          <button
            className="banner-btn btn-outline"
            onClick={() => onNavigate('hub')}
          >
            Explorar Idea Hub →
          </button>
        </div>

      </div>
    </div>
  );
}

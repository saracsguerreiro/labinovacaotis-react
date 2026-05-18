import bannerImg from './banner-bg.jpg';
import './AnimatedBanner.css';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface AnimatedBannerProps {
  onNavigate: (view: ViewType) => void;
}

const DOTS = [
  { id: 1, right: '35%', bottom: '33%', size: 8,  delay: '0s',   duration: '2.5s' },
  { id: 2, right: '22%', bottom: '37%', size: 6,  delay: '0.5s', duration: '3.1s' },
  { id: 3, right: '48%', bottom: '25%', size: 5,  delay: '1s',   duration: '2.8s' },
  { id: 4, right: '15%', bottom: '29%', size: 7,  delay: '0.3s', duration: '3.4s' },
  { id: 5, right: '30%', top:    '18%', size: 5,  delay: '0.8s', duration: '2.2s' },
  { id: 6, right: '42%', top:    '30%', size: 4,  delay: '1.3s', duration: '2.9s' },
  { id: 7, right: '10%', bottom: '42%', size: 6,  delay: '0.2s', duration: '3.6s' },
];

const IconAI = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <rect x="1" y="1" width="50" height="50" rx="8" fill="#1a1a60" stroke="#8833ff" strokeWidth="1.5"/>
    <rect x="10" y="10" width="32" height="32" rx="4" fill="#22228a" stroke="#00c8ff" strokeWidth="1"/>
    <text x="26" y="32" textAnchor="middle" fontSize="13" fontWeight="700" fill="#00e5ff" fontFamily="sans-serif">AI</text>
  </svg>
);

const IconMol = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="1" y="1" width="46" height="46" rx="8" fill="#0a1840" stroke="#00c8ff" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="9" stroke="#00e5ff" strokeWidth="2" fill="none"/>
    <circle cx="24" cy="24" r="3.5" fill="#00c8ff"/>
    <line x1="24" y1="10" x2="24" y2="15" stroke="#00e5ff" strokeWidth="2"/>
    <line x1="24" y1="33" x2="24" y2="38" stroke="#00e5ff" strokeWidth="2"/>
    <line x1="10" y1="24" x2="15" y2="24" stroke="#00e5ff" strokeWidth="2"/>
    <line x1="33" y1="24" x2="38" y2="24" stroke="#00e5ff" strokeWidth="2"/>
  </svg>
);

export default function AnimatedBanner({ onNavigate }: AnimatedBannerProps) {
  return (
    <div className="banner-wrap">

      {/* Imagem de fundo */}
      <img className="banner-bg" src={bannerImg} alt="IdeaLab banner" />

      {/* Gradiente overlay esquerdo para legibilidade do texto */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(4,6,28,0.82) 0%, rgba(4,6,28,0.55) 50%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Brilho azul no chão */}
      <div className="el-glow" style={{ zIndex: 2 }}>
        <svg width="340" height="100" viewBox="0 0 340 100" fill="none">
          <ellipse cx="170" cy="50" rx="160" ry="40" fill="#00c8ff" opacity="0.22"/>
          <ellipse cx="170" cy="50" rx="100" ry="25" fill="#00e5ff" opacity="0.15"/>
        </svg>
      </div>

      {/* Ícone AI */}
      <div className="el-icon el-ai" style={{ zIndex: 2 }}>
        <IconAI />
      </div>

      {/* Ícone molécula */}
      <div className="el-icon el-mol" style={{ zIndex: 2 }}>
        <IconMol />
      </div>

      {/* Ícone engrenagem */}
      <div className="el-icon el-gear" style={{ zIndex: 2 }}>
        <IconGear />
      </div>

      {/* Pontos roxos pulsantes */}
      {DOTS.map((d) => (
        <span
          key={d.id}
          className="dot-purple"
          style={{
            width:  d.size,
            height: d.size,
            right:  d.right,
            bottom: (d as any).bottom ?? 'auto',
            top:    (d as any).top    ?? 'auto',
            animationDelay:    d.delay,
            animationDuration: d.duration,
            zIndex: 2,
          }}
        />
      ))}

      {/* Texto e CTA */}
      <div className="banner-text" style={{ zIndex: 3 }}>
        {/* Label */}
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          background: 'rgba(37,99,235,0.18)',
          border: '1px solid rgba(100,160,255,0.35)',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#7ec8ff',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Lab de Inovação · TIS
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.15 }}>
          Tens uma ideia?<br />Faz a diferença agora.
        </h1>

        <p>
          Um espaço colaborativo onde as ideias<br />
          se transformam em impacto real para a TIS.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="banner-btn"
            onClick={() => onNavigate('create')}
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', fontWeight: 600 }}
          >
            + Partilhar a minha ideia
          </button>
          <button
            className="banner-btn"
            onClick={() => onNavigate('hub')}
            style={{ background: 'transparent', border: '1px solid rgba(100,160,255,0.45)', color: '#a8d0ff' }}
          >
            Explorar Idea Hub →
          </button>
        </div>
      </div>

    </div>
  );
}

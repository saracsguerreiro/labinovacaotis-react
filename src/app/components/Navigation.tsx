import { useState, useEffect, useRef } from 'react';
import logoAiLabWhite from './logo-tis-ai-lab-light.png';  // white text — for dark backgrounds
import logoAiLabBlack from './logo-tis-ai-lab-dark.png';   // dark text  — for light backgrounds

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: ViewType) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState('PT');
  const [isDark, setIsDark] = useState(true); // start dark (banner is dark)
  const navRef = useRef<HTMLDivElement>(null);

  /* ── detect dark/light section behind navbar ── */
  useEffect(() => {
    const NAV_SAMPLE_Y = 90; // px — bottom of nav pill

    const detect = () => {
      const elements = document.elementsFromPoint(window.innerWidth / 2, NAV_SAMPLE_Y);
      for (const el of elements) {
        // skip nav itself
        if (navRef.current && (el === navRef.current || navRef.current.contains(el))) continue;
        // walk up from this element to find data-theme
        let node: Element | null = el;
        while (node) {
          const theme = node.getAttribute('data-theme');
          if (theme) {
            setIsDark(theme === 'dark');
            return;
          }
          node = node.parentElement;
        }
        break; // only inspect the first non-nav element's ancestors
      }
      // fallback: interior pages are light
      setIsDark(false);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      detect();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // re-detect when view changes (after paint)
    const raf = requestAnimationFrame(detect);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [currentView]);

  const navLinks: { view: ViewType; label: string }[] = [
    { view: 'home', label: 'Início' },
    { view: 'hub', label: 'Ideia HUB' },
    { view: 'impact', label: 'Impacto' },
    { view: 'agents', label: 'Agentes IA' },
    { view: 'sobre', label: 'Sobre' },
  ];

  const activeColor   = isDark ? '#ffffff'                : '#0d1333';
  const inactiveColor = isDark ? 'rgba(255,255,255,0.70)' : 'rgba(13,19,51,0.50)';

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-[200] flex justify-center pt-4 px-6 transition-all duration-300"
    >
      <div
        className="w-full max-w-7xl h-[72px] flex items-center justify-between px-10 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: '50px',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)'
            : '0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {/* Logo — switches between white-text and dark-text version */}
        <div
          className="cursor-pointer select-none flex-shrink-0"
          onClick={() => onNavigate('home')}
        >
          <img
            src={isDark ? logoAiLabWhite : logoAiLabBlack}
            alt="TIS AI Lab"
            className="h-14"
            style={{ objectFit: 'contain', transition: 'opacity 0.3s ease' }}
          />
        </div>

        {/* Center nav */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ view, label }) => {
            const isActive = currentView === view;
            return (
              <button
                key={view}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[15px] transition-all duration-200 border-none cursor-pointer"
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  background: isActive
                    ? isDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,19,51,0.08)'
                    : 'transparent',
                  fontFamily: 'var(--font-outfit)',
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: isActive ? '-0.01em' : 'normal',
                }}
                onClick={() => onNavigate(view)}
              >
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#2563eb', boxShadow: '0 0 6px rgba(37,99,235,0.9)' }}
                  />
                )}
                {label}
              </button>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Language switcher */}
          <div className="flex items-center gap-0 rounded-lg p-1"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
            {['PT', 'EN'].map((lang) => (
              <button
                key={lang}
                className="px-2 py-0.5 rounded text-[11px] font-bold transition-all border-none cursor-pointer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: activeLang === lang ? '#2563eb' : 'transparent',
                  color: activeLang === lang ? 'white' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(13,19,51,0.4)',
                }}
                onClick={() => setActiveLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer transition-all hover:scale-105 flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FF0066, #9437FF)',
              border: '2px solid rgba(100,160,255,0.3)',
            }}
            title="Miguel Alves"
          >
            MA
          </div>
        </div>
      </div>
    </nav>
  );
}

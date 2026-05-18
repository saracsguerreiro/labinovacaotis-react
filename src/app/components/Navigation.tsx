import { useState, useEffect } from 'react';
import logoTisLab from '../../logo_TISLAB.png';

type ViewType = 'home' | 'create' | 'hub' | 'impact' | 'agents' | 'sobre';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: ViewType) => void;
}

export default function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState('PT');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { view: ViewType; label: string }[] = [
    { view: 'home', label: 'Início' },
    { view: 'hub', label: 'Ideia HUB' },
    { view: 'impact', label: 'Impacto' },
    { view: 'agents', label: 'Agentes IA' },
    { view: 'sobre', label: 'Sobre' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex justify-center pt-4 px-6 transition-all duration-300"
    >
      <div
        className="w-full max-w-6xl h-[58px] flex items-center justify-between px-6 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,10,30,0.97)' : 'rgba(8,10,30,0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(80,120,255,0.18)',
          borderRadius: '50px',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
      {/* Logo */}
      <div
        className="cursor-pointer select-none flex-shrink-0"
        onClick={() => onNavigate('home')}
      >
        <img src={logoTisLab} alt="TIS LAB" className="h-9" style={{ objectFit: 'contain' }} />
      </div>

      {/* Center nav */}
      <div className="flex items-center gap-0.5">
        {navLinks.map(({ view, label }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              className="relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border-none cursor-pointer"
              style={{
                color: isActive ? '#ffffff' : 'rgba(180,200,255,0.7)',
                background: isActive ? 'rgba(37,99,235,0.25)' : 'transparent',
                fontFamily: 'var(--font-outfit)',
                fontWeight: isActive ? 600 : 400,
              }}
              onClick={() => onNavigate(view)}
            >
              {label}
              {isActive && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: 'var(--blue)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Language switcher */}
        <div className="flex items-center gap-0 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {['PT', 'EN', 'FR'].map((lang) => (
            <button
              key={lang}
              className="px-2 py-0.5 rounded text-[11px] font-bold transition-all border-none cursor-pointer"
              style={{
                fontFamily: 'var(--font-mono)',
                background: activeLang === lang ? '#2563eb' : 'transparent',
                color: activeLang === lang ? 'white' : 'rgba(180,200,255,0.5)',
              }}
              onClick={() => setActiveLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* New idea CTA */}
        <button
          className="px-5 py-2 text-white text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px active:translate-y-0"
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(100,160,255,0.5)',
            borderRadius: '50px',
            color: '#ffffff',
            fontFamily: 'var(--font-outfit)',
            letterSpacing: '0.02em',
          }}
          onClick={() => onNavigate('create')}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          GET STARTED ↗
        </button>

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

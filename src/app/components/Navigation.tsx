import { useState, useEffect } from 'react';
import logoTisLab from '../../logo_TISLAB.png';
import logoTisAiLab from './logo-tis-ai-lab.png';

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
        className="w-full max-w-7xl h-[68px] flex items-center justify-between px-10 transition-all duration-300"
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
      {/* Logo */}
      <div
        className="cursor-pointer select-none flex-shrink-0"
        onClick={() => onNavigate('home')}
      >
        <img
          src={currentView === 'home' ? logoTisAiLab : logoTisLab}
          alt="TIS LAB"
          className="h-12"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Center nav */}
      <div className="flex items-center gap-0.5">
        {navLinks.map(({ view, label }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border-none cursor-pointer"
              style={{
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.92)',
                background: 'transparent',
                fontFamily: 'var(--font-outfit)',
                fontWeight: isActive ? 600 : 400,
              }}
              onClick={() => onNavigate(view)}
            >
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#2563eb', boxShadow: '0 0 6px rgba(37,99,235,0.8)' }}
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
        <div className="flex items-center gap-0 rounded-lg p-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
          {['PT', 'EN'].map((lang) => (
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

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
      className={`fixed top-0 left-0 right-0 h-[62px] flex items-center justify-between px-8 z-[200] transition-all duration-300`}
      style={{
        background: scrolled ? 'rgba(10,13,26,0.95)' : 'rgba(10,13,26,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(37,99,235,0.15)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
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
                color: isActive ? '#f1f5f9' : '#94a3b8',
                background: isActive ? 'rgba(37,99,235,0.15)' : 'transparent',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: isActive ? 600 : 500,
                transition: 'color 0.2s, background 0.2s',
              }}
              onClick={() => onNavigate(view)}
            >
              {label}
              {isActive && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#2563eb' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Language switcher */}
        <div className="flex items-center gap-0 rounded-lg border p-1" style={{ background: '#111827', borderColor: 'rgba(37,99,235,0.2)' }}>
          {['PT', 'EN', 'FR'].map((lang) => (
            <button
              key={lang}
              className="px-2 py-0.5 rounded text-[11px] font-bold transition-all border-none cursor-pointer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: activeLang === lang ? '#2563eb' : 'transparent',
                color: activeLang === lang ? 'white' : '#64748b',
              }}
              onClick={() => setActiveLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* New idea CTA */}
        <button
          className="px-5 py-2 rounded-lg border-none text-white text-[13px] font-semibold cursor-pointer transition-all hover:bg-[#3b82f6] hover:-translate-y-px active:translate-y-0"
          style={{
            background: '#2563eb',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '8px',
            padding: '8px 18px',
          }}
          onClick={() => onNavigate('create')}
        >
          + Nova Ideia
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer transition-all hover:scale-105 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            border: '2px solid rgba(37,99,235,0.3)',
          }}
          title="Miguel Alves"
        >
          MA
        </div>
      </div>
    </nav>
  );
}

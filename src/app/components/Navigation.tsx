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
      className={`fixed top-0 left-0 right-0 h-[62px] flex items-center justify-between px-8 z-[200] transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_2px_20px_rgba(30,50,140,0.08)] bg-white/96 backdrop-blur-[24px]'
          : 'bg-white/92 backdrop-blur-[20px]'
      } border-b`}
      style={{ borderColor: 'var(--border-light)' }}
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
                color: isActive ? 'var(--blue)' : 'var(--text-muted)',
                background: isActive ? 'var(--blue-light)' : 'transparent',
                fontFamily: 'var(--font-outfit)',
                fontWeight: isActive ? 600 : 500,
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
        <div className="flex items-center gap-0 bg-[var(--surface2)] rounded-lg border p-1" style={{ borderColor: 'var(--border-light)' }}>
          {['PT', 'EN', 'FR'].map((lang) => (
            <button
              key={lang}
              className="px-2 py-0.5 rounded text-[11px] font-bold transition-all border-none cursor-pointer"
              style={{
                fontFamily: 'var(--font-mono)',
                background: activeLang === lang ? 'var(--blue)' : 'transparent',
                color: activeLang === lang ? 'white' : 'var(--text-sub)',
              }}
              onClick={() => setActiveLang(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* New idea CTA */}
        <button
          className="px-5 py-2 rounded-full border-none text-white text-[13px] font-semibold cursor-pointer transition-all hover:bg-[#1d4ed8] hover:-translate-y-px active:translate-y-0"
          style={{
            background: 'var(--blue)',
            boxShadow: '0 4px 14px var(--blue-glow)',
            fontFamily: 'var(--font-outfit)',
          }}
          onClick={() => onNavigate('create')}
        >
          + Nova Ideia
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer transition-all hover:scale-105 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF0066, #9437FF)',
            border: '2px solid var(--border2)',
          }}
          title="Miguel Alves"
        >
          MA
        </div>
      </div>
    </nav>
  );
}

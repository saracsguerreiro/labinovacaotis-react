import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';
import { useNavTheme } from '../hooks/useNavTheme';
import logoAiLabWhite from './logo-tis-ai-lab-light.png';
import logoAiLabBlack from './logo-tis-ai-lab-dark.png';

const navLinks: { path: string; label: string }[] = [
  { path: '/sobre',   label: 'Sobre' },
  { path: '/hub',     label: 'Ideia HUB' },
  { path: '/agentes', label: 'Agentes IA' },
  { path: '/impacto2', label: 'Impacto' },
  { path: '/criar',   label: 'Criar Ideia' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const isDark = useNavTheme(pathname);
  const [activeLang, setActiveLang] = useState('PT');

  const activeColor   = isDark ? '#ffffff'                : '#0d1333';
  const inactiveColor = isDark ? 'rgba(255,255,255,0.70)' : 'rgba(13,19,51,0.50)';

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex justify-center pt-4 px-6 transition-all duration-300">
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
        {/* Logo */}
        <div className="cursor-pointer select-none flex-shrink-0" onClick={() => navigate('/')}>
          <img
            src={isDark ? logoAiLabWhite : logoAiLabBlack}
            alt="TIS AI Lab"
            className="h-10"
            style={{ objectFit: 'contain', transition: 'opacity 0.3s ease' }}
          />
        </div>

        {/* Center nav */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ path, label }) => {
            const isActive = pathname === path;
            return (
              <button
                key={path}
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
                onClick={() => navigate(path)}
              >
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#036ef2', boxShadow: '0 0 6px rgba(3,110,242,0.9)' }}
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
          <div
            className="flex items-center gap-0 rounded-lg p-1"
            style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
          >
            {['PT', 'EN'].map((lang) => (
              <button
                key={lang}
                className="px-2 py-0.5 rounded text-[11px] font-bold transition-all border-none cursor-pointer"
                style={{
                  fontFamily: 'var(--font-mono)',
                  background: activeLang === lang ? '#036ef2' : 'transparent',
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

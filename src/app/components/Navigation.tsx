import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScrolled } from '../hooks/useScrolled';
import { useNavTheme } from '../hooks/useNavTheme';
import { useTheme } from '../context/ThemeContext';
import logoAiLabWhite from './logo-tis-ai-lab-light.png';
import logoAiLabBlack from './logo-tis-ai-lab-dark.png';

const navLinks: { path: string; label: string }[] = [
  { path: '/sobre',    label: 'Sobre' },
  { path: '/hub',      label: 'Ideia HUB' },
  { path: '/agentes',  label: 'Agentes IA' },
  { path: '/impacto2', label: 'Impacto' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scrolled = useScrolled();
  const isDark = useNavTheme(pathname);
  const [activeLang, setActiveLang] = useState('PT');
  const { theme, toggle: toggleTheme } = useTheme();

  // light mode → nav escuro; dark mode ou página escura → nav transparente branco
  const isNavDark = true; // letras sempre brancas

  const activeColor   = '#ffffff';
  const inactiveColor = 'rgba(255,255,255,0.70)';

  const navBg = theme === 'light'
    ? (scrolled ? 'rgba(9,14,42,0.96)' : 'rgba(9,14,42,0.88)')
    : (scrolled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)');

  const navBorder = theme === 'light'
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(255,255,255,0.28)';

  const navShadow = theme === 'light'
    ? (scrolled ? '0 8px 32px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 4px 20px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)')
    : (scrolled ? '0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)');

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex justify-center pt-4 px-6 transition-all duration-300">
      <div
        className="w-full max-w-7xl h-[72px] flex items-center justify-between px-10 transition-all duration-300"
        style={{
          background: navBg,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: navBorder,
          borderRadius: '50px',
          boxShadow: navShadow,
        }}
      >
        {/* Logo */}
        <div className="cursor-pointer select-none flex-shrink-0" onClick={() => navigate('/')}>
          <img
            src={isNavDark ? logoAiLabWhite : logoAiLabBlack}
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
                    ? isNavDark ? 'rgba(255,255,255,0.15)' : 'rgba(13,19,51,0.08)'
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
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Criar Ideia CTA */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50px',
                background: '#036ef2',
                animation: 'nav-pulse 2s ease-in-out infinite',
              }}
            />
            <button
              onClick={() => navigate('/criar')}
              style={{
                position: 'relative',
                background: 'linear-gradient(135deg, #036ef2, #0550c0)',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '8px 18px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'var(--font-outfit)',
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 14px rgba(3,110,242,0.5)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(3,110,242,0.7)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(3,110,242,0.5)'; }}
            >
              Criar Ideia
            </button>
          </div>

          {/* Language switcher — plain PT | EN */}
          <div className="flex items-center gap-0.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.04em' }}>
            {(['PT', 'EN'] as const).map((lang, i) => (
              <>
                {i === 1 && (
                  <span key="sep" style={{ color: isNavDark ? 'rgba(255,255,255,0.25)' : 'rgba(13,19,51,0.25)', padding: '0 2px' }}>|</span>
                )}
                <button
                  key={lang}
                  className="px-1 border-none cursor-pointer bg-transparent transition-all duration-150"
                  style={{
                    color: activeLang === lang
                      ? '#036ef2'
                      : (isNavDark ? 'rgba(255,255,255,0.40)' : 'rgba(13,19,51,0.35)'),
                    fontWeight: activeLang === lang ? 700 : 400,
                    fontSize: '9px',
                  }}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang}
                </button>
              </>
            ))}
          </div>

          {/* Dark / Light mode toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="flex items-center justify-center w-8 h-8 rounded-full border-none cursor-pointer transition-all duration-200 hover:scale-110"
            style={{
              background: isNavDark ? 'rgba(255,255,255,0.10)' : 'rgba(13,19,51,0.07)',
              color: isNavDark ? 'rgba(255,255,255,0.85)' : 'rgba(13,19,51,0.7)',
            }}
          >
            {theme === 'dark' ? (
              /* Sun icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2" x2="12" y2="4"/>
                <line x1="12" y1="20" x2="12" y2="22"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="2" y1="12" x2="4" y2="12"/>
                <line x1="20" y1="12" x2="22" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
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

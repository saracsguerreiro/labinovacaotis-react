import { useState, useEffect } from 'react';

/**
 * Returns whether the navbar should use dark (light-text) styling.
 *
 * - Home (/): scroll-based — dark while the hero banner dominates
 * - /hub2: always dark
 * - /hub: dark when the Nebula view is active, light when Lista view is active
 *         (IdeaHub dispatches a 'hub-view-change' CustomEvent with detail: 'nebula' | 'lista')
 * - All other routes: always light
 */
export function useNavTheme(pathname: string): boolean {
  const isHome     = pathname === '/';
  const isHub      = pathname === '/hub';
  const isHub2     = pathname === '/hub2';
  const isAgentes  = pathname === '/agentes';

  const [isDark, setIsDark] = useState(isHome || isHub || isHub2 || isAgentes);

  useEffect(() => {
    // Rotas sempre escuras (fundo escuro)
    if (isHub2 || isAgentes) {
      setIsDark(true);
      return;
    }

    // Non-special routes: always light
    if (!isHome && !isHub) {
      setIsDark(false);
      return;
    }

    // /hub: dark = nebula, light = lista; listen for the event
    if (isHub) {
      setIsDark(true); // nebula is the default view
      const handler = (e: Event) => {
        setIsDark((e as CustomEvent<string>).detail === 'nebula');
      };
      window.addEventListener('hub-view-change', handler);
      return () => window.removeEventListener('hub-view-change', handler);
    }

    // Home: scroll-based
    if (isHome) {
      const check = () => {
        setIsDark(window.scrollY < window.innerHeight * 0.8);
      };
      check();
      window.addEventListener('scroll', check, { passive: true });
      return () => window.removeEventListener('scroll', check);
    }
  }, [isHome, isHub, isHub2, isAgentes]);

  return isDark;
}

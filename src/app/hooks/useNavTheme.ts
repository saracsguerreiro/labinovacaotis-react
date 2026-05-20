import { useState, useEffect } from 'react';

/**
 * Returns whether the navbar should use dark (light-text) styling.
 *
 * Only the home route needs dynamic detection — it starts over a dark
 * full-screen banner and transitions to light sections as the user scrolls.
 * All other routes have a light background, so they are always light.
 */
export function useNavTheme(pathname: string): boolean {
  const isHome = pathname === '/';
  const [isDark, setIsDark] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setIsDark(false);
      return;
    }

    const check = () => {
      // Dark while the banner (≈ full viewport height) dominates the top
      setIsDark(window.scrollY < window.innerHeight * 0.8);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, [isHome]);

  return isDark;
}

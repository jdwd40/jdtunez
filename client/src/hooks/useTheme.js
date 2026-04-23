import { useState, useEffect } from 'react';

export default function useTheme() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('jdtunez_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('jdtunez_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return { dark, toggle };
}

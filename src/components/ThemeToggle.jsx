import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const getInitialTheme = () =>
    localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      style={{
        position: 'absolute',
        top: 400,
        right: 10,
        zIndex: 999,
        padding: '8px 14px',
        background: theme === 'dark' ? '#222' : '#eee',
        color: theme === 'dark' ? '#fff' : '#222',
        border: '2px solid #1da1f2',
        borderRadius: '24px',
        fontWeight: 600,
        cursor: 'pointer'
      }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default ThemeToggle;
'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('postit_theme') as 'light' | 'dark' | null;
    const initialTheme = saved || 'light';
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('postit_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className="h-9 px-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="화면 모드 전환"
      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-stone-200 dark:border-[#6272a4]/60 bg-white dark:bg-[#282a36] text-stone-800 dark:text-[#f8f8f2] text-xs font-bold shadow-xs hover:bg-stone-50 dark:hover:bg-[#383a59] transition-all cursor-pointer select-none whitespace-nowrap"
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>다크 모드</span>
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>라이트 모드</span>
        </>
      )}
    </button>
  );
}

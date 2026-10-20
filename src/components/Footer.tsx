'use client';

interface FooterProps {
  authorName: string;
}

export default function Footer({ authorName }: FooterProps) {
  return (
    <footer className="w-full max-w-7xl mt-16 pt-6 pb-8 border-t border-stone-200/60 dark:border-[#6272a4]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-[#6272a4]">
      <div className="flex items-center gap-2 font-semibold">
        <div className="w-5 h-5 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center text-[10px] shadow-xs">
          📌
        </div>
        <span className="text-stone-700 dark:text-stone-300 font-bold">INU Post-it Todo List</span>
      </div>

      <p className="font-medium tracking-tight text-center sm:text-right">
        Copyright <span className="font-bold text-stone-700 dark:text-[#f8f8f2]">INU Post-it Todo List</span> by{' '}
        <span className="font-bold text-amber-600 dark:text-amber-400 underline decoration-amber-400/50 underline-offset-2">
          {authorName || 'chaewon lim'}
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
}

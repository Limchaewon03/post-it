'use client';

import { useState } from 'react';
import { Category } from '@/types/postit';
import { Plus } from 'lucide-react';

interface PostItInputProps {
  onAddPostIt: (content: string, category: Category) => void;
}

export default function PostItInput({ onAddPostIt }: PostItInputProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('할 일');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    onAddPostIt(content.trim(), category);
    setContent('');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-[#282a36] rounded-3xl p-6 sm:p-8 mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] border border-stone-200/90 dark:border-[#6272a4]/40 transition-all">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Top Header info */}
        <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="text-sm font-extrabold text-stone-800 dark:text-stone-100">
              포스트잇 작성 란
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-400 font-medium text-xs">
            <span>✨</span>
            <span>원하는 분류와 내용을 적고 붙여보세요</span>
          </div>
        </div>

        {/* Textarea container */}
        <div className="relative border border-stone-200 dark:border-[#6272a4]/50 rounded-2xl p-3.5 bg-stone-50/50 dark:bg-[#1e1e2e]/50 focus-within:border-amber-400 focus-within:bg-white dark:focus-within:bg-[#1e1e2e] focus-within:ring-2 focus-within:ring-amber-400/30 transition-all">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleSubmit(e);
              }
            }}
            placeholder="새로운 메모 내용을 입력하세요... (줄바꿈 가능)"
            rows={4}
            className="w-full bg-transparent text-sm font-medium text-stone-800 dark:text-[#f8f8f2] placeholder:text-stone-400 outline-none resize-none leading-relaxed"
          />
          <div className="flex justify-end text-[11px] font-medium text-stone-400 mt-1 select-none">
            {content.length}자
          </div>
        </div>

        {/* Bottom row: Category selection pills & Random color indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-600 dark:text-stone-400">분류:</span>
            
            {/* '할 일' pill */}
            <button
              type="button"
              onClick={() => setCategory('할 일')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                category === '할 일'
                  ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>📌</span>
              <span>할 일</span>
            </button>

            {/* '아이디어' pill */}
            <button
              type="button"
              onClick={() => setCategory('아이디어')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                category === '아이디어'
                  ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>💡</span>
              <span>아이디어</span>
            </button>

            {/* '기타' pill */}
            <button
              type="button"
              onClick={() => setCategory('기타')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                category === '기타'
                  ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>☕</span>
              <span>기타</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 dark:text-stone-400 text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
            <span>랜덤 파스텔 색상 적용</span>
          </div>
        </div>

        {/* Submit button: '+ 포스트잇 붙이기' */}
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="w-full mt-2 bg-[#0d1424] hover:bg-[#1a233a] dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-stone-950 font-bold py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>포스트잇 붙이기</span>
        </button>
      </form>
    </div>
  );
}

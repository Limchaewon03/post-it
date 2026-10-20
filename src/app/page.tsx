'use client';

import { useState, useEffect, useCallback } from 'react';
import { PostIt, Category, FilterCategory } from '@/types/postit';
import { formatDateTime, generateTimestamp } from '@/lib/dateUtils';
import { fetchPostItsFromSheet, sendSheetAction } from '@/lib/googleSheet';
import ThemeToggle from '@/components/ThemeToggle';
import PostItInput from '@/components/PostItInput';
import PostItList from '@/components/PostItList';
import SettingsModal from '@/components/SettingsModal';
import Footer from '@/components/Footer';
import { ChevronDown, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'simple_postits_v4'; // 중복 캐시 초기화를 위해 v4로 갱신

// 4 random pastel colors: 1 (노란색), 2 (분홍색), 3 (초록색), 4 (파랑색)
const RANDOM_COLORS = ['1', '2', '3', '4'];
const FILTER_OPTIONS: FilterCategory[] = ['전체', '할 일', '아이디어', '기타'];

// 중복 제거 헬퍼
function deduplicatePostIts(items: PostIt[]): PostIt[] {
  const seen = new Set<string>();
  const result: PostIt[] = [];

  for (const item of items) {
    const rawTs = String(item.timestamp || '').trim();
    const content = String(item.content || '').trim();
    if (!content && !rawTs) continue;

    const key = rawTs || `${content}_${item.datetime}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

export default function HomePage() {
  const [postIts, setPostIts] = useState<PostIt[]>([]);
  const [newPostItId, setNewPostItId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authorName, setAuthorName] = useState('chaewon lim');
  const [filter, setFilter] = useState<FilterCategory>('전체');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Load author name
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuthor = localStorage.getItem('postit_author_name');
      if (savedAuthor) {
        setAuthorName(savedAuthor);
      }
    }
  }, []);

  const saveToLocalStorage = (items: PostIt[]) => {
    try {
      const deduplicated = deduplicatePostIts(items);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);

    // 1. LocalStorage cached data
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPostIts(deduplicatePostIts(parsed));
        }
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // 2. Fetch from Google Apps Script
    try {
      const sheetData = await fetchPostItsFromSheet();
      if (sheetData && sheetData.length > 0) {
        const uniqueData = deduplicatePostIts(sheetData);
        setPostIts(uniqueData);
        saveToLocalStorage(uniqueData);
      }
    } catch (e) {
      console.warn('Google Sheets sync error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add new postit note
  const handleAddPostIt = (content: string, category: Category) => {
    const randomColor = RANDOM_COLORS[Math.floor(Math.random() * RANDOM_COLORS.length)];
    const id = generateTimestamp();
    const nowFormatted = formatDateTime(new Date());

    const newNote: PostIt = {
      timestamp: id,
      datetime: nowFormatted,
      category,
      content,
      color: randomColor,
      state: '미완료',
      order: 1,
    };

    setNewPostItId(id);

    setPostIts((prev) => {
      const updated = deduplicatePostIts([newNote, ...prev]).map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      saveToLocalStorage(updated);
      sendSheetAction('SYNC_ALL', updated);
      return updated;
    });

    setTimeout(() => {
      setNewPostItId(null);
    }, 500);
  };

  const handleToggleComplete = (id: string) => {
    setPostIts((prev) => {
      const updated = prev.map((item) => {
        if (item.timestamp === id) {
          const nextState: '완료' | '미완료' = item.state === '완료' ? '미완료' : '완료';
          const updatedItem = { ...item, state: nextState };
          sendSheetAction('UPDATE', updatedItem);
          return updatedItem;
        }
        return item;
      });
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const handleEdit = (id: string, newContent: string, newCategory: Category) => {
    setPostIts((prev) => {
      const updated = prev.map((item) => {
        if (item.timestamp === id) {
          const updatedItem = { ...item, content: newContent, category: newCategory };
          sendSheetAction('UPDATE', updatedItem);
          return updatedItem;
        }
        return item;
      });
      saveToLocalStorage(updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setPostIts((prev) => {
      const filtered = prev
        .filter((item) => item.timestamp !== id)
        .map((item, idx) => ({ ...item, order: idx + 1 }));

      saveToLocalStorage(filtered);
      sendSheetAction('DELETE', { timestamp: id });
      return filtered;
    });
  };

  const handleReorder = (newPostIts: PostIt[]) => {
    const deduplicated = deduplicatePostIts(newPostIts);
    setPostIts(deduplicated);
    saveToLocalStorage(deduplicated);
    sendSheetAction('SYNC_ALL', deduplicated);
  };

  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-6 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-between font-sans">
      <div className="w-full max-w-7xl flex flex-col items-center">
        
        {/* Top Header Bar matching user's reference image */}
        <header className="w-full flex flex-col sm:flex-row items-center justify-between mb-8 py-2 gap-4">
          {/* Left Brand: Notepad Icon + '포스트잇 보드' (Sticky Board 제거 & 줄바꿈 방지) */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-2xl sm:text-3xl select-none">📝</span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-[#f8f8f2] whitespace-nowrap">
              포스트잇 보드
            </h1>
          </div>

          {/* Right Controls: Filter Dropdown + Dark mode toggle + Settings modal */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end w-full sm:w-auto">
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-2xl bg-white dark:bg-[#282a36] border border-stone-200 dark:border-[#6272a4]/60 text-xs font-bold text-stone-800 dark:text-[#f8f8f2] shadow-xs hover:bg-stone-50 dark:hover:bg-[#383a59] transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="text-stone-400 font-medium">분류:</span>
                <span>{filter === '전체' ? '전체 보기' : filter}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {isFilterDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-[#282a36] border border-stone-200 dark:border-[#6272a4] rounded-2xl shadow-xl z-40 py-1.5 backdrop-blur-md animate-fade-in">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFilter(opt);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                        filter === opt
                          ? 'bg-amber-50 dark:bg-[#44475a] text-amber-800 dark:text-amber-300'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#383a59]'
                      }`}
                    >
                      <span>{opt === '전체' ? '전체 보기' : opt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={loadData}
              disabled={isLoading}
              title="구글 시트 동기화"
              className="p-2 rounded-2xl bg-white dark:bg-[#282a36] border border-stone-200 dark:border-[#6272a4]/60 hover:bg-stone-50 dark:hover:bg-[#383a59] text-stone-600 dark:text-stone-300 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
            </button>

            {/* Dark Mode toggle styled like user screenshot: '(달 아이콘) 다크 모드' */}
            <ThemeToggle />

            {/* Settings Modal (Google Apps Script URL & Author) */}
            <SettingsModal
              authorName={authorName}
              onUpdateAuthor={setAuthorName}
              onSettingsSaved={loadData}
            />
          </div>
        </header>

        {/* Input box */}
        <PostItInput onAddPostIt={handleAddPostIt} />

        {/* Post-it Notes Grid */}
        <PostItList
          postIts={postIts}
          filter={filter}
          showAll={showAll}
          onToggleShowAll={() => setShowAll((prev) => !prev)}
          newPostItId={newPostItId}
          isLoading={isLoading}
          onReorder={handleReorder}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Footer */}
      <Footer authorName={authorName} />
    </main>
  );
}

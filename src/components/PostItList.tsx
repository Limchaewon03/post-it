'use client';

import { useState } from 'react';
import { PostIt, FilterCategory, Category } from '@/types/postit';
import PostItCard from './PostItCard';
import PostItCardView from './PostItCardView';
import { StickyNote, ChevronRight, Layers } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

interface PostItListProps {
  postIts: PostIt[];
  filter: FilterCategory;
  showAll: boolean;
  onToggleShowAll: () => void;
  newPostItId: string | null;
  isLoading: boolean;
  onReorder: (newPostIts: PostIt[]) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newContent: string, newCategory: Category) => void;
  onDelete: (id: string) => void;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
  duration: 250,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
};

export default function PostItList({
  postIts,
  filter,
  showAll,
  onToggleShowAll,
  newPostItId,
  isLoading,
  onReorder,
  onToggleComplete,
  onEdit,
  onDelete,
}: PostItListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // PointerSensor with immediate 4px activation constraint for crisp and responsive feel
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = postIts.findIndex((item) => item.timestamp === active.id);
    const newIndex = postIts.findIndex((item) => item.timestamp === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(postIts, oldIndex, newIndex).map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      onReorder(reordered);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Filtered postits
  const filteredPostIts =
    filter === '전체'
      ? postIts
      : postIts.filter((item) => item.category === filter);

  // If showAll is false, show strictly 4 items max
  const displayedPostIts = showAll ? filteredPostIts : filteredPostIts.slice(0, 4);
  const remainingCount = Math.max(0, filteredPostIts.length - 4);
  const activePostIt = activeId ? postIts.find((p) => p.timestamp === activeId) : null;

  return (
    <div className="w-full max-w-7xl">
      {/* Subheader bar */}
      <div className="w-full flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
            {filter} 목록 ({filteredPostIts.length}개)
          </span>
          {!showAll && filteredPostIts.length > 4 && (
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-200 px-2.5 py-0.5 rounded-full">
              상위 4개 표시 중
            </span>
          )}
        </div>

        {/* 전체보기 토글 버튼: 4개 초과 시에만 등장 */}
        {filteredPostIts.length > 4 && (
          <button
            type="button"
            onClick={onToggleShowAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-[#282a36] border border-amber-300 dark:border-amber-600/60 text-amber-900 dark:text-amber-200 text-xs font-bold shadow-sm hover:bg-amber-50 dark:hover:bg-[#383a59] transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>{showAll ? '접기 (4개만 보기)' : `전체보기 (+${remainingCount}개 더보기)`}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? '-rotate-90' : 'rotate-90'}`} />
          </button>
        )}
      </div>

      {isLoading && postIts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400 dark:text-stone-500 animate-pulse">
          <StickyNote className="w-12 h-12 mb-3 stroke-[1.5] text-amber-400" />
          <p className="text-sm font-semibold">구글 시트에서 포스트잇을 불러오는 중입니다...</p>
        </div>
      ) : filteredPostIts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed border-stone-300 dark:border-stone-700 bg-white/40 dark:bg-stone-900/30 text-stone-400 dark:text-stone-500">
          <StickyNote className="w-10 h-10 mb-3 stroke-[1.5] text-stone-300 dark:text-stone-600" />
          <p className="text-sm font-bold text-stone-600 dark:text-stone-400 mb-1">
            등록된 포스트잇이 없습니다
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500">
            위의 입력창에서 새로운 메모를 작성하고 붙여보세요!
          </p>
        </div>
      ) : (
        /* Smooth DnD with DragOverlay */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={displayedPostIts.map((item) => item.timestamp)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-1 pb-16">
              {displayedPostIts.map((postIt) => (
                <PostItCard
                  key={postIt.timestamp}
                  postIt={postIt}
                  isNew={postIt.timestamp === newPostItId}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </SortableContext>

          {/* Smooth floating DragOverlay */}
          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activePostIt ? (
              <PostItCardView
                postIt={activePostIt}
                isOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

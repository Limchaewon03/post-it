'use client';

import { PostIt, POSTIT_COLORS, Category } from '@/types/postit';
import { X, Clock, Edit3, Check } from 'lucide-react';
import { useState } from 'react';

interface PostItCardViewProps {
  postIt: PostIt;
  isEditing?: boolean;
  isDragging?: boolean;
  isOverlay?: boolean;
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string, newContent: string, newCategory: Category) => void;
  onDelete?: (id: string) => void;
  setIsEditing?: (val: boolean) => void;
}

const CATEGORIES: Category[] = ['할 일', '아이디어', '기타'];

export default function PostItCardView({
  postIt,
  isEditing = false,
  isDragging = false,
  isOverlay = false,
  onToggleComplete,
  onEdit,
  onDelete,
  setIsEditing,
}: PostItCardViewProps) {
  const [editContent, setEditContent] = useState(postIt.content);
  const [editCategory, setEditCategory] = useState<Category>(postIt.category);

  const colorConfig = POSTIT_COLORS[postIt.color] || POSTIT_COLORS['1'];
  const isCompleted = postIt.state === '완료';

  const handleSave = () => {
    if (editContent.trim() && onEdit && setIsEditing) {
      onEdit(postIt.timestamp, editContent.trim(), editCategory);
      setIsEditing(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: colorConfig.inlineBg,
        borderColor: colorConfig.borderClass.replace('border-[', '').replace(']', ''),
        color: colorConfig.textClass.replace('text-[', '').replace(']', ''),
      }}
      className={`relative group flex flex-col justify-between rounded-3xl p-5 sm:p-6 border min-h-[220px] transition-all duration-200 select-none ${
        isOverlay
          ? 'shadow-[0_24px_45px_rgba(0,0,0,0.22)] scale-105 rotate-2 ring-2 ring-amber-400/80 cursor-grabbing'
          : isDragging
          ? 'opacity-30 scale-95 border-dashed shadow-none cursor-grabbing'
          : 'shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-grab'
      }`}
    >
      {/* Semi-transparent tape clip on top center */}
      <div className="postit-tape-top" />

      {/* Top Header: Category Tag & Action buttons */}
      <div className="flex items-center justify-between mb-3 pt-1">
        {/* Category Pill Tag */}
        {isEditing ? (
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as Category)}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white/80 border border-current/20 outline-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        ) : (
          <span
            style={{
              backgroundColor: colorConfig.inlineBadgeBg,
              color: colorConfig.inlineBadgeText,
            }}
            className="text-xs font-extrabold px-3 py-1 rounded-lg tracking-tight select-none shadow-xs"
          >
            {postIt.category}
          </span>
        )}

        {/* Action icons: Edit and Delete (X) */}
        {!isOverlay && (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <button
                type="button"
                onClick={handleSave}
                title="저장"
                className="p-1.5 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
              </button>
            ) : (
              setIsEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  title="편집"
                  className="p-1.5 rounded-lg opacity-40 group-hover:opacity-100 hover:bg-black/10 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )
            )}

            {/* Delete button (X) */}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(postIt.timestamp)}
                title="메모 즉시 삭제"
                className="p-1.5 rounded-lg opacity-40 group-hover:opacity-100 hover:bg-black/10 transition-all hover:text-red-600 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Note Content Area */}
      <div className="flex-1 my-2">
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            rows={4}
            className="w-full text-sm font-medium p-2.5 rounded-xl bg-white/80 border border-current/20 outline-none resize-none leading-relaxed"
            autoFocus
          />
        ) : (
          <div
            onClick={() => onToggleComplete && onToggleComplete(postIt.timestamp)}
            title="클릭하여 완료 상태 변경"
            className={`text-sm sm:text-[15px] font-semibold leading-relaxed whitespace-pre-wrap break-words transition-all ${
              isCompleted ? 'line-through opacity-40' : 'opacity-95'
            }`}
          >
            {postIt.content || '(내용 없음)'}
          </div>
        )}
      </div>

      {/* Bottom Footer: Clock icon and Datetime */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-black/10 text-[11px] font-medium opacity-50 select-none">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 stroke-[2]" />
          <span>{postIt.datetime}</span>
        </div>

        {isCompleted && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-900">
            완료 ✓
          </span>
        )}
      </div>
    </div>
  );
}

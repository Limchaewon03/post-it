'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PostIt, Category } from '@/types/postit';
import PostItCardView from './PostItCardView';

interface PostItCardProps {
  postIt: PostIt;
  isNew?: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string, newContent: string, newCategory: Category) => void;
  onDelete: (id: string) => void;
}

export default function PostItCard({
  postIt,
  isNew = false,
  onToggleComplete,
  onEdit,
  onDelete,
}: PostItCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: postIt.timestamp,
    disabled: isEditing,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isNew ? 'animate-stick-in' : ''}
    >
      <PostItCardView
        postIt={postIt}
        isEditing={isEditing}
        isDragging={isDragging}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}

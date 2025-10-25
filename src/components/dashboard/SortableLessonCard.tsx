'use client';

import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import LessonCard from './LessonCard';

interface Lesson {
  id: string;
  title: string;
  type: 'standard' | 'practice';
  access_type: 'free' | 'paid';
  position: number;
  video_url?: string;
  lecture_url?: string;
  total_questions?: number;
  random_questions?: number;
  mistake_chance?: number;
  lesson_points?: number;
}

interface SortableLessonCardProps {
  lesson: Lesson;
  groupColor: string;
  onSelect: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  onEdit?: (lesson: Lesson) => void;
  onViewInfo?: (lesson: Lesson) => void;
}

export default function SortableLessonCard({ lesson, groupColor, onSelect, onDelete, onEdit, onViewInfo }: SortableLessonCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <LessonCard
        lesson={lesson}
        groupColor={groupColor}
        onSelect={onSelect}
        onDelete={onDelete}
        onEdit={onEdit}
        onViewInfo={onViewInfo}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

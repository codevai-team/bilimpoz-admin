'use client';

import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import GroupCard from './GroupCard';

interface LessonGroup {
  id: string;
  title: string;
  position: number;
  color_code: string;
  lessons: any[];
}

interface SortableGroupCardProps {
  group: LessonGroup;
  onSelect: (group: LessonGroup) => void;
  onDelete: (groupId: string) => void;
  onEdit?: (group: LessonGroup) => void;
  onViewInfo?: (group: LessonGroup) => void;
  onConfirmDelete?: (options: {
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void;
}

export default function SortableGroupCard({ group, onSelect, onDelete, onEdit, onViewInfo, onConfirmDelete }: SortableGroupCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <GroupCard
        group={group}
        onSelect={onSelect}
        onDelete={onDelete}
        onEdit={onEdit}
        onViewInfo={onViewInfo}
        onConfirmDelete={onConfirmDelete}
        dragHandleProps={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

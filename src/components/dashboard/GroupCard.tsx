'use client';

import { Icons } from '@/components/ui/Icons';

interface LessonGroup {
  id: string;
  title: string;
  position: number;
  color_code: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  position: number;
  type: 'standard' | 'practice';
  access_type: 'free' | 'paid';
}

interface GroupCardProps {
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
  dragHandleProps?: any;
  isDragging?: boolean;
}

export default function GroupCard({ group, onSelect, onDelete, onEdit, onViewInfo, onConfirmDelete, dragHandleProps, isDragging: _isDragging }: GroupCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConfirmDelete) {
      onConfirmDelete({
        title: 'Удалить группу уроков',
        message: `Вы уверены, что хотите удалить группу "${group.title}"? Все уроки в ней также будут удалены. Это действие нельзя отменить.`,
        onConfirm: () => onDelete(group.id)
      });
    } else {
      // Fallback к стандартному confirm если onConfirmDelete не передан
      if (confirm('Вы уверены, что хотите удалить эту группу? Все уроки в ней также будут удалены.')) {
        onDelete(group.id);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(group);
    }
  };

  const handleViewInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInfo) {
      onViewInfo(group);
    }
  };

  return (
    <div 
      onClick={() => onSelect(group)}
      className="bg-[#242424] hover:bg-[#363636] rounded-lg p-4 cursor-pointer transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Drag handle */}
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="flex items-center justify-center w-6 h-16 cursor-grab active:cursor-grabbing group/drag"
              title="Перетащите для изменения порядка"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover/drag:text-white transition-all duration-200 group-hover/drag:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zM7 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zM7 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zM13 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 2zM13 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zM13 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"></path>
              </svg>
            </div>
          )}
          
          {/* Цветовой индикатор */}
          <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ backgroundColor: group.color_code }}>
            <Icons.FolderOpen className="h-8 w-8 text-white" />
          </div>

          {/* Информация о группе */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate">{group.title}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-2">{group.lessons.length} уроков</p>
          </div>
        </div>
        
        {/* Действия */}
        <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {onViewInfo && (
            <button
              onClick={handleViewInfo}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              title="Просмотр информации о группе"
            >
              <Icons.Eye className="h-5 w-5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              title="Редактировать группу"
            >
              <Icons.Settings className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-white hover:text-gray-300 transition-colors"
            title="Удалить группу"
          >
            <Icons.Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

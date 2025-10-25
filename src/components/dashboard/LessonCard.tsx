'use client';

import { Icons } from '@/components/ui/Icons';

interface Lesson {
  id: string;
  title: string;
  position: number;
  type: 'standard' | 'practice';
  access_type: 'free' | 'paid';
}

interface LessonCardProps {
  lesson: Lesson;
  groupColor: string;
  onSelect: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
  onEdit?: (lesson: Lesson) => void;
  onViewInfo?: (lesson: Lesson) => void;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export default function LessonCard({ lesson, groupColor, onSelect, onDelete, onEdit, onViewInfo, dragHandleProps, isDragging: _isDragging }: LessonCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот урок?')) {
      onDelete(lesson.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(lesson);
    }
  };

  const handleViewInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInfo) {
      onViewInfo(lesson);
    }
  };

  return (
    <div 
      onClick={() => onSelect(lesson)}
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
              <svg className="w-3 h-3 text-gray-400 group-hover/drag:text-white transition-all duration-200 group-hover/drag:scale-110" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zM7 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zM7 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zM13 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 2zM13 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zM13 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"></path>
              </svg>
            </div>
          )}
          
          {/* Иконка урока */}
          <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ backgroundColor: groupColor }}>
            <Icons.Play className="h-8 w-8 text-white" />
          </div>

          {/* Информация об уроке */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate">{lesson.title}</h3>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded ${
                lesson.type === 'practice' 
                  ? 'bg-orange-500/10 text-orange-400' 
                  : 'bg-blue-500/10 text-blue-400'
              }`}>
                {lesson.type === 'practice' ? 'Практика' : 'Урок'}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${
                lesson.access_type === 'paid' 
                  ? 'bg-yellow-500/10 text-yellow-400' 
                  : 'bg-green-500/10 text-green-400'
              }`}>
                {lesson.access_type === 'paid' ? 'Платный' : 'Бесплатный'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Действия */}
        <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {onViewInfo && (
            <button
              onClick={handleViewInfo}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              title="Просмотр информации об уроке"
            >
              <Icons.Eye className="h-5 w-5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              title="Редактировать урок"
            >
              <Icons.Settings className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-white hover:text-gray-300 transition-colors"
            title="Удалить урок"
          >
            <Icons.Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

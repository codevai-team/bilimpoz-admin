'use client';

import Image from 'next/image';
import { Icons } from '@/components/ui/Icons';

interface Course {
  id: string;
  name: string;
  description: string;
  course_photo_url?: string;
  language: 'kg' | 'ru';
  created_at: string;
  updated_at: string;
  lesson_groups: LessonGroup[];
}

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

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onEdit?: (course: Course) => void;
  onViewInfo?: (course: Course) => void;
}

export default function CourseCard({ course, onSelect, onDelete, onEdit, onViewInfo }: CourseCardProps) {
  const totalLessons = course.lesson_groups.reduce((acc, group) => acc + group.lessons.length, 0);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLanguageLabel = (language: string) => {
    return language === 'ru' ? 'Русский' : 'Кыргызский';
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот курс? Это действие нельзя отменить.')) {
      onDelete(course.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(course);
    }
  };

  const handleViewInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewInfo) {
      onViewInfo(course);
    }
  };

  return (
    <div 
      onClick={() => onSelect(course)}
      className="bg-[#242424] hover:bg-[#363636] rounded-lg p-4 cursor-pointer transition-colors group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          {/* Фото курса или иконка */}
          <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
            {course.course_photo_url ? (
              <Image
                src={course.course_photo_url}
                alt={course.name}
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Icons.BookOpen className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {/* Информация о курсе */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-white truncate">{course.name}</h3>
              <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                {getLanguageLabel(course.language)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{course.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{course.lesson_groups.length} групп</span>
              <span>{totalLessons} уроков</span>
              <span>Создан {formatDate(course.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {onViewInfo && (
            <button
              onClick={handleViewInfo}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              title="Просмотр информации о курсе"
            >
              <Icons.Eye className="h-5 w-5" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-2 text-white hover:text-gray-300 transition-colors"
              title="Редактировать курс"
            >
              <Icons.Settings className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-2 text-white hover:text-gray-300 transition-colors"
            title="Удалить курс"
          >
            <Icons.Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';

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

interface ViewInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'course' | 'group' | 'lesson';
  data: Course | LessonGroup | Lesson | null;
  course?: Course;
  group?: LessonGroup;
}

export default function ViewInfoModal({ isOpen, onClose, type, data, course, group }: ViewInfoModalProps) {
  if (!isOpen || !data) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageLabel = (language: string) => {
    return language === 'ru' ? 'Русский' : 'Кыргызский';
  };

  const renderCourseInfo = (courseData: Course) => (
    <div className="space-y-4">
      {/* Фото курса */}
      {courseData.course_photo_url && (
        <div className="flex justify-center">
          <img
            src={courseData.course_photo_url}
            alt={courseData.name}
            className="w-32 h-32 object-cover rounded-lg border border-gray-600"
          />
        </div>
      )}

      {/* Основная информация */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Название</label>
          <p className="text-white">{courseData.name}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Описание</label>
          <p className="text-gray-300">{courseData.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Язык</label>
            <span className="inline-flex px-2 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full">
              {getLanguageLabel(courseData.language)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">ID курса</label>
            <p className="text-gray-300 font-mono text-sm">{courseData.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Групп уроков</label>
            <p className="text-white font-semibold">{courseData.lesson_groups.length}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Всего уроков</label>
            <p className="text-white font-semibold">
              {courseData.lesson_groups.reduce((acc, group) => acc + group.lessons.length, 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Создан</label>
            <p className="text-gray-300 text-sm">{formatDate(courseData.created_at)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Обновлен</label>
            <p className="text-gray-300 text-sm">{formatDate(courseData.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroupInfo = (groupData: LessonGroup) => (
    <div className="space-y-4">
      {/* Основная информация */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Название группы</label>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: groupData.color_code }}
            />
            <p className="text-white">{groupData.title}</p>
          </div>
        </div>

        {course && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Курс</label>
            <p className="text-gray-300">{course.name}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Позиция</label>
            <p className="text-white font-semibold">{groupData.position}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Количество уроков</label>
            <p className="text-white font-semibold">{groupData.lessons.length}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">ID группы</label>
          <p className="text-gray-300 font-mono text-sm">{groupData.id}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Цветовой код</label>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-gray-600"
              style={{ backgroundColor: groupData.color_code }}
            />
            <p className="text-gray-300 font-mono text-sm">{groupData.color_code}</p>
          </div>
        </div>
      </div>

      {/* Список уроков */}
      {groupData.lessons.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Уроки в группе</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {groupData.lessons
              .sort((a, b) => a.position - b.position)
              .map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">{lesson.position}.</span>
                    <span className="text-white text-sm">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      lesson.type === 'practice' 
                        ? 'bg-orange-500/10 text-orange-400' 
                        : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {lesson.type === 'practice' ? 'Практика' : 'Урок'}
                    </span>
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      lesson.access_type === 'paid' 
                        ? 'bg-yellow-500/10 text-yellow-400' 
                        : 'bg-green-500/10 text-green-400'
                    }`}>
                      {lesson.access_type === 'paid' ? 'Платный' : 'Бесплатный'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLessonInfo = (lessonData: Lesson) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Название урока</label>
          <p className="text-white">{lessonData.title}</p>
        </div>

        {course && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Курс</label>
            <p className="text-gray-300">{course.name}</p>
          </div>
        )}

        {group && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Группа уроков</label>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color_code }}
              />
              <p className="text-gray-300">{group.title}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Позиция</label>
            <p className="text-white font-semibold">{lessonData.position}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Тип урока</label>
            <span className={`inline-flex px-2 py-1 text-xs rounded ${
              lessonData.type === 'practice' 
                ? 'bg-orange-500/10 text-orange-400' 
                : 'bg-blue-500/10 text-blue-400'
            }`}>
              {lessonData.type === 'practice' ? 'Практическое задание' : 'Обычный урок'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Тип доступа</label>
          <span className={`inline-flex px-2 py-1 text-xs rounded ${
            lessonData.access_type === 'paid' 
              ? 'bg-yellow-500/10 text-yellow-400' 
              : 'bg-green-500/10 text-green-400'
          }`}>
            {lessonData.access_type === 'paid' ? 'Платный доступ' : 'Бесплатный доступ'}
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">ID урока</label>
          <p className="text-gray-300 font-mono text-sm">{lessonData.id}</p>
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'course':
        return 'Информация о курсе';
      case 'group':
        return 'Информация о группе уроков';
      case 'lesson':
        return 'Информация об уроке';
      default:
        return 'Информация';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'course':
        return <Icons.BookOpen className="h-5 w-5" />;
      case 'group':
        return <Icons.FolderOpen className="h-5 w-5" />;
      case 'lesson':
        return <Icons.Play className="h-5 w-5" />;
      default:
        return <Icons.Info className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2">
            {getIcon()}
            <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {type === 'course' && renderCourseInfo(data as Course)}
          {type === 'group' && renderGroupInfo(data as LessonGroup)}
          {type === 'lesson' && renderLessonInfo(data as Lesson)}
        </div>

        <div className="px-6 pb-6">
          <Button onClick={onClose} className="w-full">
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
}

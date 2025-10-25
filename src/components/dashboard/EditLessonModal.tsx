'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface LessonData {
  title: string;
  video_url: string;
  lecture_url: string;
  type: 'standard' | 'practice';
  access_type: 'free' | 'paid';
  total_questions: number;
  random_questions: number;
  mistake_chance: number;
  lesson_points: number;
}

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lessonData: LessonData) => void;
  lesson: {
    id: string;
    title: string;
    video_url?: string;
    lecture_url?: string;
    type: 'standard' | 'practice';
    access_type: 'free' | 'paid';
    total_questions?: number;
    random_questions?: number;
    mistake_chance?: number;
    lesson_points?: number;
  };
}

export default function EditLessonModal({ isOpen, onClose, onSubmit, lesson }: EditLessonModalProps) {
  const [formData, setFormData] = useState<LessonData>({
    title: '',
    video_url: '',
    lecture_url: '',
    type: 'standard',
    access_type: 'free',
    total_questions: 50,
    random_questions: 10,
    mistake_chance: 2,
    lesson_points: 10
  });

  useEffect(() => {
    if (lesson && isOpen) {
      setFormData({
        title: lesson.title,
        video_url: lesson.video_url || '',
        lecture_url: lesson.lecture_url || '',
        type: lesson.type,
        access_type: lesson.access_type,
        total_questions: lesson.total_questions || 50,
        random_questions: lesson.random_questions || 10,
        mistake_chance: lesson.mistake_chance || 2,
        lesson_points: lesson.lesson_points || 10
      });
    }
  }, [lesson, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof LessonData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-white">Редактировать урок</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Основная информация</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название урока *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Введите название урока"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL видео *
              </label>
              <Input
                type="url"
                value={formData.video_url}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL лекции *
              </label>
              <Input
                type="url"
                value={formData.lecture_url}
                onChange={(e) => handleInputChange('lecture_url', e.target.value)}
                placeholder="https://example.com/lecture.pdf"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип урока *
                </label>
                <Select
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value as 'standard' | 'practice')}
                  options={[
                    { value: 'standard', label: 'Стандартный урок' },
                    { value: 'practice', label: 'Практический урок' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип доступа *
                </label>
                <Select
                  value={formData.access_type}
                  onChange={(value) => handleInputChange('access_type', value as 'free' | 'paid')}
                  options={[
                    { value: 'free', label: 'Бесплатный' },
                    { value: 'paid', label: 'Платный' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Настройки тестирования */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Настройки тестирования</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Общее количество вопросов
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.total_questions}
                  onChange={(e) => handleInputChange('total_questions', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Случайные вопросы
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.random_questions}
                  onChange={(e) => handleInputChange('random_questions', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Допустимые ошибки
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.mistake_chance}
                  onChange={(e) => handleInputChange('mistake_chance', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Баллы за урок
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.lesson_points}
                  onChange={(e) => handleInputChange('lesson_points', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

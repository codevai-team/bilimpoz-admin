'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface CreateLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (lessonData: LessonFormData) => Promise<void>;
  courseId: string;
  groupId: string;
}

interface LessonFormData {
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

interface LessonFormErrors {
  title?: string;
  video_url?: string;
  lecture_url?: string;
  type?: string;
  access_type?: string;
  total_questions?: string;
  random_questions?: string;
  mistake_chance?: string;
  lesson_points?: string;
}

export default function CreateLessonModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  courseId: _courseId,
  groupId: _groupId 
}: CreateLessonModalProps) {
  const [formData, setFormData] = useState<LessonFormData>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LessonFormErrors>({});

  const handleInputChange = (field: keyof LessonFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LessonFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название урока обязательно';
    }

    if (!formData.video_url.trim()) {
      newErrors.video_url = 'URL видео обязателен';
    }

    if (!formData.lecture_url.trim()) {
      newErrors.lecture_url = 'URL лекции обязателен';
    }

    if (formData.total_questions < 1) {
      newErrors.total_questions = 'Количество вопросов должно быть больше 0';
    }

    if (formData.random_questions < 1) {
      newErrors.random_questions = 'Количество случайных вопросов должно быть больше 0';
    }

    if (formData.random_questions > formData.total_questions) {
      newErrors.random_questions = 'Случайных вопросов не может быть больше общего количества';
    }

    if (formData.mistake_chance < 0) {
      newErrors.mistake_chance = 'Количество ошибок не может быть отрицательным';
    }

    if (formData.lesson_points < 1) {
      newErrors.lesson_points = 'Количество баллов должно быть больше 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Сбрасываем форму после успешного создания
      setFormData({
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
    } catch (error) {
      console.error('Ошибка создания урока:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
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
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        {/* Заголовок модального окна */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-[#151515]">
          <h2 className="text-xl font-semibold text-white">Создать урок</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <Icons.X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Основная информация</h3>
            
            {/* Название урока */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Название урока *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Введите название урока"
                className={errors.title ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* URL видео */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL видео *
              </label>
              <Input
                type="url"
                value={formData.video_url}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                placeholder="https://example.com/video.mp4"
                className={errors.video_url ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.video_url && (
                <p className="text-red-400 text-sm mt-1">{errors.video_url}</p>
              )}
            </div>

            {/* URL лекции */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL лекции *
              </label>
              <Input
                type="url"
                value={formData.lecture_url}
                onChange={(e) => handleInputChange('lecture_url', e.target.value)}
                placeholder="https://example.com/lecture.pdf"
                className={errors.lecture_url ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.lecture_url && (
                <p className="text-red-400 text-sm mt-1">{errors.lecture_url}</p>
              )}
            </div>

            {/* Тип урока и доступ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип урока
                </label>
                <Select
                  value={formData.type}
                  onChange={(value) => handleInputChange('type', value as 'standard' | 'practice')}
                  disabled={isSubmitting}
                  options={[
                    { value: 'standard', label: 'Стандартный урок' },
                    { value: 'practice', label: 'Практический урок' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Тип доступа
                </label>
                <Select
                  value={formData.access_type}
                  onChange={(value) => handleInputChange('access_type', value as 'free' | 'paid')}
                  disabled={isSubmitting}
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
              {/* Общее количество вопросов */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Общее количество вопросов
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.total_questions}
                  onChange={(e) => handleInputChange('total_questions', parseInt(e.target.value) || 0)}
                  className={errors.total_questions ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.total_questions && (
                  <p className="text-red-400 text-sm mt-1">{errors.total_questions}</p>
                )}
              </div>

              {/* Случайные вопросы */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Случайные вопросы
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.random_questions}
                  onChange={(e) => handleInputChange('random_questions', parseInt(e.target.value) || 0)}
                  className={errors.random_questions ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.random_questions && (
                  <p className="text-red-400 text-sm mt-1">{errors.random_questions}</p>
                )}
              </div>

              {/* Количество ошибок */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Допустимые ошибки
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.mistake_chance}
                  onChange={(e) => handleInputChange('mistake_chance', parseInt(e.target.value) || 0)}
                  className={errors.mistake_chance ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.mistake_chance && (
                  <p className="text-red-400 text-sm mt-1">{errors.mistake_chance}</p>
                )}
              </div>

              {/* Баллы за урок */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Баллы за урок
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.lesson_points}
                  onChange={(e) => handleInputChange('lesson_points', parseInt(e.target.value) || 0)}
                  className={errors.lesson_points ? 'border-red-500' : ''}
                  disabled={isSubmitting}
                />
                {errors.lesson_points && (
                  <p className="text-red-400 text-sm mt-1">{errors.lesson_points}</p>
                )}
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Создание...' : 'Создать урок'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

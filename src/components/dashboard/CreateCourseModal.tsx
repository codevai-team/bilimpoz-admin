'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: CourseFormData) => Promise<void>;
}

interface CourseFormData {
  name: string;
  description: string;
  language: 'kg' | 'ru';
  course_photo_url?: string;
}

export default function CreateCourseModal({ isOpen, onClose, onSubmit }: CreateCourseModalProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
    language: 'ru',
    course_photo_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CourseFormData>>({});

  const handleInputChange = (field: keyof CourseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CourseFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название курса обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание курса обязательно';
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
        name: '',
        description: '',
        language: 'ru',
        course_photo_url: ''
      });
    } catch (error) {
      console.error('Ошибка создания курса:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        description: '',
        language: 'ru',
        course_photo_url: ''
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-md">
        {/* Заголовок модального окна */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-white">Создать курс</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Название курса */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название курса *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Введите название курса"
              className={errors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Введите описание курса"
              rows={3}
              disabled={isSubmitting}
              className={`
                w-full px-4 py-3 bg-gray-800 border rounded-lg text-white
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20
                disabled:opacity-50 disabled:cursor-not-allowed resize-none
                ${errors.description ? 'border-red-500' : 'border-gray-700'}
              `}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Язык */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Язык курса
            </label>
            <Select
              value={formData.language}
              onChange={(value) => handleInputChange('language', value as 'kg' | 'ru')}
              disabled={isSubmitting}
              options={[
                { value: 'ru', label: 'Русский' },
                { value: 'kg', label: 'Кыргызский' }
              ]}
            />
          </div>

          {/* URL фото (необязательно) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL фото курса (необязательно)
            </label>
            <Input
              type="url"
              value={formData.course_photo_url}
              onChange={(e) => handleInputChange('course_photo_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
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
              {isSubmitting ? 'Создание...' : 'Создать курс'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}





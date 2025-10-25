'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface CourseData {
  name: string;
  description: string;
  course_photo_url: string;
  language: 'kg' | 'ru';
}

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (courseData: CourseData) => void;
  course: {
    id: string;
    name: string;
    description: string;
    course_photo_url?: string;
    language: 'kg' | 'ru';
  };
}

export default function EditCourseModal({ isOpen, onClose, onSubmit, course }: EditCourseModalProps) {
  const [formData, setFormData] = useState<CourseData>(() => ({
    name: course?.name || '',
    description: course?.description || '',
    course_photo_url: course?.course_photo_url || '',
    language: course?.language || 'ru'
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-white">Редактировать курс</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-gray-300 transition-colors"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название курса *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Введите название курса"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Введите описание курса"
              rows={3}
              className="w-full px-3 py-2 bg-[#242424] border-0 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL фото курса
            </label>
            <Input
              type="url"
              value={formData.course_photo_url}
              onChange={(e) => handleInputChange('course_photo_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Язык курса *
            </label>
            <Select
              value={formData.language}
              onChange={(value) => handleInputChange('language', value)}
              options={[
                { value: 'ru', label: 'Русский' },
                { value: 'kg', label: 'Кыргызский' }
              ]}
            />
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

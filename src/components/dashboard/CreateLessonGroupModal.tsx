'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface CreateLessonGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: LessonGroupFormData) => Promise<void>;
  courseId: string;
}

interface LessonGroupFormData {
  title: string;
  color_code: string;
}

const predefinedColors = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#EC4899', // pink
  '#6366F1', // indigo
];

export default function CreateLessonGroupModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  courseId: _courseId 
}: CreateLessonGroupModalProps) {
  const [formData, setFormData] = useState<LessonGroupFormData>({
    title: '',
    color_code: predefinedColors[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<LessonGroupFormData>>({});

  const handleInputChange = (field: keyof LessonGroupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку для этого поля
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LessonGroupFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название группы обязательно';
    }

    if (!formData.color_code) {
      newErrors.color_code = 'Выберите цвет для группы';
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
        color_code: predefinedColors[0]
      });
    } catch (error) {
      console.error('Ошибка создания группы уроков:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        color_code: predefinedColors[0]
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
          <h2 className="text-xl font-semibold text-white">Создать группу уроков</h2>
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
          {/* Название группы */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название группы *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Введите название группы уроков"
              className={errors.title ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Выбор цвета */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Цвет группы *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange('color_code', color)}
                  disabled={isSubmitting}
                  className={`
                    w-12 h-12 rounded-lg border-2 transition-all
                    ${formData.color_code === color 
                      ? 'border-white scale-110' 
                      : 'border-gray-600 hover:border-gray-400'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {errors.color_code && (
              <p className="text-red-400 text-sm mt-1">{errors.color_code}</p>
            )}
          </div>

          {/* Кастомный цвет */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Или выберите свой цвет
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.color_code}
                onChange={(e) => handleInputChange('color_code', e.target.value)}
                disabled={isSubmitting}
                className="w-12 h-12 rounded-lg border border-gray-600 bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Input
                type="text"
                value={formData.color_code}
                onChange={(e) => handleInputChange('color_code', e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
                disabled={isSubmitting}
              />
            </div>
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
              {isSubmitting ? 'Создание...' : 'Создать группу'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

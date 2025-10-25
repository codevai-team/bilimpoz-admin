'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface EditLessonGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: any) => void;
  group: {
    id: string;
    title: string;
    color_code: string;
  };
}

const colorOptions = [
  { value: '#3B82F6', label: 'Синий' },
  { value: '#10B981', label: 'Зеленый' },
  { value: '#F59E0B', label: 'Желтый' },
  { value: '#EF4444', label: 'Красный' },
  { value: '#8B5CF6', label: 'Фиолетовый' },
  { value: '#F97316', label: 'Оранжевый' },
  { value: '#06B6D4', label: 'Голубой' },
  { value: '#84CC16', label: 'Лайм' },
  { value: '#EC4899', label: 'Розовый' },
  { value: '#6B7280', label: 'Серый' }
];

export default function EditLessonGroupModal({ isOpen, onClose, onSubmit, group }: EditLessonGroupModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    color_code: '#3B82F6'
  });

  useEffect(() => {
    if (group) {
      setFormData({
        title: group.title,
        color_code: group.color_code
      });
    }
  }, [group]);

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
          <h2 className="text-xl font-semibold text-white">Редактировать группу уроков</h2>
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
              Название группы *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Введите название группы"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Цвет группы *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color_code', color.value)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.color_code === color.value
                      ? 'border-white scale-110'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
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

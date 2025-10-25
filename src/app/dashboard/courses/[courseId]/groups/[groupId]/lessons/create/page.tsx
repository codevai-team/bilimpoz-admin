'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/client-auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import FileUpload from '@/components/ui/FileUpload';
import VideoPlayer from '@/components/ui/VideoPlayer';
import Breadcrumbs, { BreadcrumbItem } from '@/components/dashboard/Breadcrumbs';

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

interface Course {
  id: string;
  name: string;
}

interface LessonGroup {
  id: string;
  title: string;
}

export default function CreateLessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const groupId = params.groupId as string;

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

  const [errors, setErrors] = useState<LessonFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [_course, setCourse] = useState<Course | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [_group, setGroup] = useState<LessonGroup | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    fetchCourseAndGroup();
  }, [courseId, groupId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCourseAndGroup = async () => {
    try {
      setIsLoading(true);
      
      // Получаем информацию о курсе
      const courseResponse = await apiRequest(`/api/courses/${courseId}`);
      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        setCourse(courseData);
        
        // Находим группу в курсе
        const foundGroup = courseData.lesson_groups?.find((g: LessonGroup) => g.id === groupId);
        if (foundGroup) {
          setGroup(foundGroup);
          
          // Устанавливаем breadcrumbs
          setBreadcrumbs([
            { id: 'courses', title: 'Курсы', type: 'courses' },
            { id: courseData.id, title: courseData.name, type: 'course' },
            { id: foundGroup.id, title: foundGroup.title, type: 'group' },
            { id: 'create', title: 'Создать урок', type: 'create' }
          ]);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await apiRequest(`/api/courses/${courseId}/groups/${groupId}/lessons`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Перенаправляем обратно к списку уроков
        router.push(`/dashboard/courses?courseId=${courseId}&groupId=${groupId}&view=lessons`);
      } else {
        const errorData = await response.json();
        console.error('Ошибка создания урока:', errorData);
      }
    } catch (error) {
      console.error('Ошибка создания урока:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/courses?courseId=${courseId}&groupId=${groupId}&view=lessons`);
  };

  const handleBreadcrumbNavigation = (item: BreadcrumbItem) => {
    switch (item.type) {
      case 'courses':
        router.push('/dashboard/courses');
        break;
      case 'course':
        router.push(`/dashboard/courses?courseId=${item.id}&view=groups`);
        break;
      case 'group':
        router.push(`/dashboard/courses?courseId=${courseId}&groupId=${item.id}&view=lessons`);
        break;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={breadcrumbs} 
          onNavigate={handleBreadcrumbNavigation}
        />

        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Создать урок</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <Icons.X className="h-4 w-4 mr-2" />
            Отмена
          </Button>
        </div>

        {/* Форма */}
        <div className="bg-[#151515] rounded-2xl border border-gray-800">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Основная информация */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-4">
                Основная информация
              </h2>
              
              {/* Название урока */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
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
                  <p className="text-red-400 text-sm mt-2">{errors.title}</p>
                )}
              </div>

              {/* Видео урока */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Видео урока *
                </label>
                
                {/* Превью видео */}
                {formData.video_url && (
                  <div className="mb-4">
                    <VideoPlayer
                      src={formData.video_url}
                      className="w-full max-w-2xl"
                      height="300px"
                      controls={true}
                    />
                  </div>
                )}
                
                <FileUpload
                  onFileSelect={(url) => handleInputChange('video_url', url)}
                  fileType="lesson-video"
                  accept="video/*"
                  maxSize={100 * 1024 * 1024} // 100MB
                  currentUrl={formData.video_url}
                  disabled={isSubmitting}
                  className={errors.video_url ? 'border-red-500' : ''}
                />
                {errors.video_url && (
                  <p className="text-red-400 text-sm mt-2">{errors.video_url}</p>
                )}
              </div>

              {/* Материалы лекции */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Материалы лекции *
                </label>
                <FileUpload
                  onFileSelect={(url) => handleInputChange('lecture_url', url)}
                  fileType="lesson-document"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip,.rar,image/*"
                  maxSize={50 * 1024 * 1024} // 50MB для документов
                  currentUrl={formData.lecture_url}
                  disabled={isSubmitting}
                  className={errors.lecture_url ? 'border-red-500' : ''}
                />
                {errors.lecture_url && (
                  <p className="text-red-400 text-sm mt-2">{errors.lecture_url}</p>
                )}
              </div>

              {/* Тип урока и доступ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-4">
                Настройки тестирования
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Общее количество вопросов */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
                    <p className="text-red-400 text-sm mt-2">{errors.total_questions}</p>
                  )}
                </div>

                {/* Случайные вопросы */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
                    <p className="text-red-400 text-sm mt-2">{errors.random_questions}</p>
                  )}
                </div>

                {/* Количество ошибок */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
                    <p className="text-red-400 text-sm mt-2">{errors.mistake_chance}</p>
                  )}
                </div>

                {/* Баллы за урок */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
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
                    <p className="text-red-400 text-sm mt-2">{errors.lesson_points}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-6 border-t border-gray-800">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 md:flex-none"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="flex-1 md:flex-none"
              >
                {isSubmitting ? 'Создание...' : 'Создать урок'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

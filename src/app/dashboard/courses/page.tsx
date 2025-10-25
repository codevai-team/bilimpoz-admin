'use client';

import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/client-auth';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';
import Button from '@/components/ui/Button';
import CreateCourseModal from '@/components/dashboard/CreateCourseModal';
import CreateLessonGroupModal from '@/components/dashboard/CreateLessonGroupModal';
import CreateLessonModal from '@/components/dashboard/CreateLessonModal';
import EditCourseModal from '@/components/dashboard/EditCourseModal';
import EditLessonGroupModal from '@/components/dashboard/EditLessonGroupModal';
import EditLessonModal from '@/components/dashboard/EditLessonModal';
import ViewInfoModal from '@/components/dashboard/ViewInfoModal';
import Breadcrumbs, { BreadcrumbItem } from '@/components/dashboard/Breadcrumbs';
import CourseCard from '@/components/dashboard/CourseCard';
import SortableGroupCard from '@/components/dashboard/SortableGroupCard';
import SortableLessonCard from '@/components/dashboard/SortableLessonCard';

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

type ViewType = 'courses' | 'groups' | 'lessons';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Настройка сенсоров для drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Модальные окна редактирования
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [isViewInfoModalOpen, setIsViewInfoModalOpen] = useState(false);
  
  // Редактируемые элементы
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingGroup, setEditingGroup] = useState<LessonGroup | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [viewInfoData, setViewInfoData] = useState<{
    type: 'course' | 'group' | 'lesson';
    data: any;
    course?: Course;
    group?: LessonGroup;
  } | null>(null);
  
  // Навигационное состояние
  const [currentView, setCurrentView] = useState<ViewType>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<LessonGroup | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки курсов:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Навигационные функции
  const navigateToCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedGroup(null);
    setCurrentView('groups');
    setBreadcrumbs([{ id: course.id, title: course.name, type: 'course' }]);
  };

  const navigateToGroup = (group: LessonGroup) => {
    setSelectedGroup(group);
    setCurrentView('lessons');
    setBreadcrumbs(prev => [...prev, { id: group.id, title: group.title, type: 'group' }]);
  };

  const handleBreadcrumbNavigation = (item: BreadcrumbItem, index: number) => {
    if (index === -1) {
      // Возврат к курсам
      setCurrentView('courses');
      setSelectedCourse(null);
      setSelectedGroup(null);
      setBreadcrumbs([]);
    } else if (item.type === 'course') {
      // Переход к группам курса
      const course = courses.find(c => c.id === item.id);
      if (course) {
        setSelectedCourse(course);
        setSelectedGroup(null);
        setCurrentView('groups');
        setBreadcrumbs([{ id: course.id, title: course.name, type: 'course' }]);
      }
    } else if (item.type === 'group') {
      // Переход к урокам группы
      const group = selectedCourse?.lesson_groups.find(g => g.id === item.id);
      if (group) {
        setSelectedGroup(group);
        setCurrentView('lessons');
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      }
    }
  };

  const handleCreateCourse = async (courseData: any) => {
    try {
      const response = await apiRequest('/api/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        // Обновляем список курсов, чтобы получить полные данные включая lesson_groups
        await fetchCourses();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Ошибка создания курса:', error);
    }
  };

  const handleCreateGroup = async (groupData: any) => {
    if (!selectedCourse) return;
    
    try {
      const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups`, {
        method: 'POST',
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        await fetchCourses();
        // Обновляем выбранный курс
        const updatedCourse = courses.find(c => c.id === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
        }
        setIsCreateGroupModalOpen(false);
      }
    } catch (error) {
      console.error('Ошибка создания группы уроков:', error);
    }
  };

  const handleCreateLesson = async (lessonData: any) => {
    if (!selectedCourse || !selectedGroup) return;
    
    try {
      const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/${selectedGroup.id}/lessons`, {
        method: 'POST',
        body: JSON.stringify(lessonData),
      });

      if (response.ok) {
        await fetchCourses();
        // Обновляем выбранные курс и группу
        const updatedCourse = courses.find(c => c.id === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
          const updatedGroup = updatedCourse.lesson_groups.find(g => g.id === selectedGroup.id);
          if (updatedGroup) {
            setSelectedGroup(updatedGroup);
          }
        }
        setIsCreateLessonModalOpen(false);
      }
    } catch (error) {
      console.error('Ошибка создания урока:', error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await apiRequest(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCourses(prev => prev.filter(c => c.id !== courseId));
        // Если удаляем текущий курс, возвращаемся к списку курсов
        if (selectedCourse?.id === courseId) {
          setCurrentView('courses');
          setSelectedCourse(null);
          setSelectedGroup(null);
          setBreadcrumbs([]);
        }
      }
    } catch (error) {
      console.error('Ошибка удаления курса:', error);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!selectedCourse) return;
    
    try {
      const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/${groupId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchCourses();
        // Обновляем выбранный курс
        const updatedCourse = courses.find(c => c.id === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
        }
        // Если удаляем текущую группу, возвращаемся к группам
        if (selectedGroup?.id === groupId) {
          setCurrentView('groups');
          setSelectedGroup(null);
          setBreadcrumbs(prev => prev.slice(0, -1));
        }
      }
    } catch (error) {
      console.error('Ошибка удаления группы:', error);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourse || !selectedGroup) return;
    
    try {
      const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/${selectedGroup.id}/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchCourses();
        // Обновляем выбранные курс и группу
        const updatedCourse = courses.find(c => c.id === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
          const updatedGroup = updatedCourse.lesson_groups.find(g => g.id === selectedGroup.id);
          if (updatedGroup) {
            setSelectedGroup(updatedGroup);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка удаления урока:', error);
    }
  };

  // Обработчики редактирования
  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsEditCourseModalOpen(true);
  };

  const handleEditGroup = (group: LessonGroup) => {
    setEditingGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsEditLessonModalOpen(true);
  };

  // Обработчики просмотра информации
  const handleViewCourseInfo = (course: Course) => {
    setViewInfoData({
      type: 'course',
      data: course,
      course
    });
    setIsViewInfoModalOpen(true);
  };

  const handleViewGroupInfo = (group: LessonGroup) => {
    setViewInfoData({
      type: 'group',
      data: group,
      course: selectedCourse || undefined,
      group
    });
    setIsViewInfoModalOpen(true);
  };

  const handleViewLessonInfo = (lesson: Lesson) => {
    setViewInfoData({
      type: 'lesson',
      data: lesson,
      course: selectedCourse || undefined,
      group: selectedGroup || undefined
    });
    setIsViewInfoModalOpen(true);
  };

  // Обработчики сохранения изменений
  const handleSaveEditCourse = async (courseData: any) => {
    if (!editingCourse) return;
    
    try {
      const response = await apiRequest(`/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        await fetchCourses();
        setIsEditCourseModalOpen(false);
        setEditingCourse(null);
      }
    } catch (error) {
      console.error('Ошибка редактирования курса:', error);
    }
  };

  const handleSaveEditGroup = async (groupData: any) => {
    if (!editingGroup || !selectedCourse) return;
    
    try {
      const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/${editingGroup.id}`, {
        method: 'PUT',
        body: JSON.stringify(groupData),
      });

      if (response.ok) {
        await fetchCourses();
        setIsEditGroupModalOpen(false);
        setEditingGroup(null);
      }
    } catch (error) {
      console.error('Ошибка редактирования группы:', error);
    }
  };

  const handleSaveEditLesson = async (lessonData: any) => {
    if (!editingLesson || !selectedCourse || !selectedGroup) return;
    
    try {
      const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/${selectedGroup.id}/lessons/${editingLesson.id}`, {
        method: 'PUT',
        body: JSON.stringify(lessonData),
      });

      if (response.ok) {
        await fetchCourses();
        setIsEditLessonModalOpen(false);
        setEditingLesson(null);
      }
    } catch (error) {
      console.error('Ошибка редактирования урока:', error);
    }
  };

  // Обработчик drag and drop для групп
  const handleGroupDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && selectedCourse) {
      const oldIndex = selectedCourse.lesson_groups.findIndex((group) => group.id === active.id);
      const newIndex = selectedCourse.lesson_groups.findIndex((group) => group.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newGroups = arrayMove(selectedCourse.lesson_groups, oldIndex, newIndex);
        
        // Оптимистичное обновление - сразу обновляем UI
        const updatedCourse = {
          ...selectedCourse,
          lesson_groups: newGroups.map((group, index) => ({
            ...group,
            position: index + 1
          }))
        };
        
        setSelectedCourse(updatedCourse);
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse.id ? updatedCourse : course
          )
        );

        // Обновляем позиции на сервере в фоне
        const groupOrders = newGroups.map((group, index) => ({
          id: group.id,
          position: index + 1
        }));

        try {
          const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/reorder`, {
            method: 'POST',
            body: JSON.stringify({ groupOrders }),
          });

          if (!response.ok) {
            // Если ошибка, откатываем изменения
            console.error('Ошибка изменения порядка групп');
            await fetchCourses();
            const originalCourse = courses.find(c => c.id === selectedCourse.id);
            if (originalCourse) {
              setSelectedCourse(originalCourse);
            }
          }
        } catch (error) {
          console.error('Ошибка изменения порядка групп:', error);
          // Откатываем изменения при ошибке
          await fetchCourses();
          const originalCourse = courses.find(c => c.id === selectedCourse.id);
          if (originalCourse) {
            setSelectedCourse(originalCourse);
          }
        }
      }
    }
  };

  // Обработчик drag and drop для уроков
  const handleLessonDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && selectedGroup && selectedCourse) {
      const oldIndex = selectedGroup.lessons.findIndex((lesson) => lesson.id === active.id);
      const newIndex = selectedGroup.lessons.findIndex((lesson) => lesson.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newLessons = arrayMove(selectedGroup.lessons, oldIndex, newIndex);
        
        // Оптимистичное обновление - сразу обновляем UI
        const updatedGroup = {
          ...selectedGroup,
          lessons: newLessons.map((lesson, index) => ({
            ...lesson,
            position: index + 1
          }))
        };
        
        const updatedCourse = {
          ...selectedCourse,
          lesson_groups: selectedCourse.lesson_groups.map(group =>
            group.id === selectedGroup.id ? updatedGroup : group
          )
        };
        
        setSelectedGroup(updatedGroup);
        setSelectedCourse(updatedCourse);
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.id === selectedCourse.id ? updatedCourse : course
          )
        );

        // Обновляем позиции на сервере в фоне
        const lessonOrders = newLessons.map((lesson, index) => ({
          id: lesson.id,
          position: index + 1
        }));

        try {
          const response = await apiRequest(`/api/courses/${selectedCourse.id}/groups/${selectedGroup.id}/lessons/reorder`, {
            method: 'POST',
            body: JSON.stringify({ lessonOrders }),
          });

          if (!response.ok) {
            // Если ошибка, откатываем изменения
            console.error('Ошибка изменения порядка уроков');
            await fetchCourses();
            const originalCourse = courses.find(c => c.id === selectedCourse.id);
            if (originalCourse) {
              setSelectedCourse(originalCourse);
              const originalGroup = originalCourse.lesson_groups.find(g => g.id === selectedGroup.id);
              if (originalGroup) {
                setSelectedGroup(originalGroup);
              }
            }
          }
        } catch (error) {
          console.error('Ошибка изменения порядка уроков:', error);
          // Откатываем изменения при ошибке
          await fetchCourses();
          const originalCourse = courses.find(c => c.id === selectedCourse.id);
          if (originalCourse) {
            setSelectedCourse(originalCourse);
            const originalGroup = originalCourse.lesson_groups.find(g => g.id === selectedGroup.id);
            if (originalGroup) {
              setSelectedGroup(originalGroup);
            }
          }
        }
      }
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'courses':
        return 'Курсы';
      case 'groups':
        return `Группы уроков - ${selectedCourse?.name}`;
      case 'lessons':
        return `Уроки - ${selectedGroup?.title}`;
      default:
        return 'Курсы';
    }
  };


  const getCreateButtonText = () => {
    switch (currentView) {
      case 'courses':
        return 'Создать курс';
      case 'groups':
        return 'Создать группу';
      case 'lessons':
        return 'Создать урок';
      default:
        return 'Создать курс';
    }
  };

  const getCreateButtonIcon = () => {
    switch (currentView) {
      case 'courses':
        return <Icons.BookOpen className="h-4 w-4" />;
      case 'groups':
        return <Icons.FolderOpen className="h-4 w-4" />;
      case 'lessons':
        return <Icons.Play className="h-4 w-4" />;
      default:
        return <Icons.BookOpen className="h-4 w-4" />;
    }
  };

  const handleCreateButtonClick = () => {
    switch (currentView) {
      case 'courses':
        setIsCreateModalOpen(true);
        break;
      case 'groups':
        setIsCreateGroupModalOpen(true);
        break;
      case 'lessons':
        setIsCreateLessonModalOpen(true);
        break;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="bg-[#151515] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
            </div>
            <Button 
              onClick={handleCreateButtonClick}
              className="flex items-center gap-2"
            >
              {getCreateButtonIcon()}
              {getCreateButtonText()}
            </Button>
          </div>
        </div>

        {/* Хлебные крошки */}
        <Breadcrumbs 
          items={breadcrumbs} 
          onNavigate={handleBreadcrumbNavigation} 
        />

        {/* Основной контент */}
        <div className="bg-[#151515] rounded-2xl p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* Список курсов */}
              {currentView === 'courses' && (
                <>
                  {courses.length === 0 ? (
                    <div className="text-center py-12">
                      <Icons.BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">Курсы не найдены</h3>
                      <p className="text-gray-500 mb-4">Создайте свой первый курс, чтобы начать</p>
                      <Button onClick={() => setIsCreateModalOpen(true)}>
                        Создать курс
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <CourseCard 
                          key={course.id} 
                          course={course} 
                          onSelect={navigateToCourse}
                          onDelete={handleDeleteCourse}
                          onEdit={handleEditCourse}
                          onViewInfo={handleViewCourseInfo}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Список групп */}
              {currentView === 'groups' && selectedCourse && (
                <>
                  {selectedCourse.lesson_groups.length === 0 ? (
                    <div className="text-center py-12">
                      <Icons.FolderOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">Группы уроков не найдены</h3>
                      <p className="text-gray-500 mb-4">Создайте первую группу уроков для этого курса</p>
                      <Button onClick={() => setIsCreateGroupModalOpen(true)}>
                        Создать группу
                      </Button>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleGroupDragEnd}
                    >
                      <SortableContext
                        items={selectedCourse.lesson_groups.map(g => g.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {selectedCourse.lesson_groups
                            .sort((a, b) => a.position - b.position)
                            .map((group) => (
                              <SortableGroupCard
                                key={group.id}
                                group={group}
                                onSelect={navigateToGroup}
                                onDelete={handleDeleteGroup}
                                onEdit={handleEditGroup}
                                onViewInfo={handleViewGroupInfo}
                              />
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </>
              )}

              {/* Список уроков */}
              {currentView === 'lessons' && selectedGroup && (
                <>
                  {selectedGroup.lessons.length === 0 ? (
                    <div className="text-center py-12">
                      <Icons.Play className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">Уроки не найдены</h3>
                      <p className="text-gray-500 mb-4">Создайте первый урок для этой группы</p>
                      <Button onClick={() => setIsCreateLessonModalOpen(true)}>
                        Создать урок
                      </Button>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleLessonDragEnd}
                    >
                      <SortableContext
                        items={selectedGroup.lessons.map(l => l.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {selectedGroup.lessons
                            .sort((a, b) => a.position - b.position)
                            .map((lesson) => (
                              <SortableLessonCard
                                key={lesson.id}
                                lesson={lesson}
                                groupColor={selectedGroup.color_code}
                                onSelect={(lesson) => {
                                  // Здесь можно добавить логику для открытия урока
                                  console.log('Открыть урок:', lesson);
                                }}
                                onDelete={handleDeleteLesson}
                                onEdit={handleEditLesson}
                                onViewInfo={handleViewLessonInfo}
                              />
                            ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Модальные окна */}
        <CreateCourseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCourse}
        />

        {selectedCourse && (
          <CreateLessonGroupModal
            isOpen={isCreateGroupModalOpen}
            onClose={() => setIsCreateGroupModalOpen(false)}
            onSubmit={handleCreateGroup}
            courseId={selectedCourse.id}
          />
        )}

        {selectedCourse && selectedGroup && (
          <CreateLessonModal
            isOpen={isCreateLessonModalOpen}
            onClose={() => setIsCreateLessonModalOpen(false)}
            onSubmit={handleCreateLesson}
            courseId={selectedCourse.id}
            groupId={selectedGroup.id}
          />
        )}

        {/* Модальные окна редактирования */}
        {editingCourse && (
          <EditCourseModal
            key={editingCourse.id}
            isOpen={isEditCourseModalOpen}
            onClose={() => {
              setIsEditCourseModalOpen(false);
              setEditingCourse(null);
            }}
            onSubmit={handleSaveEditCourse}
            course={editingCourse}
          />
        )}

        {editingGroup && (
          <EditLessonGroupModal
            isOpen={isEditGroupModalOpen}
            onClose={() => {
              setIsEditGroupModalOpen(false);
              setEditingGroup(null);
            }}
            onSubmit={handleSaveEditGroup}
            group={editingGroup}
          />
        )}

        {editingLesson && (
          <EditLessonModal
            isOpen={isEditLessonModalOpen}
            onClose={() => {
              setIsEditLessonModalOpen(false);
              setEditingLesson(null);
            }}
            onSubmit={handleSaveEditLesson}
            lesson={editingLesson}
          />
        )}

        {/* Модальное окно просмотра информации */}
        <ViewInfoModal
          isOpen={isViewInfoModalOpen}
          onClose={() => {
            setIsViewInfoModalOpen(false);
            setViewInfoData(null);
          }}
          type={viewInfoData?.type || 'course'}
          data={viewInfoData?.data}
          course={viewInfoData?.course}
          group={viewInfoData?.group}
        />
      </div>
    </DashboardLayout>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    courseId: string;
    groupId: string;
    lessonId: string;
  }>;
}

// GET /api/courses/[courseId]/groups/[groupId]/lessons/[lessonId] - Получить урок
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { groupId, lessonId } = await params;
    const lesson = await prisma.lessons.findUnique({
      where: { 
        id: lessonId,
        lesson_group_id: groupId 
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Урок не найден' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Ошибка получения урока:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId]/groups/[groupId]/lessons/[lessonId] - Обновить урок
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { groupId, lessonId } = await params;
    const body = await request.json();
    const { 
      title, 
      video_url, 
      lecture_url, 
      type, 
      access_type,
      position,
      total_questions,
      random_questions,
      mistake_chance,
      lesson_points
    } = body;

    // Проверяем существование урока
    const existingLesson = await prisma.lessons.findUnique({
      where: { 
        id: lessonId,
        lesson_group_id: groupId 
      }
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Урок не найден' }, { status: 404 });
    }

    // Валидация данных
    if (title && !title.trim()) {
      return NextResponse.json(
        { error: 'Название урока не может быть пустым' },
        { status: 400 }
      );
    }

    if (video_url && !video_url.trim()) {
      return NextResponse.json(
        { error: 'URL видео не может быть пустым' },
        { status: 400 }
      );
    }

    if (lecture_url && !lecture_url.trim()) {
      return NextResponse.json(
        { error: 'URL лекции не может быть пустым' },
        { status: 400 }
      );
    }

    if (type && !['standard', 'practice'].includes(type)) {
      return NextResponse.json(
        { error: 'Неверный тип урока' },
        { status: 400 }
      );
    }

    if (access_type && !['free', 'paid'].includes(access_type)) {
      return NextResponse.json(
        { error: 'Неверный тип доступа' },
        { status: 400 }
      );
    }

    // Если изменяется позиция, обновляем позиции других уроков
    if (position !== undefined && position !== existingLesson.position) {
      await updateLessonPositions(groupId, existingLesson.position, position);
    }

    // Обновление урока
    const updatedLesson = await prisma.lessons.update({
      where: { id: lessonId },
      data: {
        ...(title && { title: title.trim() }),
        ...(video_url && { video_url: video_url.trim() }),
        ...(lecture_url && { lecture_url: lecture_url.trim() }),
        ...(type && { type }),
        ...(access_type && { access_type }),
        ...(position !== undefined && { position }),
        ...(total_questions !== undefined && { total_questions }),
        ...(random_questions !== undefined && { random_questions }),
        ...(mistake_chance !== undefined && { mistake_chance }),
        ...(lesson_points !== undefined && { lesson_points })
      }
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Ошибка обновления урока:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/groups/[groupId]/lessons/[lessonId] - Удалить урок
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { groupId, lessonId } = await params;
    // Проверяем существование урока
    const existingLesson = await prisma.lessons.findUnique({
      where: { 
        id: lessonId,
        lesson_group_id: groupId 
      }
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Урок не найден' }, { status: 404 });
    }

    // Удаление урока
    await prisma.lessons.delete({
      where: { id: lessonId }
    });

    // Обновляем позиции оставшихся уроков
    await prisma.lessons.updateMany({
      where: {
        lesson_group_id: groupId,
        position: { gt: existingLesson.position }
      },
      data: {
        position: { decrement: 1 }
      }
    });

    return NextResponse.json({ message: 'Урок успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления урока:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для обновления позиций уроков
async function updateLessonPositions(groupId: string, oldPosition: number, newPosition: number) {
  if (oldPosition < newPosition) {
    // Перемещение вниз - сдвигаем уроки между старой и новой позицией вверх
    await prisma.lessons.updateMany({
      where: {
        lesson_group_id: groupId,
        position: {
          gt: oldPosition,
          lte: newPosition
        }
      },
      data: {
        position: { decrement: 1 }
      }
    });
  } else if (oldPosition > newPosition) {
    // Перемещение вверх - сдвигаем уроки между новой и старой позицией вниз
    await prisma.lessons.updateMany({
      where: {
        lesson_group_id: groupId,
        position: {
          gte: newPosition,
          lt: oldPosition
        }
      },
      data: {
        position: { increment: 1 }
      }
    });
  }
}

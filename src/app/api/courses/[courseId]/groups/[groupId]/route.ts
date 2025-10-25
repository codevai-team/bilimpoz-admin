import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    courseId: string;
    groupId: string;
  }>;
}

// GET /api/courses/[courseId]/groups/[groupId] - Получить группу уроков
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId, groupId } = await params;
    const group = await prisma.lesson_groups.findUnique({
      where: { 
        id: groupId,
        course_id: courseId 
      },
      include: {
        lessons: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Группа уроков не найдена' }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error('Ошибка получения группы уроков:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId]/groups/[groupId] - Обновить группу уроков
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId, groupId } = await params;
    const body = await request.json();
    const { title, color_code, position } = body;

    // Проверяем существование группы
    const existingGroup = await prisma.lesson_groups.findUnique({
      where: { 
        id: groupId,
        course_id: courseId 
      }
    });

    if (!existingGroup) {
      return NextResponse.json({ error: 'Группа уроков не найдена' }, { status: 404 });
    }

    // Валидация данных
    if (title && !title.trim()) {
      return NextResponse.json(
        { error: 'Название группы не может быть пустым' },
        { status: 400 }
      );
    }

    if (color_code && !color_code.match(/^#[0-9A-F]{6}$/i)) {
      return NextResponse.json(
        { error: 'Неверный формат цвета' },
        { status: 400 }
      );
    }

    // Если изменяется позиция, обновляем позиции других групп
    if (position !== undefined && position !== existingGroup.position) {
      await updateGroupPositions(courseId, existingGroup.position, position);
    }

    // Обновление группы уроков
    const updatedGroup = await prisma.lesson_groups.update({
      where: { id: groupId },
      data: {
        ...(title && { title: title.trim() }),
        ...(color_code && { color_code }),
        ...(position !== undefined && { position })
      },
      include: {
        lessons: {
          orderBy: { position: 'asc' }
        }
      }
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Ошибка обновления группы уроков:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/groups/[groupId] - Удалить группу уроков
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId, groupId } = await params;
    // Проверяем существование группы
    const existingGroup = await prisma.lesson_groups.findUnique({
      where: { 
        id: groupId,
        course_id: courseId 
      }
    });

    if (!existingGroup) {
      return NextResponse.json({ error: 'Группа уроков не найдена' }, { status: 404 });
    }

    // Удаление группы (каскадное удаление уроков настроено в схеме)
    await prisma.lesson_groups.delete({
      where: { id: groupId }
    });

    // Обновляем позиции оставшихся групп
    await prisma.lesson_groups.updateMany({
      where: {
        course_id: courseId,
        position: { gt: existingGroup.position }
      },
      data: {
        position: { decrement: 1 }
      }
    });

    return NextResponse.json({ message: 'Группа уроков успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления группы уроков:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// Вспомогательная функция для обновления позиций групп
async function updateGroupPositions(courseId: string, oldPosition: number, newPosition: number) {
  if (oldPosition < newPosition) {
    // Перемещение вниз - сдвигаем группы между старой и новой позицией вверх
    await prisma.lesson_groups.updateMany({
      where: {
        course_id: courseId,
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
    // Перемещение вверх - сдвигаем группы между новой и старой позицией вниз
    await prisma.lesson_groups.updateMany({
      where: {
        course_id: courseId,
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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

// GET /api/courses/[courseId] - Получить курс по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId } = await params;
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      include: {
        lesson_groups: {
          include: {
            lessons: {
              orderBy: { position: 'asc' }
            }
          },
          orderBy: { position: 'asc' }
        },
        creator: {
          select: {
            id: true,
            name: true,
            login: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Ошибка получения курса:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId] - Обновить курс
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId } = await params;
    const body = await request.json();
    const { name, description, language, course_photo_url } = body;

    // Проверяем существование курса
    const existingCourse = await prisma.courses.findUnique({
      where: { id: courseId }
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    // Валидация данных
    if (name && !name.trim()) {
      return NextResponse.json(
        { error: 'Название курса не может быть пустым' },
        { status: 400 }
      );
    }

    if (description && !description.trim()) {
      return NextResponse.json(
        { error: 'Описание курса не может быть пустым' },
        { status: 400 }
      );
    }

    if (language && !['kg', 'ru'].includes(language)) {
      return NextResponse.json(
        { error: 'Неверный язык курса' },
        { status: 400 }
      );
    }

    // Обновление курса
    const updatedCourse = await prisma.courses.update({
      where: { id: courseId },
      data: {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(language && { language }),
        ...(course_photo_url !== undefined && { 
          course_photo_url: course_photo_url?.trim() || null 
        })
      },
      include: {
        lesson_groups: {
          include: {
            lessons: {
              orderBy: { position: 'asc' }
            }
          },
          orderBy: { position: 'asc' }
        },
        creator: {
          select: {
            id: true,
            name: true,
            login: true
          }
        }
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Ошибка обновления курса:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId] - Удалить курс
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId } = await params;
    // Проверяем существование курса
    const existingCourse = await prisma.courses.findUnique({
      where: { id: courseId }
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    // Удаление курса (каскадное удаление групп и уроков настроено в схеме)
    await prisma.courses.delete({
      where: { id: courseId }
    });

    return NextResponse.json({ message: 'Курс успешно удален' });
  } catch (error) {
    console.error('Ошибка удаления курса:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

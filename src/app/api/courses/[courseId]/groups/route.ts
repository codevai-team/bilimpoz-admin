import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

// GET /api/courses/[courseId]/groups - Получить группы уроков курса
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId } = await params;
    const groups = await prisma.lesson_groups.findMany({
      where: { course_id: courseId },
      include: {
        lessons: {
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Ошибка получения групп уроков:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/groups - Создать новую группу уроков
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId } = await params;
    const body = await request.json();
    const { title, color_code } = body;

    // Валидация данных
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Название группы обязательно' },
        { status: 400 }
      );
    }

    if (!color_code || !color_code.match(/^#[0-9A-F]{6}$/i)) {
      return NextResponse.json(
        { error: 'Неверный формат цвета' },
        { status: 400 }
      );
    }

    // Проверяем существование курса
    const course = await prisma.courses.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }

    // Получаем максимальную позицию для новой группы
    const maxPosition = await prisma.lesson_groups.findFirst({
      where: { course_id: courseId },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    const newPosition = (maxPosition?.position || 0) + 1;

    // Создание группы уроков
    const group = await prisma.lesson_groups.create({
      data: {
        title: title.trim(),
        color_code,
        position: newPosition,
        course_id: courseId
      },
      include: {
        lessons: {
          orderBy: { position: 'asc' }
        }
      }
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания группы уроков:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

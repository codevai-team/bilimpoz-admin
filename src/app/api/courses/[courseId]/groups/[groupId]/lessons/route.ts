import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    courseId: string;
    groupId: string;
  }>;
}

// GET /api/courses/[courseId]/groups/[groupId]/lessons - Получить уроки группы
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { groupId } = await params;
    const lessons = await prisma.lessons.findMany({
      where: { lesson_group_id: groupId },
      orderBy: { position: 'asc' }
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Ошибка получения уроков:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/groups/[groupId]/lessons - Создать новый урок
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const { courseId, groupId } = await params;
    const body = await request.json();
    const { 
      title, 
      video_url, 
      lecture_url, 
      type, 
      access_type,
      total_questions,
      random_questions,
      mistake_chance,
      lesson_points
    } = body;

    // Валидация данных
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Название урока обязательно' },
        { status: 400 }
      );
    }

    if (!video_url || !video_url.trim()) {
      return NextResponse.json(
        { error: 'URL видео обязателен' },
        { status: 400 }
      );
    }

    if (!lecture_url || !lecture_url.trim()) {
      return NextResponse.json(
        { error: 'URL лекции обязателен' },
        { status: 400 }
      );
    }

    if (!['standard', 'practice'].includes(type)) {
      return NextResponse.json(
        { error: 'Неверный тип урока' },
        { status: 400 }
      );
    }

    if (!['free', 'paid'].includes(access_type)) {
      return NextResponse.json(
        { error: 'Неверный тип доступа' },
        { status: 400 }
      );
    }

    // Проверяем существование группы
    const group = await prisma.lesson_groups.findUnique({
      where: { 
        id: groupId,
        course_id: courseId 
      }
    });

    if (!group) {
      return NextResponse.json({ error: 'Группа уроков не найдена' }, { status: 404 });
    }

    // Получаем максимальную позицию для нового урока
    const maxPosition = await prisma.lessons.findFirst({
      where: { lesson_group_id: groupId },
      orderBy: { position: 'desc' },
      select: { position: true }
    });

    const newPosition = (maxPosition?.position || 0) + 1;

    // Создание урока
    const lesson = await prisma.lessons.create({
      data: {
        title: title.trim(),
        video_url: video_url.trim(),
        lecture_url: lecture_url.trim(),
        type,
        access_type,
        position: newPosition,
        lesson_group_id: groupId,
        total_questions: total_questions || 50,
        random_questions: random_questions || 10,
        mistake_chance: mistake_chance || 2,
        lesson_points: lesson_points || 10
      }
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания урока:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

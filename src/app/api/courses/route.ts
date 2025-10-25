import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/courses - Получить все курсы
export async function GET(request: NextRequest) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const courses = await prisma.courses.findMany({
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
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Ошибка получения курсов:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Создать новый курс
export async function POST(request: NextRequest) {
  try {
    const user = await auth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, language, course_photo_url } = body;

    // Валидация данных
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Название и описание курса обязательны' },
        { status: 400 }
      );
    }

    if (!['kg', 'ru'].includes(language)) {
      return NextResponse.json(
        { error: 'Неверный язык курса' },
        { status: 400 }
      );
    }

    // Создание курса
    const course = await prisma.courses.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        language,
        course_photo_url: course_photo_url?.trim() || null,
        created_by: user.id
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

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания курса:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}








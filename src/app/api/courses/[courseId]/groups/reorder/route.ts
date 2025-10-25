import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const { groupOrders } = await request.json();

    if (!Array.isArray(groupOrders)) {
      return NextResponse.json(
        { error: 'groupOrders должен быть массивом' },
        { status: 400 }
      );
    }

    // Обновляем позиции групп в транзакции
    await prisma.$transaction(
      groupOrders.map(({ id, position }) =>
        prisma.lesson_groups.update({
          where: { 
            id,
            course_id: courseId
          },
          data: { position }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка изменения порядка групп:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
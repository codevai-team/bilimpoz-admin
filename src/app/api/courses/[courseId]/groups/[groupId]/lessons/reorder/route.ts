import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const { lessonOrders } = await request.json();

    if (!Array.isArray(lessonOrders)) {
      return NextResponse.json(
        { error: 'lessonOrders должен быть массивом' },
        { status: 400 }
      );
    }

    // Обновляем позиции уроков в транзакции
    await prisma.$transaction(
      lessonOrders.map(({ id, position }) =>
        prisma.lessons.update({
          where: { 
            id,
            lesson_group_id: groupId
          },
          data: { position }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка изменения порядка уроков:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
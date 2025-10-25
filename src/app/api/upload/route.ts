import { NextRequest, NextResponse } from 'next/server';
import { 
  uploadFileToS3, 
  validateFile, 
  generateFileName, 
  getS3Path,
  ALLOWED_FILE_TYPES 
} from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию (можно добавить проверку JWT токена)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string; // 'course-image', 'course-video', 'lesson-image', 'lesson-video', 'lesson-document'

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      );
    }

    if (!fileType) {
      return NextResponse.json(
        { error: 'Тип файла не указан' },
        { status: 400 }
      );
    }

    // Определяем тип контента
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isDocument = fileType === 'lesson-document' && !isImage && !isVideo;

    // Проверяем тип файла только для изображений и видео
    if (!isDocument && !ALLOWED_FILE_TYPES.includes(file.type)) {
      console.log('Неподдерживаемый тип файла:', file.type, 'Разрешенные типы:', ALLOWED_FILE_TYPES);
      return NextResponse.json(
        { error: `Неподдерживаемый тип файла: ${file.type}. Разрешены: ${ALLOWED_FILE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Валидируем размер файла
    if (!isDocument) {
      const validation = validateFile(
        { size: file.size, mimetype: file.type },
        isImage ? 'image' : 'video'
      );

      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    } else {
      // Для документов проверяем только размер (максимум 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Файл слишком большой. Максимальный размер: 50MB` },
          { status: 400 }
        );
      }
    }

    // Определяем путь в S3 на основе типа файла
    let s3PathType: 'course-images' | 'course-videos' | 'lesson-videos' | 'lesson-images' | 'lesson-documents';
    
    switch (fileType) {
      case 'course-image':
        s3PathType = 'course-images';
        break;
      case 'course-video':
        s3PathType = 'course-videos';
        break;
      case 'lesson-image':
        s3PathType = 'lesson-images';
        break;
      case 'lesson-video':
        s3PathType = 'lesson-videos';
        break;
      case 'lesson-document':
        s3PathType = 'lesson-documents';
        break;
      default:
        return NextResponse.json(
          { error: 'Неверный тип файла' },
          { status: 400 }
        );
    }

    const s3Path = getS3Path(s3PathType);
    const fileName = generateFileName(file.name, s3PathType);

    // Конвертируем файл в Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Загружаем файл в S3
    const fileUrl = await uploadFileToS3(
      buffer,
      fileName,
      file.type,
      s3Path
    );

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// Опционально: endpoint для удаления файлов
export async function DELETE(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json(
        { error: 'URL файла не указан' },
        { status: 400 }
      );
    }

    // Удаляем файл из S3 (импортируем функцию)
    const { deleteFileFromS3 } = await import('@/lib/s3');
    await deleteFileFromS3(fileUrl);

    return NextResponse.json({
      success: true,
      message: 'Файл успешно удален'
    });

  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    return NextResponse.json(
      { error: 'Не удалось удалить файл' },
      { status: 500 }
    );
  }
}

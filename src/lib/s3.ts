import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Конфигурация S3 клиента
const s3Client = new S3Client({
  endpoint: process.env.S3_URL,
  region: 'auto', // Для совместимости с различными S3-совместимыми сервисами
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Для совместимости с MinIO и другими S3-совместимыми сервисами
});

const BUCKET_NAME = process.env.BUCKET_NAME!;

// Типы файлов и их расширения
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

// Максимальные размеры файлов (в байтах)
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Функция для генерации уникального имени файла
export function generateFileName(originalName: string, prefix: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${prefix}/${timestamp}-${randomString}.${extension}`;
}

// Функция для получения пути в S3 для различных типов контента
export function getS3Path(type: 'course-images' | 'course-videos' | 'lesson-videos' | 'lesson-images' | 'lesson-documents'): string {
  const basePath = 'bilimpoz';
  
  switch (type) {
    case 'course-images':
      return `${basePath}/courses/images`;
    case 'course-videos':
      return `${basePath}/courses/videos`;
    case 'lesson-videos':
      return `${basePath}/lessons/videos`;
    case 'lesson-images':
      return `${basePath}/lessons/images`;
    case 'lesson-documents':
      return `${basePath}/lessons/documents`;
    default:
      return `${basePath}/misc`;
  }
}

// Функция для загрузки файла в S3
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  s3Path: string
): Promise<string> {
  const key = `${s3Path}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    // Делаем файл публично доступным для чтения
    ACL: 'public-read',
  });

  try {
    await s3Client.send(command);
    
    // Возвращаем публичный URL файла
    return `${process.env.S3_URL}/${BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error('Ошибка загрузки файла в S3:', error);
    throw new Error('Не удалось загрузить файл');
  }
}

// Функция для удаления файла из S3
export async function deleteFileFromS3(fileUrl: string): Promise<void> {
  try {
    // Извлекаем ключ из URL
    const urlParts = fileUrl.split('/');
    const bucketIndex = urlParts.indexOf(BUCKET_NAME);
    
    if (bucketIndex === -1) {
      throw new Error('Неверный URL файла');
    }
    
    const key = urlParts.slice(bucketIndex + 1).join('/');
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Ошибка удаления файла из S3:', error);
    throw new Error('Не удалось удалить файл');
  }
}

// Функция для валидации файла
export function validateFile(
  file: { size: number; mimetype: string },
  type: 'image' | 'video'
): { isValid: boolean; error?: string } {
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      isValid: false,
      error: `Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      isValid: false,
      error: `Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`
    };
  }

  return { isValid: true };
}

// Функция для получения подписанного URL для загрузки (если нужно)
export async function getSignedUploadUrl(
  fileName: string,
  contentType: string,
  s3Path: string
): Promise<string> {
  const key = `${s3Path}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 час
    return signedUrl;
  } catch (error) {
    console.error('Ошибка создания подписанного URL:', error);
    throw new Error('Не удалось создать подписанный URL');
  }
}

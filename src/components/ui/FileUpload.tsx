'use client';

import { useState, useRef } from 'react';
import { Icons } from './Icons';
import Button from './Button';
import { getAuthToken } from '@/lib/client-auth';

interface FileUploadProps {
  onFileSelect: (url: string) => void;
  fileType: 'course-image' | 'course-video' | 'lesson-image' | 'lesson-video' | 'lesson-document';
  accept: string;
  maxSize?: number;
  currentUrl?: string;
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  fileType,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB по умолчанию
  currentUrl,
  disabled = false,
  className = ''
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = accept.includes('image') && fileType !== 'lesson-document';
  const isVideo = accept.includes('video');
  const isDocument = fileType === 'lesson-document';

  const getFileExtension = (url: string) => {
    const fileName = url.split('/').pop() || '';
    const extension = fileName.split('.').pop() || 'file';
    return extension;
  };

  const getFileName = (url: string) => {
    const fileName = url.split('/').pop() || '';
    // Убираем timestamp и случайную строку из имени файла, если они есть
    // Паттерн: timestamp-randomstring-originalname.ext
    const cleanName = fileName.replace(/^\d+-[a-z0-9]+-/, '');
    
    if (cleanName && cleanName !== fileName) {
      return cleanName;
    }
    
    // Если паттерн не найден, возвращаем оригинальное имя или дефолтное
    return fileName || 'Документ';
  };

  const getFileIcon = (extension: string) => {
    const ext = extension.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <Icons.FileText className="h-8 w-8 text-red-400" />;
      case 'doc':
      case 'docx':
        return <Icons.FileText className="h-8 w-8 text-blue-400" />;
      case 'xls':
      case 'xlsx':
        return <Icons.FileText className="h-8 w-8 text-green-400" />;
      case 'ppt':
      case 'pptx':
        return <Icons.FileText className="h-8 w-8 text-orange-400" />;
      case 'zip':
      case 'rar':
        return <Icons.FileText className="h-8 w-8 text-purple-400" />;
      case 'txt':
        return <Icons.FileText className="h-8 w-8 text-gray-400" />;
      default:
        return <Icons.FileText className="h-8 w-8 text-blue-400" />;
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Валидация размера файла
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      setError(`Файл слишком большой. Максимальный размер: ${maxSizeMB}MB`);
      return;
    }

    // Валидация типа файла
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image/*') {
        return file.type.startsWith('image/');
      }
      if (type === 'video/*') {
        return file.type.startsWith('video/');
      }
      if (type.startsWith('.')) {
        // Проверка по расширению файла
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type === type;
    });
    
    if (!isValidType) {
      console.log('Клиентская валидация: тип файла', file.type, 'не соответствует', acceptedTypes);
      setError(`Неподдерживаемый тип файла: ${file.type}`);
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Получаем токен авторизации из cookies
      const token = getAuthToken();
      if (!token) {
        throw new Error('Не авторизован');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', fileType);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка загрузки файла');
      }

      onFileSelect(result.url);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      setError(error instanceof Error ? error.message : 'Ошибка загрузки файла');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = () => {
    onFileSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Скрытый input для выбора файлов */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Область загрузки */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-400 bg-blue-50/10' : 'border-gray-600'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-500'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-sm text-gray-400">Загрузка файла...</p>
          </div>
        ) : currentUrl ? (
          <div 
            className="space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Превью файла */}
            {isImage && (
              <div className="relative inline-block">
                <img
                  src={currentUrl}
                  alt="Превью"
                  className="max-w-full max-h-32 rounded-lg object-cover"
                />
              </div>
            )}
            {isVideo && (
              <div className="relative inline-block">
                <div className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg">
                  <Icons.Video className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-300 font-medium">{getFileName(currentUrl)}</p>
                    <p className="text-xs text-gray-500">
                      Видео файл
                    </p>
                  </div>
                </div>
              </div>
            )}
            {isDocument && (
              <div className="relative">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(getFileExtension(currentUrl))}
                    <div>
                      <p className="text-sm text-gray-300 font-medium">{getFileName(currentUrl)}</p>
                      <p className="text-xs text-gray-500">
                        {getFileExtension(currentUrl).toUpperCase()} файл
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    disabled={disabled}
                    className="ml-4 flex-shrink-0"
                  >
                    <Icons.Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {!isDocument && (
              <div className="flex items-center justify-center space-x-2">
                <Icons.CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-300">Файл загружен</span>
              </div>
            )}
            
            {!isDocument && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                disabled={disabled}
              >
                <Icons.Trash className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              {isImage ? (
                <Icons.Image className="h-12 w-12 text-gray-400" />
              ) : isVideo ? (
                <Icons.Video className="h-12 w-12 text-gray-400" />
              ) : (
                <Icons.FileText className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-300">
                Перетащите файл сюда или{' '}
                <span className="text-blue-400 underline">выберите файл</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isImage 
                  ? 'PNG, JPG, WEBP' 
                  : isVideo 
                    ? 'MP4, WEBM, OGG' 
                    : 'PDF, DOC, DOCX, PPT, XLS и другие'
                } до {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ошибка */}
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <Icons.AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

'use client';

import { Icons } from './Icons';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <Icons.Trash className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <Icons.AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'info':
        return <Icons.Info className="h-6 w-6 text-blue-500" />;
      default:
        return <Icons.AlertTriangle className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (variant) {
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      default:
        return 'danger';
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#151515] rounded-2xl w-full max-w-md border border-gray-800">
        {/* Заголовок с иконкой */}
        <div className="flex items-center gap-3 p-6 pb-4">
          {getIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <Icons.X className="h-5 w-5" />
          </button>
        </div>

        {/* Сообщение */}
        <div className="px-6 pb-6">
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {message}
          </p>

          {/* Кнопки */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              variant={getConfirmButtonVariant() as 'primary' | 'secondary' | 'outline' | 'danger' | 'warning'}
              onClick={handleConfirm}
              disabled={isLoading}
              isLoading={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Удаление...' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

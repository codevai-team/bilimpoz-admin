'use client';

import { useState, useCallback } from 'react';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  isLoading: boolean;
}

export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
    variant: 'danger',
    onConfirm: () => {},
    isLoading: false
  });

  const openDialog = useCallback((options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void | Promise<void>;
  }) => {
    setState({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || 'Подтвердить',
      cancelText: options.cancelText || 'Отмена',
      variant: options.variant || 'danger',
      onConfirm: options.onConfirm,
      isLoading: false
    });
  }, []);

  const closeDialog = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  const handleConfirm = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await state.onConfirm();
      closeDialog();
    } catch (error) {
      console.error('Ошибка при выполнении действия:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.onConfirm, closeDialog]);

  return {
    dialogState: state,
    openDialog,
    closeDialog,
    handleConfirm
  };
}

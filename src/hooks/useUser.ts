'use client';

import { useState, useEffect } from 'react';
import { getAuthToken, removeAuthToken, apiRequest } from '@/lib/client-auth';

export interface User {
  id: string;
  name: string;
  login: string;
  role: 'admin' | 'teacher' | 'student';
  status: 'registered' | 'verified' | 'banned' | 'deleted';
  telegram_id: string | null;
}

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError('Токен аутентификации не найден');
        setLoading(false);
        return;
      }

      // Сначала пробуем загрузить из localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }

      // Затем проверяем актуальность данных через API
      const response = await apiRequest('/api/user/me');
      
      if (response.ok) {
        const currentUser = await response.json();
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else if (response.status === 401) {
        // Токен недействителен
        removeAuthToken();
        localStorage.removeItem('user');
        setError('Сессия истекла');
      } else {
        setError('Ошибка загрузки данных пользователя');
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Ошибка загрузки данных пользователя');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    loadUser();
  }, []);

  return {
    user,
    loading,
    error,
    logout
  };
}

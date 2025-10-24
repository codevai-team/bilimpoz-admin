'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/ui/Icons';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Тестовые данные для входа
    const testCredentials = {
      login: 'admin',
      password: 'admin123'
    };
    
    console.log('Login attempt:', formData);
    
    // Имитация запроса с проверкой тестовых данных
    setTimeout(() => {
      if (formData.login === testCredentials.login && formData.password === testCredentials.password) {
        console.log('Login successful! Redirecting to Telegram verification...');
        router.push('/verify-telegram');
      } else {
        console.log('Invalid credentials');
        setError('Неверный логин или пароль');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Очищаем ошибку при изменении полей
    if (error) setError('');
  };

  return (
    <div className="rounded-2xl p-10 shadow-2xl" style={{backgroundColor: '#151515'}}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="login" className="block text-sm font-medium text-white mb-3">
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4" />
              Логин
            </div>
          </label>
          <Tooltip text="Введите ваш логин для входа в систему">
            <Input
              id="login"
              name="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              placeholder="admin"
              required
            />
          </Tooltip>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-3">
            <div className="flex items-center gap-2">
              <LockIcon className="w-4 h-4" />
              Пароль
            </div>
          </label>
          <Tooltip text="Введите ваш пароль">
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>
          </Tooltip>
        </div>

        {/* Отображение ошибки */}
        {error && (
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>
    </div>
  );
}

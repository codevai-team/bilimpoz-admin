'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '@/components/ui/Icons';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет логика аутентификации
    console.log('Login attempt:', formData);
    
    // Имитация запроса
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </Tooltip>
        </div>


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

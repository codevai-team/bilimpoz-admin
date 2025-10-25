'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { TelegramIcon, ArrowLeftIcon } from '@/components/ui/Icons';

export default function TelegramVerificationForm() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(20); // 5 минут в секундах
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Таймер обратного отсчета
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    // Разрешаем только цифры
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Автоматический переход к следующему полю
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // Фокус на последнем заполненном поле или следующем пустом
    const nextEmptyIndex = newCode.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Введите полный 6-значный код');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Получаем данные пользователя из localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('Данные пользователя не найдены. Войдите заново.');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);
      console.log('Telegram verification attempt:', fullCode);
      
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Telegram verification successful! Redirecting to dashboard...');
        
        // Сохраняем JWT токен в cookies
        if (data.token) {
          document.cookie = `auth-token=${data.token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`;
        }
        
        // Сохраняем актуальные данные пользователя в localStorage
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        router.push('/dashboard');
      } else {
        console.log('Verification failed:', data.error);
        setError(data.error || 'Неверный код. Попробуйте еще раз.');
        // Очищаем поля при ошибке
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Получаем данные пользователя из localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('Данные пользователя не найдены. Войдите заново.');
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);
      console.log('Resending Telegram code...');
      
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTimeLeft(20); // Сброс таймера
        setError('');
        console.log('Code resent successfully');
      } else {
        setError(data.error || 'Ошибка при повторной отправке кода');
      }
    } catch (error) {
      console.error('Error resending code:', error);
      setError('Ошибка подключения к серверу');
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="rounded-2xl p-10 shadow-2xl" style={{backgroundColor: '#151515'}}>
      {/* Заголовок */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gray-500/20 p-3 rounded-full">
            <TelegramIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Подтверждение входа</h2>
        <p className="text-gray-400 text-sm">
          Введите 6-значный код, отправленный в ваш Telegram
        </p>
      </div>

      {/* Уведомления */}
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

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Поля ввода кода */}
        <div>
          <label className="block text-sm font-medium text-white mb-4">
            Код подтверждения
          </label>
           <div className="flex gap-3 justify-center">
             {code.map((digit, index) => (
               <input
                 key={index}
                 ref={(el) => { inputRefs.current[index] = el; }}
                 type="text"
                 inputMode="numeric"
                 maxLength={1}
                 value={digit}
                 onChange={(e) => handleInputChange(index, e.target.value)}
                 onKeyDown={(e) => handleKeyDown(index, e)}
                 onPaste={handlePaste}
                 className={`
                   w-12 h-14 text-center text-xl font-bold
                   text-white placeholder-gray-400
                   rounded-xl border-2
                   focus:outline-none focus:border-white
                   hover:border-gray-500
                   transition-all duration-300 ease-in-out
                   ${error ? 'border-red-400' : 'border-gray-600'}
                   ${digit ? 'border-white bg-white/10' : ''}
                 `}
                 style={{
                   backgroundColor: digit ? undefined : '#0b0b0b'
                 }}
               />
             ))}
           </div>
        </div>

        {/* Таймер и повторная отправка */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-400">
              Код действителен еще: <span className="text-white font-mono">{formatTime(timeLeft)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
            >
              Отправить ещё
            </button>
          )}
        </div>

         {/* Кнопки */}
         <div className="space-y-4">
           <Button
             type="submit"
             isLoading={isLoading}
             className="w-full"
             disabled={code.join('').length !== 6}
           >
             {isLoading ? 'Проверка кода...' : 'Подтвердить'}
           </Button>
           
           <div className="text-center">
             <button
               type="button"
               onClick={handleBackToLogin}
               className="text-gray-400 hover:text-gray-300 transition-colors text-sm inline-flex items-center gap-2"
             >
               <ArrowLeftIcon className="w-4 h-4" />
               Вернуться к входу
             </button>
           </div>
         </div>
      </form>
    </div>
  );
}

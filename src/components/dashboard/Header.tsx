'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import { useUser } from '@/hooks/useUser';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Header({ onMenuToggle, isMobileMenuOpen: _isMobileMenuOpen }: HeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, loading, logout } = useUser();

  return (
    <header className="fixed top-4 left-4 right-4 lg:left-4 lg:right-4 bg-[#151515] rounded-2xl px-4 lg:px-6 h-16 flex items-center justify-between z-50 shadow-2xl">
      {/* Левая часть - логотип и кнопка меню */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Открыть меню"
        >
          <Icons.Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-sm">B</span>
          </div>
          <h1 className="text-xl font-bold text-white hidden sm:block">
            Bilimpoz Admin
          </h1>
        </div>
      </div>

      {/* Правая часть - уведомления и профиль */}
      <div className="flex items-center gap-4">
        {/* Поиск */}
        <div className="hidden md:flex items-center relative">
          <Icons.Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск..."
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent w-64"
          />
        </div>

        {/* Уведомления */}
        <button className="relative p-2 rounded-lg hover:bg-gray-800 transition-colors">
          <Icons.Bell className="h-5 w-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Профиль */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              <Icons.User className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm text-white">
              {loading ? 'Загрузка...' : user?.name || 'Пользователь'}
            </span>
            <Icons.ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Выпадающее меню профиля */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#151515] rounded-2xl shadow-2xl py-2 z-50">
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg mx-2 transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Icons } from '@/components/ui/Icons';
import { useUser } from '@/hooks/useUser';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: 'Дашборд',
    href: '/dashboard',
    icon: Icons.BarChart3,
  },
  {
    title: 'Курсы',
    href: '/dashboard/courses',
    icon: Icons.BookOpen,
  },
  {
    title: 'Пользователи',
    href: '/dashboard/users',
    icon: Icons.Users,
  },
  {
    title: 'Рассылки',
    href: '/dashboard/newsletters',
    icon: Icons.Mail,
  },
  {
    title: 'Тесты',
    href: '/dashboard/tests',
    icon: Icons.FileText,
  },
  {
    title: 'Вопросы',
    href: '/dashboard/questions',
    icon: Icons.HelpCircle,
  },
  {
    title: 'Настройки',
    href: '/dashboard/settings',
    icon: Icons.Settings,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, loading, logout } = useUser();

  return (
    <>
      {/* Overlay для мобильных устройств */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Сайдбар */}
      <aside
        className={`
          fixed top-24 left-4 z-40 h-[calc(100vh-7rem)] w-64 bg-[#151515] rounded-2xl shadow-2xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Заголовок сайдбара */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">B</span>
            </div>
            <h2 className="text-lg font-semibold text-white">Bilimpoz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Icons.X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Навигационное меню */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Нижняя часть сайдбара */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                <Icons.User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {loading ? 'Загрузка...' : user?.name || 'Пользователь'}
                </p>
                <p className="text-xs text-gray-400">
                  {loading ? '...' : user?.role || 'admin'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <Icons.LogOut className="h-3 w-3" />
              Выйти
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

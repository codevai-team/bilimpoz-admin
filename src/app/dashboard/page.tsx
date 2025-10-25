import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Дашборд</h1>
          <p className="text-gray-400">Обзор основных метрик и аналитики</p>
        </div>

        {/* Карточки с метриками */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icons.Users className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Пользователи</h3>
            <p className="text-2xl font-bold text-white">1,234</p>
            <p className="text-xs text-gray-500 mt-1">за последний месяц</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Icons.BookOpen className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Активные курсы</h3>
            <p className="text-2xl font-bold text-white">24</p>
            <p className="text-xs text-gray-500 mt-1">курсов в продаже</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Icons.BarChart3 className="h-6 w-6 text-yellow-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                +15%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Доходы</h3>
            <p className="text-2xl font-bold text-white">₽89,012</p>
            <p className="text-xs text-gray-500 mt-1">за последний месяц</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Icons.FileText className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                +3
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Тесты</h3>
            <p className="text-2xl font-bold text-white">156</p>
            <p className="text-xs text-gray-500 mt-1">активных тестов</p>
          </div>
        </div>

        {/* Быстрые действия и недавняя активность */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Быстрые действия */}
          <div className="bg-[#151515] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Быстрые действия</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                <Icons.Users className="h-5 w-5" />
                Добавить пользователя
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Icons.BookOpen className="h-5 w-5" />
                Создать курс
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Icons.Mail className="h-5 w-5" />
                Отправить рассылку
              </button>
            </div>
          </div>

          {/* Недавняя активность */}
          <div className="bg-[#151515] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Недавняя активность</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icons.User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Новый пользователь зарегистрировался</p>
                  <p className="text-xs text-gray-400">2 минуты назад</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Icons.BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Курс "React Основы" опубликован</p>
                  <p className="text-xs text-gray-400">15 минут назад</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Icons.Mail className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Рассылка отправлена 1,234 пользователям</p>
                  <p className="text-xs text-gray-400">1 час назад</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

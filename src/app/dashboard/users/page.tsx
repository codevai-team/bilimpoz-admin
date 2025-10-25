import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Пользователи</h1>
            <p className="text-gray-400">Управление пользователями и их правами</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Icons.Users className="h-4 w-4" />
            Добавить пользователя
          </button>
        </div>

        {/* Статистика пользователей */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icons.Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Всего</h3>
            </div>
            <p className="text-2xl font-bold text-white">1,234</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Icons.User className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Активные</h3>
            </div>
            <p className="text-2xl font-bold text-white">1,156</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Icons.User className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Новые</h3>
            </div>
            <p className="text-2xl font-bold text-white">78</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Icons.User className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Заблокированные</h3>
            </div>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-[#151515] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск пользователей..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20">
              <option>Все статусы</option>
              <option>Активные</option>
              <option>Неактивные</option>
              <option>Заблокированные</option>
            </select>
          </div>
        </div>

        {/* Список пользователей */}
        <div className="bg-[#151515] rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Все пользователи</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Пользователь</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Статус</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Регистрация</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Действия</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Иван Петров', email: 'ivan@example.com', status: 'active', date: '15.10.2024' },
                  { name: 'Мария Сидорова', email: 'maria@example.com', status: 'active', date: '14.10.2024' },
                  { name: 'Алексей Козлов', email: 'alex@example.com', status: 'inactive', date: '13.10.2024' },
                  { name: 'Елена Васильева', email: 'elena@example.com', status: 'blocked', date: '12.10.2024' },
                ].map((user, index) => (
                  <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <Icons.User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-500/10 text-green-400' :
                        user.status === 'inactive' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {user.status === 'active' ? 'Активный' : 
                         user.status === 'inactive' ? 'Неактивный' : 'Заблокирован'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{user.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <Icons.Settings className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          <Icons.Mail className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

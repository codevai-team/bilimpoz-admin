import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Настройки</h1>
          <p className="text-gray-400">Конфигурация системы и пользовательские настройки</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Навигация по настройкам */}
          <div className="lg:col-span-1">
            <div className="bg-[#151515] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Разделы</h2>
              <nav className="space-y-2">
                {[
                  { name: 'Общие', icon: Icons.Settings, active: true },
                  { name: 'Пользователи', icon: Icons.Users, active: false },
                  { name: 'Уведомления', icon: Icons.Bell, active: false },
                  { name: 'Безопасность', icon: Icons.Lock, active: false },
                  { name: 'Интеграции', icon: Icons.Settings, active: false },
                  { name: 'Резервное копирование', icon: Icons.Settings, active: false },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active
                          ? 'bg-white text-black'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Основной контент настроек */}
          <div className="lg:col-span-2 space-y-6">
            {/* Общие настройки */}
            <div className="bg-[#151515] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Общие настройки</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Название платформы
                  </label>
                  <input
                    type="text"
                    defaultValue="Bilimpoz"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Описание
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Образовательная платформа для изучения программирования"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Email администратора
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@bilimpoz.com"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Часовой пояс
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20">
                    <option>UTC+3 (Москва)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC-5 (EST)</option>
                    <option>UTC-8 (PST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Настройки курсов */}
            <div className="bg-[#151515] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Настройки курсов</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Автоматическая публикация</h3>
                    <p className="text-sm text-gray-400">Автоматически публиковать курсы после модерации</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Уведомления о новых курсах</h3>
                    <p className="text-sm text-gray-400">Отправлять email уведомления пользователям</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Максимальный размер файла (МБ)
                  </label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Настройки тестирования */}
            <div className="bg-[#151515] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Настройки тестирования</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Время на прохождение теста (минуты)
                  </label>
                  <input
                    type="number"
                    defaultValue="60"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Проходной балл (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="70"
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Количество попыток
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20">
                    <option value="1">1 попытка</option>
                    <option value="2">2 попытки</option>
                    <option value="3" selected>3 попытки</option>
                    <option value="unlimited">Неограниченно</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex items-center justify-end gap-4">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Отменить
              </button>
              <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                Сохранить изменения
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

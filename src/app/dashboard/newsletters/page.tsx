import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function NewslettersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Рассылки</h1>
            <p className="text-gray-400">Создание и управление email рассылками</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Icons.Mail className="h-4 w-4" />
            Создать рассылку
          </button>
        </div>

        {/* Статистика рассылок */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icons.Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Всего отправлено</h3>
            </div>
            <p className="text-2xl font-bold text-white">15,234</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Icons.BarChart3 className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Открытий</h3>
            </div>
            <p className="text-2xl font-bold text-white">78%</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Icons.BarChart3 className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Кликов</h3>
            </div>
            <p className="text-2xl font-bold text-white">23%</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Icons.Users className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Подписчики</h3>
            </div>
            <p className="text-2xl font-bold text-white">1,156</p>
          </div>
        </div>

        {/* Быстрые шаблоны */}
        <div className="bg-[#151515] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Быстрые шаблоны</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-left hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Icons.BookOpen className="h-5 w-5 text-blue-400" />
                <h3 className="text-white font-medium">Новый курс</h3>
              </div>
              <p className="text-sm text-gray-400">Уведомление о запуске нового курса</p>
            </button>
            
            <button className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-left hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Icons.BarChart3 className="h-5 w-5 text-green-400" />
                <h3 className="text-white font-medium">Еженедельный отчет</h3>
              </div>
              <p className="text-sm text-gray-400">Статистика и достижения за неделю</p>
            </button>
            
            <button className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-left hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Icons.HelpCircle className="h-5 w-5 text-yellow-400" />
                <h3 className="text-white font-medium">Напоминание</h3>
              </div>
              <p className="text-sm text-gray-400">Напоминание о незавершенных уроках</p>
            </button>
          </div>
        </div>

        {/* История рассылок */}
        <div className="bg-[#151515] rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">История рассылок</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { 
                  title: 'Новый курс "React Advanced"', 
                  sent: '1,234 получателя', 
                  date: '25.10.2024', 
                  status: 'sent',
                  opens: '78%',
                  clicks: '23%'
                },
                { 
                  title: 'Еженедельный отчет #42', 
                  sent: '1,156 получателей', 
                  date: '21.10.2024', 
                  status: 'sent',
                  opens: '65%',
                  clicks: '18%'
                },
                { 
                  title: 'Напоминание о курсе JavaScript', 
                  sent: '567 получателей', 
                  date: '18.10.2024', 
                  status: 'draft',
                  opens: '-',
                  clicks: '-'
                },
              ].map((newsletter, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icons.Mail className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{newsletter.title}</h3>
                      <p className="text-sm text-gray-400">{newsletter.sent} • {newsletter.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Открытий</p>
                      <p className="text-white font-medium">{newsletter.opens}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Кликов</p>
                      <p className="text-white font-medium">{newsletter.clicks}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      newsletter.status === 'sent' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {newsletter.status === 'sent' ? 'Отправлено' : 'Черновик'}
                    </span>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Icons.Settings className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

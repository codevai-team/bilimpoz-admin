import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function TestsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Тесты</h1>
            <p className="text-gray-400">Создание и управление тестами и экзаменами</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Icons.FileText className="h-4 w-4" />
            Создать тест
          </button>
        </div>

        {/* Статистика тестов */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Icons.FileText className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Всего тестов</h3>
            </div>
            <p className="text-2xl font-bold text-white">156</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Icons.FileText className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Активные</h3>
            </div>
            <p className="text-2xl font-bold text-white">124</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icons.Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Прохождений</h3>
            </div>
            <p className="text-2xl font-bold text-white">2,345</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Icons.BarChart3 className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Средний балл</h3>
            </div>
            <p className="text-2xl font-bold text-white">78%</p>
          </div>
        </div>

        {/* Категории тестов */}
        <div className="bg-[#151515] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Категории тестов</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
              <Icons.BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Курсы</h3>
              <p className="text-2xl font-bold text-white">89</p>
              <p className="text-xs text-gray-400">тестов</p>
            </div>
            
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
              <Icons.HelpCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Экзамены</h3>
              <p className="text-2xl font-bold text-white">34</p>
              <p className="text-xs text-gray-400">тестов</p>
            </div>
            
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
              <Icons.FileText className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Практика</h3>
              <p className="text-2xl font-bold text-white">23</p>
              <p className="text-xs text-gray-400">тестов</p>
            </div>
            
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center">
              <Icons.BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium mb-1">Оценка</h3>
              <p className="text-2xl font-bold text-white">10</p>
              <p className="text-xs text-gray-400">тестов</p>
            </div>
          </div>
        </div>

        {/* Список тестов */}
        <div className="bg-[#151515] rounded-2xl">
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Все тесты</h2>
            <div className="flex items-center gap-4">
              <select className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/20">
                <option>Все категории</option>
                <option>Курсы</option>
                <option>Экзамены</option>
                <option>Практика</option>
                <option>Оценка</option>
              </select>
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск тестов..."
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { 
                  name: 'React Основы - Итоговый тест', 
                  category: 'Курсы', 
                  questions: 25, 
                  attempts: 156, 
                  avgScore: 85,
                  status: 'active'
                },
                { 
                  name: 'JavaScript ES6+ Экзамен', 
                  category: 'Экзамены', 
                  questions: 50, 
                  attempts: 89, 
                  avgScore: 78,
                  status: 'active'
                },
                { 
                  name: 'TypeScript Практические задачи', 
                  category: 'Практика', 
                  questions: 15, 
                  attempts: 234, 
                  avgScore: 92,
                  status: 'draft'
                },
                { 
                  name: 'Node.js Backend Оценка знаний', 
                  category: 'Оценка', 
                  questions: 30, 
                  attempts: 67, 
                  avgScore: 74,
                  status: 'active'
                },
              ].map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icons.FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{test.name}</h3>
                      <p className="text-sm text-gray-400">{test.category} • {test.questions} вопросов</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Попыток</p>
                      <p className="text-white font-medium">{test.attempts}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Средний балл</p>
                      <p className="text-white font-medium">{test.avgScore}%</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.status === 'active' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {test.status === 'active' ? 'Активный' : 'Черновик'}
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

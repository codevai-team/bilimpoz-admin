import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function QuestionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Вопросы</h1>
            <p className="text-gray-400">Банк вопросов для тестов и экзаменов</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Icons.HelpCircle className="h-4 w-4" />
            Добавить вопрос
          </button>
        </div>

        {/* Статистика вопросов */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icons.HelpCircle className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Всего вопросов</h3>
            </div>
            <p className="text-2xl font-bold text-white">1,234</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Icons.HelpCircle className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Одиночный выбор</h3>
            </div>
            <p className="text-2xl font-bold text-white">856</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Icons.HelpCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Множественный выбор</h3>
            </div>
            <p className="text-2xl font-bold text-white">234</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Icons.HelpCircle className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Открытые</h3>
            </div>
            <p className="text-2xl font-bold text-white">144</p>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-[#151515] rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск вопросов..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20">
              <option>Все категории</option>
              <option>JavaScript</option>
              <option>React</option>
              <option>Node.js</option>
              <option>TypeScript</option>
            </select>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20">
              <option>Все типы</option>
              <option>Одиночный выбор</option>
              <option>Множественный выбор</option>
              <option>Открытый вопрос</option>
            </select>
            <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20">
              <option>Все уровни</option>
              <option>Начальный</option>
              <option>Средний</option>
              <option>Продвинутый</option>
            </select>
          </div>
        </div>

        {/* Категории вопросов */}
        <div className="bg-[#151515] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Категории вопросов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'JavaScript', count: 456, color: 'yellow' },
              { name: 'React', count: 234, color: 'blue' },
              { name: 'Node.js', count: 189, color: 'green' },
              { name: 'TypeScript', count: 167, color: 'purple' },
              { name: 'CSS', count: 123, color: 'pink' },
            ].map((category, index) => (
              <div key={index} className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-center hover:bg-gray-700 transition-colors cursor-pointer">
                <div className={`w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                  category.color === 'yellow' ? 'bg-yellow-500/10' :
                  category.color === 'blue' ? 'bg-blue-500/10' :
                  category.color === 'green' ? 'bg-green-500/10' :
                  category.color === 'purple' ? 'bg-purple-500/10' :
                  'bg-pink-500/10'
                }`}>
                  <Icons.HelpCircle className={`h-6 w-6 ${
                    category.color === 'yellow' ? 'text-yellow-400' :
                    category.color === 'blue' ? 'text-blue-400' :
                    category.color === 'green' ? 'text-green-400' :
                    category.color === 'purple' ? 'text-purple-400' :
                    'text-pink-400'
                  }`} />
                </div>
                <h3 className="text-white font-medium mb-1">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.count} вопросов</p>
              </div>
            ))}
          </div>
        </div>

        {/* Список вопросов */}
        <div className="bg-[#151515] rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Последние вопросы</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  question: 'Что такое замыкание в JavaScript?',
                  category: 'JavaScript',
                  type: 'Одиночный выбор',
                  difficulty: 'Средний',
                  used: 45,
                  correctRate: 78
                },
                {
                  question: 'Какие хуки используются в React для управления состоянием?',
                  category: 'React',
                  type: 'Множественный выбор',
                  difficulty: 'Начальный',
                  used: 89,
                  correctRate: 85
                },
                {
                  question: 'Объясните разницу между async/await и Promise',
                  category: 'JavaScript',
                  type: 'Открытый',
                  difficulty: 'Продвинутый',
                  used: 23,
                  correctRate: 65
                },
                {
                  question: 'Как создать middleware в Express.js?',
                  category: 'Node.js',
                  type: 'Одиночный выбор',
                  difficulty: 'Средний',
                  used: 67,
                  correctRate: 72
                },
              ].map((question, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">{question.question}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                          {question.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                          {question.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          question.difficulty === 'Начальный' ? 'bg-green-500/10 text-green-400' :
                          question.difficulty === 'Средний' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Icons.Settings className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6 text-gray-400">
                      <span>Использован в {question.used} тестах</span>
                      <span>Правильных ответов: {question.correctRate}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-gray-700 text-white rounded text-xs hover:bg-gray-600 transition-colors">
                        Редактировать
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                        Использовать
                      </button>
                    </div>
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

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Icons } from '@/components/ui/Icons';

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Курсы</h1>
            <p className="text-gray-400">Управление курсами и учебными материалами</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            <Icons.BookOpen className="h-4 w-4" />
            Создать курс
          </button>
        </div>

        {/* Статистика курсов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Icons.BookOpen className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Активные курсы</h3>
            </div>
            <p className="text-2xl font-bold text-white">24</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Icons.Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Студенты</h3>
            </div>
            <p className="text-2xl font-bold text-white">1,234</p>
          </div>
          
          <div className="bg-[#151515] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Icons.BarChart3 className="h-5 w-5 text-yellow-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-400">Завершений</h3>
            </div>
            <p className="text-2xl font-bold text-white">89%</p>
          </div>
        </div>

        {/* Список курсов */}
        <div className="bg-[#151515] rounded-2xl">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white">Все курсы</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'React Основы', students: 156, status: 'active', progress: 85 },
                { name: 'JavaScript для начинающих', students: 234, status: 'active', progress: 92 },
                { name: 'Node.js Backend', students: 89, status: 'draft', progress: 45 },
                { name: 'TypeScript Advanced', students: 67, status: 'active', progress: 78 },
              ].map((course, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icons.BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-400">{course.students} студентов</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Прогресс</p>
                      <p className="text-white font-medium">{course.progress}%</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === 'active' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {course.status === 'active' ? 'Активный' : 'Черновик'}
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

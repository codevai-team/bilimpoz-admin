export default function DashboardPage() {
  return (
    <div className="min-h-screen text-white p-8" style={{backgroundColor: '#0b0b0b'}}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
          <p className="text-gray-400">Добро пожаловать в административную панель Bilimpoz</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg p-6" style={{backgroundColor: '#151515'}}>
            <h3 className="text-lg font-semibold mb-2">Пользователи</h3>
            <p className="text-3xl font-bold text-white">1,234</p>
            <p className="text-sm text-gray-400">+12% за месяц</p>
          </div>
          
          <div className="rounded-lg p-6" style={{backgroundColor: '#151515'}}>
            <h3 className="text-lg font-semibold mb-2">Заказы</h3>
            <p className="text-3xl font-bold text-white">567</p>
            <p className="text-sm text-gray-400">+8% за месяц</p>
          </div>
          
          <div className="rounded-lg p-6" style={{backgroundColor: '#151515'}}>
            <h3 className="text-lg font-semibold mb-2">Доходы</h3>
            <p className="text-3xl font-bold text-white">₽89,012</p>
            <p className="text-sm text-gray-400">+15% за месяц</p>
          </div>
          
          <div className="rounded-lg p-6" style={{backgroundColor: '#151515'}}>
            <h3 className="text-lg font-semibold mb-2">Продукты</h3>
            <p className="text-3xl font-bold text-white">89</p>
            <p className="text-sm text-gray-400">+3 за неделю</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white text-black px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Добавить пользователя
            </button>
            <button className="bg-white text-black px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Создать заказ
            </button>
            <button className="bg-white text-black px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Управление продуктами
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

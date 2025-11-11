import { useAuth } from '../auth/hooks/useAuth';

export default function Dashboard() {
  const { userData } = useAuth();

  const stats = [
    { name: 'Aktive Aufträge', value: '0', icon: '📋', color: 'bg-blue-500' },
    { name: 'Abgeschlossen', value: '0', icon: '✓', color: 'bg-green-500' },
    { name: 'Team-Mitglieder', value: '1', icon: '👥', color: 'bg-purple-500' },
    { name: 'Rezepte', value: '0', icon: '📖', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Willkommen zurück, {userData?.first_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Hier ist eine Übersicht über dein Team und deine Aufträge.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            + Neuen Auftrag erstellen
          </button>
          <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            👥 Team-Mitglied einladen
          </button>
          <button className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
            📖 Rezept erstellen
          </button>
        </div>
      </div>

      {/* Recent Orders (Placeholder) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzte Aufträge</h2>
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Noch keine Aufträge vorhanden</p>
          <p className="mt-2 text-sm">Erstelle deinen ersten Auftrag, um hier eine Übersicht zu sehen.</p>
        </div>
      </div>
    </div>
  );
}

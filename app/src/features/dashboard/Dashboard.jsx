import { Link } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../orders/services/orderService';

export default function Dashboard() {
  const { userData } = useAuth();

  // Fetch orders for stats
  const { data: orders } = useQuery({
    queryKey: ['orders', null],
    queryFn: () => getOrders(null),
  });

  const activeOrders = orders?.filter(o => o.status === 'open').length || 0;
  const completedOrders = orders?.filter(o => o.status === 'done').length || 0;

  const stats = [
    {
      name: 'Aktive Aufträge',
      value: activeOrders.toString(),
      icon: '/design-assets/icons/vuesaxlinearrouting2.svg',
      color: 'bg-purple-light',
      link: '/orders'
    },
    {
      name: 'Abgeschlossen',
      value: completedOrders.toString(),
      icon: '/design-assets/icons/vuesaxlinearcalendartick.svg',
      color: 'bg-green-50',
      link: '/orders'
    },
    {
      name: 'Team-Mitglieder',
      value: '1',
      icon: '/design-assets/icons/vuesaxlinearusersquare.svg',
      color: 'bg-blue-50',
      link: '/team'
    },
    {
      name: 'Rezepte',
      value: '0',
      icon: '/design-assets/icons/vuesaxlinearemptywallettick.svg',
      color: 'bg-orange-50',
      link: '/recipes'
    },
  ];

  return (
    <div className="p-10 space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl border-2 border-primary shadow-soft p-8">
        <h1 className="text-3xl font-albert-sans font-bold text-text-dark">
          Willkommen zurück, {userData?.first_name}!
        </h1>
        <p className="mt-3 text-lg font-cabin text-gray-600">
          Hier ist eine Übersicht über dein Team und deine Aufträge.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="bg-white rounded-xl border-2 border-border-inactive shadow-soft p-6 hover:border-primary transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-cabin font-semibold text-text-gray">{stat.name}</p>
                <p className="mt-2 text-4xl font-product-sans font-bold text-text-dark">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center`}>
                <img
                  src={stat.icon}
                  alt={stat.name}
                  className="w-7 h-7"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
        <h2 className="text-xl font-albert-sans font-bold text-text-dark mb-6">Schnellaktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/orders/new"
            className="px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors font-cabin font-semibold text-center flex items-center justify-center gap-2"
          >
            <img
              src="/design-assets/icons/vuesaxlinearrouting2.svg"
              alt="Orders"
              className="w-5 h-5 brightness-0 invert"
            />
            Neuen Auftrag erstellen
          </Link>
          <Link
            to="/team"
            className="px-6 py-4 border-2 border-primary text-primary rounded-xl hover:bg-purple-light transition-colors font-cabin font-semibold text-center flex items-center justify-center gap-2"
          >
            <img
              src="/design-assets/icons/vuesaxlinearusersquare.svg"
              alt="Team"
              className="w-5 h-5"
            />
            Team-Mitglied einladen
          </Link>
          <Link
            to="/recipes"
            className="px-6 py-4 border-2 border-border-inactive text-gray-700 rounded-xl hover:border-primary hover:text-primary transition-colors font-cabin font-semibold text-center flex items-center justify-center gap-2"
          >
            <img
              src="/design-assets/icons/vuesaxlinearemptywallettick.svg"
              alt="Recipes"
              className="w-5 h-5"
            />
            Rezept erstellen
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border-2 border-border-inactive shadow-soft p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-albert-sans font-bold text-text-dark">Letzte Aufträge</h2>
          <Link
            to="/orders"
            className="text-primary font-cabin font-semibold hover:underline"
          >
            Alle anzeigen →
          </Link>
        </div>
        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-product-sans font-bold text-text-dark">{order.title}</h3>
                    {order.customer_name && (
                      <p className="text-sm font-cabin text-gray-600 mt-1">
                        Kunde: {order.customer_name}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-cabin font-semibold ${
                    order.status === 'open'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'done'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'open' ? 'Offen' : order.status === 'done' ? 'Erledigt' : 'Archiviert'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-light rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="/design-assets/icons/vuesaxlinearrouting2.svg"
                alt="Orders"
                className="w-8 h-8"
              />
            </div>
            <p className="text-lg font-cabin text-gray-500">Noch keine Aufträge vorhanden</p>
            <p className="mt-2 text-sm font-cabin text-gray-400">
              Erstelle deinen ersten Auftrag, um hier eine Übersicht zu sehen.
            </p>
            <Link
              to="/orders/new"
              className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-cabin font-semibold"
            >
              + Ersten Auftrag erstellen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

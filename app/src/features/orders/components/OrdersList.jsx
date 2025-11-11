import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services/orderService';
import { useOrderRealtime } from '../hooks/useOrderRealtime';
import OrderCard from './OrderCard';

export default function OrdersList() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subscribe to realtime updates
  useOrderRealtime();

  // Fetch orders based on active tab
  const statusFilter = activeTab === 'all' ? null : activeTab;
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', statusFilter],
    queryFn: () => getOrders(statusFilter),
  });

  const tabs = [
    { id: 'all', label: 'Alle', count: orders?.length || 0 },
    { id: 'open', label: 'Aktiv', count: orders?.filter(o => o.status === 'open').length || 0 },
    { id: 'done', label: 'Abgeschlossen', count: orders?.filter(o => o.status === 'done').length || 0 },
  ];

  // Filter orders by search query
  const filteredOrders = orders?.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.title?.toLowerCase().includes(query) ||
      order.customer?.toLowerCase().includes(query) ||
      order.description?.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Aufträge: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Aufträge</h1>
        <Link
          to="/orders/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Neuer Auftrag
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Aufträge durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">Keine Aufträge gefunden</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery
              ? 'Versuche eine andere Suche'
              : 'Erstelle deinen ersten Auftrag'}
          </p>
        </div>
      )}
    </div>
  );
}

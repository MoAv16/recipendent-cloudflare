import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../services/orderService';
import { useOrderRealtime } from '../hooks/useOrderRealtime';
import OrderCardNew from './OrderCardNew';
import OrderDetailView from './OrderDetailView';

export default function OrdersList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Subscribe to realtime updates
  useOrderRealtime();

  // Fetch all open orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', 'open'],
    queryFn: () => getOrders('open'),
  });

  // Filter orders by search query
  const filteredOrders = orders?.filter((order) => {
    const query = searchQuery.toLowerCase();
    return (
      order.title?.toLowerCase().includes(query) ||
      order.customer_name?.toLowerCase().includes(query) ||
      order.category?.toLowerCase().includes(query) ||
      order.location?.toLowerCase().includes(query) ||
      order.description?.toLowerCase().includes(query)
    );
  });

  // Get selected order details
  const selectedOrder = selectedOrderId
    ? orders?.find(o => o.id === selectedOrderId)
    : null;

  // Auto-select first order when orders load
  if (!selectedOrderId && filteredOrders && filteredOrders.length > 0) {
    setSelectedOrderId(filteredOrders[0].id);
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Aufträge: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen pt-10 px-6 gap-10 pb-10">
      {/* Left Side - Orders List */}
      <div className="flex-shrink-0 w-[540px] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-albert-sans font-bold text-black mb-4">
            Aktive Aufträge
          </h1>

          {/* Search Bar */}
          <div className="bg-white rounded-xl border border-[#ecedf6] shadow-soft-lg px-4 py-3 flex items-center gap-3 max-w-[388px]">
            <img
              src="/design-assets/icons/vector_3.svg"
              alt="Search"
              className="w-6 h-6"
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-base font-abeezee placeholder:text-[#c4c4c4]"
            />
            <button className="w-6 h-6">
              <img
                src="/design-assets/icons/vuesaxlinearsetting4.svg"
                alt="Filter"
                className="w-full h-full"
              />
            </button>
          </div>
        </div>

        {/* Orders List - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCardNew
                key={order.id}
                order={order}
                isActive={selectedOrderId === order.id}
                onClick={() => setSelectedOrderId(order.id)}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-soft">
              <p className="text-gray-500 text-lg">Keine Aufträge gefunden</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery
                  ? 'Versuche eine andere Suche'
                  : 'Erstelle deinen ersten Auftrag'}
              </p>
            </div>
          )}
        </div>

        {/* Create New Order Button */}
        <div className="mt-6">
          <Link
            to="/orders/new"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-center"
          >
            + Neuer Auftrag
          </Link>
        </div>
      </div>

      {/* Right Side - Order Detail View */}
      <div className="flex-1 flex flex-col">
        <OrderDetailView order={selectedOrder} />
      </div>
    </div>
  );
}

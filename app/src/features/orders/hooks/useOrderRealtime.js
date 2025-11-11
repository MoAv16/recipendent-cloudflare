import { useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Subscribe to realtime changes for orders
 * Automatically invalidates React Query cache when orders change
 */
export const useOrderRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Order changed:', payload);

          // Invalidate orders query to refetch
          queryClient.invalidateQueries({ queryKey: ['orders'] });

          // If it's an update or delete, also invalidate the specific order
          if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
            queryClient.invalidateQueries({
              queryKey: ['orders', payload.old.id]
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};

/**
 * Custom hook for fetching orders with React Query
 */
export const useOrders = (status = null) => {
  const { getOrders } = require('../services/orderService');
  const { useQuery } = require('@tanstack/react-query');

  return useQuery({
    queryKey: ['orders', status],
    queryFn: () => getOrders(status),
  });
};

/**
 * Custom hook for fetching a single order
 */
export const useOrder = (orderId) => {
  const { getOrderById } = require('../services/orderService');
  const { useQuery } = require('@tanstack/react-query');

  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

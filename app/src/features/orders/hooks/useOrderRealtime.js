import { useEffect } from 'react';
import { supabase } from '../../../config/supabase';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Subscribe to realtime changes for orders
 * Automatically invalidates React Query cache when orders change
 * RLS policies ensure users only receive changes for their company
 */
export const useOrderRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('[Realtime] Order changed:', payload.eventType, payload.new || payload.old);

          // Invalidate all orders queries
          queryClient.invalidateQueries({ queryKey: ['orders'] });

          // Invalidate specific order if we have the ID
          const orderId = payload.new?.id || payload.old?.id;
          if (orderId) {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
          }

          // Also invalidate company-users if team assignments changed
          if (payload.eventType === 'UPDATE' && payload.new?.assigned_to !== payload.old?.assigned_to) {
            queryClient.invalidateQueries({ queryKey: ['company-users'] });
          }
        }
      )
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
      });

    return () => {
      console.log('[Realtime] Unsubscribing from orders');
      supabase.removeChannel(channel);
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

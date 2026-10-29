'use client';

import { useState, useEffect } from 'react';

export interface EscrowOrder {
  orderId: number;
  buyer: string;
  designer: string;
  amountStroops: string;
  status: string;
  createdAt: string;
}

export function useEscrowOrders() {
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/escrow/orders');
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.statusText}`);
      const json = await res.json();
      setOrders(json.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      // Fallback mock orders for local dev testing
      setOrders([
        {
          orderId: 101,
          buyer: 'GBUYERTESTADDRESS1234567890BUYER1',
          designer: 'GBTYMGFXTESTADDRESS1234567890DESIGNER1',
          amountStroops: '500000000',
          status: 'Funded',
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/api.service';
import { RoutingResponse } from '@/types/routing.types';
import { toast } from 'sonner';

// MUDANÇA AQUI: O hook agora aceita productId
export function useRoutings(productId: string) {
  const [routings, setRoutings] = useState<RoutingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutings = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // MUDANÇA AQUI: Chama a nova função do serviço
      const data = await productService.findRoutingsByProductId(productId);
      setRoutings(data);
    } catch (error) {
      toast.error('Error fetching routings', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
    // MUDANÇA AQUI: A dependência agora é o productId
  }, [productId]);

  useEffect(() => {
    fetchRoutings();
  }, [fetchRoutings]);

  return {
    routings,
    loading,
    fetchRoutings,
  };
}
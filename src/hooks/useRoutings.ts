'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/api.service';
import { RoutingResponse } from '@/types/routing.types';
import { toast } from 'sonner';

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
      const allRoutings = await productService.findRoutingsByProductId(productId);
      
      const filteredData = allRoutings.filter(routing => !!routing.workCenterCode);
     
      setRoutings(filteredData);
    } catch (error) {
      toast.error('Error fetching routings', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
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
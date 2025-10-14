'use client';

import { useState, useEffect, useCallback } from 'react';
import { componentService } from '@/services/api.service';
import { ComponentResponse } from '@/types/component.types';
import { toast } from 'sonner';

export function useComponents(productId: string) {
  const [components, setComponents] = useState<ComponentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComponents = useCallback(async () => {
    // Não faz a busca se o productId ainda não estiver disponível
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await componentService.findAllByProduct(productId);
      setComponents(data);
    } catch (error) {
      toast.error('Error fetching components', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  return {
    components,
    loading,
    fetchComponents,
  };
}
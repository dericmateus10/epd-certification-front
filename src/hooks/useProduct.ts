'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/api.service';
import { ProductResponse } from '@/types/product.types';
import { toast } from 'sonner';

export function useProduct(productId: string) {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await productService.getById(productId);
      setProduct(data);
    } catch (error) {
      toast.error('Error fetching material details', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading };
}
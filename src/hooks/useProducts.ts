// src/hooks/useProducts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/api.service';
import { ProductResponse, UpdateProductDto } from '@/types/product.types';
import { toast } from 'sonner';

export function useProducts() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // MUDANÇA PRINCIPAL AQUI: fetchProducts corrigido e simplificado
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true); // 1. Começa o carregamento
      const response = await productService.getAll(); // 2. Faz UMA chamada à API
      setProducts(response.data); // 3. Atualiza o estado com os dados corretos
    } catch (error) {
      toast.error('Error fetching materials', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false); // 4. Finaliza o carregamento, com sucesso ou erro
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const importProduct = async (productCode: string) => {
    try {
      const newProduct = await productService.importByCode(productCode);
      // Esta linha está correta e agora vai funcionar de forma previsível
      setProducts((prev) => [...prev, newProduct]);
      
      toast.success('Material imported successfully!', {
        description: `The product "${newProduct.productDescription}" has been added.`,
      });
    } catch (error) {
      toast.error('Error importing material', {
        description: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };
  
  const updateProduct = async (id: string, data: UpdateProductDto) => {
    try {
      const updatedProduct = await productService.update(id, data);
      setProducts((prev) => 
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
      toast.success('Material updated successfully!');
    } catch (error) {
      toast.error('Error updating material', {
        description: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Material deleted successfully!');
    } catch (error) {
      toast.error('Error deleting material', {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    importProduct,
    updateProduct,
    deleteProduct,
  };
}
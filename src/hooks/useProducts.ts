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
      toast.error('Erro ao buscar produtos', {
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
      
      toast.success('Produto importado com sucesso!', {
        description: `O produto "${newProduct.productDescription}" foi adicionado.`,
      });
    } catch (error) {
      toast.error('Erro ao importar produto', {
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
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar produto', {
        description: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Produto deletado com sucesso!');
    } catch (error) {
      toast.error('Erro ao deletar produto', {
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
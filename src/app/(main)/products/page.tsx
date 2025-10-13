'use client';

import { useState, useRef } from 'react'; // CORREÇÃO 1
import { useProducts } from '@/hooks/useProducts';
import { MoreHorizontal } from 'lucide-react';
import { ProductResponse } from '@/types/product.types';
import { ProductForm } from './ProductForm';
import { toast } from 'sonner';
import { productService } from '@/services/api.service'; // CORREÇÃO 2
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';


export default function ProductsPage() {
  const { products, loading, deleteProduct, importProduct, updateProduct } = useProducts();
  
  const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductResponse | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProductForImport, setSelectedProductForImport] = useState<ProductResponse | null>(null);

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductResponse) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (product: ProductResponse) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  const handleCopyComponents = async (product: ProductResponse) => {
    try {
      const componentCodes = await productService.getDistinctComponentCodes(product.productCode);
      if (componentCodes.length === 0) {
        toast.info('Nenhum componente encontrado para este produto.');
        return;
      }
      const textToCopy = componentCodes.join('\n');
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Lista de componentes copiada para a área de transferência!');
    } catch (error) {
      toast.error('Erro ao buscar componentes', {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleImportRoutingClick = (product: ProductResponse) => {
    setSelectedProductForImport(product);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedProductForImport) {
      try {
        toast.info('Importando arquivo de roteiro...');
        await productService.importRouting(selectedProductForImport.productCode, file);
        toast.success('Roteiro importado com sucesso!');
      } catch (error) {
        toast.error('Erro ao importar roteiro', {
          description: error instanceof Error ? error.message : String(error),
        });
      } finally {
        setSelectedProductForImport(null);
        if (event.target) event.target.value = '';
      }
    }
  };

  if (loading) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        <Button onClick={handleOpenCreateModal}>Adicionar Produto</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome / Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.productCode}</TableCell>
                <TableCell>{product.productDescription || '-'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOpenEditModal(product)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyComponents(product)}>
                        Copiar Componentes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleImportRoutingClick(product)}>
                        Importar Roteiro
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(product)}>
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm 
            productToEdit={productToEdit} 
            onSuccess={() => setIsFormModalOpen(false)} 
            onImport={importProduct}
            onUpdate={updateProduct}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá deletar permanentemente o produto
              <span className="font-bold"> {productToDelete?.productDescription}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
'use client';

import { useParams } from 'next/navigation';
import { useComponents } from '@/hooks/useComponents';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProduct } from '@/hooks/useProduct';

export default function ComponentsListPage() {
  const params = useParams();
  const { productId } = params;

  const { product, loading: productLoading } = useProduct(productId as string);
  const { components, loading: componentsLoading } = useComponents(productId as string);

  const isLoading = productLoading || componentsLoading;

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Components" subtitle="Loading component list..."/>
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        // 3. Popule o cabeçalho com os dados do produto
        title="Material Components"
        subtitle={product ? `${product.productCode} - ${product.productDescription}` : `Loading details for ID: ${productId}`}
      />
      
      {/* 3. Renderizamos a tabela com os dados */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item No.</TableHead>
              <TableHead>Component Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.length > 0 ? (
              components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.itemNumber}</TableCell>
                  <TableCell>{component.componentName}</TableCell>
                  <TableCell>{component.componentDescription || '-'}</TableCell>
                  <TableCell className="text-right">{component.quantity}</TableCell>
                  <TableCell>{component.unit || '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              // 4. Exibimos um estado de "lista vazia"
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No components found for this material.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
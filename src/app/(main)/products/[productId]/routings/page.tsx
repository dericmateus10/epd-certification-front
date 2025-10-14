// src/app/(main)/products/[productId]/routings/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useRoutings } from '@/hooks/useRoutings';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function RoutingsListPage() {
  const params = useParams();
  const { productId } = params;

  const { routings, loading } = useRoutings(productId as string);

  if (loading) {
    return (
      <div>
        <PageHeader title="Routings" subtitle="Loading routing list..." />
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Material Routings"
        subtitle={`List of all routing steps for the material with ID: ${productId}`}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* MUDANÇA AQUI: Adicionando novos cabeçalhos */}
              <TableHead>Operation No.</TableHead>
              <TableHead>Material Code</TableHead>
              <TableHead>Material Description</TableHead>
              <TableHead>Work Center</TableHead>
              <TableHead className="text-right">Setup Machine</TableHead>
              <TableHead className="text-right">Setup Operator</TableHead>
              <TableHead className="text-right">Machine Hours</TableHead>
              <TableHead className="text-right">Operator Hours</TableHead>
              <TableHead className="text-center">Primary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routings.length > 0 ? (
              routings.map((routing) => (
                <TableRow key={routing.id}>
                  {/* MUDANÇA AQUI: Adicionando as novas células de dados */}
                  <TableCell className="font-medium">
                    {routing.operationNumber || '-'}
                  </TableCell>
                  <TableCell>{routing.materialCode || '-'}</TableCell>
                  <TableCell>{routing.materialDescription || '-'}</TableCell>
                  <TableCell>{routing.workCenterCode || '-'}</TableCell>
                  <TableCell className="text-right">{routing.setupMachine}</TableCell>
                  <TableCell className="text-right">{routing.setupOperator}</TableCell>
                  <TableCell className="text-right">
                    {routing.machineHours}
                  </TableCell>
                  <TableCell className="text-right">
                    {routing.operatorHours}
                  </TableCell>
                  <TableCell className="text-center">
                    {routing.isPrimary && <Badge variant="secondary">Yes</Badge>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* MUDANÇA AQUI: colSpan atualizado para 9 colunas */}
                <TableCell colSpan={9} className="h-24 text-center">
                  No routings found for this material.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
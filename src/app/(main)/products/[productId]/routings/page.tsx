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
              {/* MUDANÇA AQUI: Adicionamos novas colunas */}
              <TableHead>Operation No.</TableHead>
              <TableHead>Work Center</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Base Qty</TableHead>
              <TableHead className="text-right">Machine Hours</TableHead>
              <TableHead className="text-right">Operator Hours</TableHead>
              <TableHead className="text-center">Primary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routings.length > 0 ? (
              routings.map((routing) => (
                <TableRow key={routing.id}>
                  {/* MUDANÇA AQUI: Adicionamos as novas células */}
                  <TableCell className="font-medium">
                    {routing.operationNumber || '-'}
                  </TableCell>
                  <TableCell>{routing.workCenterCode || '-'}</TableCell>
                  <TableCell>{routing.description || '-'}</TableCell>
                  <TableCell className="text-right">{routing.baseQuantity}</TableCell>
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
                {/* MUDANÇA AQUI: colSpan atualizado para 7 colunas */}
                <TableCell colSpan={7} className="h-24 text-center">
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
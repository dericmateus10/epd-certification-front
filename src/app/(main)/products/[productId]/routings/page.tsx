// src/app/(main)/products/[productId]/routings/page.tsx
'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

// Definindo a interface para o estado de visibilidade das colunas
type ColumnVisibility = {
  [key: string]: boolean;
};

export default function RoutingsListPage() {
  const params = useParams();
  const { productId } = params;

  const { routings, loading } = useRoutings(productId as string);

  // 1. STATE: Estado para controlar a visibilidade de cada coluna. Todas começam visíveis.
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    operationNumber: true,
    materialCode: true,
    materialDescription: true,
    workCenterCode: true,
    setupMachine: true,
    setupOperator: true,
    machineHours: true,
    operatorHours: true,
    isPrimary: true,
  });

  // 2. CALCULATION: Calcula o número de colunas visíveis para o colSpan dinâmico.
  const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length;

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

      {/* 3. UI: Adicionamos o botão de Dropdown para controlar as colunas */}
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Mapeamos o estado de visibilidade para criar os checkboxes */}
            {Object.entries(columnVisibility).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                className="capitalize"
                checked={value}
                onCheckedChange={(checked) =>
                  setColumnVisibility((prev) => ({ ...prev, [key]: checked }))
                }
              >
                {/* Transforma 'operationNumber' em 'Operation Number' */}
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* 4. CONDITIONAL RENDERING: Renderiza cabeçalhos baseados na visibilidade */}
              {columnVisibility.operationNumber && <TableHead>Operation No.</TableHead>}
              {columnVisibility.materialCode && <TableHead>Material Code</TableHead>}
              {columnVisibility.materialDescription && <TableHead>Material Description</TableHead>}
              {columnVisibility.workCenterCode && <TableHead>Work Center</TableHead>}
              {columnVisibility.setupMachine && <TableHead className="text-right">Setup Machine</TableHead>}
              {columnVisibility.setupOperator && <TableHead className="text-right">Setup Operator</TableHead>}
              {columnVisibility.machineHours && <TableHead className="text-right">Machine Hours</TableHead>}
              {columnVisibility.operatorHours && <TableHead className="text-right">Operator Hours</TableHead>}
              {columnVisibility.isPrimary && <TableHead className="text-center">Primary</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {routings.length > 0 ? (
              routings.map((routing) => (
                <TableRow key={routing.id}>
                  {/* 5. CONDITIONAL RENDERING: Renderiza células baseadas na visibilidade */}
                  {columnVisibility.operationNumber && <TableCell className="font-medium">{routing.operationNumber || '-'}</TableCell>}
                  {columnVisibility.materialCode && <TableCell>{routing.materialCode || '-'}</TableCell>}
                  {columnVisibility.materialDescription && <TableCell>{routing.materialDescription || '-'}</TableCell>}
                  {columnVisibility.workCenterCode && <TableCell>{routing.workCenterCode || '-'}</TableCell>}
                  {columnVisibility.setupMachine && <TableCell className="text-right">{routing.setupMachine}</TableCell>}
                  {columnVisibility.setupOperator && <TableCell className="text-right">{routing.setupOperator}</TableCell>}
                  {columnVisibility.machineHours && <TableCell className="text-right">{routing.machineHours}</TableCell>}
                  {columnVisibility.operatorHours && <TableCell className="text-right">{routing.operatorHours}</TableCell>}
                  {columnVisibility.isPrimary && <TableCell className="text-center">{routing.isPrimary && <Badge variant="secondary">Yes</Badge>}</TableCell>}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumnsCount} className="h-24 text-center">
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
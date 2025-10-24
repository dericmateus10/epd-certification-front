'use client';

import { useParams } from 'next/navigation';
import { useQualityHoursReport } from '@/hooks/useQualityHoursReport';
import { PageHeader } from '@/components/common/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import { StatCard } from '@/components/common/StatCard';
import { useMemo } from 'react';
import { useProduct } from '@/hooks/useProduct';

export default function QualityHoursReportPage() {
  const params = useParams();
  const { productId } = params;

  const { product, loading: productLoading } = useProduct(productId as string);
  const { reportData, loading: reportLoading } = useQualityHoursReport(productId as string);

  const isLoading = productLoading || reportLoading;

  const totals = useMemo(() => {
    const individualTotals = reportData.reduce(
      (acc, current) => {
        acc.setupOperator += current.setupOperatorHoursApi;
        acc.setupMachine += current.setupMachineHoursApi;
        acc.operator += current.operatorHoursApi;
        acc.machine += current.machineHoursApi;
        return acc;
      },
      { setupOperator: 0, setupMachine: 0, operator: 0, machine: 0 }
    );

    const totalOperatorHours = individualTotals.setupOperator + individualTotals.operator;
    const totalMachineHours = individualTotals.setupMachine + individualTotals.machine;
    const grandTotalHours = totalOperatorHours + totalMachineHours;

    return {
      ...individualTotals,
      totalOperator: totalOperatorHours,
      totalMachine: totalMachineHours,
      grandTotal: grandTotalHours,
    };
  }, [reportData]);

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Quality Hours Report" subtitle="Loading report data..." />
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  const productDescription = reportData.length > 0 ? reportData[0].productDescription : '';

  return (
    <div>
      <PageHeader
        title="Quality Hours Report"
        subtitle={product ? `${product.productCode} - ${product.productDescription}` : `Loading details for ID: ${productId}`}
      />

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard
          title="Total Operator Hours"
          value={totals.totalOperator.toFixed(2)}
          description="Sum of Operator and Setup Operator hours"
        />
        <StatCard
          title="Total Machine Hours"
          value={totals.totalMachine.toFixed(2)}
          description="Sum of Machine and Setup Machine hours"
        />
        <StatCard
          title="Grand Total Hours"
          value={totals.grandTotal.toFixed(2)}
          description="Total time spent on this material"
        />
      </div>

      {/* 5. TABELA DE DADOS DETALHADOS */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work Center</TableHead>
              <TableHead>Operation</TableHead>
              {/* MUDANÇA PRINCIPAL AQUI: Cabeçalhos com totais integrados */}
              <TableHead className="text-right">
                <div>
                  <span>Setup Operator (h)</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {totals.setupOperator.toFixed(2)}
                  </span>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div>
                  <span>Setup Machine (h)</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {totals.setupMachine.toFixed(2)}
                  </span>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div>
                  <span>Operator (h)</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {totals.operator.toFixed(2)}
                  </span>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div>
                  <span>Machine (h)</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {totals.machine.toFixed(2)}
                  </span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                <TableRow key={`${row.productId}-${index}`} className="odd:bg-muted/40 hover:bg-muted/50">
                   <TableCell className="font-medium">{row.workCenterDescription || row.workCenterCode || '-'}</TableCell>
                   <TableCell>{row.operationDescription || '-'}</TableCell>
                   <TableCell className="text-right">{row.setupOperatorHoursApi.toFixed(2)}</TableCell>
                   <TableCell className="text-right">{row.setupMachineHoursApi.toFixed(2)}</TableCell>
                   <TableCell className="text-right">{row.operatorHoursApi.toFixed(2)}</TableCell>
                   <TableCell className="text-right">{row.machineHoursApi.toFixed(2)}</TableCell>
                 </TableRow>
               ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No quality hours data found for this material.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* MUDANÇA AQUI: Adicionamos o TableFooter para os totais */}
          {reportData.length > 0 && (
            <TableFooter className="bg-muted">
               <TableRow>
                 <TableCell colSpan={2} className="font-bold">Total</TableCell>
                 <TableCell className="text-right font-bold">{totals.setupOperator.toFixed(2)}</TableCell>
                 <TableCell className="text-right font-bold">{totals.setupMachine.toFixed(2)}</TableCell>
                 <TableCell className="text-right font-bold">{totals.operator.toFixed(2)}</TableCell>
                 <TableCell className="text-right font-bold">{totals.machine.toFixed(2)}</TableCell>
               </TableRow>
             </TableFooter>
           )}
        </Table>
      </div>
    </div>
  );
}
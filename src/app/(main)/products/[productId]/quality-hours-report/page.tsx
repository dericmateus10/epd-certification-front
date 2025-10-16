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
} from '@/components/ui/table';

export default function QualityHoursReportPage() {
  const params = useParams();
  const { productId } = params;

  const { reportData, loading } = useQualityHoursReport(productId as string);

  if (loading) {
    return (
      <div>
        <PageHeader title="Quality Hours Report" subtitle="Loading report data..." />
        <div className="p-6 text-center">Loading...</div>
      </div>
    );
  }

  // Pega a descrição do produto do primeiro item do relatório para o subtítulo
  const productDescription = reportData.length > 0 ? reportData[0].productDescription : '';

  return (
    <div>
      <PageHeader
        title="Quality Hours Report"
        subtitle={productDescription || `Analysis for material ID: ${productId}`}
      />
      
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work Center</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead className="text-right">Setup Operator (h)</TableHead>
              <TableHead className="text-right">Setup Machine (h)</TableHead>
              <TableHead className="text-right">Operator (h)</TableHead>
              <TableHead className="text-right">Machine (h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.length > 0 ? (
              reportData.map((row, index) => (
                // Usamos o index como key se não houver um ID único por linha de relatório
                <TableRow key={`${row.productId}-${index}`}>
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
        </Table>
      </div>
    </div>
  );
}
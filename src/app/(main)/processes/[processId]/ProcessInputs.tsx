'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MetersOnProcessesResponse } from '@/types/relationship.types';

interface ProcessInputsProps {
  inputs: MetersOnProcessesResponse[];
  isLoading: boolean;
}

export function ProcessInputs({ inputs, isLoading }: ProcessInputsProps) {
  if (isLoading) {
    return <div className="p-4 text-center text-sm text-gray-500">Loading inputs...</div>;
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Inputs</h3>
        <p className="text-sm text-gray-500">Resources consumed in this process step.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Resource</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Allocation Factor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inputs.length > 0 ? (
            inputs.map((input) => (
              <TableRow key={input.id}>
                <TableCell className="font-medium">{input.meter.code}</TableCell>
                <TableCell>{input.meter.unit}</TableCell>
                <TableCell className="text-right">
                  {/* Formata o fator de alocação como uma porcentagem */}
                  {(input.allocationFactor * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                No inputs found for this process.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
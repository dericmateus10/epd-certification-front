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
    return <div className="p-4 text-center text-sm text-muted-foreground">Loading inputs...</div>;
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Inputs</h3>
        <p className="text-sm text-muted-foreground">Resources consumed in this process step.</p>
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-muted-foreground">Resource</TableHead>
            <TableHead className="text-muted-foreground">Unit</TableHead>
            <TableHead className="text-right text-muted-foreground">Allocation Factor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inputs.length > 0 ? (
            inputs.map((input) => (
              <TableRow key={input.id} className="odd:bg-muted/40 hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-foreground">{input.meter.code}</TableCell>
                <TableCell className="text-foreground">{input.meter.unit}</TableCell>
                <TableCell className="text-right tabular-nums text-foreground">
                  {(input.allocationFactor * 100).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                No inputs found for this process.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
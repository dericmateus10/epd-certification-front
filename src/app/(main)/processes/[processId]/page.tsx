'use client';

import { useParams } from 'next/navigation';
import { useProcess } from '@/hooks/useProcess';
import { PageHeader } from '@/components/common/PageHeader';
import { useProcessInputs } from '@/hooks/useProcessInputs';
import { ProcessInputs } from './ProcessInputs';

export default function ProcessDetailPage() {
  const params = useParams();
  const { processId } = params;

  const { process, loading: isProcessLoading } = useProcess(processId as string);
  const { inputs, loading: areInputsLoading } = useProcessInputs(processId as string);

  if (isProcessLoading) {
    return <div className="text-muted-foreground">Loading process details...</div>;
  }

  if (!process) {
    return (
      <div>
        <PageHeader title="Error" subtitle="Process not found." />
      </div>
    );
  }

  return (
    <div>
      {/* Título e subtítulo do processo */}
      <PageHeader
        title={`${process.stepNumber}. ${process.name}`}
        subtitle="Environmental Product Declaration - Manufacturing Process"
      />

      {/* Conteúdo principal: Inputs e Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProcessInputs inputs={inputs} isLoading={areInputsLoading} />

        {/* Outputs (placeholder) */}
        <div className="rounded-lg border border-border bg-card shadow-sm p-4">
          <h3 className="text-lg font-semibold text-foreground">Outputs</h3>
          <p className="text-sm text-muted-foreground mt-4">This section will be built next.</p>
        </div>
      </div>

      {/* Dashboard (placeholder) */}
      <div className="p-6 border border-border rounded-lg bg-card shadow-sm mt-8">
        <p className="text-foreground">The complete process dashboard will be added here...</p>
        <p className="font-mono mt-4 text-xs bg-muted text-muted-foreground p-2 rounded">ID: {process.id}</p>
      </div>
    </div>
  );
}
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

  const { inputs, loading: areInputsLoading } = useProcessInputs(processId as string)

  
  if (isProcessLoading) {
    return <div>Loading process details...</div>;
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
      {/* 3. Use a variável 'process' para exibir os dados dinâmicos */}
      <PageHeader
        title={`${process.stepNumber}. ${process.name}`}
        subtitle="Environmental Product Declaration - Manufacturing Process"
      />
       {/* 4. Renderize o novo componente de Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProcessInputs inputs={inputs} isLoading={areInputsLoading} />
        
        {/* Espaço reservado para o futuro componente de "Outputs" */}
        <div className="rounded-lg border bg-white shadow-sm p-4">
          <h3 className="text-lg font-semibold">Outputs</h3>
          <p className="text-sm text-gray-500 mt-4">This section will be built next.</p>
        </div>
      </div>
        
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <p>The complete process dashboard will be added here...</p>
        <p className="font-mono mt-4 text-xs bg-gray-100 p-2 rounded">ID: {process.id}</p>
      </div>
    </div>
  );
}
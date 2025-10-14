'use client';

import { useParams } from 'next/navigation';
// 1. Importe o hook correto (singular) do arquivo correto
import { useProcess } from '@/hooks/useProcess';
import { PageHeader } from '@/components/common/PageHeader';

export default function ProcessDetailPage() {
  const params = useParams();
  const { processId } = params;
  
  // 2. Chame o hook correto (singular) e desestruture a variável 'process' (singular)
  const { process, loading } = useProcess(processId as string);

  // O estado de carregamento é exibido enquanto os dados são buscados
  if (loading) {
    return <div>Loading process details...</div>;
  }

  if (!process) {
    return (
      <div>
        <PageHeader title="Error" subtitle="Process not found." />
      </div>
    );
  }

  // Se tudo deu certo, exibe a página com os dados do processo
  return (
    <div>
      {/* 3. Use a variável 'process' para exibir os dados dinâmicos */}
      <PageHeader
        title={`${process.stepNumber}. ${process.name}`}
        subtitle="Environmental Product Declaration - Manufacturing Process"
      />

      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <p>The complete process dashboard will be added here...</p>
        <p className="font-mono mt-4 text-xs bg-gray-100 p-2 rounded">ID: {process.id}</p>
      </div>
    </div>
  );
}
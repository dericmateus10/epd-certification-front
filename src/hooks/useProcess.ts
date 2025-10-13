'use client';

import { useState, useEffect, useCallback } from 'react';
import { processService } from '@/services/api.service';
import { ProcessResponse } from '@/types/process.types';
import { toast } from 'sonner';

export function useProcess(processId: string) {
  const [process, setProcess] = useState<ProcessResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProcess = useCallback(async () => {
    // Não faz nada se o ID não estiver disponível
    if (!processId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await processService.getById(processId);
      setProcess(data);
    } catch (error) {
      toast.error('Erro ao buscar os detalhes do processo', {
        description: error instanceof Error ? error.message : String(error),
      });
      setProcess(null); // Limpa o estado em caso de erro
    } finally {
      setLoading(false);
    }
  }, [processId]);

  useEffect(() => {
    fetchProcess();
  }, [fetchProcess]);

  return {
    process,
    loading,
    fetchProcess,
  };
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { processService } from '@/services/api.service';
import { ProcessResponse } from '@/types/process.types';
import { toast } from 'sonner';

export function useProcesses() { 
  const [processes, setProcesses] = useState<ProcessResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProcesses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await processService.getAll();
      const sortedData = response.data.sort((a, b) => a.stepNumber - b.stepNumber);
      setProcesses(sortedData);
    } catch (error) {
      toast.error('Erro ao buscar as etapas do processo', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  return {
    processes,
    loading,
    fetchProcesses,
  };
}
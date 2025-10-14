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
      const data = await processService.getAll();
      setProcesses(data.data);
    } catch (error) {
      toast.error('Error fetching process steps', {
        description: error instanceof Error ? error.message : String(error),
      });
      setProcesses([]);
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
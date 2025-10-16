'use client';

import { useState, useEffect, useCallback } from 'react';
import { relationshipService } from '@/services/api.service';
import { MetersOnProcessesResponse } from '@/types/relationship.types';
import { toast } from 'sonner';

export function useProcessInputs(processId: string) {
  const [inputs, setInputs] = useState<MetersOnProcessesResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInputs = useCallback(async () => {
    if (!processId) { /* ... */ }

    try {
      setLoading(true);
      // 1. Busca TODOS os relacionamentos
      const allRelationships = await relationshipService.getAllMetersOnProcesses();

      // 2. Filtra no frontend pelo ID do processo atual
      const filteredInputs = allRelationships.filter(rel => rel.processId === processId);

      setInputs(filteredInputs);
    } catch (error) {
      // ... (tratamento de erro)
    } finally {
      setLoading(false);
    }
  }, [processId]);

  useEffect(() => {
    fetchInputs();
  }, [fetchInputs]);

  return { inputs, loading, fetchInputs };
}
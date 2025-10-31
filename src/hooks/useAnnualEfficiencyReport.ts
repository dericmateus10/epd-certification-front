'use client';

import { useState, useEffect, useCallback } from 'react';
import { reportService } from '@/services/api.service';
import { AnnualEfficiencyReportDto } from '@/types/reports.types';
import { toast } from 'sonner';

export function useAnnualEfficiencyReport(processId: string, year: number) {
  const [data, setData] = useState<AnnualEfficiencyReportDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    // Não busca se os parâmetros não estiverem prontos
    if (!processId || !year) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const reportData = await reportService.getAnnualEfficiencyReport(year, processId);
      setData(reportData);
    } catch (error) {
      toast.error('Error fetching annual efficiency report', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [processId, year]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    data,
    loading,
  };
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/api.service';
import { QualityHoursResponse } from '@/types/quality-hours.types';
import { toast } from 'sonner';

export function useQualityHoursReport(productId: string) {
  const [reportData, setReportData] = useState<QualityHoursResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await productService.getQualityHoursReport(productId);
      setReportData(data);
    } catch (error) {
      toast.error('Error fetching quality hours report', {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    reportData,
    loading,
  };
}
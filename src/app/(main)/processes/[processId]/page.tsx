"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAnnualEfficiencyReport } from "@/hooks/useAnnualEfficiencyReport";
import { useProcess } from "@/hooks/useProcess";

export default function ProcessDetailPage() {
  const params = useParams();
  const { processId } = params;

  const { process, loading: isProcessLoading } = useProcess(
    processId as string,
  );

  const reportYear = 2024;

  const { data: reportData, loading: isReportLoading } =
    useAnnualEfficiencyReport(processId as string, reportYear);

  const isLoading = isProcessLoading || isReportLoading;

  const annualAverageEnergyPerHour = useMemo(() => {
    if (!reportData || reportData.length === 0) {
      return 0;
    }

    // Soma todos os valores de 'energyPerHour' (tratando nulos)
    const sum = reportData.reduce(
      (acc, current) => acc + (current.energyPerHour || 0),
      0,
    );

    // Retorna a média
    return sum / reportData.length;
  }, [reportData]);

  const chartData = useMemo(() => {
    return reportData.map((item) => ({
      month: new Date(item.month + "-02").toLocaleString("default", {
        month: "short",
      }),
      "Energy per Hour": item.energyPerHour,
    }));
  }, [reportData]);

  if (isLoading) {
    return <div>Carregando detalhes do processo...</div>;
  }

  if (!process) {
    return <PageHeader title="Erro" subtitle="Processo não encontrado." />;
  }

  return (
    <div>
      <PageHeader
        title={`${process.stepNumber}. ${process.name}`}
        subtitle={`Annual Report for ${reportYear}`}
      />

      {/* 3. ADICIONAMOS O CARD DA MÉDIA AQUI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <StatCard
          title="Annual Avg. Energy Efficiency"
          value={`${annualAverageEnergyPerHour.toFixed(2)} kWh/h`}
          description={`Average energy consumed per hour in ${reportYear}`}
        />
      </div>

      {/* 4. O GRÁFICO FICA NA PARTE INFERIOR, COMO SOLICITADO */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Energy Efficiency (kWh / Hour)</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length > 0 ? (
            <ChartContainer config={{}} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    label={{
                      value: "Energy per Hour (kWh/h)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="Energy per Hour"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey="Energy per Hour"
                      position="top"
                      formatter={(value: number) => value.toFixed(2)}
                      fontSize={18}
                      fill="var(--color-foreground)"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">
                No data available to display the chart.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

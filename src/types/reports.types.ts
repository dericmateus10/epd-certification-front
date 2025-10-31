export interface AnnualEfficiencyReportDto {
  processId: string;
  stepNumber: number;
  month: string; // Formato "YYYY-MM"
  totalHours: number;
  totalEnergy: number;
  energyPerHour: number | null;
}
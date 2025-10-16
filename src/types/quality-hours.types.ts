export interface QualityHoursResponse {
  productId: string;
  productCode: string;
  productDescription: string;
  operationDescription: string | null;
  workCenterCode: string | null;
  workCenterDescription: string | null;
  costCenterCode: string | null;
  costCenterDescription: string | null;
  materialCode: string | null;
  materialDescription: string | null;
  isPrimary: boolean;
  setupOperatorHoursApi: number;
  machineHoursApi: number;
  operatorHoursApi: number;
  setupMachineHoursApi: number;
}
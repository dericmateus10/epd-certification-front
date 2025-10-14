export interface RoutingResponse {
  id: string;
  materialCode: string | null;
  materialDescription: string | null;
  operationNumber: string | null;
  workCenterCode: string | null;
  description: string | null;
  baseQuantity: number;
  setupMachine: number;
  setupOperator: number;
  machineHours: number;
  operatorHours: number;
  routingGroup: string | null;
  groupCounter: string | null;
  employeeCount: number | null;
  isPrimary: boolean;
  productId: string;
  workCenterId: string | null;
}
export interface MetersOnProcessesResponse {
  id: string;
  processId: string;
  meterId: string;
  allocationFactor: number;
  createdAt: string;
  updatedAt: string;
  process: {
    id: string;
    stepNumber: number;
    name: string;
  };
  meter: {
    id: string;
    code: string;
    unit: string;
    section: string;
  };
}
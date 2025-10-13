export interface ProcessResponse {
  id: string;
  stepNumber: number;
  name: string;
  description?: string;
  // O restante dos campos é opcional para a navegação
  createdAt: string;
  updatedAt: string;
}
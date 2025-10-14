export interface ComponentResponse {
  id: string;
  explosionLevel: number;
  itemNumber: string;
  componentName: string;
  componentDescription: string | null;
  quantity: number;
  unit: string | null;
  massFactor: number | null;
  productId: string;
  parentId: string | null;
  createdAt: string; // JSON serializa Datas como strings
}
export interface ProductResponse {
  id: string;
  productCode: string;
  productDescription?: string;
  createdAt: string;
  updatedAt: string;
  // O campo 'components' é opcional e não usaremos na listagem inicial
}

export interface CreateProductDto {
  productCode: string;
}

export interface UpdateProductDto {
  productCode?: string;
  productDescription?: string;
}
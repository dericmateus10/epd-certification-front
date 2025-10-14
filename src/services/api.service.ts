import { AuthResponseDto, LoginDto, UserResponseDto } from "@/types/auth.types";
import { ProductResponse, UpdateProductDto } from "@/types/product.types";
import { PaginatedResponse } from "@/types/api.types"; 
import { ProcessResponse } from "@/types/process.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: any;
};

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('epd_auth_token') : null;

  const isFormData = options.body instanceof FormData;

  // Normaliza headers para objeto simples
  let headersObj: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      for (const [key, value] of options.headers) {
        headersObj[key] = value;
      }
    } else {
      headersObj = { ...(options.headers as Record<string, string>) };
    }
  }

  if (token) {
    headersObj['Authorization'] = `Bearer ${token}`;
  }

  // Define o Content-Type apenas se não for FormData e se ainda não estiver definido
  if (!isFormData && !('Content-Type' in headersObj)) {
    headersObj['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers: headersObj,
    // Garante que o body seja stringified apenas quando necessário
    body: isFormData
      ? options.body
      : typeof options.body === 'string'
        ? options.body
        : options.body != null
          ? JSON.stringify(options.body)
          : undefined,
  };

  // GET e HEAD não podem ter body
  if (config.method === 'GET' || config.method === 'HEAD') {
    delete config.body;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
    throw new Error(errorMessage || 'An error occurred while making the request.');
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// --- Serviço de Processos ---
export const processService = {
  // MUDANÇA AQUI: Atualize o tipo de retorno
  getAll: (): Promise<PaginatedResponse<ProcessResponse>> => {
    return apiRequest('/processes?limit=100');
  },

  getById: (id: string): Promise<ProcessResponse> => {
    return apiRequest(`/processes/${id}`);
  },
};

// --- Serviço de Autenticação ---
export const authService = {
  login: (data: LoginDto): Promise<AuthResponseDto> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: data,
    });
  },
  getMe: (): Promise<UserResponseDto> => {
    return apiRequest('/auth/me');
  },
};

// --- Serviço de Produtos ---
export const productService = {
  getAll: (): Promise<PaginatedResponse<ProductResponse>> => {
    return apiRequest('/products');
  },
  // MUDANÇA AQUI: Substituímos a função 'create'
  importByCode: (productCode: string): Promise<ProductResponse> => {
    // Faz um POST para a nova rota, sem corpo (body)
    return apiRequest(`/import/product/${productCode}`, {
      method: 'POST', 
    });
  },
  update: (id: string, data: UpdateProductDto): Promise<ProductResponse> => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  delete: (id: string): Promise<void> => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // NOVA FUNÇÃO: Obter códigos dos componentes
  getDistinctComponentCodes: (productCode: string): Promise<string[]> => {
    return apiRequest(`/products/${productCode}/distinct-component-codes`, {
      method: 'GET',
    });
  },

  // NOVA FUNÇÃO: Importar roteiro via arquivo
  importRouting: (productCode: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiRequest(`/routings/import/product/${productCode}`, {
      method: 'POST',
      body: formData,
    });
  },


};
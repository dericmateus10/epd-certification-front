import { AuthResponseDto, UserResponseDto } from "@/types/auth.types"; // LoginDto removido, não é mais usado
import { ProductResponse, UpdateProductDto } from "@/types/product.types";
import { PaginatedResponse } from "@/types/api.types";
import { ProcessResponse } from "@/types/process.types";
import { ComponentResponse } from "@/types/component.types";
import { RoutingResponse } from "@/types/routing.types";
import { MetersOnProcessesResponse } from "@/types/relationship.types";
import { QualityHoursResponse } from "@/types/quality-hours.types";

// Garanta que esta variável esteja definida corretamente no seu .env.local
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// Tipo customizado para as opções, permitindo 'any' no body para simplificar
type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: any;
};

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  // REMOVIDO: Lógica do token JWT do localStorage não é mais necessária com cookies httpOnly
  // const token = typeof window !== 'undefined' ? localStorage.getItem('epd_auth_token') : null;

  console.log("API Request BASE_URL:", BASE_URL);

  const isFormData = options.body instanceof FormData;

  // Normaliza headers para objeto simples
  let headersObj: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => { headersObj[key] = value; });
    } else if (Array.isArray(options.headers)) {
      for (const [key, value] of options.headers) { headersObj[key] = value; }
    } else {
      headersObj = { ...(options.headers as Record<string, string>) };
    }
  }

  // REMOVIDO: Header Authorization não é mais necessário
  // if (token) {
  //   headersObj['Authorization'] = `Bearer ${token}`;
  // }

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
    // ESSENCIAL: Envia o cookie httpOnly cross-origin
    credentials: 'include',
  };

  // GET e HEAD não podem ter body
  if (config.method === 'GET' || config.method === 'HEAD') {
    delete config.body;
  }

  // Verifica se BASE_URL está definido para evitar erros
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      // Se a resposta de erro não for JSON, lança um erro genérico
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
    throw new Error(errorMessage || 'An error occurred while making the request.');
  }

  // Trata respostas sem conteúdo
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

  // Tenta parsear JSON, mas trata caso não seja JSON
  try {
    return await response.json() as Promise<T>;
  } catch (jsonError) {
    console.error("Failed to parse JSON response:", jsonError);
    throw new Error("Received non-JSON response from server.");
  }
}

// --- Serviço de Relacionamentos ---
export const relationshipService = {
  getAllMetersOnProcesses: (): Promise<MetersOnProcessesResponse[]> => {
    return apiRequest(`/relationships/meters-processes`);
  },
};

// --- Serviço de Processos ---
export const processService = {
  getAll: (): Promise<PaginatedResponse<ProcessResponse>> => {
    return apiRequest('/processes?limit=100');
  },
  getById: (id: string): Promise<ProcessResponse> => {
    return apiRequest(`/processes/${id}`);
  },
};

// --- Serviço de Autenticação ---
export const authService = {
  // REMOVIDO: Função login não é mais usada no fluxo SSO
  // login: (data: LoginDto): Promise<AuthResponseDto> => { ... },

  // ESSENCIAL: Verifica se o cookie de sessão é válido
  getMe: (): Promise<UserResponseDto> => {
    return apiRequest('/auth/me');
  },
};

// --- Serviço de Produtos ---
export const productService = {
  getAll: (): Promise<PaginatedResponse<ProductResponse>> => {
    return apiRequest('/products?limit=100'); // Adicionado limit=100 por padrão
  },
  getById: (productId: string): Promise<ProductResponse> => {
    return apiRequest(`/products/${productId}`);
  },
  getQualityHoursReport: (productId: string): Promise<QualityHoursResponse[]> => {
    return apiRequest(`/products/${productId}/quality-hours-report`);
  },
  importByCode: (productCode: string): Promise<ProductResponse> => {
    return apiRequest(`/import/product/${productCode}`, { method: 'POST' });
  },
  update: (id: string, data: UpdateProductDto): Promise<ProductResponse> => {
    return apiRequest(`/products/${id}`, { method: 'PUT', body: data });
  },
  delete: (id: string): Promise<void> => {
    return apiRequest(`/products/${id}`, { method: 'DELETE' });
  },
  findRoutingsByProductId: (productId: string): Promise<RoutingResponse[]> => {
    return apiRequest(`/products/${productId}/routings`);
  },
  getDistinctComponentCodes: (productCode: string): Promise<string[]> => {
    // Atenção: Esta rota ainda usa productCode conforme definido anteriormente.
    // Se o backend padronizar para ID, precisará ser ajustada aqui.
    return apiRequest(`/products/${productCode}/distinct-component-codes`, { method: 'GET' });
  },
  importRouting: (productCode: string, file: File): Promise<any> => {
    // Atenção: Esta rota ainda usa productCode. Se padronizar para ID, ajustar aqui.
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest(`/routings/import/product/${productCode}`, { method: 'POST', body: formData });
  },
};

// --- Serviço de Componentes ---
export const componentService = {
  // Atenção: Esta rota usa productId conforme definido anteriormente.
  findAllByProduct: (productId: string): Promise<ComponentResponse[]> => {
    return apiRequest(`/components/product/${productId}`);
  },
};
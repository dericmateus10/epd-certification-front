import { AuthResponseDto, UserResponseDto } from "@/types/auth.types";
import { ProductResponse, UpdateProductDto } from "@/types/product.types";
import { PaginatedResponse } from "@/types/api.types";
import { ProcessResponse } from "@/types/process.types";
import { ComponentResponse } from "@/types/component.types";
import { RoutingResponse } from "@/types/routing.types";
import { MetersOnProcessesResponse } from "@/types/relationship.types";
import { QualityHoursResponse } from "@/types/quality-hours.types";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: any;
};

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {

  console.log("API Request BASE_URL:", BASE_URL);

  const isFormData = options.body instanceof FormData;

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

  if (!isFormData && !('Content-Type' in headersObj)) {
    headersObj['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers: headersObj,
    body: isFormData
      ? options.body
      : typeof options.body === 'string'
        ? options.body
        : options.body != null
          ? JSON.stringify(options.body)
          : undefined,
    credentials: 'include',
  };

  if (config.method === 'GET' || config.method === 'HEAD') {
    delete config.body;
  }

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set.");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData: ErrorResponse;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
    throw new Error(errorMessage || 'An error occurred while making the request.');
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null as T;
  }

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
  getMe: (): Promise<UserResponseDto> => {
    return apiRequest('/auth/me');
  },
};

// --- Serviço de Produtos ---
export const productService = {
  getAll: (): Promise<PaginatedResponse<ProductResponse>> => {
    return apiRequest('/products?limit=100');
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
    return apiRequest(`/products/${productCode}/distinct-component-codes`, { method: 'GET' });
  },
  importRouting: (productCode: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest(`/routings/import/product/${productCode}`, { method: 'POST', body: formData });
  },
};

// --- Serviço de Componentes ---
export const componentService = {
  findAllByProduct: (productId: string): Promise<ComponentResponse[]> => {
    return apiRequest(`/components/product/${productId}`);
  },
};
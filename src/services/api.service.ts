import { AuthResponseDto, LoginDto, UserResponseDto } from "@/types/auth.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('epd_auth_token') : null;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: defaultHeaders,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    const errorMessage = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : errorData.message;
    throw new Error(errorMessage || 'Ocorreu um erro na requisição.');
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// --- Serviço de Autenticação ---
export const authService = {
  login: (data: LoginDto): Promise<AuthResponseDto> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getMe: (): Promise<UserResponseDto> => {
    return apiRequest('/auth/me');
  },
};
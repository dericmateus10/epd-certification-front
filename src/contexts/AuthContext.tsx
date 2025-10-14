'use client'; // Essencial para indicar que este é um Client Component

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api.service';
import { UserResponseDto, LoginDto, AuthResponseDto } from '@/types/auth.types';

// 1. Define a "forma" do nosso contexto
interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}

// 2. Cria o Contexto com um valor inicial indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Cria o Provedor (o componente que vai gerenciar o estado)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para verificar o token

  // Este useEffect roda uma vez quando o app carrega
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('epd_auth_token');
      if (token) {
        try {
          // Se temos um token, tentamos buscar os dados do usuário
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          // Se o token for inválido, o getMe() falha. Limpamos o token.
          console.error("Invalid session:", error);
          localStorage.removeItem('epd_auth_token');
          setUser(null);
        }
      }
      setIsLoading(false); // Finaliza o carregamento inicial
    };

    validateToken();
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('epd_auth_token', response.access_token);
      // Após o login, buscamos os dados completos do usuário
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      // Re-lança o erro para que o formulário de login possa tratá-lo (ex: mostrar um toast)
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('epd_auth_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // Converte o objeto user em um booleano
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Cria um Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
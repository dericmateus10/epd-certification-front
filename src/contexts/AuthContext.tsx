// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api.service';
import { UserResponseDto } from '@/types/auth.types';

// 1. A "forma" do contexto mudou (sem login/logout explícitos aqui)
interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>; // Função para revalidar
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para verificar se o cookie de sessão é válido
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // A chamada ao /auth/me SÓ funcionará se o cookie httpOnly for válido.
      // A opção 'credentials: include' no apiRequest garante que o cookie seja enviado.
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      // Se a chamada falhar (ex: 401 Unauthorized), significa que não há sessão válida.
      console.warn("Verificação de sessão falhou:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Roda uma vez quando o provider é montado
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // O logout agora é responsabilidade do backend invalidar o cookie.
  // Poderíamos adicionar uma chamada a um endpoint /auth/logout se ele existir.
  // Por enquanto, apenas limpamos o estado local.
  const logout = () => {
    // Idealmente, chamar um endpoint do backend aqui: POST /auth/logout
    setUser(null);
    // Redirecionar para a página pública ou de login, se necessário
    window.location.href = '/login'; // Ou use o useRouter se preferir
  };


  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    checkAuthStatus,
    // Poderíamos expor a função logout se necessário em outros lugares
    // logout, 
  };

  // Removemos a necessidade de gerenciar o token no localStorage
  // if (typeof window !== 'undefined') {
  //   if (value.isAuthenticated) {
  //     // Não precisamos mais salvar o token aqui
  //   } else {
  //     localStorage.removeItem('epd_auth_token'); // Limpa se houver token antigo
  //   }
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
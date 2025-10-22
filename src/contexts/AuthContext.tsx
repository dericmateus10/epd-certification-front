'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api.service';
import { UserResponseDto } from '@/types/auth.types';

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  logout: () => void; // Adicionando logout de volta para uso
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    // Não precisa setar isLoading aqui, pois o estado inicial já é true
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      // Apenas loga o erro se falhar (ex: cookie inválido ou ausente)
      console.warn("Auth status check failed (user likely not logged in):", error);
      setUser(null);
    } finally {
       // Só finaliza o loading global uma vez, após a primeira tentativa
       if (isLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Roda apenas uma vez na montagem inicial

  const logout = async () => {
    setUser(null);
    // Idealmente, chamar um endpoint do backend que limpa o cookie httpOnly
    // Exemplo: await apiRequest('/auth/logout', { method: 'POST' });
    
    // Redireciona para a página pública/login após limpar estado local
    // (Pode ser melhor usar o useRouter para navegação no Next.js)
    window.location.href = '/login'; 
  };


  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    checkAuthStatus,
    logout,
  };

  // NENHUMA interação com localStorage aqui!

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
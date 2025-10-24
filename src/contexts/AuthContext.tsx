'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api.service';
import { UserResponseDto } from '@/types/auth.types';

interface AuthContextType {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  logout: () => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      console.warn("Auth status check failed (user likely not logged in):", error);
      setUser(null);
    } finally {
       if (isLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const logout = async () => {
    setUser(null); // Limpa o estado local imediatamente para a UI responder

    try {
      // Chama o backend para limpar o cookie httpOnly
      await authService.logout();
      console.log("Backend logout successful");
    } catch (error) {
      // Loga o erro, mas continua o fluxo de redirecionamento
      console.error("Backend logout failed:", error);
    } finally {
      // Redireciona para a página de login do frontend após a tentativa de logout no backend
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    checkAuthStatus,
    logout,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProcessResponse } from '@/types/process.types';
import { useProcesses } from '@/hooks/useProcesses';
import Link from 'next/link'; // Importe o componente Link
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes'

// Componente de Carregamento (Spinner)
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

function Sidebar({ processes, isLoading }: { processes: ProcessResponse[]; isLoading: boolean }) {
  const { logout } = useAuth(); // 1. Pegue a função logout do contexto
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <aside className="w-72 bg-sidebar text-sidebar-foreground p-4 flex flex-col shadow-lg border-r border-sidebar-border">
      {/* 1. Cabeçalho de Branding */}
      <div className="px-2 pb-4 mb-4 border-b border-sidebar-border flex items-center justify-between">
        <h1 className="text-xl font-bold">EPD Certification</h1>
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </Button>
      </div>
      {/* 2. Título da Seção de Navegação */}
      <h2 className="text-lg font-semibold mb-4 px-2">Manufacturing Steps</h2>
      
      {/* 3. Lista de Navegação Principal */}
      <nav className="flex-1 space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground px-2">Loading steps...</p>
        ) : (
          <ul>
            {processes.map((process) => (
              <li key={process.id}>
                <Link
                  // O href aponta para a rota dinâmica usando o ID do processo
                  href={`/processes/${process.id}`}
                  className="w-full block p-2 rounded-md hover:bg-sidebar-accent transition-colors text-sm"
                >
                  {/* O texto é formatado para remover underscores */}
                  {`${process.stepNumber}. ${process.name.replace(/_/g, ' ')}`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
      
      {/* 4. Seção de Gerenciamento */}
      <div>
        <h3 className="text-lg font-semibold mb-2 border-t border-sidebar-border pt-4 px-2">Management</h3>
        <ul>
          <li>
            <Link 
              href="/products" 
              className="w-full block p-2 rounded-md hover:bg-sidebar-accent transition-colors text-sm"
            >
              Materials
            </Link>
          </li>
        </ul>
      </div>
      {/* 2. BOTÃO DE LOGOUT: Adicione este bloco no final do sidebar */}
      <div className="mt-auto pt-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={logout} // 3. Chame a função logout ao clicar
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // 2. Use o hook para buscar os processos e seu estado de carregamento
  const { processes, loading: areProcessesLoading } = useProcesses();

  useEffect(() => {
    // Evita empurrar para /login se já estamos na própria rota de login
    if (!isAuthLoading && !isAuthenticated) {
      if (pathname !== '/login') {
        router.replace('/login');
      }
    }
    // A lógica de fetchProcesses foi movida para dentro do hook, então não é mais necessária aqui.
  }, [isAuthLoading, isAuthenticated, router, pathname]);

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen">
        {/* 3. Passe os dados reais e o estado de carregamento para o Sidebar */}
        <Sidebar processes={processes} isLoading={areProcessesLoading} />
        <main className="flex-1 p-8 bg-background overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return null;
}
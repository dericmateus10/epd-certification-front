"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProcessResponse } from '@/types/process.types';
import { useProcesses } from '@/hooks/useProcesses';
import Link from 'next/link'; // Importe o componente Link

// Componente de Carregamento (Spinner)
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

function Sidebar({ processes, isLoading }: { processes: ProcessResponse[]; isLoading: boolean }) {
  return (
    <aside className="w-72 bg-gray-900 text-white p-4 flex flex-col shadow-lg">
      {/* 1. Cabeçalho de Branding */}
      <div className="px-2 pb-4 mb-4 border-b border-gray-600">
        <h1 className="text-xl font-bold">EPD Certification</h1>
      </div>

      {/* 2. Título da Seção de Navegação */}
      <h2 className="text-lg font-semibold mb-4 px-2">Manufacturing Steps</h2>
      
      {/* 3. Lista de Navegação Principal */}
      <nav className="flex-1 space-y-2">
        {isLoading ? (
          <p className="text-sm text-gray-400 px-2">Loading steps...</p>
        ) : (
          <ul>
            {processes.map((process) => (
              <li key={process.id}>
                <Link
                  // O href aponta para a rota dinâmica usando o ID do processo
                  href={`/processes/${process.id}`}
                  className="w-full block p-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
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
        <h3 className="text-lg font-semibold mb-2 border-t border-gray-600 pt-4 px-2">Management</h3>
        <ul>
          <li>
            <Link 
              href="/products" 
              className="w-full block p-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Materials
            </Link>
          </li>
        </ul>
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
        <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return null;
}
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProcessResponse } from '@/types/process.types';
import Link from 'next/link'; // Importe o componente Link

// Componente de Carregamento (Spinner)
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Componente do Menu Lateral
function Sidebar({ processes }: { processes: ProcessResponse[] }) {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Etapas de Manufatura</h2>
      <nav className="flex-1">
        <ul>
          {processes.map((process) => (
            <li key={process.id} className="mb-2">
              <a href="#" className="hover:text-gray-300">
                {process.stepNumber}. {process.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Adicionando o menu de gerenciamento */}
      <div>
        <h3 className="text-lg font-semibold mb-2 border-t border-gray-700 pt-4">Gerenciamento</h3>
        <ul>
          <li className="mb-2">
            <Link href="/products" className="hover:text-gray-300">
              Produtos
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [processes, setProcesses] = useState<ProcessResponse[]>([]);

  useEffect(() => {
    // 1. Lógica de Proteção de Rota
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    // 2. Busca dos dados para o menu
    async function fetchProcesses() {
      // ATENÇÃO: Por enquanto, vamos usar dados mocados (falsos).
      // A chamada real à API será feita em um hook customizado mais tarde.
      const mockProcesses: ProcessResponse[] = [
        { id: '1', stepNumber: 1, name: 'Extrusão', createdAt: '', updatedAt: '' },
        { id: '2', stepNumber: 2, name: 'Laminação', createdAt: '', updatedAt: '' },
        { id: '3', stepNumber: 3, name: 'Corte', createdAt: '', updatedAt: '' },
        { id: '4', stepNumber: 4, name: 'Acabamento', createdAt: '', updatedAt: '' },
      ];
      setProcesses(mockProcesses);
    }

    if (isAuthenticated) {
      fetchProcesses();
    }
  }, [isLoading, isAuthenticated, router]);

  // Enquanto verifica a autenticação, mostra um spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Se estiver autenticado, mostra o layout principal
  if (isAuthenticated) {
    return (
      <div className="flex h-screen">
        <Sidebar processes={processes} />
        <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  // Retorna nulo enquanto redireciona para evitar piscar de tela
  return null;
}
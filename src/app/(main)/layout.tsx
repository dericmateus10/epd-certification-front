// src/app/(main)/layout.tsx
'use client';

// Imports de Hooks
import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Apenas o useAuth
import { useProcesses } from '@/hooks/useProcesses'; // 1. IMPORTAMOS O useProcesses AQUI
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

// Imports de Tipos
import { ProcessResponse } from '@/types/process.types';

// Imports de Componentes e Ícones
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  PanelLeftClose, PanelLeftOpen, ChevronDown, ChevronRight, Search,
  ListTree, Settings, LogOut, Moon, Sun
} from 'lucide-react';

// --- COMPONENTE SPINNER ---
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

// --- COMPONENTE SIDEBAR ---
// A Sidebar volta a receber 'processes' e 'isLoading' como props
function Sidebar({ processes, isLoading }: { processes: ProcessResponse[]; isLoading: boolean }) {
  const { user, logout } = useAuth(); // Pegamos user/logout do Auth
  const { setTheme, theme } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManufacturingOpen, setIsManufacturingOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProcesses = useMemo(() => {
    if (!searchTerm) return processes;
    return processes.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.stepNumber).includes(searchTerm)
    );
  }, [processes, searchTerm]);

  const mainMenus = [
    { key: 'manufacturing', name: 'Manufacturing Steps', icon: ListTree, children: filteredProcesses },
    { key: 'management', name: 'Management', icon: Settings, href: '/products', children: [] },
  ];

  const getUserInitials = (name: string | undefined): string => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <aside
      className={`
        bg-card text-card-foreground p-3 flex flex-col shadow-lg border-r border-border
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20 items-center' : 'w-72'}
      `}
    >
      {/* 1. Cabeçalho com Logo e Botão de Colapso */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} pb-4 mb-4 border-b border-border`}>
        {!isCollapsed && <h1 className="text-xl font-bold ml-2">EPD</h1>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      </div>

      {/* 2. Barra de Busca */}
      {!isCollapsed && (
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* 3. Navegação Principal */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {mainMenus.map((menu) => (
          menu.key === 'manufacturing' ? (
            <Collapsible key={menu.key} open={isManufacturingOpen} onOpenChange={setIsManufacturingOpen} className="space-y-1">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}>
                  <menu.icon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
                  {!isCollapsed && <span>{menu.name}</span>}
                  {!isCollapsed && (isManufacturingOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />)}
                </Button>
              </CollapsibleTrigger>
              {!isCollapsed && (
                <CollapsibleContent className="pl-6 space-y-1">
                  {/* Usamos o 'isLoading' que veio das props */}
                  {isLoading ? (
                    <p className="text-xs text-muted-foreground py-2">Loading steps...</p>
                  ) : (
                    filteredProcesses.map((process) => (
                      <Link
                        key={process.id}
                        href={`/processes/${process.id}`}
                        className="w-full flex items-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                        title={`${process.stepNumber}. ${process.name.replace(/_/g, ' ')}`}
                      >
                         <span className='truncate'>{`${process.stepNumber}. ${process.name.replace(/_/g, ' ')}`}</span>
                      </Link>
                    ))
                  )}
                  {!isLoading && filteredProcesses.length === 0 && searchTerm && (
                     <p className="text-xs text-muted-foreground py-2 text-center">No steps found.</p>
                  )}
                </CollapsibleContent>
              )}
            </Collapsible>
          ) : (
            <Link key={menu.key} href={menu.href || '#'} title={menu.name}>
              <Button variant="ghost" className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}>
                <menu.icon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
                {!isCollapsed && <span>{menu.name}</span>}
              </Button>
            </Link>
          )
        ))}
      </nav>

      {/* 4. Rodapé com Perfil e Logout */}
      <div className={`mt-auto pt-4 border-t border-border ${isCollapsed ? 'space-y-2' : ''}`}>
        <Button
            variant="ghost"
            className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? ( <Sun className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} /> ) : ( <Moon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} /> )}
            {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'p-2'}`}>
           <Avatar className="h-8 w-8">
             <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
           </Avatar>
           {!isCollapsed && (
             <div className='ml-2 text-sm truncate'>
               <p className='font-medium'>{user?.name}</p>
               <p className='text-muted-foreground text-xs'>{user?.email}</p>
             </div>
           )}
        </div>
        <Button
          variant="ghost"
          className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
          onClick={logout}
          title="Logout"
        >
          <LogOut className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

// --- COMPONENTE MAINLAYOUT ---
export default function MainLayout({ children }: { children: React.ReactNode }) {
  // 1. O Layout protegido pega o status de autenticação
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  
  // 2. O Layout protegido chama o hook para buscar os dados DA SIDEBAR
  const { processes, loading: areProcessesLoading } = useProcesses();

  // 3. Efeito de Proteção de Rota
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // Enquanto o AuthContext verifica a sessão, mostramos um spinner
  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  // Se estiver autenticado, renderiza o layout com a sidebar
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-background">
        {/* 4. Passa os dados dos processos para a Sidebar */}
        <Sidebar processes={processes} isLoading={areProcessesLoading} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  // Se não estiver autenticado (e não estiver carregando), retorna nulo (e o useEffect redireciona)
  return null;
}
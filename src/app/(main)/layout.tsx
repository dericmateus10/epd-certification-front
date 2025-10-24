"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { ProcessResponse } from '@/types/process.types';
import { useProcesses } from '@/hooks/useProcesses';
import Link from 'next/link'; // Importe o componente Link
import { Button } from '@/components/ui/button';
import { LogOut, Sun, Moon, ChevronDown, ChevronRight, ListTree, Settings, PanelLeftOpen, PanelLeftClose, Search } from 'lucide-react';
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

// Componente de Carregamento (Spinner)
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-foreground"></div>
    </div>
  );
}

function Sidebar({ processes, isLoading }: { processes: ProcessResponse[]; isLoading: boolean }) {
  const { user, logout } = useAuth(); // Pegamos o 'user' para o perfil
  const { setTheme, theme } = useTheme(); // Para o botão de tema

  // Estado para controlar se a sidebar está colapsada
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Estado para controlar se o submenu Manufacturing está aberto
  const [isManufacturingOpen, setIsManufacturingOpen] = useState(true); // Começa aberto
  // Estado para o termo de busca
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra os processos baseado no searchTerm (otimizado com useMemo)
  const filteredProcesses = useMemo(() => {
    if (!searchTerm) {
      return processes;
    }
    return processes.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.stepNumber).includes(searchTerm)
    );
  }, [processes, searchTerm]);

  // Filtra os menus principais (exemplo simples)
  const mainMenus = [
    // Definimos nossos menus aqui para facilitar a filtragem
    { key: 'manufacturing', name: 'Manufacturing Steps', icon: ListTree, children: filteredProcesses },
    { key: 'management', name: 'Management', icon: Settings, href: '/products', children: [] }, // Exemplo, adicione mais se precisar
  ].filter(menu => menu.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Função para pegar as iniciais do nome do usuário
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

      {/* 2. Barra de Busca (visível apenas quando expandido) */}
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
            // Submenu Colapsável para Manufacturing Steps
            <Collapsible key={menu.key} open={isManufacturingOpen} onOpenChange={setIsManufacturingOpen} className="space-y-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <menu.icon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
                  {!isCollapsed && <span>{menu.name}</span>}
                  {!isCollapsed && (isManufacturingOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />)}
                </Button>
              </CollapsibleTrigger>
              {!isCollapsed && (
                <CollapsibleContent className="pl-6 space-y-1">
                  {isLoading ? (
                    <p className="text-xs text-muted-foreground py-2">Loading steps...</p>
                  ) : (
                    menu.children.map((process) => (
                      <Link
                        key={process.id}
                        href={`/processes/${process.id}`}
                        className="w-full flex items-center p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                        title={`${process.stepNumber}. ${process.name.replace(/_/g, ' ')}`} // Tooltip para nome completo
                      >
                         {/* Poderia adicionar um ícone genérico aqui se quisesse */}
                         <span className='truncate'>{`${process.stepNumber}. ${process.name.replace(/_/g, ' ')}`}</span>
                      </Link>
                    ))
                  )}
                  {/* Mensagem se o filtro não encontrar nada */}
                  {!isLoading && menu.children.length === 0 && searchTerm && (
                     <p className="text-xs text-muted-foreground py-2 text-center">No steps found.</p>
                  )}
                </CollapsibleContent>
              )}
            </Collapsible>
          ) : (
            // Item de Menu Normal (Ex: Management/Products)
            <Link key={menu.key} href={menu.href || '#'} title={menu.name}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <menu.icon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} />
                {!isCollapsed && <span>{menu.name}</span>}
              </Button>
            </Link>
          )
        ))}
      </nav>

      {/* 4. Rodapé com Perfil e Logout */}
      <div className={`mt-auto pt-4 border-t border-border ${isCollapsed ? 'space-y-2' : ''}`}>
        {/* Botão de Tema (Opcional) */}
        <Button
            variant="ghost"
            className={`w-full justify-start ${isCollapsed ? 'justify-center px-0' : ''}`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? ( <Sun className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} /> ) : ( <Moon className={`h-5 w-5 ${!isCollapsed ? 'mr-2' : ''}`} /> )}
            {!isCollapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>
        {/* Perfil do Usuário */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'p-2'}`}>
           <Avatar className="h-8 w-8">
             {/* <AvatarImage src={user?.avatarUrl} alt={user?.name} /> */}
             <AvatarFallback>{getUserInitials(user?.name)}</AvatarFallback>
           </Avatar>
           {!isCollapsed && (
             <div className='ml-2 text-sm truncate'>
               <p className='font-medium'>{user?.name}</p>
               <p className='text-muted-foreground text-xs'>{user?.email}</p>
             </div>
           )}
        </div>
        {/* Botão de Logout */}
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Componente de Página (pode ser Server Component, pois não tem estado complexo)
export default function LoginPage() {
  return (
    <div className="flex h-screen items-stretch">
      {/* Coluna Esquerda: Conteúdo */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-background text-foreground">
        <div className="w-full max-w-xs text-center lg:text-left">
          {/* Você pode adicionar sua logo aqui */}
          {/* <img src="/logo.png" alt="Logo" className="h-12 mx-auto lg:mx-0 mb-4" /> */}
          
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Environmental Product Declaration
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with your WEG username and password
          </p>
          
          {/* Botão que leva para a rota de início do SSO */}
          <Button asChild className="w-full">
            <Link href="/initiate-sso">SIGN IN</Link>
          </Button>
        </div>
        <p className="absolute bottom-4 text-xs text-muted-foreground">
          Copyright © WEG {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>

      {/* Coluna Direita: Imagem (Placeholder) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-muted p-16">
        {/* Adicione a sua imagem de ilustração aqui */}
        {/* Idealmente, use o componente <Image> do Next.js */}
        {/* <Image src="/path/to/your/illustration.svg" alt="Illustration" width={500} height={500} /> */}
        <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center text-muted-foreground">
          Illustration Placeholder
        </div>
      </div>
    </div>
  );
}
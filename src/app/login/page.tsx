import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex h-screen items-stretch">
      {/* Coluna Esquerda: Conteúdo */}
      {/* MUDANÇA AQUI: Alterando a largura em telas grandes para 1/3 */}
      <div className="w-full lg:w-1/3 flex flex-col items-center justify-center p-8 lg:p-16 bg-background text-foreground relative">
        <div className="w-full max-w-xs text-center lg:text-left">
          {/* Logo Opcional */}
          {/* <Image src="/weg-logo.svg" alt="WEG Logo" width={100} height={40} className="mb-4 mx-auto lg:mx-0" /> */}
          
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Environmental Product Declaration
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in with your WEG username and password
          </p>
          
          <Button asChild className="w-full">
            <Link href="/initiate-sso">SIGN IN</Link>
          </Button>
        </div>
        <p className="absolute bottom-4 text-xs text-muted-foreground">
          Copyright © WEG {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
{/* Coluna Direita: Imagens em Camadas */}
      <div className="hidden lg:block lg:w-2/3 relative bg-gray-900 overflow-hidden"> {/* Adicionado overflow-hidden */}
        
        {/* 1. Imagem de Fundo (Desfocada) */}
        <Image 
          src="/fundo-system-epd-weg.svg" // Imagem da paisagem
          alt="Blurred background landscape"
          fill 
          style={{ objectFit: 'cover' }} 
          className="absolute inset-0 z-0 blur-md scale-105" // Desfoque + leve scale + z-index baixo
          priority 
        />

        {/* Opcional: Overlay para contraste */}
        <div className="absolute inset-0 z-5 bg-black/20"></div> {/* z-index intermediário */}

        {/* 2. Imagem Principal (Nítida) */}
        <Image 
          src="/capa-system-epd-weg-1920x1080.svg"
          alt="EPD System - WEG Transformer Illustration"
          fill 
          style={{ objectFit: 'contain' }} 
          className="relative z-10 p-8 sm:p-16"
          priority 
        />
        
      </div>
    </div>
  );
}
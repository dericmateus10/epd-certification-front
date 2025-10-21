// src/app/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Usa BACKEND_URL como fonte principal, com fallback para API_URL se necessário
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!backendBase) {
    console.error('Missing NEXT_PUBLIC_BACKEND_URL (or fallback NEXT_PUBLIC_API_URL)');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  const backendLoginUrl = `${backendBase}/auth/keycloak/login`;

  // Encaminha os cookies recebidos para o backend e verifica se já há sessão válida
  const incomingCookie = request.headers.get('cookie') ?? '';
  let hasValidSession = false;
  try {
    const meResponse = await fetch(`${backendBase}/auth/me`, {
      headers: { cookie: incomingCookie },
      credentials: 'include',
    });
    hasValidSession = meResponse.ok;
  } catch (err) {
    // Ignora erros de rede; seguirá para iniciar fluxo de login
    console.warn('Failed to verify session against backend /auth/me:', err);
  }

  if (hasValidSession) {
    // Já autenticado: envia usuário para a raiz da aplicação
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Não autenticado: inicia fluxo de login do Keycloak via backend
  console.log('Redirecting to Keycloak login via backend:', backendLoginUrl);
  return NextResponse.redirect(backendLoginUrl);
}
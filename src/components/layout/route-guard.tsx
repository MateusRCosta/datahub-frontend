'use client';

import { useAuth } from '@/features/auth/provider/auth-provider';
import { Role } from '@/features/auth/schema/roles';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedPageProps {
  roles: Role | Role[];
  children: ReactNode;
}

/**
 * Wrapper que protege uma página inteira com base em permissões.
 * - Bloqueia a renderização dos children até o auth carregar
 * - Não renderiza nada se o usuário não tem permissão
 * - Redireciona para '/' se sem permissão
 */
export function ProtectedPage({ roles, children }: ProtectedPageProps) {
  const { temPermissao, isLoading } = useAuth();
  const router = useRouter();
  const temAcesso = temPermissao(roles);

  useEffect(() => {
    if (!isLoading && !temAcesso) {
      router.replace('/');
    }
  }, [isLoading, temAcesso, router]);

  if (isLoading) return null;

  if (!temAcesso) return null;

  return <>{children}</>;
}

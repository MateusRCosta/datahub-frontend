'use client';

import { useAuth } from '@/features/auth/provider/auth-provider';
import { Role } from '@/features/auth/schema/roles';
import { Skeleton } from '@/components/ui/skeleton';
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
      // router.replace('/');
    }
  }, [isLoading, temAcesso, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6 w-full h-full">
        <div className="flex flex-col w-full border-b-2 gap-4 pb-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-2 self-end">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!temAcesso) return null;

  return <>{children}</>;
}

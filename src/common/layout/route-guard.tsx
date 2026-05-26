'use client';

import { Role } from '@/features/auth/schema/roles';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/features/auth/provider/auth-provider';

interface ProtectedPageProps {
  roles: Role | Role[];
  children: ReactNode;
}

/**
 * Wrapper que protege uma página inteira com base em permissões.
 * - Bloqueia a renderização dos children até o auth carregar
 * - Não renderiza nada se o usuário não tem permissão
 * - Redireciona para "/" se sem permissão
 */
export function ProtectedPage({ roles, children }: ProtectedPageProps) {
  const { temPermissao, isLoading } = useAuth();
  const router = useRouter();
  const temAcesso = temPermissao(roles);

  useEffect(() => {
    if (!isLoading && !temAcesso) {
      // router.replace("/");
    }
  }, [isLoading, temAcesso, router]);

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4 p-6 w-full h-full'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-96' />
        <Skeleton className='h-4 w-96 self-end' />
        <Skeleton className='h-full w-full' />
      </div>
    );
  }

  if (!temAcesso) return null;

  return <>{children}</>;
}

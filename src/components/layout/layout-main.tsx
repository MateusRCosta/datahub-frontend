'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { Main } from '@/components/layout/main';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider, useAuth } from '@/features/auth/provider/auth-provider';

export function LayoutMain({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutMainContent>{children}</LayoutMainContent>
    </AuthProvider>
  );
}

function LayoutMainContent({ children }: { children: React.ReactNode }) {
  const { isLoading, usuario } = useAuth();

  if (isLoading || !usuario) {
    return (
      <main className="flex min-h-dvh w-full flex-col gap-4 p-6">
        <Skeleton className="min-h-0 flex-1 w-full" />
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <Main>
        <div className="sticky top-0 z-10 pt-2 pl-2 lg:hidden">
          <SidebarTrigger />
        </div>
        {children}
      </Main>
    </SidebarProvider>
  );
}

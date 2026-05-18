import { AppSidebar } from '@/components/layout/app-sidebar';
import { Main } from '@/components/layout/main';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AuthProvider } from '@/features/auth/provider/auth-provider';

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />
          <Main>
            <div className="sticky top-0 z-10 pt-2 pl-2 lg:hidden">
              <SidebarTrigger />
            </div>
            {children}
          </Main>
        </SidebarProvider>
      </AuthProvider>
    </>
  );
}

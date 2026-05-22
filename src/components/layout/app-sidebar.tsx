'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  useSidebar,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import useFazLogout from '@/features/auth/api/use-faz-logout';
import { Me } from '@/features/auth/componentes/me';
import { useAuth } from '@/features/auth/provider/auth-provider';
import {
  RESOURCE_CONFIG,
  ResourceEntry,
} from '@/features/auth/config/resources';
import { LogOut, Menu, Sun, House, Moon, Settings, Loader } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Route } from 'next';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  visible: boolean;
  adminOnly: boolean;
}

export function AppSidebar() {
  const { temPermissao } = useAuth();
  const [openMe, setOpenMe] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  const currentPage = pathname.split('/')[1] || 'home';

  const handleNavigate = (path?: string) => {
    const destino = path ? (`/${path}` as Route) : ('/' as Route);
    router.push(destino);
  };

  const { mutateAsync, isPending } = useFazLogout();
  async function handleLogout() {
    const response = await mutateAsync();
    if (response.status > 500) {
      toast.error('Erro interno, tente novamente mais tarde.');
      return;
    }
    router.push('/login');
  }

  function handleAlteraTema() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  // Gera menu items a partir do RESOURCE_CONFIG (fonte de verdade única)
  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        id: 'home',
        label: 'Home',
        icon: House,
        visible: true,
        adminOnly: false,
      },
    ];

    for (const [resource, configObj] of Object.entries(RESOURCE_CONFIG)) {
      const config = configObj as ResourceEntry;
      if (!(config.show === false)) {
        items.push({
          id: resource,
          label: config.label,
          icon: config.icon,
          path: config.pathFront,
          visible: temPermissao(config.userRole),
          adminOnly: config.adminOnly,
        });
      }
    }

    return items;
  }, [temPermissao]);

  const { toggleSidebar, open } = useSidebar();

  const menuPrincipal = menuItems.filter(
    (item) => item.visible && !item.adminOnly,
  );
  const menuAdmin = menuItems.filter((item) => item.visible && item.adminOnly);

  return (
    <Sidebar collapsible="icon" className="border-0">
      <SidebarContent className="bg-primary">
        {/* Header */}
        <SidebarGroup className="border-b border-white rounded-b-none">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => toggleSidebar()}
                className="flex items-center gap-2 text-white font-medium"
              >
                <Menu className="h-4 w-4" />
                <span>Hotdata</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Menu principal */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuPrincipal
                .filter((mp) => !mp.path?.includes('integracoes'))
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={currentPage === item.id}
                        onClick={() => handleNavigate(item.path)}
                        className="text-white font-medium"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
          {menuPrincipal.filter((mp) => mp.path?.includes('integracoes'))
            .length > 0 && (
            <SidebarGroupContent>
              {open && (
                <SidebarGroupLabel className="text-white font-medium">
                  Integrações
                </SidebarGroupLabel>
              )}
              <SidebarMenu>
                {menuPrincipal
                  .filter((mp) => mp.path?.includes('integracoes'))
                  .map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={currentPage === item.id}
                          onClick={() => handleNavigate(item.path)}
                          className="text-white font-medium"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
          {menuAdmin.length > 0 && (
            <SidebarGroupContent>
              {open && (
                <SidebarGroupLabel className="text-white font-medium">
                  Administração
                </SidebarGroupLabel>
              )}
              <SidebarMenu>
                {menuAdmin.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={currentPage === item.id}
                        onClick={() => handleNavigate(item.path)}
                        className="text-white font-medium"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-primary border-t rounded-b-none border-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleAlteraTema}
              className="text-white"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
              <span>Alterar Tema</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenMe(!openMe)}
              className="text-white"
            >
              <Settings className="h-4 w-4" />
              <span>Configurações</span>
            </SidebarMenuButton>
            <Me open={openMe} onOpenChange={() => setOpenMe(false)} />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-vermelho"
              disabled={isPending}
            >
              {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

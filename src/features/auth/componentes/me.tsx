'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { RESOURCE_CONFIG, getRecursosParaRole } from '../config/resources';
import { useAuth } from '../provider/auth-provider';
import type { Role } from '../schema/roles';
import { AlteraSenha } from './altera-senha';

interface MeProps {
  open: boolean;
  onOpenChange: () => void;
}

interface PermissaoItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export function Me({ open = false, onOpenChange }: MeProps) {
  const ehDesktop = useMediaQuery('(min-width: 768px)');
  const [openAlteraSenha, setOpenAlteraSenha] = useState(false);

  const { usuario, isLoading } = useAuth();

  const renderizaConteudo = () => {
    if (isLoading) {
      return (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3"
            >
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </>
      );
    }

    if (usuario) {
      const permissoes = usuario.permissoes.reduce<PermissaoItem[]>(
        (items, role) => {
          const recursos = getRecursosParaRole(role as Role);

          recursos.forEach((resource) => {
            const config = RESOURCE_CONFIG[resource];
            items.push({
              label: config.label,
              icon: config.icon,
            });
          });

          return items;
        },
        [],
      );

      const renderizaPermissoes = () => {
        if (!permissoes.length) {
          return <span className="text-sm font-medium">Nenhuma</span>;
        }

        return (
          <TooltipProvider>
            <div className="flex items-center gap-2">
              {permissoes.map((item) => {
                const Icon = item.icon;

                return (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <Icon className="h-4 w-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">{item.label}</div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        );
      };

      const campos: { label: string; value: ReactNode }[] = [
        { label: 'Nome', value: usuario.nome },
        { label: 'E-mail', value: usuario.email },
        {
          label: 'Tipo usuário',
          value: usuario.admin ? 'Administrador' : 'Usuario',
        },
        { label: 'Permissões', value: renderizaPermissoes() },
      ];

      return (
        <>
          {campos.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className="text-sm font-medium">{value}</div>
            </div>
          ))}
        </>
      );
    }

    return null;
  };

  if (ehDesktop) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Usuário</DialogTitle>
              <DialogDescription>
                Informações básicas do seu usuário
              </DialogDescription>
            </DialogHeader>
            <div className="divide-y divide-border rounded-lg border">
              {renderizaConteudo()}
            </div>
            <DialogFooter>
              <div className="flex h-full w-full flex-row justify-between gap-2">
                <Button
                  variant="default"
                  onClick={() => setOpenAlteraSenha(!openAlteraSenha)}
                >
                  Alterar senha
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Sair</Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlteraSenha
          open={openAlteraSenha}
          onOpenChange={() => setOpenAlteraSenha(!openAlteraSenha)}
        />
      </>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Usuário</DrawerTitle>
              <DrawerDescription>
                Informações básicas do seu usuário
              </DrawerDescription>
            </DrawerHeader>
            <div className="divide-y divide-border rounded-lg border">
              {renderizaConteudo()}
            </div>
            <DrawerFooter>
              <Button
                variant="default"
                onClick={() => setOpenAlteraSenha(!openAlteraSenha)}
              >
                Alterar senha
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Sair</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <AlteraSenha
        open={openAlteraSenha}
        onOpenChange={() => setOpenAlteraSenha(!openAlteraSenha)}
      />
    </>
  );
}

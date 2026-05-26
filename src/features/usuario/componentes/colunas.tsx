'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DialogDeleta } from '@/components/layout/dialog-deleta';
import { UsuariosResponse } from '../schema';
import { TableModal } from '@/types/util.schema';
import { SwitchStatus } from '@/components/layout/switch-status';
import { UsuarioEdita } from './usuario-edita';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  RESOURCE_CONFIG,
  getRecursosParaRole,
} from '@/features/auth/config/resources';

interface PermissaoItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const getColunas = ({
  modoSelecao,
}: TableModal<UsuariosResponse>): ColumnDef<UsuariosResponse>[] => {
  const baseCols: ColumnDef<UsuariosResponse>[] = [];

  baseCols.push(
    {
      accessorKey: 'id',
      header: () => {
        return <div className='sr-only'>Identificador</div>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.id}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'nome',
      header: () => {
        return <div className=''>Nome</div>;
      },
      cell: ({ row }) => {
        return (
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.nome}</span>
            <span className='text-xs text-muted-foreground'>
              {row.original.email}
            </span>
            <span className='text-xs text-muted-foreground'>
              {row.original.admin ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'permissoes',
      header: () => {
        return <div className=''>Permissões</div>;
      },
      cell: ({ row }) => {
        const permissoes = row.original.permissoes;

        const items: PermissaoItem[] = [];
        permissoes.forEach((role) => {
          const recursos = getRecursosParaRole(role);
          recursos.forEach((resource) => {
            const config = RESOURCE_CONFIG[resource];
            items.push({
              label: config.label,
              icon: config.icon,
            });
          });
        });

        return (
          <div className='flex gap-2'>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <div>
                      <TooltipTrigger asChild>
                        <Icon className='h-4 w-4 cursor-pointer' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className='space-y-1'>{item.label}</div>
                      </TooltipContent>
                    </div>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        );
      },
    },
  );

  if (!modoSelecao) {
    baseCols.push(
      {
        accessorKey: 'ativo',
        header: () => {
          return <div className=''>Status</div>;
        },
        cell: ({ row }) => {
          return (
            <div className='flex items-right'>
              <SwitchStatus
                status={row.getValue('ativo')}
                id={row.original.id}
                path='usuarios'
                mensagens={{
                  naoEncontrado: `O usuário "${row.original.nome}" não foi encontrado.`,
                  sucesso: 'Status alterado com sucesso.',
                }}
              />
            </div>
          );
        },
      },
      {
        id: 'acoes',
        header: () => {
          return <span className='sr-only'>Ações</span>;
        },
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-1'>
              <UsuarioEdita id={row.original.id} />
              <DialogDeleta
                id={row.original.id}
                path='usuarios'
                nome={row.original.nome}
                objeto={'Usuário'}
                mensagens={{
                  naoEncontrado: `O usuário "${row.original.nome}" não foi encontrado.`,
                  sucesso: `O usuário "${row.original.nome}" foi excluído com sucesso.`,
                  confirmacao: (
                    <p>
                      Tem certeza que deseja excluir o usuário{' '}
                      <strong>{row.original.nome}</strong>?
                    </p>
                  ),
                }}
              />
            </div>
          );
        },
      },
    );
  }
  return baseCols;
};

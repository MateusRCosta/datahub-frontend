'use client';

import { ROLES } from '@/features/auth/schema/roles';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useController } from 'react-hook-form';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface PermissoesSelectorProps {
  name: string;
  organizacaoId?: string;
}

const ROLES_COMUM = [
  {
    id: ROLES.EDITAR_BASE_DADOS,
    label: 'Editar base de dados',
    description: 'Gerenciar bases de dados',
  },
  {
    id: ROLES.EDITAR_CAMPANHAS,
    label: 'Editar campanhas e templates',
    description: 'Gerenciar campanhas e templates',
  },
  {
    id: ROLES.EDITAR_INTEGRACOES,
    label: 'Editar integrações',
    description: 'Gerenciar integrações',
  },
  {
    id: ROLES.VISUALIZAR_RELATORIOS,
    label: 'Vizualizar relatórios',
    description: 'Gerenciar relatórios',
  },
];

export function PermissoesSelector({ name }: PermissoesSelectorProps) {
  const { field } = useController({ name });

  const permissoesAtuais: string[] = useMemo(
    () => field.value ?? [],
    [field.value]
  );

  const togglePermissao = (role: string) => {
    const novaLista = permissoesAtuais.includes(role)
      ? permissoesAtuais.filter((p) => p !== role)
      : [...permissoesAtuais, role];
    field.onChange(novaLista);
  };

  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
      <div className="space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ROLES_COMUM.map((role) => (
            <div
              key={role.id}
              className={cn(
                'flex items-start space-x-3 space-y-0 rounded-md border p-3 hover:bg-accent/50 transition-colors',
                permissoesAtuais.includes(role.id) &&
                'border-primary bg-primary/5',
              )}
            >
              <Checkbox
                id={`role-${role.id}`}
                checked={permissoesAtuais.includes(role.id)}
                onCheckedChange={() => togglePermissao(role.id)}
                onClick={(e) => e.stopPropagation()}
                className='cursor-pointer'
              />
              <div
                className="flex flex-col gap-0.5 leading-none"
              >
                <Label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {role.label}
                </Label>
                <p className="text-xs text-muted-foreground leading-tight">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

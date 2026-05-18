'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWrapper, InputGenerico, SelectGenerico } from '@/components/layout/form';
import { UsuarioFiltros, usuarioFiltrosSchema } from '../schema';
import { Button } from '@/components/ui/button';

const selectOptionsAtivo = [
  { label: 'Todos', value: 'todos' },
  { label: 'Sim', value: 'true' },
  { label: 'Não', value: 'false' },
];

const selectOptionsAdmin = [
  { label: 'Todos', value: 'todos' },
  { label: 'Administrador', value: 'true' },
  { label: 'Usuário', value: 'false' },
];

interface UsuarioFiltroProps {
  filtros: UsuarioFiltros;
  setFiltros: (data: Partial<UsuarioFiltros>) => void;
}

export function UsuarioFiltro({ filtros, setFiltros }: UsuarioFiltroProps) {
  const form = useForm<UsuarioFiltros>({
    resolver: zodResolver(usuarioFiltrosSchema),
    values: {
      ativo: filtros?.ativo ?? undefined,
      admin: filtros?.admin ?? undefined,
      nome: filtros?.nome ?? '',
      email: filtros?.email ?? '',
    },
  });

  const handleSubmit = (data: UsuarioFiltros) => {
    setFiltros(data);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      id="usuario-filtro-complexo"
    >
      <div className="grid grid-cols-1 gap-4">
        <InputGenerico name="nome" label="Nome" />
        <InputGenerico name="email" label="E-mail" />
        <div className="grid grid-cols-2 gap-2">
          <SelectGenerico
            name="ativo"
            label="Ativo"
            options={selectOptionsAtivo}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SelectGenerico
            name="admin"
            label="Tipo de usuário"
            options={selectOptionsAdmin}
          />
        </div>
        <Button form="usuario-filtro-complexo" type="submit" className="w-full">
          Filtrar
        </Button>
      </div>
    </FormWrapper>
  );
}

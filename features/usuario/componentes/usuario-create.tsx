'use client';

import { useAuth } from '@/features/auth/provider/auth-provider';
import { PaginationApiRequest } from '@/types/api.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  USUARIO_CHAVE_URL,
  UsuarioCreateRequest,
  usuarioCreateSchema,
  usuarioFiltrosSchema,
} from '../schema';
import { toast } from 'sonner';
import { InputGenerico } from '@/components/layout/form';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { useUrlFiltros } from '@/hooks/use-url-filtros';
import useCriaUsuario from '../api/use-cria-usuario';
import { PermissoesSelector } from './permissoes-selector';
import { Switch } from '@/components/ui/switch';

interface UsuarioCreateProps {
  pagination: PaginationApiRequest<string>;
}

export function UsuarioCreate({
  pagination,
}: UsuarioCreateProps) {
  const { isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const { filtros } = useUrlFiltros(usuarioFiltrosSchema, USUARIO_CHAVE_URL);

  const form = useForm<UsuarioCreateRequest>({
    mode: 'onSubmit',
    resolver: zodResolver(usuarioCreateSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      admin: false,

      permissoes: [],
    },
  });

  const { mutateAsync, isPending } = useCriaUsuario({
    pagination: pagination,
    filtros,
  });

  const onSubmit = async (data: UsuarioCreateRequest) => {
    const response = await mutateAsync(data as UsuarioCreateRequest);
    if (response.status === 201) {
      toast.success('Usuário criado com sucesso.');
      form.reset();
      setOpen(false);
    }

    if (response.status === 409) {
      toast.error(
        'Erro ao criar usuário, e-mail já cadastrado.',
      );
      form.setError('email', { message: 'E-mail já cadastrado.' });
      return;
    }

    toast.error(
      'Erro interno do servidor, tente novamente mais tarde.',
    );
    form.setError('root', { message: 'Erro interno do servidor, tente novamente mais tarde.' });
    return;
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-37.5" />;
  }

  return (
    <DialogCustom
      titulo={`Novo Usuário`}
      idForm="form-cria-usuario"
      descricao={<p>Crie um novo usuário.</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button type="button" onClick={() => setOpen(true)}>
          Criar Usuário
        </Button>
      }
      isPending={isPending}
    >
      <div className="flex flex-col h-full">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="form-cria-usuario" className="flex flex-col gap-2 h-full">
            <FieldGroup className="flex flex-col min-h-0 flex-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Informações de Acesso</h3>
                <InputGenerico name="nome" label="Nome Completo" type="text" />
                <InputGenerico name="email" label="E-mail" type="email" />
                <InputGenerico name="senha" label="Senha Inicial" type="password" />
                <div className="flex flex-col space-x-2 gap-2">
                  <label htmlFor="admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Administrador
                  </label>
                  <Switch name="admin" />
                </div>
              </div>
              <div className="flex flex-col h-full border-t pt-4">
                <h3 className="text-sm font-semibold mb-4">Permissões de Usuário</h3>
                <PermissoesSelector name="permissoes" />
              </div>
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

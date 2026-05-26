'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { PaginationApiRequest } from '@/types/api.schema';
import {
  IntegracaoCriacao,
  IntegracaoFiltros,
  integracaoCriacaoSchema,
} from '../schema/integracao.schema';
import useCriaIntegracao from '../api/use-cria-integracao';
import {
  integracaoDefaultValues,
  normalizaIntegracaoFormValues,
} from '../lib/integracao-form.mapper';
import { IntegracaoBasicoForm } from './integracao-basico-form';
import { IntegracaoConfigForm } from './integracao-config-form';

export { integracaoDefaultValues, normalizaIntegracaoFormValues };

type IntegracaoCriaProps = {
  pagination: PaginationApiRequest<string>;
  filtros: IntegracaoFiltros;
};

export function IntegracaoCria({ pagination, filtros }: IntegracaoCriaProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<
    z.input<typeof integracaoCriacaoSchema>,
    unknown,
    IntegracaoCriacao
  >({
    mode: 'onSubmit',
    resolver: zodResolver(integracaoCriacaoSchema),
    defaultValues: integracaoDefaultValues,
  });

  const { mutateAsync, isPending } = useCriaIntegracao({ pagination, filtros });

  const onSubmit = async (data: IntegracaoCriacao) => {
    const response = await mutateAsync(data);
    if (response.status === 201) {
      toast.success('Integração criada com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro ao criar integração.');
    form.setError('root', {
      message: 'Verifique os dados e tente novamente.',
    });
  };

  return (
    <DialogCustom
      titulo='Nova integração'
      idForm='form-cria-integracao'
      descricao={<p>Crie uma nova integração de coleta.</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          type='button'
          onClick={() => {
            form.reset(integracaoDefaultValues);
            setOpen(true);
          }}
        >
          Criar integração
        </Button>
      }
      isPending={isPending}
    >
      <div className='flex flex-col h-full'>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='form-cria-integracao'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-3'>
              <IntegracaoBasicoForm />
              <IntegracaoConfigForm />
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

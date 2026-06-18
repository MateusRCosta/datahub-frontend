'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { useFormComponents } from '@/hooks/use-form-components';
import { PaginationApiRequest } from '@/types/api.schema';
import {
  IntegracaoCampanhaCriacao,
  IntegracaoCampanhaFiltros,
  integracaoCampanhaConfigDefaultValues,
  integracaoCampanhaCriacaoSchema,
} from '../schema/integracao-campanha.schema';
import z from 'zod';
import useCriaIntegracaoCampanha from '../api/use-cria-integracao-campanha';
import { IntegracaoCampanhaConfigForm } from './integracao-campanha-config-form';
import { ProvedorEnum, provedorEnumSchema } from '@/common/schema/provedor.schema';

interface IntegracaoCampanhaCriaProps {
  pagination: PaginationApiRequest<string>;
  filtros: IntegracaoCampanhaFiltros;
}

const provedorOptions = provedorEnumSchema.options.map((provedor) => ({
  label: provedor.toUpperCase(),
  value: provedor,
}));

export function IntegracaoCampanhaCria({
  pagination,
  filtros,
}: IntegracaoCampanhaCriaProps) {
  const [open, setOpen] = useState(false);
  const { Input, Select } = useFormComponents<IntegracaoCampanhaCriacao>();

  const form = useForm<
    z.input<typeof integracaoCampanhaCriacaoSchema>,
    unknown,
    IntegracaoCampanhaCriacao
  >({
    mode: 'onSubmit',
    resolver: zodResolver(integracaoCampanhaCriacaoSchema),
    defaultValues: {
      nome: '',
      provedor: ProvedorEnum.UPCHAT,
      config: integracaoCampanhaConfigDefaultValues.upchat,
    },
  });

  const { mutateAsync, isPending } = useCriaIntegracaoCampanha({
    pagination,
    filtros,
  });

  const onSubmit = async (data: IntegracaoCampanhaCriacao) => {
    const response = await mutateAsync(data);
    if (response.status === 201) {
      toast.success('Integração de campanha criada com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro ao criar integração de campanha.');
    form.setError('root', {
      message: 'Verifique os dados e tente novamente.',
    });
  };

  const atualizaConfigProvedor = (provedor: string) => {
    const resultado = provedorEnumSchema.safeParse(provedor);
    if (!resultado.success) return;

    form.setValue(
      'config',
      integracaoCampanhaConfigDefaultValues[resultado.data],
    );
  };

  return (
    <DialogCustom
      titulo='Nova integração de campanha'
      idForm='form-cria-integracao-campanha'
      descricao={<p>Crie uma nova integração para campanhas.</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          type='button'
          onClick={() => {
            form.reset();
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
            id='form-cria-integracao-campanha'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>Informações básicas</h3>
                <Input
                  name='nome'
                  label='Nome'
                  placeholder='Digite o nome da integração'
                />
                <Select
                  name='provedor'
                  label='Provedor'
                  options={provedorOptions}
                  onValueChange={atualizaConfigProvedor}
                />
              </div>
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>Configuração</h3>
                <IntegracaoCampanhaConfigForm />
              </div>
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

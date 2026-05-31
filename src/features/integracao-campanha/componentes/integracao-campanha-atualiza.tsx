'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { DialogTrigger } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';
import { useFormComponents } from '@/hooks/use-form-components';
import { formataDataUI } from '@/lib/utils';
import { PenBox } from 'lucide-react';
import {
  IntegracaoCampanhaEdicao,
  integracaoCampanhaConfigDefaultValues,
  integracaoCampanhaEdicaoSchema,
} from '../schema/integracao-campanha.schema';
import useEditaIntegracaoCampanha from '../api/use-edita-integracao-campanha';
import useRetornaIntegracaoCampanha from '../api/use-retorna-integracao-campanha';
import { IntegracaoCampanhaConfigForm } from './integracao-campanha-config-form';
import { provedorEnumSchema } from '@/common/schema/provedor.schema';

interface IntegracaoCampanhaAtualizaProps {
  id: number;
}

const provedorOptions = provedorEnumSchema.options.map((provedor) => ({
  label: provedor.toUpperCase(),
  value: provedor,
}));

export function IntegracaoCampanhaAtualiza({
  id,
}: IntegracaoCampanhaAtualizaProps) {
  const [open, setOpen] = useState(false);
  const { isError, error, data } = useRetornaIntegracaoCampanha({
    enabled: open,
    id,
  });
  const { Input, Select } = useFormComponents<IntegracaoCampanhaEdicao>();

  const form = useForm<IntegracaoCampanhaEdicao>({
    mode: 'onSubmit',
    resolver: zodResolver(integracaoCampanhaEdicaoSchema),
    defaultValues: {
      nome: '',
      provedor: 'upchat',
      config: integracaoCampanhaConfigDefaultValues.upchat,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (data?.data) {
      reset(
        {
          nome: data.data.nome,
          provedor: data.data.provedor,
          config: {
            ...integracaoCampanhaConfigDefaultValues[data.data.provedor],
            ...data.data.config,
          },
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const { mutateAsync, isPending } = useEditaIntegracaoCampanha(id);

  const atualizaConfigProvedor = (provedor: string) => {
    const resultado = provedorEnumSchema.safeParse(provedor);
    if (!resultado.success) return;

    form.setValue(
      'config',
      integracaoCampanhaConfigDefaultValues[resultado.data],
    );
  };

  const onSubmit = async (formData: IntegracaoCampanhaEdicao) => {
    const response = await mutateAsync({ ...formData, id });
    if (response.status === 404) {
      toast.warning('Integração de campanha não encontrada.');
      form.reset();
      setOpen(false);
      return;
    }
    if (response.status === 400) {
      toast.error('Erro ao editar: verifique os dados e tente novamente.');
      form.setError('root', {
        message: 'Verifique os dados e tente novamente.',
      });
      return;
    }
    if (response.status === 204) {
      toast.success('Integração de campanha editada com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro ao editar: tente novamente mais tarde.');
    form.setError('root', { message: 'Tente novamente mais tarde.' });
  };

  return (
    <DialogCustom
      titulo='Editar integração de campanha'
      idForm='form-atualiza-integracao-campanha'
      descricao={
        <div className='flex flex-row w-full justify-between'>
          <p className='w-full'>Edite a integração de campanha existente.</p>
          <div className='flex flex-1 w-full'>
            <RegistroInfoCard
              dados={{
                ID: data?.data?.id,
                'Criado por': data?.data?.usuario?.nome,
                'Criado em': formataDataUI(data?.data?.createdAt),
                'Atualizado em': formataDataUI(data?.data?.updatedAt),
              }}
            />
          </div>
        </div>
      }
      open={open}
      setOpen={setOpen}
      trigger={
        <DialogTrigger asChild>
          <PenBox className='mr-2 h-4 cursor-pointer hover:text-primary transition-colors' />
        </DialogTrigger>
      }
      isPending={isPending}
    >
      <div className='flex flex-col h-full'>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='form-atualiza-integracao-campanha'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              {isError && (
                <div className='text-red-500'>
                  Erro ao carregar integração de campanha: {error?.message}
                </div>
              )}
              {data && !isError && (
                <>
                  <div className='space-y-4'>
                    <h3 className='text-sm font-semibold'>
                      Informações básicas
                    </h3>
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
                </>
              )}
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

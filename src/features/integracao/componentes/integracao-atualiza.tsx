'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PenBox } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';
import { formataDataUI } from '@/lib/utils';
import {
  IntegracaoEdicao,
  integracaoEdicaoSchema,
} from '../schema/integracao.schema';
import useEditaIntegracao from '../api/use-edita-integracao';
import useRetornaIntegracao from '../api/use-retorna-integracao';
import { IntegracaoBasicoForm } from './integracao-basico-form';
import { IntegracaoConfigForm } from './integracao-config-form';
import {
  integracaoDefaultValues,
  normalizaIntegracaoFormValues,
} from '../lib/integracao-form.mapper';

type IntegracaoAtualizaProps = {
  id: number;
};

export function IntegracaoAtualiza({ id }: IntegracaoAtualizaProps) {
  const [open, setOpen] = useState(false);
  const { isError, error, data } = useRetornaIntegracao({ enabled: open, id });

  const form = useForm<IntegracaoEdicao>({
    mode: 'onSubmit',
    resolver: zodResolver(integracaoEdicaoSchema),
    defaultValues: integracaoDefaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    if (!open) {
      reset(integracaoDefaultValues);
      return;
    }

    if (data?.data) {
      reset(normalizaIntegracaoFormValues(data.data));
    }
  }, [data?.data, open, reset]);

  const { mutateAsync, isPending } = useEditaIntegracao(id);

  const onSubmit = async (formData: IntegracaoEdicao) => {
    if (formData.responseScrap) {
      const nome = formData.responseScrap?.map((response) => {
        return response.nome;
      });
      const nomesRepetidos = nome.filter(
        (n, index) => nome.indexOf(n) !== index,
      );

      if (nomesRepetidos.length > 0) {
        formData.responseScrap.forEach((response, index) => {
          if (nomesRepetidos.includes(response.nome)) {
            form.setError(`responseScrap.${index}.nome`, {
              message: 'Nome duplicado.',
            });
          }
        });
        return;
      }
    }
    const response = await mutateAsync({ ...formData, id });
    if (response.status === 404) {
      toast.warning('Integração não encontrada.');
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
      toast.success('Integração editada com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro ao editar: tente novamente mais tarde.');
    form.setError('root', { message: 'Tente novamente mais tarde.' });
  };

  return (
    <DialogCustom
      titulo='Editar integração'
      idForm='form-atualiza-integracao'
      descricao={
        <div className='flex flex-row w-full justify-between'>
          <p className='w-full'>Edite a integração existente.</p>
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
            id='form-atualiza-integracao'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-3'>
              {isError && (
                <div className='text-red-500'>
                  Erro ao carregar integração: {error?.message}
                </div>
              )}
              {data && !isError && (
                <>
                  <IntegracaoBasicoForm />
                  <IntegracaoConfigForm />
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

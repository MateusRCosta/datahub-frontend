'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PenBox } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input as InputUi } from '@/components/ui/input';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';
import { useFormComponents } from '@/hooks/use-form-components';
import { formataDataUI } from '@/lib/utils';
import useEditaTemplate from '../api/use-edita-template';
import useRetornaTemplate from '../api/use-retorna-template';
import {
  TemplateEdicao,
  templateConfigDefaultValues,
  templateEdicaoSchema,
} from '../schema/template.schema';
import { TemplateConfigForm } from './template-config-form';
import { ProvedorEnum } from '@/common/schema/provedor.schema';

interface TemplateAtualizaProps {
  id: number;
}

export function TemplateAtualiza({ id }: TemplateAtualizaProps) {
  const [open, setOpen] = useState(false);
  const { isError, error, data } = useRetornaTemplate({ enabled: open, id });
  const { Input } = useFormComponents<TemplateEdicao>();
  const integracaoCampanhaNome = data?.data?.integracaoCampanha.nome ?? '';

  const form = useForm<TemplateEdicao>({
    mode: 'onSubmit',
    resolver: zodResolver(templateEdicaoSchema),
    defaultValues: {
      nome: '',
      quantidadeVars: undefined,
      provedor: ProvedorEnum.UPCHAT,
      config: templateConfigDefaultValues.upchat,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (data?.data) {
      const provedor = data.data.integracaoCampanha.provedor;

      reset(
        {
          nome: data.data.nome,
          quantidadeVars: data.data.quantidadeVars,
          provedor,
          config: {
            ...templateConfigDefaultValues[provedor],
            ...data.data.config,
          },
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const { mutateAsync, isPending } = useEditaTemplate(id);

  const onSubmit = async (formData: TemplateEdicao) => {
    const response = await mutateAsync({ ...formData, id });
    if (response.status === 404) {
      toast.warning('Template não encontrado.');
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
      toast.success('Template editado com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro ao editar: tente novamente mais tarde.');
    form.setError('root', { message: 'Tente novamente mais tarde.' });
  };

  return (
    <DialogCustom
      titulo='Editar template'
      idForm='form-atualiza-template'
      descricao={
        <div className='flex flex-row w-full justify-between'>
          <p className='w-full'>Edite o template existente.</p>
          <div className='flex flex-1 w-full'>
            <RegistroInfoCard
              dados={{
                ID: data?.data?.id,
                Provedor: data?.data?.integracaoCampanha.provedor,
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
            id='form-atualiza-template'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              {isError && (
                <div className='text-red-500'>
                  Erro ao carregar template: {error?.message}
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
                      placeholder='Digite o nome do template'
                    />
                    <Input
                      name='quantidadeVars'
                      label='Quantidade de variáveis'
                      type='number'
                      min={0}
                      max={1024}
                      placeholder='Digite a quantidade de variáveis'
                    />
                    <Field>
                      <FieldLabel className='font-normal text-xs'>
                        Integração de campanha
                      </FieldLabel>
                      <InputUi
                        value={integracaoCampanhaNome}
                        readOnly
                        disabled
                        className='bg-field-background text-sm'
                      />
                    </Field>
                  </div>
                  <div className='space-y-4'>
                    <h3 className='text-sm font-semibold'>Configuração</h3>
                    <TemplateConfigForm />
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

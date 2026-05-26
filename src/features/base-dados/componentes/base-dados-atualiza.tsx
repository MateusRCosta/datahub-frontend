'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';

import {
  BaseDadosCriacao,
  BaseDadosEdicao,
  baseDadosEdicaoSchema,
  enumSchema,
} from '../schema/base-dados.schema';
import z from 'zod';
import { useFormComponents } from '@/hooks/use-form-components';
import useRetornaBaseDados from '../api/use-retorna-base-dados';
import useEditaBaseDados from '../api/use-edita-base-dados';
import { PenBox } from 'lucide-react';
import { DialogTrigger } from '@/components/ui/dialog';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';
import { formataDataUI } from '@/lib/utils';

interface BaseDadosAtualizaProps {
  id: number;
}

const tipoColunaOptions = enumSchema.options.map((tipo) => ({
  label: tipo,
  value: tipo,
}));

export function BaseDadosAtualiza({ id }: BaseDadosAtualizaProps) {
  const [open, setOpen] = useState(false);
  const { isError, error, data } = useRetornaBaseDados({ enabled: open, id });

  const { Input, Select, Switch } = useFormComponents<BaseDadosCriacao>();

  const form = useForm<
    z.input<typeof baseDadosEdicaoSchema>,
    unknown,
    BaseDadosEdicao
  >({
    mode: 'onSubmit',
    resolver: zodResolver(baseDadosEdicaoSchema),
    defaultValues: {
      nome: '',
      estrutura: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (data?.data) {
      reset(
        {
          nome: data.data.nome,
          estrutura: data.data.estrutura,
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const { fields: estruturaFields } = useFieldArray({
    control: form.control,
    name: 'estrutura',
  });

  const { mutateAsync, isPending } = useEditaBaseDados(id);

  const onSubmit = async (formData: BaseDadosEdicao) => {
    const response = await mutateAsync({ ...formData, id });
    if (response.status === 404) {
      toast.warning('Erro ao editar: base de dados não encontrada.');
      form.reset();
      setOpen(false);
      return;
    }
    if (response.status === 400) {
      toast.error('Erro ao editar: verifique os dados e tente novamente.');
      form.setError('root', {
        message: 'Verifique os dados e tente novamente',
      });
      return;
    }
    if (response.status === 204) {
      toast.success('Base de dados editada com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro ao editar: tente novamente mais tarde.');
    form.setError('root', { message: 'Tente novamente mais tarde.' });
    return;
  };

  return (
    <DialogCustom
      titulo={`Editar base de dados`}
      idForm='form-cria-base-dados'
      descricao={
        <div className='flex flex-row w-full justify-between'>
          <p className='w-full'>Edite a base de dados existente.</p>
          <div className='flex flex-1 w-full'>
            <RegistroInfoCard
              dados={{
                ID: data?.data?.id,
                'Total clientes': data?.data?._count.clientes,
                'Criado por': data?.data?.integracao?.nome
                  ? `Integração - ${data?.data?.integracao?.nome}`
                  : `Usuário - ${data?.data?.usuario?.nome}`,
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
            id='form-cria-base-dados'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>Informações básicas</h3>
                <Input
                  name='nome'
                  label='Nome'
                  placeholder='Digite o nome da base de dados'
                />
                <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
                  {isError && (
                    <div className='text-red-500'>
                      Erro ao carregar base de dados: {error?.message}
                    </div>
                  )}
                  {data && !isError && (
                    <div className='space-y-4'>
                      <h3 className='text-sm font-semibold'>
                        Estrutura dos dados
                      </h3>
                      <div className='grid gap-2'>
                        {estruturaFields.map((field, index) => (
                          <div
                            key={field.id}
                            className='flex flex-col bg-foreground/1 p-2 gap-2 border rounded-md'
                          >
                            <Input
                              name={`estrutura.${index}.cabecalho`}
                              label='Cabeçalho'
                              disabled
                            />
                            <Input
                              name={`estrutura.${index}.rotulo`}
                              label='Rótulo'
                            />
                            <div className='flex gap-2 w-full items-center'>
                              <Switch
                                name={`estrutura.${index}.obrigatorio` as const}
                                label='Obrigatório'
                                className='justify-end'
                              />
                              <Select
                                name={`estrutura.${index}.tipo`}
                                label='Tipo'
                                options={tipoColunaOptions}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </FieldGroup>
              </div>
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

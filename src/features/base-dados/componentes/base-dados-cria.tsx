'use client';

import { useAuth } from '@/features/auth/provider/auth-provider';
import { PaginationApiRequest } from '@/types/api.schema';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { DialogCustom } from '@/components/layout/dialog-custom';
import useCriaBaseDados from '../api/use-cria-base-dados';
import Papa from 'papaparse';

import {
  BaseDadosCriacao,
  baseDadosCriacaoSchema,
  BaseDadosFiltros,
  enumSchema,
} from '../schema/base-dados.schema';
import z from 'zod';
import { useFormComponents } from '@/hooks/use-form-components';

interface BaseDadosCreateProps {
  pagination: PaginationApiRequest<string>;
  filtros: BaseDadosFiltros;
}

const tipoColunaOptions = enumSchema.options.map((tipo) => ({
  label: tipo,
  value: tipo,
}));

export function BaseDadosCria({ pagination, filtros }: BaseDadosCreateProps) {
  const { isLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [colunas, setColunas] = useState<string[]>([]);
  const { Input, Select, Switch } = useFormComponents<BaseDadosCriacao>();

  const form = useForm<
    z.input<typeof baseDadosCriacaoSchema>,
    unknown,
    BaseDadosCriacao
  >({
    mode: 'onSubmit',
    resolver: zodResolver(baseDadosCriacaoSchema),
    defaultValues: {
      nome: '',
      estrutura: [],
    },
  });

  const { fields: estruturaFields, replace: replaceEstrutura } = useFieldArray({
    control: form.control,
    name: 'estrutura',
  });

  const { mutateAsync, isPending } = useCriaBaseDados({
    pagination: pagination,
    filtros,
  });

  const onSubmit = async (data: BaseDadosCriacao) => {
    const response = await mutateAsync(data as BaseDadosCriacao);
    if (response.status === 201) {
      toast.success('Base de dados criado com sucesso.');
      form.reset();
      setOpen(false);
      return;
    }

    toast.error('Erro interno do servidor, tente novamente mais tarde.');
    form.setError('root', {
      message: 'Erro interno do servidor, tente novamente mais tarde.',
    });
    return;
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-32" />;
  }

  function retornaColunasDoCsv(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setColunas([]);
      replaceEstrutura([]);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 20,
      complete: (result) => {
        const resultadoColunas =
          result.meta.fields?.filter((coluna) => coluna.trim() !== '') ?? [];
        if (!resultadoColunas || resultadoColunas.length === 0) {
          form.setError('arquivo', {
            type: 'manual',
            message: 'O CSV não possui cabeçalho válido',
          });
          setColunas([]);
          replaceEstrutura([]);
          return;
        }
        form.clearErrors('arquivo');
        setColunas(resultadoColunas);
        replaceEstrutura(
          resultadoColunas.map((coluna) => ({
            cabecalho: coluna,
            rotulo: '',
            tipo: enumSchema.enum.TEXTO,
            obrigatorio: false,
          })),
        );
      },
    });
  }

  return (
    <DialogCustom
      titulo={`Nova Base de dados`}
      idForm="form-cria-base-dados"
      descricao={<p>Crie uma nova base de dados.</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          type="button"
          onClick={() => {
            form.reset();
            setOpen(true);
          }}
        >
          Criar Base de dados
        </Button>
      }
      isPending={isPending}
    >
      <div className="flex flex-col h-full">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="form-cria-base-dados"
            className="flex flex-col gap-2 h-full"
          >
            <FieldGroup className="flex flex-col min-h-0 flex-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Informações básicas</h3>
                <Input
                  name="nome"
                  label="Nome"
                  placeholder="Digite o nome da base de dados"
                />
                <Input
                  name="arquivo"
                  label="Arquivo"
                  accept=".csv"
                  type="file"
                  onChange={(e) => retornaColunasDoCsv(e)}
                  placeholder="Escolha o arquivo csv"
                />
                <FieldGroup className="flex flex-col min-h-0 flex-1 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">
                      Estrutura dos dados
                    </h3>
                    <div className="grid gap-2">
                      {colunas.length === 0 &&
                        'Insira um arquivo csv para visualizar as suas colunas'}
                      {estruturaFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex flex-col bg-foreground/1 p-2 gap-2 border rounded-md"
                        >
                          <Input
                            name={`estrutura.${index}.cabecalho`}
                            label="Cabeçalho"
                            disabled
                          />
                          <Input
                            name={`estrutura.${index}.rotulo`}
                            label="Rótulo"
                          />
                          <div className="flex gap-2 w-full items-center">
                            <Switch
                              name={`estrutura.${index}.obrigatorio` as const}
                              label="Obrigatório"
                              className="justify-end"
                            />
                            <Select
                              name={`estrutura.${index}.tipo`}
                              label="Tipo"
                              options={tipoColunaOptions}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

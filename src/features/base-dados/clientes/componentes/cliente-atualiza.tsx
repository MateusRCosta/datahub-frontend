import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useMemo, Fragment } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { PenBox } from 'lucide-react';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';

import {
  ClienteEdicao,
  Validacao,
  criaClienteEdicaoSchema,
} from '../schema/cliente.schema';
import z from 'zod';
import { Estrutura } from '../../schema/base-dados.schema';
import { formataDataUI } from '@/lib/utils';
import useRetornaCliente from '../api/use-retorna-cliente';
import useEditaCliente from '../api/use-edita-cliente';
import { useFormComponents } from '@/hooks/use-form-components';
import { retornaMensagemValidacao } from '../constants';

interface ClienteAtualizaProps {
  id: number;
  estrutura: Estrutura;
}

export function ClienteAtualiza({ id, estrutura }: ClienteAtualizaProps) {
  const [open, setOpen] = useState(false);
  const { Input, Switch, DatePicker } = useFormComponents<ClienteEdicao>();
  const { isLoading, isError, error, data } = useRetornaCliente({
    enabled: open,
    id,
  });
  const defaultValues = useMemo(() => {
    return estrutura.reduce<Record<string, string | boolean | undefined>>(
      (acc, est) => {
        if (est.tipo === 'BOOLEANO') {
          acc[est.cabecalho] = false;
          return acc;
        }

        acc[est.cabecalho] = '';
        return acc;
      },
      {},
    );
  }, [estrutura]);
  const clienteEdicaoSchema = useMemo(
    () => criaClienteEdicaoSchema(estrutura),
    [estrutura],
  );

  const form = useForm<
    z.input<typeof clienteEdicaoSchema>,
    unknown,
    z.output<typeof clienteEdicaoSchema>
  >({
    mode: 'onSubmit',
    resolver: zodResolver(clienteEdicaoSchema),
    defaultValues: {
      dados: defaultValues,
    },
  });

  const { clearErrors, reset, setError } = form;

  useEffect(() => {
    if (data?.data) {
      const dadosRaw = { ...defaultValues, ...data.data.dados };
      const dados = estrutura.reduce<Record<string, string | number | boolean>>(
        (acc, campo) => {
          const valor = dadosRaw[campo.cabecalho];

          if (valor !== null && valor !== undefined) {
            acc[campo.cabecalho] = valor;
            return acc;
          }

          acc[campo.cabecalho] = campo.tipo === 'BOOLEANO' ? false : '';
          return acc;
        },
        {},
      );

      reset(
        {
          dados,
        },
        { keepDefaultValues: false },
      );

      clearErrors('dados');
      data.data.validacao.forEach((validacao) => {
        setError(`dados.${validacao.cabecalho}`, {
          type: validacao.codigo,
          message:
            'Campo inválido: ' +
            retornaMensagemValidacao(validacao, dados[validacao.cabecalho]),
        });
      });
    }
  }, [clearErrors, data, defaultValues, reset, setError, estrutura]);

  const { mutateAsync, isPending } = useEditaCliente(id);

  const onSubmit = async (formData: z.output<typeof clienteEdicaoSchema>) => {
    const response = await mutateAsync({ ...formData, id });
    if (response.status !== 204) {
      toast.error(
        'Erro ao editar cliente, verifique os dados e tente novamente.',
      );
      form.setError('root', { message: 'Erro ao editar cliente...' });
      return;
    }

    toast.success('Cliente editado com sucesso.');
    form.reset();
    setOpen(false);
  };

  return (
    <DialogCustom
      titulo={`Cliente: ${data?.data?.id}`}
      idForm='form-atualiza-cliente'
      descricao={
        <div className='flex w-full justify-between'>
          <span className='w-full'>Gerencie os dados do cliente</span>
          <div className='flex flex-1 w-full'>
            <RegistroInfoCard
              dados={{
                ID: data?.data?.id,
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
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id='form-atualiza-cliente'
          className='flex flex-col gap-2 h-full'
        >
          <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
            {isError && (
              <div className='text-red-500'>
                Erro ao carregar cliente: {error?.message}
              </div>
            )}
            {data && !isError && (
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>Informações</h3>
                {data.data?.dados &&
                  estrutura.map((estruturaAtual) => {
                    const chave = estruturaAtual.cabecalho;
                    const tipo = estruturaAtual.tipo;
                    const label = estruturaAtual.rotulo ?? chave;

                    if (tipo === 'BOOLEANO') {
                      return (
                        <Fragment key={`dados.${chave}`}>
                          <Switch name={`dados.${chave}`} label={label} />
                        </Fragment>
                      );
                    }

                    if (tipo === 'UTC') {
                      return (
                        <Fragment key={`dados.${chave}`}>
                          <DatePicker name={`dados.${chave}`} label={label} />
                        </Fragment>
                      );
                    }
                    return (
                      <Fragment key={`dados.${chave}`}>
                        <Input
                          name={`dados.${chave}`}
                          label={label}
                          type={tipo === 'NUMERO' ? 'number' : 'text'}
                        />
                      </Fragment>
                    );
                  })}
              </div>
            )}
            {isLoading && (
              <>
                {[...Array(estrutura.length)].map((_, index) => (
                  <Skeleton key={index} className='h-12 w-full' />
                ))}
              </>
            )}
          </FieldGroup>
        </form>
      </FormProvider>
      <FieldError>{form.formState.errors.root?.message}</FieldError>
    </DialogCustom>
  );
}

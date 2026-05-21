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

import { ClienteEdicao, clienteEdicaoSchema } from '../schema/cliente.schema';
import z from 'zod';
import { Estrutura } from '../../schema/base-dados.schema';
import { formataDataUI } from '@/lib/utils';
import useRetornaCliente from '../api/use-retorna-cliente';
import useEditaCliente from '../api/use-edita-cliente';
import { useFormComponents } from '@/hooks/use-form-components';

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
    return estrutura.reduce<Record<string, string>>((acc, est) => {
      acc[est.cabecalho] = '';
      return acc;
    }, {});
  }, [estrutura]);

  const form = useForm<
    z.input<typeof clienteEdicaoSchema>,
    unknown,
    ClienteEdicao
  >({
    mode: 'onSubmit',
    resolver: zodResolver(clienteEdicaoSchema),
    defaultValues: {
      dados: defaultValues,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (data?.data) {
      reset(
        {
          dados: data.data.dados,
        },
        { keepDefaultValues: false },
      );
    }
  }, [data, reset]);

  const { mutateAsync, isPending } = useEditaCliente(id);

  const onSubmit = async (formData: ClienteEdicao) => {
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
      idForm="form-atualiza-cliente"
      descricao={
        <div className="flex w-full justify-between">
          <span className="w-full">Gerencie os dados do cliente</span>
          <div className="flex flex-1 w-full">
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
          <PenBox className="mr-2 h-4 cursor-pointer hover:text-primary transition-colors" />
        </DialogTrigger>
      }
      isPending={isPending}
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="form-atualiza-cliente"
          className="flex flex-col gap-2 h-full"
        >
          <FieldGroup className="flex flex-col min-h-0 flex-1 gap-6">
            {isError && (
              <div className="text-red-500">
                Erro ao carregar cliente: {error?.message}
              </div>
            )}
            {data && !isError && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Informações</h3>
                {data.data?.dados &&
                  Object.entries(data.data.dados).map(
                    ([chave, valor], _index) => {
                      const estruturaAtual = estrutura.filter(
                        (est) => est.cabecalho === chave,
                      )[0];
                      const tipo = estruturaAtual.tipo;
                      const label = estruturaAtual.rotulo ?? chave;

                      const erros =
                        data.data?.validacao.filter(
                          (e) => e.cabecalho === chave,
                        ) ?? [];
                      const temErros = erros.length > 0;
                      const mensagem = erros.map((e) => {
                        switch (e.codigo) {
                          case 'INVALID_BOOLEAN':
                            return `valor booleano "${valor}" não aceito`;
                          case 'EMAIL_INVALIDO':
                            return `e-mail inválido`;
                          case 'INVALID_DATE':
                            return `data inválida`;
                          case 'INVALID_NUMBER':
                            return `número inválido`;
                          case 'TELEFONE_INVALIDO':
                            return `telefone inválido`;
                          case 'REQUIRED':
                            return `valor é obrigatório`;
                        }
                      });

                      if (tipo === 'BOOLEANO') {
                        return (
                          <Fragment key={`dados.${chave}`}>
                            <Switch
                              name={`dados.${chave}`}
                              label={label}
                              ariaInvalid={temErros}
                            />
                            {erros.length > 0 && (
                              <FieldError>
                                Valor inválido: {mensagem.join(', ')}
                              </FieldError>
                            )}
                          </Fragment>
                        );
                      }

                      if (tipo === 'UTC') {
                        return (
                          <Fragment key={`dados.${chave}`}>
                            <DatePicker
                              name={`dados.${chave}`}
                              label={label}
                              ariaInvalid={temErros}
                            />
                            {erros.length > 0 && (
                              <FieldError>
                                Valor inválido: {mensagem.join(', ')}
                              </FieldError>
                            )}
                          </Fragment>
                        );
                      }
                      return (
                        <Fragment key={`dados.${chave}`}>
                          <Input
                            name={`dados.${chave}`}
                            label={label}
                            type="text"
                            aria-invalid={temErros}
                            ariaInvalid={temErros}
                          />
                          {erros.length > 0 && (
                            <FieldError>
                              Valor inválido: {mensagem.join(', ')}
                            </FieldError>
                          )}
                        </Fragment>
                      );
                    },
                  )}
              </div>
            )}
            {isLoading && (
              <>
                {[...Array(estrutura.length)].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
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

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { useFormComponents } from '@/hooks/use-form-components';
import { PaginationApiRequest } from '@/types/api.schema';
import { IntegracoesCampanhasApiResponse } from '../../schema/integracao-campanha.schema';
import { IntegracaoCampanhaTabela } from '../../componentes/integracao-campanha-tabela';
import useCriaTemplate from '../api/use-cria-template';
import {
  TemplateCriacao,
  TemplateFiltros,
  templateConfigDefaultValues,
  templateCriacaoSchema,
} from '../schema/template.schema';
import { TemplateConfigForm } from './template-config-form';

interface TemplateCriaProps {
  pagination: PaginationApiRequest<string>;
  filtros: TemplateFiltros;
}

export function TemplateCria({ pagination, filtros }: TemplateCriaProps) {
  const [open, setOpen] = useState(false);
  const [integracaoCampanhaNome, setIntegracaoCampanhaNome] = useState('');
  const { Input, InputSelecaoModal } = useFormComponents<TemplateCriacao>();

  const form = useForm<
    z.input<typeof templateCriacaoSchema>,
    unknown,
    TemplateCriacao
  >({
    mode: 'onSubmit',
    resolver: zodResolver(templateCriacaoSchema),
    defaultValues: {
      nome: '',
      quantidadeVars: 0,
      provedor: 'upchat',
      integracaoCampanhaId: 0,
      config: templateConfigDefaultValues.upchat,
    },
  });

  const { mutateAsync, isPending } = useCriaTemplate({ pagination, filtros });

  const selecionarIntegracaoCampanha = (
    integracaoCampanha: IntegracoesCampanhasApiResponse,
  ) => {
    form.setValue('integracaoCampanhaId', integracaoCampanha.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('provedor', integracaoCampanha.provedor, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(
      'config',
      templateConfigDefaultValues[integracaoCampanha.provedor],
    );
    setIntegracaoCampanhaNome(integracaoCampanha.nome);
  };

  const onSubmit = async (data: TemplateCriacao) => {
    const response = await mutateAsync(data);
    if (response.status === 201) {
      toast.success('Template criado com sucesso.');
      form.reset();
      setIntegracaoCampanhaNome('');
      setOpen(false);
      return;
    }

    toast.error('Erro ao criar template.');
    form.setError('root', {
      message: 'Verifique os dados e tente novamente.',
    });
  };

  return (
    <DialogCustom
      titulo='Novo template'
      idForm='form-cria-template'
      descricao={<p>Crie um novo template de campanha.</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          type='button'
          onClick={() => {
            form.reset();
            setIntegracaoCampanhaNome('');
            setOpen(true);
          }}
        >
          Criar template
        </Button>
      }
      isPending={isPending}
    >
      <div className='flex flex-col h-full'>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='form-cria-template'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>Informações básicas</h3>
                <Input
                  name='nome'
                  label='Nome'
                  placeholder='Digite o nome do template'
                />
                <Input
                  name='quantidadeVars'
                  label='Quantidade de variáveis'
                  type='number'
                  min={1}
                  max={1024}
                  placeholder='Digite a quantidade de variáveis'
                />
                <InputSelecaoModal
                  name='integracaoCampanhaId'
                  label='Integração de campanha'
                  nomeDisplay={integracaoCampanhaNome}
                  modalTitle='Selecionar integração de campanha'
                  modalContent={(fecharModal) => (
                    <IntegracaoCampanhaTabela
                      path='templates'
                      modoSelecao
                      onSelecionar={(integracaoCampanha) => {
                        selecionarIntegracaoCampanha(integracaoCampanha);
                        fecharModal();
                      }}
                    />
                  )}
                />
              </div>
              <div className='space-y-4'>
                <h3 className='text-sm font-semibold'>Configuração</h3>
                <TemplateConfigForm />
              </div>
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

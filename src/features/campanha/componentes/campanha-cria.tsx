'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { PaginationApiRequest } from '@/types/api.schema';
import useCriaCampanha from '../api/use-cria-campanha';
import { CampanhaFiltros } from '../schema/campanha.schema';
import {
  CampanhaFormulario,
  CampanhaFormularioInput,
  campanhaFormularioSchema,
} from '../schema/campanha-form.schema';
import { CampanhaForm } from './campanha-form';

interface CampanhaCriaProps {
  pagination: PaginationApiRequest<string>;
  filtros: CampanhaFiltros;
}

const defaultValues: CampanhaFormularioInput = {
  nome: '',
  scheduledAt: '',
  templateId: 0,
  baseDadosId: undefined,
  viewId: undefined,
  contatoCampo: '',
  vars: [{ variavel: '', valor: '' }],
};

export function CampanhaCria({ pagination, filtros }: CampanhaCriaProps) {
  const [open, setOpen] = useState(false);
  const [templateNome, setTemplateNome] = useState('');
  const [viewNome, setViewNome] = useState('');
  const [baseDadosNome, setBaseDadosNome] = useState('');

  const form = useForm<CampanhaFormularioInput, unknown, CampanhaFormulario>({
    mode: 'onSubmit',
    resolver: zodResolver(campanhaFormularioSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useCriaCampanha({ pagination, filtros });

  const resetForm = () => {
    form.reset(defaultValues);
    setTemplateNome('');
    setViewNome('');
    setBaseDadosNome('');
  };

  const onSubmit = async (data: CampanhaFormulario) => {
    const response = await mutateAsync(data);
    if (response.status === 201) {
      toast.success('Campanha criada com sucesso.');
      resetForm();
      setOpen(false);
      return;
    }

    toast.error('Erro ao criar campanha.');
    form.setError('root', {
      message: 'Verifique os dados e tente novamente.',
    });
  };

  return (
    <DialogCustom
      titulo='Nova campanha'
      idForm='form-cria-campanha'
      descricao={<p>Crie uma campanha com envio agendado.</p>}
      open={open}
      setOpen={setOpen}
      trigger={
        <Button
          type='button'
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Criar campanha
        </Button>
      }
      isPending={isPending}
    >
      <div className='flex flex-col h-full'>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='form-cria-campanha'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              <CampanhaForm
                templateNome={templateNome}
                setTemplateNome={setTemplateNome}
                viewNome={viewNome}
                setViewNome={setViewNome}
                baseDadosNome={baseDadosNome}
                setBaseDadosNome={setBaseDadosNome}
              />
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

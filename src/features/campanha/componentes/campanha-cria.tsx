'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { ApiResponseError, PaginationApiRequest } from '@/types/api.schema';
import useCriaCampanha from '../api/use-cria-campanha';
import { CampanhaFiltros } from '../schema/campanha.schema';
import {
  CampanhaFormulario,
  CampanhaFormularioInput,
  campanhaFormularioSchema,
} from '../schema/campanha-form.schema';
import { mapCampanhaError } from '../types/erros.constant';
import { CamposSelecionaveis } from '../types/campanha.types';
import { CampanhaForm } from './campanha-form';
import { ProvedorEnum } from '@/common/schema/provedor.schema';

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
  vars: [],
};

export function CampanhaCria({ pagination, filtros }: CampanhaCriaProps) {
  const [open, setOpen] = useState(false);
  const [templateNome, setTemplateNome] = useState('');
  const [templateQtdVars, setTemplateQtdVars] = useState<number>(0);
  const [templateProvedor, setTemplateProvedor] = useState<ProvedorEnum>(ProvedorEnum.UPCHAT);
  const [viewNome, setViewNome] = useState('');
  const [baseDadosNome, setBaseDadosNome] = useState('');
  const [camposSelecionaveis, setCamposSelecionaveis] =
    useState<CamposSelecionaveis>([]);

  const form = useForm<CampanhaFormularioInput, unknown, CampanhaFormulario>({
    mode: 'onSubmit',
    resolver: zodResolver(campanhaFormularioSchema),
    defaultValues,
  });

  const { mutateAsync, isPending } = useCriaCampanha({ pagination, filtros });

  const resetForm = () => {
    form.reset(defaultValues);
    setTemplateProvedor(ProvedorEnum.UPCHAT);
    setTemplateNome('');
    setViewNome('');
    setBaseDadosNome('');
    setCamposSelecionaveis([]);
  };

  const onSubmit = async (data: CampanhaFormulario) => {
    try {
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
    } catch (error) {
      const message = mapCampanhaError(error as ApiResponseError);
      toast.error(message);
      form.setError('root', { message });
    }
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
                templateProvedor={templateProvedor}
                setTemplateProvedor={setTemplateProvedor}
                templateNome={templateNome}
                templateQtdVars={templateQtdVars}
                setTemplateQtdVars={setTemplateQtdVars}
                setTemplateNome={setTemplateNome}
                viewNome={viewNome}
                setViewNome={setViewNome}
                baseDadosNome={baseDadosNome}
                setBaseDadosNome={setBaseDadosNome}
                camposSelecionaveis={camposSelecionaveis}
                setCamposSelecionaveis={setCamposSelecionaveis}
              />
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

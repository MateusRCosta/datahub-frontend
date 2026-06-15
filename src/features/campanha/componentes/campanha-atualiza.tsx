'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { PenBox } from 'lucide-react';
import { toast } from 'sonner';
import { DialogTrigger } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';
import { ApiResponseError } from '@/types/api.schema';
import { formataDataUI } from '@/lib/utils';
import useEditaCampanha from '../api/use-edita-campanha';
import useRetornaCampanha from '../api/use-retorna-campanha';
import {
  CampanhaFormulario,
  CampanhaFormularioInput,
  campanhaFormularioSchema,
} from '../schema/campanha-form.schema';
import { mapCampanhaError } from '../types/erros.constant';
import {
  STATUS_CAMPANHA,
  STATUS_CAMPANHA_LABEL,
  campanhaPodeEditar,
} from '../types/campanha.types';
import { CampanhaForm } from './campanha-form';

interface CampanhaAtualizaProps {
  id: number;
  status: STATUS_CAMPANHA;
}

export function CampanhaAtualiza({ id, status }: CampanhaAtualizaProps) {
  const [open, setOpen] = useState(false);
  const podeEditar = campanhaPodeEditar(status);

  const { isError, error, data } = useRetornaCampanha({
    enabled: open,
    id,
  });

  const campanha = data?.data;

  const form = useForm<CampanhaFormularioInput, unknown, CampanhaFormulario>({
    mode: 'onSubmit',
    resolver: zodResolver(campanhaFormularioSchema),
    values: campanha
      ? {
          nome: campanha.nome,
          scheduledAt: campanha.scheduledAt,
          templateId: campanha.template.id,
          baseDadosId: campanha.baseDeDados?.id,
          viewId: campanha.view?.id,
          contatoCampo: campanha.contatoCampo || {
            valor: '',
            baseDadosId: undefined,
          },
          vars: campanha.vars || [],
        }
      : {
          nome: '',
          scheduledAt: '',
          templateId: 0,
          baseDadosId: undefined,
          viewId: undefined,
          contatoCampo: { valor: '', baseDadosId: undefined },
          vars: [{ variavel: '', valor: '', baseDadosId: undefined }],
        },
  });

  const { mutateAsync, isPending } = useEditaCampanha(id);

  const onSubmit = async (formData: CampanhaFormulario) => {
    if (!podeEditar) return;

    try {
      const response = await mutateAsync({ ...formData, id });
      if (response.status === 204) {
        toast.success('Campanha editada com sucesso.');
        form.reset();
        setOpen(false);
        return;
      }

      toast.error('Erro ao editar: tente novamente mais tarde.');
      form.setError('root', { message: 'Tente novamente mais tarde.' });
    } catch (error) {
      const apiError = error as ApiResponseError;

      if (apiError.statusCode === 404) {
        toast.warning('Campanha não encontrada.');
        form.reset();
        setOpen(false);
        return;
      }

      const message = mapCampanhaError(apiError);
      toast.error(message);
      form.setError('root', { message });
    }
  };


  return (
    <DialogCustom
      titulo='Editar campanha'
      idForm='form-atualiza-campanha'
      descricao={
        <div className='flex flex-row w-full justify-between'>
          {podeEditar ? (
            <p className='w-full'>Edite a campanha pendente.</p>
          ) : (
            <p className='w-full text-xs text-muted-foreground'>
              Esta campanha está em modo de visualização, não pode ser editada.
            </p>
          )}
          <div className='flex flex-1 w-full'>
            <RegistroInfoCard
              dados={{
                ID: campanha?.id,
                Status: campanha?.status
                  ? STATUS_CAMPANHA_LABEL[campanha.status]
                  : undefined,
                'Criado por': campanha?.usuario?.nome,
                'Criado em': formataDataUI(campanha?.createdAt),
                'Atualizado em': formataDataUI(campanha?.updatedAt),
                'Finalizada em': formataDataUI(campanha?.finishedAt),
                'Executada em': formataDataUI(campanha?.executedAt),
              }}
            />
          </div>
        </div>
      }
      open={open}
      setOpen={setOpen}
      trigger={
        <DialogTrigger asChild>
          <PenBox className='mr-2 h-4 cursor-pointer hover:opacity-40 transition-colors' />
        </DialogTrigger>
      }
      isPending={isPending}
      disableSubmit={!podeEditar}
    >
      <div className='flex flex-col h-full'>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id='form-atualiza-campanha'
            className='flex flex-col gap-2 h-full'
          >
            <FieldGroup className='flex flex-col min-h-0 flex-1 gap-6'>
              {isError && (
                <div className='text-red-500'>
                  Erro ao carregar campanha: {error?.message}
                </div>
              )}
              {campanha && !isError && (
                <CampanhaForm
                  campanhaInicial={campanha}
                  readOnly={!podeEditar}
                />
              )}
            </FieldGroup>
          </form>
        </FormProvider>
        <FieldError>{form.formState.errors.root?.message}</FieldError>
      </div>
    </DialogCustom>
  );
}

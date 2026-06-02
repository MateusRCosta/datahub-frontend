'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { PenBox } from 'lucide-react';
import { toast } from 'sonner';
import { DialogTrigger } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { RegistroInfoCard } from '@/components/layout/registro-info-card';
import { ApiResponseError } from '@/types/api.schema';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  CamposSelecionaveis,
  campanhaPodeAbrirEdicao,
  campanhaPodeEditar,
} from '../types/campanha.types';
import { CampanhaForm } from './campanha-form';
import { ProvedorEnum } from '@/common/schema/provedor.schema';

interface CampanhaAtualizaProps {
  id: number;
  status: STATUS_CAMPANHA;
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

export function CampanhaAtualiza({ id, status }: CampanhaAtualizaProps) {
  const [open, setOpen] = useState(false);
  const [templateNome, setTemplateNome] = useState('');
  const [templateQtdVars, setTemplateQtdVars] = useState<number>(0);
  const [templateProvedor, setTemplateProvedor] = useState<ProvedorEnum>(ProvedorEnum.UPCHAT);
  const [viewNome, setViewNome] = useState('');
  const [baseDadosNome, setBaseDadosNome] = useState('');
  const [camposSelecionaveis, setCamposSelecionaveis] =
    useState<CamposSelecionaveis>([]);
  const podeEditar = campanhaPodeEditar(status);
  const podeAbrirEdicao = campanhaPodeAbrirEdicao();

  const { isError, error, data } = useRetornaCampanha({
    enabled: open && podeAbrirEdicao,
    id,
  });

  const form = useForm<CampanhaFormularioInput, unknown, CampanhaFormulario>({
    mode: 'onSubmit',
    resolver: zodResolver(campanhaFormularioSchema),
    defaultValues,
  });

  const { reset } = form;

  useEffect(() => {
    if (!data?.data) return;

    const campanha = data.data;
    const vars = Object.entries(campanha.vars ?? {}).map(
      ([variavel, valor]) => ({
        variavel,
        valor,
      }),
    );

    reset(
      {
        nome: campanha.nome,
        scheduledAt: campanha.scheduledAt,
        templateId: campanha.template.id,
        baseDadosId: campanha.baseDeDados?.id,
        viewId: campanha.view?.id,
        contatoCampo: campanha.contatoCampo,
        vars: vars.length > 0 ? vars : [{ variavel: '', valor: '' }],
      },
      { keepDefaultValues: false },
    );
    queueMicrotask(() => {
      setTemplateProvedor(campanha.template.integracaoCampanha.provedor);
      setTemplateNome(campanha.template.nome);
      setViewNome(campanha.view?.nome ?? '');
      setBaseDadosNome(campanha.baseDeDados?.nome ?? '');
      setTemplateQtdVars(campanha.template.quantidadeVars);
      setCamposSelecionaveis(campanha.campos ?? []);
    });
  }, [data, reset]);

  const { mutateAsync, isPending } = useEditaCampanha(id);

  const onSubmit = async (formData: CampanhaFormulario) => {
    if (!podeEditar) return;

    try {
      const response = await mutateAsync({ ...formData, id });
      if (response.status === 204) {
        toast.success('Campanha editada com sucesso.');
        form.reset(defaultValues);
        setOpen(false);
        return;
      }

      toast.error('Erro ao editar: tente novamente mais tarde.');
      form.setError('root', { message: 'Tente novamente mais tarde.' });
    } catch (error) {
      const apiError = error as ApiResponseError;

      if (apiError.statusCode === 404) {
        toast.warning('Campanha não encontrada.');
        form.reset(defaultValues);
        setOpen(false);
        return;
      }

      const message = mapCampanhaError(apiError);
      toast.error(message);
      form.setError('root', { message });
    }
  };

  if (!podeAbrirEdicao) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PenBox className='mr-2 h-4 text-muted-foreground opacity-50' />
          </TooltipTrigger>
          <TooltipContent>
            <span>Somente campanhas pendentes podem ser editadas.</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

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
                ID: data?.data?.id,
                Status: data?.data?.status
                  ? STATUS_CAMPANHA_LABEL[data.data.status]
                  : undefined,
                'Criado por': data?.data?.usuario?.nome,
                'Criado em': formataDataUI(data?.data?.createdAt),
                'Atualizado em': formataDataUI(data?.data?.updatedAt),
                'Finalizada em': formataDataUI(data?.data?.finishedAt),
                'Executada em': formataDataUI(data?.data?.executedAt),
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
              {data && !isError && (
                <CampanhaForm
                  templateProvedor={templateProvedor}
                  setTemplateProvedor={setTemplateProvedor}
                  templateNome={templateNome}
                  setTemplateNome={setTemplateNome}
                  templateQtdVars={templateQtdVars}
                  setTemplateQtdVars={setTemplateQtdVars}
                  viewNome={viewNome}
                  setViewNome={setViewNome}
                  baseDadosNome={baseDadosNome}
                  setBaseDadosNome={setBaseDadosNome}
                  camposSelecionaveis={camposSelecionaveis}
                  setCamposSelecionaveis={setCamposSelecionaveis}
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

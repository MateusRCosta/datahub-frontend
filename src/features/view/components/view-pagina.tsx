'use client';

import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { QueryTabela } from './query-tabela';
import { GroupFilterConstrutor } from './group-filter-construtor';
import { BaseDadosSidebar } from './base-dados-sidebar';
import { ViewDadosModal } from './view-dados-modal';
import { useViewCriacaoForm } from '../hooks/use-view-form';
import useRetornaViews from '../api/use-retorna-views';
import useCriaView from '../api/use-cria-view';
import useEditaView from '../api/use-edita-view';
import useRetornaBasesDados from '@/features/base-dados/api/use-retorna-bases-dados';
import {
  Join,
  SelectCampo,
  ViewDados,
  ViewCampanhaCriacao,
  ViewsApiResponse,
} from '../schema/view.schema';
import { FromComNome, JoinComNome, SelectComNome } from '../types';
import { TIPO_JOIN_ENUM } from '../types/enums';

const defaultPagination = {
  page: 1,
  limit: 100,
  orderBy: 'createdAt',
  order: 'asc',
} as const;

export function ViewPagina() {
  const [selectedView, setSelectedView] = useState<ViewsApiResponse | null>(null);
  const [from, setFrom] = useState<FromComNome | null>(null);
  const [joins, setJoins] = useState<JoinComNome[]>([]);
  const [selects, setSelects] = useState<SelectComNome[]>([]);
  const [dadosModalOpen, setDadosModalOpen] = useState(false);

  const { data: viewsData } = useRetornaViews({
    enabled: true,
    pagination: defaultPagination,
  });

  const { data: basesDadosData } = useRetornaBasesDados({
    enabled: true,
    pagination: defaultPagination,
  });

  const views = viewsData?.data?.data ?? [];
  const basesDados = basesDadosData?.data?.data ?? [];

  const criacaoForm = useViewCriacaoForm();
  const { mutateAsync: criaView, isPending: criaPending } = useCriaView();
  const { mutateAsync: editaView, isPending: editaPending } = useEditaView(
    selectedView?.id ?? 0,
  );

  const isPending = criaPending || editaPending;

  const getNomeBaseDados = (baseDadosId: number) =>
    basesDados.find((baseDados) => baseDados.id === baseDadosId)?.nome ??
    `ID ${baseDadosId}`;

  const loadView = (view: ViewsApiResponse) => {
    setSelectedView(view);
    setFrom({
      ...view.query.from,
      nome: getNomeBaseDados(view.query.from.baseDadosId),
    });
    setJoins(
      view.query.joins.map((join) => ({
        ...join,
        nome: getNomeBaseDados(join.baseDadosIdJoin),
      })),
    );
    setSelects(
      view.query.select.map((select) => ({
        ...select,
        nome: getNomeBaseDados(select.baseDadosId),
      })),
    );
    criacaoForm.reset({
      nome: view.nome,
      descricao: view.descricao,
      query: view.query,
    });
  };

  const resetView = () => {
    setSelectedView(null);
    setFrom(null);
    setJoins([]);
    setSelects([]);
    criacaoForm.reset();
  };

  const buildQuery = (
    groupFilter: ViewCampanhaCriacao['query']['groupFilter'],
  ): ViewCampanhaCriacao['query'] => ({
    from: { baseDadosId: from?.baseDadosId ?? 0 },
    joins: joins.map((join) => ({
      baseDadosIdJoin: join.baseDadosIdJoin,
      campoFrom: join.campoFrom,
      campoJoin: join.campoJoin,
      tipo: join.tipo,
    })),
    select: selects.map((select, index) => ({
      baseDadosId: select.baseDadosId,
      joinIndex: index,
      campos: select.campos,
    })),
    groupFilter,
  });

  const getGroupFilter = (): ViewCampanhaCriacao['query']['groupFilter'] =>
    criacaoForm.getValues('query.groupFilter') as ViewCampanhaCriacao['query']['groupFilter'];

  const handleCriaView = async (data: ViewDados) => {
    const query = buildQuery(getGroupFilter());
    const response = await criaView({ ...data, query });
    if (response.status === 201) {
      toast.success('View criada com sucesso.');
      setDadosModalOpen(false);
      resetView();
      return;
    }
    toast.error('Erro ao criar view.');
  };

  const handleEditaDados = async (data: ViewDados) => {
    if (!selectedView) return;
    const query = buildQuery(getGroupFilter());
    const response = await editaView({ ...data, id: selectedView.id, query });
    if (response.status === 204) {
      toast.success('Dados da view atualizados com sucesso.');
      setSelectedView((viewAtual) =>
        viewAtual ? { ...viewAtual, ...data, query } : viewAtual,
      );
      setDadosModalOpen(false);
      return;
    }
    toast.error('Erro ao atualizar view.');
  };

  const handleSalvaView = async () => {
    if (!selectedView) return;
    const query = buildQuery(getGroupFilter());
    const response = await editaView({
      id: selectedView.id,
      nome: selectedView.nome,
      descricao: selectedView.descricao,
      query,
    });
    if (response.status === 204) {
      toast.success('View salva com sucesso.');
      setSelectedView((viewAtual) =>
        viewAtual ? { ...viewAtual, query } : viewAtual,
      );
      return;
    }
    toast.error('Erro ao salvar view.');
  };

  const removeSelectsForaDasBasesPermitidas = (
    selectsAtuais: SelectComNome[],
    proximoFrom: FromComNome | null,
    proximosJoins: JoinComNome[],
  ) => {
    const basesPermitidas = new Set([
      ...(proximoFrom ? [proximoFrom.baseDadosId] : []),
      ...proximosJoins.map((join) => join.baseDadosIdJoin),
    ]);

    return selectsAtuais
      .filter((select) => basesPermitidas.has(select.baseDadosId))
      .map((select, index) => ({ ...select, joinIndex: index }));
  };

  return (
    <div className='flex flex-row h-full min-h-0 w-full overflow-hidden'>
      <div className='flex flex-col flex-1 min-w-0 overflow-y-auto p-6 gap-6'>
        <div className='flex items-end gap-4 flex-wrap border rounded-md p-4 bg-card'>
          <div className='flex flex-col gap-1'>
            <Label htmlFor='view-selector' className='text-sm'>
              Visualização existente
            </Label>
            <select
              id='view-selector'
              className='border rounded px-3 py-2 text-sm bg-background min-w-52'
              value={selectedView?.id ?? ''}
              onChange={(event) => {
                const id = Number(event.target.value);
                const found = views.find((view) => view.id === id);
                if (found) loadView(found);
                else resetView();
              }}
            >
              <option value=''>Nova visualização</option>
              {views.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.nome}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant={selectedView ? 'outline' : 'default'}
              onClick={() => setDadosModalOpen(true)}
              disabled={isPending}
            >
              {selectedView ? 'Editar dados' : 'Criar view'}
            </Button>
            {selectedView && (
              <Button
                type='button'
                onClick={handleSalvaView}
                disabled={isPending}
              >
                Salvar alterações
              </Button>
            )}
          </div>
        </div>

        <ViewDadosModal
          open={dadosModalOpen}
          onClose={() => setDadosModalOpen(false)}
          titulo={selectedView ? 'Editar dados da view' : 'Criar view'}
          descricao={
            selectedView
              ? 'Atualize o nome e a descrição da visualização.'
              : 'Informe o nome e a descrição para salvar a visualização.'
          }
          isPending={isPending}
          initialValues={{
            nome: selectedView?.nome ?? '',
            descricao: selectedView?.descricao ?? '',
          }}
          onSubmit={selectedView ? handleEditaDados : handleCriaView}
        />

        <QueryTabela
          from={from}
          joins={joins}
          selects={selects}
          basesDados={basesDados}
          onFromDrop={(baseDadosId, nome) => {
            const proximoFrom = { baseDadosId, nome };
            setFrom(proximoFrom);
            setSelects((selectsAtuais) =>
              removeSelectsForaDasBasesPermitidas(selectsAtuais, proximoFrom, joins),
            );
          }}
          onFromRemove={() => {
            setFrom(null);
            setSelects((selectsAtuais) =>
              removeSelectsForaDasBasesPermitidas(selectsAtuais, null, joins),
            );
          }}
          onJoinDrop={(baseDadosIdJoin, nome) =>
            setJoins((joinsAtuais) => [
              ...joinsAtuais,
              {
                baseDadosIdJoin,
                nome,
                campoFrom: '',
                campoJoin: '',
                tipo: TIPO_JOIN_ENUM.INNER,
              },
            ])
          }
          onJoinUpdate={(index, data: Join) =>
            setJoins((joinsAtuais) =>
              joinsAtuais.map((join, joinIndex) =>
                joinIndex === index ? { ...join, ...data } : join,
              ),
            )
          }
          onJoinRemove={(index) => {
            const proximosJoins = joins.filter((_, joinIndex) => joinIndex !== index);
            setJoins(proximosJoins);
            setSelects((selectsAtuais) =>
              removeSelectsForaDasBasesPermitidas(selectsAtuais, from, proximosJoins),
            );
          }}
          onSelectDrop={(baseDadosId, nome) =>
            setSelects((selectsAtuais) => [
              ...selectsAtuais,
              { baseDadosId, nome, joinIndex: selectsAtuais.length, campos: [] },
            ])
          }
          onSelectUpdate={(index, campos: SelectCampo[]) =>
            setSelects((selectsAtuais) =>
              selectsAtuais.map((select, selectIndex) =>
                selectIndex === index ? { ...select, campos } : select,
              ),
            )
          }
          onSelectRemove={(index) =>
            setSelects((selectsAtuais) =>
              selectsAtuais
                .filter((_, selectIndex) => selectIndex !== index)
                .map((select, selectIndex) => ({ ...select, joinIndex: selectIndex })),
            )
          }
        />

        <FormProvider {...criacaoForm}>
          <div className='flex flex-col gap-2'>
            <h3 className='text-sm font-semibold'>Filtros</h3>
            <GroupFilterConstrutor
              path='query.groupFilter'
              basesDados={basesDados}
            />
          </div>
        </FormProvider>
      </div>

      <BaseDadosSidebar basesDados={basesDados} />
    </div>
  );
}

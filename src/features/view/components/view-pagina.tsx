'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { QueryTabela } from './query/query-tabela';
import { ViewDadosModal } from './view-dados-modal';
import { ViewBar } from './view-bar';
import { useViewForm } from '../hooks/use-view-form';
import useRetornaView from '../api/use-retorna-view';
import useRetornaViews from '../api/use-retorna-views';
import useCriaView from '../api/use-cria-view';
import useEditaView from '../api/use-edita-view';
import useRetornaBasesDadosCampos from '@/features/base-dados/api/use-retorna-bases-dados-campos';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import {
  Join,
  SelectCampo,
  ViewDados,
  ViewCampanhaCriacao,
  ViewApiResponse,
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
  const [selectedView, setSelectedView] = useState<ViewsApiResponse | null>(
    null,
  );
  const [from, setFrom] = useState<FromComNome | null>(null);
  const [joins, setJoins] = useState<JoinComNome[]>([]);
  const [selects, setSelects] = useState<SelectComNome[]>([]);
  const [dadosModalOpen, setDadosModalOpen] = useState(false);
  const [filtrosModalOpen, setFiltrosModalOpen] = useState(false);
  const [selectedViewId, setSelectedViewId] = useState<number | null>(null);
  const [basesDados, setBasesDados] = useState<BasesDadosCampanhaApiResponse[]>(
    [],
  );

  const { data: viewsData } = useRetornaViews({
    enabled: true,
    pagination: defaultPagination,
  });

  const {
    data: retornaViewResponse,
    isPending: retornaViewQueryPending,
    error: retornaViewError,
  } = useRetornaView({
    id: selectedViewId ?? 0,
    enabled: selectedViewId !== null,
  });
  const retornaViewPending = retornaViewQueryPending && selectedViewId !== null;

  const views = useMemo(() => viewsData?.data?.data ?? [], [viewsData]);

  const form = useViewForm();
  const { mutateAsync: criaView, isPending: criaPending } = useCriaView();
  const { mutateAsync: editaView, isPending: editaPending } = useEditaView(
    selectedView?.id ?? 0,
  );

  const isPending = retornaViewPending || criaPending || editaPending;

  const getNomeBaseDados = useCallback(
    (baseDadosId: number) =>
      basesDados.find((baseDados) => baseDados.id === baseDadosId)?.nome ??
      `ID ${baseDadosId}`,
    [basesDados],
  );

  const getSelectJoinIndex = useCallback(
    (
      baseDadosId: number,
      fromAtual: FromComNome | null,
      joinsAtuais: JoinComNome[],
    ) => {
      if (fromAtual?.baseDadosId === baseDadosId) {
        return 0;
      }

      const joinIndex = joinsAtuais.findIndex(
        (join) => join.baseDadosIdJoin === baseDadosId,
      );

      return joinIndex >= 0 ? joinIndex + 1 : 0;
    },
    [],
  );

  const handleBaseDadosLoad = useCallback(
    (baseDados: BasesDadosCampanhaApiResponse) => {
      setBasesDados((basesDadosAtuais) => {
        const baseDadosAtual = basesDadosAtuais.find(
          (item) => item.id === baseDados.id,
        );

        if (baseDadosAtual) {
          if (baseDadosAtual === baseDados) return basesDadosAtuais;

          return basesDadosAtuais.map((item) =>
            item.id === baseDados.id ? baseDados : item,
          );
        }

        return [...basesDadosAtuais, baseDados];
      });

      setFrom((fromAtual) => {
        if (!fromAtual || fromAtual.baseDadosId !== baseDados.id) {
          return fromAtual;
        }

        return fromAtual.nome === baseDados.nome
          ? fromAtual
          : { ...fromAtual, nome: baseDados.nome };
      });

      setJoins((joinsAtuais) => {
        let mudou = false;
        const proximosJoins = joinsAtuais.map((join) => {
          if (
            join.baseDadosIdJoin !== baseDados.id ||
            join.nome === baseDados.nome
          ) {
            return join;
          }

          mudou = true;
          return { ...join, nome: baseDados.nome };
        });

        return mudou ? proximosJoins : joinsAtuais;
      });

      setSelects((selectsAtuais) => {
        let mudou = false;
        const proximosSelects = selectsAtuais.map((select) => {
          if (
            select.baseDadosId !== baseDados.id ||
            select.nome === baseDados.nome
          ) {
            return select;
          }

          mudou = true;
          return { ...select, nome: baseDados.nome };
        });

        return mudou ? proximosSelects : selectsAtuais;
      });
    },
    [],
  );

  const basesDadosContextoIds = useMemo(
    () =>
      Array.from(
        new Set([
          ...(from ? [from.baseDadosId] : []),
          ...joins.map((join) => join.baseDadosIdJoin),
        ]),
      ),
    [from, joins],
  );

  const basesDadosContextoQueries = useRetornaBasesDadosCampos({
    enabled: basesDadosContextoIds.length > 0,
    pagination: {
      page: 1,
      limit: 25,
      orderBy: 'createdAt',
      order: 'asc',
    },
    ids: basesDadosContextoIds.filter(
      (id) => !basesDados.some((baseDados) => baseDados.id === id),
    ),
  });

  const loadView = useCallback(
    (view: ViewApiResponse) => {
      const fromSelecionado = {
        ...view.config.from,
        nome: getNomeBaseDados(view.config.from.baseDadosId),
      };
      const joinsSelecionados = view.config.joins.map((join) => ({
        ...join,
        nome: getNomeBaseDados(join.baseDadosIdJoin),
      }));

      setSelectedView(view);
      setFrom(fromSelecionado);
      setJoins(joinsSelecionados);
      setSelects(
        view.config.select.map((select) => ({
          ...select,
          nome: getNomeBaseDados(select.baseDadosId),
          joinIndex: getSelectJoinIndex(
            select.baseDadosId,
            fromSelecionado,
            joinsSelecionados,
          ),
        })),
      );
      form.reset({
        nome: view.nome,
        descricao: view.descricao,
        config: view.config,
      });
    },
    [form, getNomeBaseDados, getSelectJoinIndex],
  );

  useEffect(() => {
    basesDadosContextoQueries.forEach((query) => {
      const baseDadosCarregados = query.data?.data?.data ?? [];
      baseDadosCarregados.forEach((baseDados) => {
        handleBaseDadosLoad(baseDados);
      });
    });
  }, [basesDadosContextoQueries, handleBaseDadosLoad]);

  const resetView = () => {
    setSelectedViewId(null);
    setSelectedView(null);
    setFrom(null);
    setJoins([]);
    setSelects([]);
    form.reset();
  };

  useEffect(() => {
    if (selectedViewId === null || !retornaViewResponse) return;
    if (retornaViewResponse.status === 200) {
      if (retornaViewResponse.data) {
        const view = retornaViewResponse.data;
        console.log('view carregada:', JSON.stringify(view, null, 2));
        queueMicrotask(() => {
          loadView(view);
        });
      }
      return;
    }

    if (retornaViewResponse.status === 404) {
      toast.warning('Erro ao selecionar registro: visualização não encontrada');
      return;
    }

    toast.error('Erro ao carregar visualização.');
  }, [loadView, retornaViewResponse, selectedViewId]);

  useEffect(() => {
    if (!retornaViewError) return;

    toast.error('Erro ao carregar visualização.');
  }, [retornaViewError]);

  const handleSelecionaView = (view: ViewsApiResponse | null) => {
    if (!view) {
      resetView();
      return;
    }

    setSelectedViewId(view.id);
    setSelectedView(view);
  };

  const buildQuery = (
    groupFilter: ViewCampanhaCriacao['config']['groupFilter'],
  ): ViewCampanhaCriacao['config'] => ({
    from: { baseDadosId: from?.baseDadosId ?? 0 },
    joins: joins.map((join) => ({
      baseDadosIdJoin: join.baseDadosIdJoin,
      campoFrom: join.campoFrom,
      campoJoin: join.campoJoin,
      tipo: join.tipo,
    })),
    select: selects.map((select) => ({
      baseDadosId: select.baseDadosId,
      joinIndex: getSelectJoinIndex(select.baseDadosId, from, joins),
      campos: select.campos,
    })),
    groupFilter,
  });

  const handleCriaView = async (data: ViewDados) => {
    const config = buildQuery(groupFilterWatched);
    const response = await criaView({ ...data, config });
    if (response.status === 201) {
      toast.success('Visualização criada com sucesso.');
      setDadosModalOpen(false);
      resetView();
      return;
    }
    toast.error('Erro ao criar visualização.');
  };

  const handleEditaDados = async (data: ViewDados) => {
    if (!selectedView) return;
    const config = buildQuery(groupFilterWatched);
    const response = await editaView({ ...data, id: selectedView.id, config });
    if (response.status === 204) {
      toast.success('Dados da visualização atualizados com sucesso.');
      setSelectedView((viewAtual) =>
        viewAtual ? { ...viewAtual, ...data, config } : viewAtual,
      );
      setDadosModalOpen(false);
      return;
    }
    if (response.status === 400) {
      toast.warning(
        'Erro ao salvar registro: verifique se os dados estão salvos corretamente',
      );
      return;
    }
    if (response.status > 500) {
      toast.error(
        'Erro ao salvar registro: erro interno de servidor, por favor tente novamente mais tarde',
      );
      return;
    }
  };

  const groupFilterWatched = useWatch({
    control: form.control,
    name: 'config.groupFilter',
  });

  const handleSalvaView = async () => {
    if (!selectedView) return;
    const config = buildQuery(groupFilterWatched);
    const response = await editaView({
      id: selectedView.id,
      nome: selectedView.nome,
      descricao: selectedView.descricao,
      config,
    });
    if (response.status === 204) {
      toast.success('Visualização salva com sucesso.');
      setSelectedView((viewAtual) =>
        viewAtual ? { ...viewAtual, config } : viewAtual,
      );
      return;
    }
    if (response.status === 400) {
      toast.warning(
        'Erro ao salvar registro: verifique se os dados estão salvos corretamente',
      );
      return;
    }
    if (response.status > 500) {
      toast.error(
        'Erro ao salvar registro: erro interno de servidor, por favor tente novamente mais tarde',
      );
      return;
    }
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
      .map((select) => ({
        ...select,
        joinIndex: getSelectJoinIndex(
          select.baseDadosId,
          proximoFrom,
          proximosJoins,
        ),
      }));
  };

  return (
    <div className='flex flex-col h-full min-w-0 overflow-y-auto px-6 pb-6 pt-2 gap-6'>
      <FormProvider {...form}>
        <ViewBar
          views={views}
          selectedView={selectedView}
          isPending={isPending}
          dadosModalOpen={dadosModalOpen}
          viewSelect={selectedView}
          onViewSelect={(view) => {
            void handleSelecionaView(view);
          }}
          onCreateView={() => setDadosModalOpen(true)}
          onSaveView={handleSalvaView}
          filtrosModalOpen={filtrosModalOpen}
          setFiltrosModalOpen={setFiltrosModalOpen}
          basesDados={basesDados}
        />

        <ViewDadosModal
          open={dadosModalOpen}
          onClose={() => setDadosModalOpen(false)}
          titulo={
            selectedView ? 'Editar dados da visualização' : 'Criar visualização'
          }
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
          onBaseDadosLoad={handleBaseDadosLoad}
          onFromSelect={(baseDadosId, nome) => {
            const proximoFrom = { baseDadosId, nome };
            setFrom(proximoFrom);
            setSelects((selectsAtuais) =>
              removeSelectsForaDasBasesPermitidas(
                selectsAtuais,
                proximoFrom,
                joins,
              ),
            );
          }}
          onFromRemove={() => {
            setFrom(null);
            setSelects((selectsAtuais) =>
              removeSelectsForaDasBasesPermitidas(selectsAtuais, null, joins),
            );
          }}
          onJoinSelect={(baseDadosIdJoin, nome) =>
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
            const proximosJoins = joins.filter(
              (_, joinIndex) => joinIndex !== index,
            );
            setJoins(proximosJoins);
            setSelects((selectsAtuais) =>
              removeSelectsForaDasBasesPermitidas(
                selectsAtuais,
                from,
                proximosJoins,
              ),
            );
          }}
          onSelectSelect={(baseDadosId, nome) =>
            setSelects((selectsAtuais) => [
              ...selectsAtuais,
              {
                baseDadosId,
                nome,
                joinIndex: getSelectJoinIndex(baseDadosId, from, joins),
                campos: [],
              },
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
              selectsAtuais.filter((_, selectIndex) => selectIndex !== index),
            )
          }
        />
      </FormProvider>
    </div>
  );
}

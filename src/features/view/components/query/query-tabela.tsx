'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { BaseDadosTabela } from '@/features/base-dados/componentes/base-dados-tabela';
import { useFormComponents } from '@/hooks/use-form-components';
import { BaseDadosSelectModal } from '../base-dados/base-dados-select-modal';
import { FromColuna } from '../from/from-coluna';
import { JoinsColuna } from '../join/joins-coluna';
import { SelectColuna } from '../select/select-coluna';
import {
  type Join,
  type SelectCampo,
  type ViewCampanhaCriacao,
} from '../../schema/view.schema';
import {
  type FromComNome,
  type JoinComNome,
  type SelectComNome,
} from '../../types';
import { MAX_JOINS } from '../../constants';

type QueryTabelaProps = {
  from: FromComNome | null;
  joins: JoinComNome[];
  selects: SelectComNome[];
  basesDados: BasesDadosCampanhaApiResponse[];
  onBaseDadosLoad: (baseDados: BasesDadosCampanhaApiResponse) => void;
  onFromSelect: (baseDadosId: number, nome: string) => void;
  onFromRemove: () => void;
  onJoinSelect: (baseDadosId: number, nome: string) => void;
  onJoinUpdate: (index: number, data: Join) => void;
  onJoinRemove: (index: number) => void;
  onSelectSelect: (baseDadosId: number, nome: string) => void;
  onSelectUpdate: (index: number, campos: SelectCampo[]) => void;
  onSelectRemove: (index: number) => void;
};

type SelectorTarget = 'from' | 'join' | 'select';

export function QueryTabela({
  from,
  joins,
  selects,
  basesDados,
  onBaseDadosLoad,
  onFromSelect,
  onFromRemove,
  onJoinSelect,
  onJoinUpdate,
  onJoinRemove,
  onSelectSelect,
  onSelectUpdate,
  onSelectRemove,
}: QueryTabelaProps) {
  const [selectorTarget, setSelectorTarget] = useState<SelectorTarget | null>(
    null,
  );
  const { InputSelecaoModal } = useFormComponents<ViewCampanhaCriacao>();

  const basesDadosPermitidasSelect = useMemo(
    () => [
      ...(from ? [from.baseDadosId] : []),
      ...joins.map((join) => join.baseDadosIdJoin),
    ],
    [from, joins],
  );

  const basesDadosSelect = useMemo(() => {
    const basesDadosPorId = new Map(
      basesDados.map((baseDados) => [baseDados.id, baseDados]),
    );

    return Array.from(new Set(basesDadosPermitidasSelect))
      .map((baseDadosId) => basesDadosPorId.get(baseDadosId))
      .filter((baseDados): baseDados is BasesDadosCampanhaApiResponse =>
        Boolean(baseDados),
      );
  }, [basesDados, basesDadosPermitidasSelect]);

  const basesDadosSelecionadasIds = useMemo(
    () => new Set(selects.map((select) => select.baseDadosId)),
    [selects],
  );

  const basesDadosDisponiveisSelect = useMemo(
    () =>
      basesDadosSelect.filter(
        (baseDados) => !basesDadosSelecionadasIds.has(baseDados.id),
      ),
    [basesDadosSelect, basesDadosSelecionadasIds],
  );

  const handleSelectBaseDados = (baseDados: BasesDadosCampanhaApiResponse) => {
    onBaseDadosLoad(baseDados);

    if (selectorTarget === 'from') {
      onFromSelect(baseDados.id, baseDados.nome);
      return true;
    }

    if (selectorTarget === 'join') {
      onJoinSelect(baseDados.id, baseDados.nome);
      return true;
    }

    return false;
  };

  const renderBaseDadosTabela = (fecharModal: () => void) => (
    <BaseDadosTabela
      modoSelecao
      campos
      onSelecionar={(baseDados) => {
        const existeCampos = 'campos' in baseDados;
        if (!existeCampos) return;

        const selecionouBaseDados = handleSelectBaseDados(baseDados);
        if (!selecionouBaseDados) return;

        setSelectorTarget(null);
        fecharModal();
      }}
    />
  );

  return (
    <div className='w-full h-full overflow-x-auto rounded-md border'>
      <table className='w-full h-full rounded-md border-none'>
        <thead className='h-[5%]'>
          <tr>
            <QueryHeader
              title='Referência'
              modalTitle='Selecionar base de dados de Referencia'
              onAdd={() => setSelectorTarget('from')}
              InputSelecaoModal={InputSelecaoModal}
              modalContent={renderBaseDadosTabela}
            />
            <QueryHeader
              title='Junções'
              modalTitle='Selecionar bases de dados de Juncoes'
              disabled={joins.length >= MAX_JOINS}
              onAdd={() => setSelectorTarget('join')}
              InputSelecaoModal={InputSelecaoModal}
              modalContent={renderBaseDadosTabela}
            />
            <QueryHeader
              title='Seleção'
              disabled={basesDadosDisponiveisSelect.length === 0}
              onAdd={() => setSelectorTarget('select')}
            />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='p-2 align-top'>
              <FromColuna from={from} onRemove={onFromRemove} />
            </td>
            <td className='border-l p-2 align-top'>
              <JoinsColuna
                joins={joins}
                onUpdate={onJoinUpdate}
                onRemove={onJoinRemove}
                from={from}
                basesDados={basesDados}
              />
            </td>
            <td className='border-l p-2 align-top'>
              <SelectColuna
                selects={selects}
                basesDados={basesDados}
                onUpdate={onSelectUpdate}
                onRemove={onSelectRemove}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <BaseDadosSelectModal
        open={selectorTarget === 'select'}
        onOpenChange={(open) => {
          if (!open) setSelectorTarget(null);
        }}
        title='Selecionar bases de dados de Seleção'
        emptyMessage='Nenhuma base de dados nova disponível para seleção.'
        basesDados={basesDadosDisponiveisSelect}
        onSelect={(baseDadosId, nome) => {
          onSelectSelect(baseDadosId, nome);
          setSelectorTarget(null);
        }}
      />
    </div>
  );
}

type QueryHeaderProps = {
  title: string;
  onAdd: () => void;
  InputSelecaoModal?: ReturnType<
    typeof useFormComponents<ViewCampanhaCriacao>
  >['InputSelecaoModal'];
  modalTitle?: string;
  modalContent?: (fecharModal: () => void) => React.ReactNode;
  disabled?: boolean;
};

function QueryHeader({
  title,
  modalTitle,
  onAdd,
  InputSelecaoModal,
  modalContent,
  disabled = false,
}: QueryHeaderProps) {
  if (!InputSelecaoModal || !modalTitle || !modalContent) {
    return (
      <th className='border-l bg-muted px-4 py-2 text-left text-sm font-semibold w-1/3'>
        <div className='flex items-center justify-between gap-2'>
          <span>{title}</span>
          <Button
            type='button'
            variant='ghost'
            size='icon-sm'
            onClick={onAdd}
            disabled={disabled}
            aria-label={`Adicionar ${title}`}
            title={`Adicionar ${title}`}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </th>
    );
  }

  return (
    <th className='border-l bg-muted px-4 py-2 text-left text-sm font-semibold w-1/3'>
      <div className='flex items-center justify-between gap-2'>
        <span>{title}</span>
        <InputSelecaoModal
          name='config.from.baseDadosId'
          label={title}
          nomeDisplay=''
          modalTitle={modalTitle}
          disabled={disabled}
          modalContent={modalContent}
          renderTrigger={(abrirModal) => (
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              onClick={() => {
                onAdd();
                abrirModal();
              }}
              disabled={disabled}
              aria-label={`Adicionar ${title}`}
              title={`Adicionar ${title}`}
            >
              <Plus className='h-4 w-4' />
            </Button>
          )}
        />
      </div>
    </th>
  );
}

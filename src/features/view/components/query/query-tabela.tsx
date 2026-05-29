'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { FromColuna } from '../from/from-coluna';
import { JoinsColuna } from '../join/joins-coluna';
import { SelectColuna } from '../select/select-coluna';
import { BaseDadosSelectModal } from '../base-dados/base-dados-select-modal';
import { type Join, type SelectCampo } from '../../schema/view.schema';
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
  basesDados: BasesDadosApiResponse[];
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

  const basesDadosPermitidasSelect = [
    ...(from ? [from.baseDadosId] : []),
    ...joins.map((join) => join.baseDadosIdJoin),
  ];

  const selectBasesDados = basesDados.filter((baseDados) =>
    basesDadosPermitidasSelect.includes(baseDados.id),
  );

  const selectorBasesDados =
    selectorTarget === 'select' ? selectBasesDados : basesDados;

  const selectorTitle =
    selectorTarget === 'from'
      ? 'Selecionar base From'
      : selectorTarget === 'join'
        ? 'Selecionar base Join'
        : 'Selecionar base Select';

  const handleSelectBaseDados = (baseDadosId: number, nome: string) => {
    if (selectorTarget === 'from') {
      onFromSelect(baseDadosId, nome);
      return;
    }

    if (selectorTarget === 'join') {
      onJoinSelect(baseDadosId, nome);
      return;
    }

    onSelectSelect(baseDadosId, nome);
  };

  return (
    <div className='w-full h-full overflow-x-auto'>
      <table className='w-full h-full border-collapse'>
        <thead className='h-[5%]'>
          <tr>
            <QueryHeader title='From' onAdd={() => setSelectorTarget('from')} />
            <QueryHeader
              title='Joins'
              onAdd={() => setSelectorTarget('join')}
              disabled={joins.length >= MAX_JOINS}
            />
            <QueryHeader
              title='Select'
              onAdd={() => setSelectorTarget('select')}
              disabled={basesDadosPermitidasSelect.length === 0}
            />
          </tr>
        </thead>
        <tbody >
          <tr>
            <td className='border p-2 align-top'>
              <FromColuna from={from} onRemove={onFromRemove} />
            </td>
            <td className='border p-2 align-top'>
              <JoinsColuna
                joins={joins}
                onUpdate={onJoinUpdate}
                onRemove={onJoinRemove}
              />
            </td>
            <td className='border p-2 align-top'>
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
        open={selectorTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSelectorTarget(null);
        }}
        title={selectorTitle}
        emptyMessage={
          selectorTarget === 'select'
            ? 'Adicione uma base em From ou Joins antes de selecionar campos.'
            : 'Nenhuma base encontrada.'
        }
        basesDados={selectorBasesDados}
        onSelect={handleSelectBaseDados}
      />
    </div>
  );
}

type QueryHeaderProps = {
  title: string;
  onAdd: () => void;
  disabled?: boolean;
};

function QueryHeader({ title, onAdd, disabled = false }: QueryHeaderProps) {
  return (
    <th className='border bg-muted px-4 py-2 text-left text-sm font-semibold w-1/3'>
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

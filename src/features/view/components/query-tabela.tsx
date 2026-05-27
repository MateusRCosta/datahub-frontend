'use client';

import { FromColuna } from './from-coluna';
import { JoinsColuna } from './joins-coluna';
import { SelectColuna } from './select-coluna';
import { Join, SelectCampo } from '../schema/view.schema';
import { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { FromComNome, JoinComNome, SelectComNome } from '../types';

type QueryTabelaProps = {
  from: FromComNome | null;
  joins: JoinComNome[];
  selects: SelectComNome[];
  basesDados: BasesDadosApiResponse[];
  onFromDrop: (baseDadosId: number, nome: string) => void;
  onFromRemove: () => void;
  onJoinDrop: (baseDadosId: number, nome: string) => void;
  onJoinUpdate: (index: number, data: Join) => void;
  onJoinRemove: (index: number) => void;
  onSelectDrop: (baseDadosId: number, nome: string) => void;
  onSelectUpdate: (index: number, campos: SelectCampo[]) => void;
  onSelectRemove: (index: number) => void;
};

export function QueryTabela({
  from,
  joins,
  selects,
  basesDados,
  onFromDrop,
  onFromRemove,
  onJoinDrop,
  onJoinUpdate,
  onJoinRemove,
  onSelectDrop,
  onSelectUpdate,
  onSelectRemove,
}: QueryTabelaProps) {
  const basesDadosPermitidasSelect = [
    ...(from ? [from.baseDadosId] : []),
    ...joins.map((join) => join.baseDadosIdJoin),
  ];

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse'>
        <thead>
          <tr>
            <th className='border bg-muted px-4 py-2 text-left text-sm font-semibold w-1/3'>
              From
            </th>
            <th className='border bg-muted px-4 py-2 text-left text-sm font-semibold w-1/3'>
              Joins
            </th>
            <th className='border bg-muted px-4 py-2 text-left text-sm font-semibold w-1/3'>
              Select
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='border p-2 align-top'>
              <FromColuna from={from} onDrop={onFromDrop} onRemove={onFromRemove} />
            </td>
            <td className='border p-2 align-top'>
              <JoinsColuna
                joins={joins}
                onDrop={onJoinDrop}
                onUpdate={onJoinUpdate}
                onRemove={onJoinRemove}
              />
            </td>
            <td className='border p-2 align-top'>
              <SelectColuna
                selects={selects}
                basesDados={basesDados}
                basesDadosPermitidas={basesDadosPermitidasSelect}
                onDrop={onSelectDrop}
                onUpdate={onSelectUpdate}
                onRemove={onSelectRemove}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useFormContext } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { ViewCampanhaCriacao } from '../schema/view.schema';
import { OPERADOR_ENUM } from '../types/enums';

type FiltroLinhaProps = {
  path: string;
  basesDados: BasesDadosApiResponse[];
  onRemove: () => void;
};

const operadorOptions = Object.values(OPERADOR_ENUM);

export function FiltroLinha({ path, basesDados, onRemove }: FiltroLinhaProps) {
  const { register, watch } = useFormContext<ViewCampanhaCriacao>();
  const baseDadosId = watch(`${path}.baseDadosId` as 'query.groupFilter.filter.baseDadosId');
  const estrutura =
    basesDados.find((baseDados) => baseDados.id === Number(baseDadosId))?.estrutura ?? [];

  return (
    <div className='flex flex-wrap items-center gap-2 p-2 border rounded bg-muted/20'>
      <select
        {...register(`${path}.baseDadosId` as Parameters<typeof register>[0], {
          valueAsNumber: true,
        })}
        className='border rounded px-2 py-1 text-sm bg-background'
      >
        <option value=''>Base</option>
        {basesDados.map((baseDados) => (
          <option key={baseDados.id} value={baseDados.id}>
            {baseDados.nome}
          </option>
        ))}
      </select>

      <select
        {...register(`${path}.campo` as Parameters<typeof register>[0])}
        className='border rounded px-2 py-1 text-sm bg-background'
      >
        <option value=''>Campo</option>
        {estrutura.map((metadado) => (
          <option key={metadado.cabecalho} value={metadado.cabecalho}>
            {metadado.rotulo ?? metadado.cabecalho}
          </option>
        ))}
      </select>

      <select
        {...register(`${path}.operador` as Parameters<typeof register>[0])}
        className='border rounded px-2 py-1 text-sm bg-background'
      >
        {operadorOptions.map((operador) => (
          <option key={operador} value={operador}>
            {operador}
          </option>
        ))}
      </select>

      <input
        {...register(`${path}.valor` as Parameters<typeof register>[0])}
        placeholder='Valor'
        className='border rounded px-2 py-1 text-sm bg-background w-32'
      />

      <Button type='button' variant='ghost' size='icon' onClick={onRemove}>
        <Trash2 className='h-4 w-4 text-destructive' />
      </Button>
    </div>
  );
}

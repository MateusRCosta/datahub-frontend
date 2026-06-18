'use client';

import { type FieldPath, useFormContext } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { ViewCampanhaCriacao } from '../../schema/view.schema';
import { OPERADOR_ENUM } from '../../types/enums';

type FiltroLinhaProps = {
  path: string;
  basesDados: BasesDadosCampanhaApiResponse[];
  onRemove: () => void;
};
 
const operadorOptions = Object.values(OPERADOR_ENUM);
const operadorLabels: Record<OPERADOR_ENUM, string> = {
  [OPERADOR_ENUM.EQUAL]: 'Igual',
  [OPERADOR_ENUM.DIFFERENT]: 'Diferente',
  [OPERADOR_ENUM.GREATER]: 'Maior que',
  [OPERADOR_ENUM.LESS]: 'Menor que',
  [OPERADOR_ENUM.GREATER_EQUAL]: 'Maior ou igual',
  [OPERADOR_ENUM.LESS_EQUAL]: 'Menor ou igual',
  [OPERADOR_ENUM.CONTAINS]: 'Contém',
  [OPERADOR_ENUM.START_WITH]: 'Começa com',
  [OPERADOR_ENUM.IS_NULL]: 'É nulo',
  [OPERADOR_ENUM.IS_NOT_NULL]: 'Não é nulo',
};

export function FiltroLinha({ path, basesDados, onRemove }: FiltroLinhaProps) {
  const { register, watch } = useFormContext<ViewCampanhaCriacao>();
  const baseDadosIdPath =
    `${path}.baseDadosId` as FieldPath<ViewCampanhaCriacao>;
  const baseDadosId = watch(baseDadosIdPath);
  const campos =
    basesDados.find((baseDados) => baseDados.id === Number(baseDadosId))
      ?.campos ?? [];

  return (
    <div className='flex flex-wrap items-center gap-2 p-2 border rounded bg-muted/20'>
      <select
        {...register(`${path}.baseDadosId` as Parameters<typeof register>[0], {
          valueAsNumber: true,
        })}
        className='border rounded px-2 py-1 text-sm bg-background'
      >
        <option value='' disabled>
          Base
        </option>
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
        <option value='' disabled>
          Campo
        </option>
        {campos.map((metadado) => (
          <option key={metadado.campo} value={metadado.campo}>
            {metadado.rotulo?.trim() || metadado.campo}
          </option>
        ))}
      </select>

      <select
        {...register(`${path}.operador` as Parameters<typeof register>[0])}
        className='border rounded px-2 py-1 text-sm bg-background'
      >
        {operadorOptions.map((operador) => (
          <option key={operador} value={operador}>
            {operadorLabels[operador]}
          </option>
        ))}
      </select>

      <input
        {...register(`${path}.valor` as Parameters<typeof register>[0])}
        placeholder='Valor'
        className='border rounded px-2 py-1 text-sm bg-background w-32'
      />

      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={onRemove}
        className='ml-auto'
      >
        <Trash2 className='h-4 w-4 text-destructive' />
      </Button>
    </div>
  );
}

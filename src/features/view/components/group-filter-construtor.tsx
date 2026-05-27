'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ViewCampanhaCriacao } from '../schema/view.schema';
import { MAX_NESTED_GROUP_FILTER } from '../constants';
import { OPERADOR_ENUM, OPERADOR_WHERE_ENUM, TIPO_FILTRO_ENUM } from '../types/enums';
import { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { FiltroLinha } from './filtro-linha';

type GroupFilterConstrutorProps = {
  path: string;
  basesDados: BasesDadosApiResponse[];
  depth?: number;
};

const operadorWhereOptions = Object.values(OPERADOR_WHERE_ENUM);

export function GroupFilterConstrutor({
  path,
  basesDados,
  depth = 0,
}: GroupFilterConstrutorProps) {
  const { register, control } = useFormContext<ViewCampanhaCriacao>();

  const {
    fields: nestedGroups,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control,
    name: `${path}.groupFilter` as 'query.groupFilter.groupFilter',
  });

  const addFilter = () => {
    appendGroup({
      type: TIPO_FILTRO_ENUM.FILTER,
      operadorWhere: OPERADOR_WHERE_ENUM.AND,
      groupFilter: [],
      filter: {
        baseDadosId: 0,
        joinIndex: 0,
        campo: '',
        operador: OPERADOR_ENUM.EQUAL,
        valor: '',
      },
    });
  };

  const addGroup = () => {
    appendGroup({
      type: TIPO_FILTRO_ENUM.GROUP,
      operadorWhere: OPERADOR_WHERE_ENUM.AND,
      groupFilter: [],
      filter: {
        baseDadosId: 0,
        joinIndex: 0,
        campo: '',
        operador: OPERADOR_ENUM.EQUAL,
        valor: '',
      },
    });
  };

  return (
    <div
      className='flex flex-col gap-2 border rounded-md p-3'
      style={{ marginLeft: depth > 0 ? '1rem' : 0 }}
    >
      <div className='flex items-center gap-3 flex-wrap'>
        <span className='text-xs font-semibold text-muted-foreground uppercase'>
          {depth === 0 ? 'Filtros' : 'Grupo'}
        </span>
        <select
          {...register(`${path}.operadorWhere` as Parameters<typeof register>[0])}
          className='border rounded px-2 py-1 text-xs bg-background'
        >
          {operadorWhereOptions.map((op) => (
            <option key={op} value={op}>
              {op.toUpperCase()}
            </option>
          ))}
        </select>
        <Button type='button' variant='outline' size='sm' onClick={addFilter}>
          <Plus className='h-3 w-3 mr-1' />
          Filtro
        </Button>
        {depth < MAX_NESTED_GROUP_FILTER && (
          <Button type='button' variant='outline' size='sm' onClick={addGroup}>
            <Plus className='h-3 w-3 mr-1' />
            Grupo
          </Button>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        {nestedGroups.map((field, index) => {
          const itemPath = `${path}.groupFilter.${index}`;
          const itemType = (field as { type?: string }).type;

          return (
            <div key={field.id} className='relative'>
              {itemType === TIPO_FILTRO_ENUM.FILTER ? (
                <FiltroLinha
                  path={`${itemPath}.filter`}
                  basesDados={basesDados}
                  onRemove={() => removeGroup(index)}
                />
              ) : (
                <div className='relative'>
                  <GroupFilterConstrutor
                    path={itemPath}
                    basesDados={basesDados}
                    depth={depth + 1}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='absolute top-2 right-2'
                    onClick={() => removeGroup(index)}
                  >
                    <Trash2 className='h-4 w-4 text-destructive' />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

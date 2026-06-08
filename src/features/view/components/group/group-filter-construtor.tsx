'use client';

import { type ReactNode } from 'react';
import {
  type FieldArrayPath,
  type FieldPath,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { type ViewCampanhaCriacao } from '../../schema/view.schema';
import { MAX_NESTED_GROUP_FILTER } from '../../constants';
import {
  OPERADOR_ENUM,
  OPERADOR_WHERE_ENUM,
  TIPO_FILTRO_ENUM,
} from '../../types/enums';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { FiltroLinha } from '../filtro/filtro-linha';

type GroupFilterConstrutorProps = {
  basesDados: BasesDadosCampanhaApiResponse[];
};

type NestedGroupFilterProps = {
  path: string;
  basesDados: BasesDadosCampanhaApiResponse[];
  depth: number;
  onRemove: () => void;
};

const operadorWhereOptions = Object.values(OPERADOR_WHERE_ENUM);

const createFilter = () => ({
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

const createGroup = () => ({
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

export function GroupFilterConstrutor({
  basesDados,
}: GroupFilterConstrutorProps) {
  const { control } = useFormContext<ViewCampanhaCriacao>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'config.groupFilter',
  });

  return (
    <div className='flex flex-col gap-2 border rounded-md p-3'>
      <FilterActions
        title='Filtros'
        onAddFilter={() => append(createFilter())}
        onAddGroup={() => append(createGroup())}
        canAddGroup
      />

      <div className='flex flex-col gap-2'>
        {fields.map((field, index) => (
          <GroupFilterItem
            key={field.id}
            path={`config.groupFilter.${index}`}
            type={field.type}
            basesDados={basesDados}
            depth={0}
            onRemove={() => remove(index)}
          />
        ))}
      </div>
    </div>
  );
}

function NestedGroupFilter({
  path,
  basesDados,
  depth,
  onRemove,
}: NestedGroupFilterProps) {
  const { register, control } = useFormContext<ViewCampanhaCriacao>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${path}.groupFilter` as FieldArrayPath<ViewCampanhaCriacao>,
  });

  return (
    <div className='relative'>
      <div
        className='flex flex-col gap-2 border rounded-md p-3'
        style={{ marginLeft: '1rem' }}
      >
        <FilterActions
          title='Grupo'
          onAddFilter={() => append(createFilter())}
          onAddGroup={() => append(createGroup())}
          canAddGroup={depth < MAX_NESTED_GROUP_FILTER}
        >
          <select
            {...register(
              `${path}.operadorWhere` as FieldPath<ViewCampanhaCriacao>,
            )}
            className='border rounded px-2 py-1 text-xs bg-background'
          >
            {operadorWhereOptions.map((op) => (
              <option key={op} value={op}>
                {op.toUpperCase()}
              </option>
            ))}
          </select>
        </FilterActions>

        <div className='flex flex-col gap-2'>
          {fields.map((field, index) => (
            <GroupFilterItem
              key={field.id}
              path={`${path}.groupFilter.${index}`}
              type={(field as { type: string }).type}
              basesDados={basesDados}
              depth={depth}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      </div>

      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute top-2 right-2'
        onClick={onRemove}
      >
        <Trash2 className='h-4 w-4 text-destructive' />
      </Button>
    </div>
  );
}

type FilterActionsProps = {
  title: string;
  onAddFilter: () => void;
  onAddGroup: () => void;
  canAddGroup: boolean;
  children?: ReactNode;
};

function FilterActions({
  title,
  onAddFilter,
  onAddGroup,
  canAddGroup,
  children,
}: FilterActionsProps) {
  return (
    <div className='flex items-center gap-3 flex-wrap'>
      <span className='text-xs font-semibold text-muted-foreground uppercase'>
        {title}
      </span>
      {children}
      <Button type='button' variant='outline' size='sm' onClick={onAddFilter}>
        <Plus className='h-3 w-3 mr-1' />
        Filtro
      </Button>
      {canAddGroup && (
        <Button type='button' variant='outline' size='sm' onClick={onAddGroup}>
          <Plus className='h-3 w-3 mr-1' />
          Grupo
        </Button>
      )}
    </div>
  );
}

type GroupFilterItemProps = {
  path: string;
  type: string;
  basesDados: BasesDadosCampanhaApiResponse[];
  depth: number;
  onRemove: () => void;
};

function GroupFilterItem({
  path,
  type,
  basesDados,
  depth,
  onRemove,
}: GroupFilterItemProps) {
  if (type === TIPO_FILTRO_ENUM.FILTER) {
    return (
      <FiltroLinha
        path={`${path}.filter`}
        basesDados={basesDados}
        onRemove={onRemove}
      />
    );
  }

  return (
    <NestedGroupFilter
      path={path}
      basesDados={basesDados}
      depth={depth + 1}
      onRemove={onRemove}
    />
  );
}

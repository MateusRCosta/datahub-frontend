'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  FormWrapper,
  InputGenerico,
  SelectGenerico,
} from '@/components/layout/form';
import {
  CampanhaFiltros,
  campanhaFiltrosSchema,
} from '../schema/campanha.schema';
import { STATUS_CAMPANHA_OPTIONS } from '../types/campanha.types';

interface CampanhaFiltroProps {
  filtros: CampanhaFiltros;
  setFiltros: (data: Partial<CampanhaFiltros>) => void;
}

export function CampanhaFiltro({ filtros, setFiltros }: CampanhaFiltroProps) {
  const form = useForm<CampanhaFiltros>({
    resolver: zodResolver(campanhaFiltrosSchema),
    values: {
      nome: filtros?.nome ?? '',
      id: filtros?.id ?? '',
      status: filtros?.status ?? '',
      templateId: filtros?.templateId ?? '',
      viewId: filtros?.viewId ?? '',
      baseDeDadoId: filtros?.baseDeDadoId ?? '',
      usuarioId: filtros?.usuarioId ?? '',
    },
  });

  const handleSubmit = (data: CampanhaFiltros) => {
    setFiltros(data);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      id='campanha-filtro-complexo'
    >
      <div className='grid grid-cols-1 gap-4'>
        <InputGenerico name='nome' label='Nome' />
        <InputGenerico name='id' label='Id' />
        <SelectGenerico
          name='status'
          label='Status'
          options={[
            { label: 'Todos', value: 'todos' },
            ...STATUS_CAMPANHA_OPTIONS,
          ]}
        />
        <InputGenerico name='templateId' label='Template' />
        <InputGenerico name='viewId' label='Visualização' />
        <InputGenerico name='baseDeDadoId' label='Base de dados' />
        <InputGenerico name='usuarioId' label='Usuário' />
        <Button
          form='campanha-filtro-complexo'
          type='submit'
          className='w-full'
        >
          Filtrar
        </Button>
      </div>
    </FormWrapper>
  );
}

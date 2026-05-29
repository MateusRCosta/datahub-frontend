'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWrapper, InputGenerico } from '@/components/layout/form';
import { Button } from '@/components/ui/button';
import {
  BaseDadosFiltros,
  baseDadosFiltrosSchema,
} from '../schema/base-dados.schema';

interface BaseDadosFiltroProps {
  filtros: BaseDadosFiltros;
  setFiltros: (data: Partial<BaseDadosFiltros>) => void;
}

export function BaseDadosFiltro({ filtros, setFiltros }: BaseDadosFiltroProps) {
  const form = useForm<BaseDadosFiltros>({
    resolver: zodResolver(baseDadosFiltrosSchema),
    values: {
      nome: filtros?.nome ?? '',
      id: filtros?.id ?? '',
    },
  });

  const handleSubmit = (data: BaseDadosFiltros) => {
    setFiltros(data);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      id='usuario-filtro-complexo'
    >
      <div className='grid grid-cols-1 gap-4'>
        <InputGenerico name='nome' label='Nome' />
        <InputGenerico name='id' label='Id' />
        <Button form='usuario-filtro-complexo' type='submit' className='w-full'>
          Filtrar
        </Button>
      </div>
    </FormWrapper>
  );
}

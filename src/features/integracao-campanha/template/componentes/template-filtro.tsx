'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { FormWrapper, InputGenerico } from '@/components/layout/form';
import {
  TemplateFiltros,
  templateFiltrosSchema,
} from '../schema/template.schema';

interface TemplateFiltroProps {
  filtros: TemplateFiltros;
  setFiltros: (data: Partial<TemplateFiltros>) => void;
}

export function TemplateFiltro({ filtros, setFiltros }: TemplateFiltroProps) {
  const form = useForm<TemplateFiltros>({
    resolver: zodResolver(templateFiltrosSchema),
    values: {
      nome: filtros?.nome ?? '',
      provedor: filtros?.provedor ?? '',
      id: filtros?.id ?? '',
    },
  });

  const handleSubmit = (data: TemplateFiltros) => {
    setFiltros(data);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      id='template-filtro-complexo'
    >
      <div className='grid grid-cols-1 gap-4'>
        <InputGenerico name='nome' label='Nome' />
        <InputGenerico name='provedor' label='Provedor' />
        <InputGenerico name='id' label='Id' />
        <Button
          form='template-filtro-complexo'
          type='submit'
          className='w-full'
        >
          Filtrar
        </Button>
      </div>
    </FormWrapper>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWrapper, InputGenerico } from '@/components/layout/form';
import { Button } from '@/components/ui/button';
import {
  IntegracaoCampanhaFiltros,
  integracaoCampanhaFiltrosSchema,
} from '../schema/integracao-campanha.schema';

interface IntegracaoCampanhaFiltroProps {
  filtros: IntegracaoCampanhaFiltros;
  setFiltros: (data: Partial<IntegracaoCampanhaFiltros>) => void;
}

export function IntegracaoCampanhaFiltro({
  filtros,
  setFiltros,
}: IntegracaoCampanhaFiltroProps) {
  const form = useForm<IntegracaoCampanhaFiltros>({
    resolver: zodResolver(integracaoCampanhaFiltrosSchema),
    values: {
      nome: filtros?.nome ?? '',
      provedor: filtros?.provedor ?? '',
      id: filtros?.id ?? '',
    },
  });

  const handleSubmit = (data: IntegracaoCampanhaFiltros) => {
    setFiltros(data);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      id="usuario-filtro-complexo"
    >
      <div className="grid grid-cols-1 gap-4">
        <InputGenerico name="nome" label="Nome" />
        <InputGenerico name="id" label="Id" />
        <Button form="usuario-filtro-complexo" type="submit" className="w-full">
          Filtrar
        </Button>
      </div>
    </FormWrapper>
  );
}

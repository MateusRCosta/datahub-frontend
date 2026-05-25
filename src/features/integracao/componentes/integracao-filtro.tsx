'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormWrapper, InputGenerico } from '@/components/layout/form';
import { Button } from '@/components/ui/button';
import {
  IntegracaoFiltros,
  integracaoFiltrosSchema,
} from '../schema/integracao.schema';

type IntegracaoFiltroProps = {
  filtros: IntegracaoFiltros;
  setFiltros: (data: Partial<IntegracaoFiltros>) => void;
};

export function IntegracaoFiltro({
  filtros,
  setFiltros,
}: IntegracaoFiltroProps) {
  const form = useForm<IntegracaoFiltros>({
    resolver: zodResolver(integracaoFiltrosSchema),
    values: {
      nome: filtros?.nome ?? '',
      id: filtros?.id ?? '',
      status: filtros?.status ?? '',
    },
  });

  const handleSubmit = (data: IntegracaoFiltros) => {
    setFiltros(data);
  };

  return (
    <FormWrapper
      form={form}
      onSubmit={handleSubmit}
      id="integracao-filtro-complexo"
    >
      <div className="grid grid-cols-1 gap-4">
        <InputGenerico name="nome" label="Nome" />
        <InputGenerico name="id" label="Id" />
        <Button
          form="integracao-filtro-complexo"
          type="submit"
          className="w-full"
        >
          Filtrar
        </Button>
      </div>
    </FormWrapper>
  );
}

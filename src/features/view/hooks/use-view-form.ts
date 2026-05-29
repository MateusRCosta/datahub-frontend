'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { viewCriacaoSchema, ViewCampanhaCriacao } from '../schema/view.schema';

export function useViewForm() {
  return useForm<ViewCampanhaCriacao>({
    mode: 'onSubmit',
    resolver: zodResolver(viewCriacaoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      config: {
        from: { baseDadosId: 0 },
        joins: [],
        select: [],
        groupFilter: [],
      },
    },
  });
}

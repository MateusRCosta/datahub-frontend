'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  viewCriacaoSchema,
  ViewCampanhaCriacao,
} from '../schema/view.schema';

export function useViewCriacaoForm() {
  return useForm<ViewCampanhaCriacao>({
    mode: 'onSubmit',
    resolver: zodResolver(viewCriacaoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      query: {
        from: { baseDadosId: 0 },
        joins: [],
        select: [],
        groupFilter: [],
      },
    },
  });
}

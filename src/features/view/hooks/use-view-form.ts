'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
  viewCriacaoSchema,
  viewEdicaoSchema,
  ViewCampanhaCriacao,
  ViewCampanhaEdicao,
  ViewsApiResponse,
} from '../schema/view.schema';

export function useViewCriacaoForm() {
  return useForm<z.input<typeof viewCriacaoSchema>, unknown, ViewCampanhaCriacao>({
    mode: 'onSubmit',
    resolver: zodResolver(viewCriacaoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      query: {
        from: { baseDadosId: 0 },
        joins: [],
        select: [],
        groupFilter: {
          type: 'group',
          operadorWhere: 'and',
          groupFilter: [],
          filter: {
            baseDadosId: 0,
            joinIndex: 0,
            campo: '',
            operador: 'eq',
            valor: '',
          },
        },
      },
    },
  });
}

export function useViewEdicaoForm(view?: ViewsApiResponse) {
  return useForm<ViewCampanhaEdicao>({
    mode: 'onSubmit',
    resolver: zodResolver(viewEdicaoSchema),
    defaultValues: view
      ? {
          nome: view.nome,
          descricao: view.descricao,
          query: view.query as ViewCampanhaEdicao['query'],
        }
      : {
          nome: '',
          descricao: '',
        },
  });
}

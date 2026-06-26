'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  viewCriacaoSchema,
  type ViewCampanhaCriacao,
} from '../schema/view.schema';
import {
  OPERADOR_ENUM,
  OPERADOR_WHERE_ENUM,
  TIPO_FILTRO_ENUM,
} from '../types/enums';

export const createDefaultViewFormValues = (): ViewCampanhaCriacao => ({
  nome: '',
  descricao: '',
  config: {
    from: { baseDadosId: 0 },
    joins: [],
    select: [],
    groupFilter: {
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
    },
  },
});

export function useViewForm() {
  return useForm<ViewCampanhaCriacao>({
    mode: 'onSubmit',
    resolver: zodResolver(viewCriacaoSchema),
    defaultValues: createDefaultViewFormValues(),
  });
}
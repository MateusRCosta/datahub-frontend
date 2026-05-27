export type { OPERADOR_ENUM, OPERADOR_WHERE_ENUM, TIPO_FILTRO_ENUM, TIPO_JOIN_ENUM } from './enums';

import type { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import type { From, Join, Select } from '../schema/view.schema';

export type { BasesDadosApiResponse };

export type FromComNome = From & {
  nome: string;
};

export type JoinComNome = Join & {
  nome: string;
};

export type SelectComNome = Select & {
  nome: string;
};

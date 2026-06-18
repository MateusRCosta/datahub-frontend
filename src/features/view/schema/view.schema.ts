import {
  usuarioApiResponse,
  usuarioBasicApiResponse,
} from '@/lib/schema/usuario.schema';
import z from 'zod';
import {
  OPERADOR_ENUM,
  OPERADOR_WHERE_ENUM,
  TIPO_FILTRO_ENUM,
  TIPO_JOIN_ENUM,
} from '../types/enums';
import { camposDetailSchema } from '@/common/schema/relacao.schema';

export const tipoJoinEnumSchema = z.enum(TIPO_JOIN_ENUM);
export const operadorEnumSchema = z.enum(OPERADOR_ENUM);
export const tipoFiltroEnumSchema = z.enum(TIPO_FILTRO_ENUM);
export const operadorWhereEnumSchema = z.enum(OPERADOR_WHERE_ENUM);

export const fromSchema = z.object({
  baseDadosId: z.number().int().positive(),
});
export type From = z.infer<typeof fromSchema>;

export const joinsSchema = z.object({
  baseDadosIdJoin: z.number().int().positive(),
  campoFrom: z.string(),
  campoJoin: z.string(),
  tipo: tipoJoinEnumSchema,
});
export type Join = z.infer<typeof joinsSchema>;

export const selectCampoSchema = z.object({
  campo: z.string(),
  rotulo: z.string(),
});
export type SelectCampo = z.infer<typeof selectCampoSchema>;

export const selectCamposFormSchema = z.object({
  campos: z.array(selectCampoSchema),
});
export type SelectCamposForm = z.infer<typeof selectCamposFormSchema>;

export const selectSchema = z.object({
  baseDadosId: z.number().int().positive(),
  joinIndex: z.number().int().min(0),
  campos: z.array(selectCampoSchema),
});
export type Select = z.infer<typeof selectSchema>;

export const filterSchema = z.object({
  baseDadosId: z.number().int().positive(),
  joinIndex: z.number().int().min(0),
  campo: z.string(),
  operador: operadorEnumSchema,
  valor: z.union([z.string(), z.number(), z.boolean()]),
});

export type GroupFilter = {
  type: z.infer<typeof tipoFiltroEnumSchema>;
  operadorWhere: z.infer<typeof operadorWhereEnumSchema>;
  groupFilter: GroupFilter[];
  filter: z.infer<typeof filterSchema>;
};

export const groupFilterSchema: z.ZodType<GroupFilter, GroupFilter> = z.lazy(
  () =>
    z.object({
      type: tipoFiltroEnumSchema,
      operadorWhere: operadorWhereEnumSchema,
      groupFilter: z.array(groupFilterSchema),
      filter: filterSchema,
    }),
);

export const configSchema = z.object({
  from: fromSchema,
  joins: z.array(joinsSchema),
  select: z.array(selectSchema),
  groupFilter: groupFilterSchema,
});

export const viewSchema = z.object({
  id: z.number().int().positive(),
  nome: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  descricao: z
    .string()
    .max(100, 'A descrição deve ter no máximo 100 caracteres'),
  config: configSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type ViewCampanha = z.infer<typeof viewSchema>;

export const viewCriacaoSchema = viewSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial({
    descricao: true,
  });
export type ViewCampanhaCriacao = z.infer<typeof viewCriacaoSchema>;

export const viewDadosSchema = viewSchema
  .pick({
    nome: true,
    descricao: true,
  })
  .partial({
    descricao: true,
  });
export type ViewDados = z.infer<typeof viewDadosSchema>;

export const viewEdicaoSchema = viewSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial({
    nome: true,
    descricao: true,
    config: true,
  });
export type ViewCampanhaEdicao = z.input<typeof viewEdicaoSchema>;

export const viewsApiResponseSchema = viewSchema
  .omit({
    config: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    usuario: usuarioBasicApiResponse.optional(),
  });
export type ViewsApiResponse = z.infer<typeof viewsApiResponseSchema>;

export const viewApiResponseSchema = viewSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    usuario: usuarioApiResponse,
  });

export const viewsCampanhaApiResponseSchema = viewsApiResponseSchema.extend({
  campos: z.array(camposDetailSchema),
});
export type ViewsCampanhaApiResponse = z.infer<
  typeof viewsCampanhaApiResponseSchema
>;

export type ViewTabelaRow = ViewsApiResponse | ViewsCampanhaApiResponse;

export type ViewApiResponse = z.infer<typeof viewApiResponseSchema>;

export const viewFiltrosSchema = z.object({
  nome: z.string().optional(),
  descricao: z.string().optional(),
  id: z.string().optional(),
});

export type ViewFiltros = z.infer<typeof viewFiltrosSchema>;

export type ViewExecutaValor = string | number | boolean | null;
export type ViewExecutaLinha = Record<string, ViewExecutaValor>;

const viewFiltroSimplesChaves = viewSchema
  .pick({ nome: true, descricao: true })
  .keyof();
export const viewFiltroSimplesChavesObjeto = {
  [viewFiltroSimplesChaves.enum.nome]: 'Nome',
  [viewFiltroSimplesChaves.enum.descricao]: 'Descrição',
};

export const viewFiltroSimplesChavesOptions = viewFiltroSimplesChaves.options;
export const viewFiltrosSimplesSchema = z.object({
  filtrarPor: viewFiltroSimplesChaves.optional(),
  valor: z.string().optional(),
});

export type ViewCampanhaFiltrosSimples = z.infer<
  typeof viewFiltrosSimplesSchema
>;

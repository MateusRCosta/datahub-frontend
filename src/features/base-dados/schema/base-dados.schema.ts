import {
  camposSchema,
  integracaoApiResponse,
  integracaoBasicApiResponse,
  usuarioApiResponse,
  usuarioBasicApiResponse,
} from '@/common/schema/relacao.schema';
import z from 'zod';

const TIPOS_PERMITIDOS = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/comma-separated-values',
  'application/csv',
];

export const enumSchema = z.enum([
  'TEXTO',
  'NUMERO',
  'BOOLEANO',
  'UTC',
  'MM_DD_YYYY',
  'DD_MM_YYYY',
  'YYYY_MM_DD',
  'EMAIL',
  'TELEFONE',
]);


export const metadadoSchema = z.object({
  tipo: enumSchema,
  obrigatorio: z
    .union([z.boolean(), z.string()])
    .transform((v) => v === true || v === 'true')
    .default(false),
  cabecalho: z
    .string()
    .min(1, 'O cabeçalho deve ter no mínimo 1 caracter')
    .max(100, 'O cabeçalho deve ter no máximo 100 caracteres'),
  rotulo: z.string().max(100, 'O cabeçalho deve ter no máximo 100 caracteres').optional(),
});

export type Metadado = z.infer<typeof metadadoSchema>;

export const estururaSchema = z.array(metadadoSchema);
export type Estrutura = z.infer<typeof estururaSchema>;

export const baseDadosSchema = z.object({
  id: z.number().int().positive(),
  nome: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  estrutura: estururaSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type BaseDados = z.infer<typeof baseDadosSchema>;

export const baseDadosCriacaoSchema = baseDadosSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    arquivo: z
      .file({ message: 'Arquivo obrigatório' })
      .mime(TIPOS_PERMITIDOS, 'O arquivo precisa ser um CSV'),
  });
export type BaseDadosCriacao = z.infer<typeof baseDadosCriacaoSchema>;

export const baseDadosEdicaoSchema = baseDadosSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  }).partial({
    nome: true,
    estrutura: true
  });
export type BaseDadosEdicao = z.input<typeof baseDadosEdicaoSchema>;

const _countSchema = z.object({
  clientes: z.int(),
});

export const basesDadosApiResponseSchema = baseDadosSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    integracao: integracaoBasicApiResponse.optional(),
    usuario: usuarioBasicApiResponse.optional(),
    _count: _countSchema,
  });
export type BasesDadosApiResponse = z.infer<typeof basesDadosApiResponseSchema>;

export const basesDadosCampanhaApiResponseSchema = basesDadosApiResponseSchema
  .extend({
    campos: z.array(camposSchema),
  })
  .omit({
    estrutura: true,
  });
export type BasesDadosCampanhaApiResponse = z.infer<
  typeof basesDadosCampanhaApiResponseSchema
>;

export const baseDadosApiResponseSchema = baseDadosSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    integracao: integracaoApiResponse,
    usuario: usuarioApiResponse,
    _count: _countSchema,
  });
export type BaseDadosApiResponse = z.infer<typeof baseDadosApiResponseSchema>;

export type BaseDadosTabelaRow =
  | BasesDadosApiResponse
  | BasesDadosCampanhaApiResponse;
export const baseDadosFiltrosSchema = z.object({
  nome: z.string().optional(),
  id: z.string().optional(),
});

export type BaseDadosFiltros = z.infer<typeof baseDadosFiltrosSchema>;

const baseDadosFiltroSimplesChaves = baseDadosSchema
  .pick({ nome: true })
  .keyof();
export const baseDadosFiltroSimplesChavesObjeto = {
  [baseDadosFiltroSimplesChaves.enum.nome]: 'Nome',
};

export const baseDadosFiltroSimplesChavesOptions =
  baseDadosFiltroSimplesChaves.options;
export const baseDadosFiltrosSimplesSchema = z.object({
  filtrarPor: baseDadosFiltroSimplesChaves.optional(),
  valor: z.string().optional(),
});

export type BaseDadosFiltrosSimples = z.infer<
  typeof baseDadosFiltrosSimplesSchema
>;

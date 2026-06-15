import {
  usuarioApiResponse,
  usuarioBasicApiResponse,
} from '@/common/schema/relacao.schema';
import { enumSchema } from '@/features/base-dados/schema/base-dados.schema';
import z from 'zod';

export const integracaoMetodoSchema = z.enum([
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
]);
export type IntegracaoMetodo = z.infer<typeof integracaoMetodoSchema>;

export const integracaoValorSchema = z.union([
  z.string().max(100, 'O valor nao pode ter mais de 100 caracteres'),
  z.number(),
  z.boolean(),
]);

export const integracaoHeaderSchema = z.object({
  chave: z.string().max(100, 'A chave nao pode ter mais de 100 caracteres'),
  valor: integracaoValorSchema,
});
export type IntegracaoHeader = z.infer<typeof integracaoHeaderSchema>;

export const integracaoVariavelIncrementoSchema = z.object({
  incrementa: z.boolean().default(false),
  limiteIncrementa: z.coerce.number().max(65536).optional(),
  limiteDataAtual: z.boolean().default(false),
  delimitador: z.boolean().default(false),
});
export type IntegracaoVariavelIncremento = z.infer<
  typeof integracaoVariavelIncrementoSchema
>;

export const integracaoVariavelSchema = z.object({
  nome: z.string().max(100, 'O nome deve ter no maximo 100 caracteres'),
  valor: z.string().max(256, 'O valor pode ter no maximo 256 caracteres'),
  tipo: enumSchema,
  incremento: integracaoVariavelIncrementoSchema.optional(),
});
export type IntegracaoVariavel = z.infer<typeof integracaoVariavelSchema>;

export const integracaoResponseSchema = z.object({
  nome: z.string().max(100, 'O nome deve ter no maximo 100 caracteres'),
  path: z.string().max(100, 'O caminho deve ter no maximo 100 caracteres'),
  tipo: enumSchema,
  identificador: z.boolean().default(false),
});
export type IntegracaoResponse = z.infer<typeof integracaoResponseSchema>;

const optionalUrlSchema = z
  .union([z.literal(''), z.httpUrl('Informe uma URL valida')])
  .optional()
  .transform((value) => (value === '' ? undefined : value));

export const integracaoSchema = z.object({
  id: z.number().int().positive(),
  usuarioId: z.number().int().positive(),

  nome: z.string().min(3, 'O nome deve ter no minimo 3 caracteres').max(100),
  limitDeRequisicaoPorMin: z.coerce.number().int().nonnegative().max(50),
  horaExecucao: z.coerce.number().min(0).max(24),
  status: z.boolean().default(true),

  urlAuth: optionalUrlSchema,
  metodoAuth: integracaoMetodoSchema.default('POST'),
  headersAuth: z.array(integracaoHeaderSchema).optional(),
  bodyAuth: z.string().max(1024).optional(),
  responseAuth: z.array(integracaoResponseSchema).optional(),
  variaveisAuth: z.array(integracaoVariavelSchema).optional(),

  urlRefresh: optionalUrlSchema,
  metodoRefresh: integracaoMetodoSchema.default('POST'),
  headersRefresh: z.array(integracaoHeaderSchema).optional(),
  bodyRefresh: z.string().max(1024).optional(),
  responseRefresh: z.array(integracaoResponseSchema).optional(),
  variaveisRefresh: z.array(integracaoVariavelSchema).optional(),

  urlScrap: z.httpUrl('Informe uma URL valida'),
  metodoScrap: integracaoMetodoSchema.default('GET'),
  headersScrap: z.array(integracaoHeaderSchema).optional(),
  bodyScrap: z.string().max(1024).optional(),
  responseScrap: z.array(integracaoResponseSchema).optional(),
  variaveisScrap: z.array(integracaoVariavelSchema).optional(),

  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type Integracao = z.infer<typeof integracaoSchema>;

export const integracaoCriacaoSchema = integracaoSchema.omit({
  id: true,
  usuarioId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type IntegracaoCriacao = z.infer<typeof integracaoCriacaoSchema>;

export const integracaoEdicaoSchema = integracaoCriacaoSchema.partial();
export type IntegracaoEdicao = z.input<typeof integracaoEdicaoSchema>;

export const integracoesApiResponseSchema = integracaoSchema
  .omit({
    usuarioId: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    usuario: usuarioBasicApiResponse.optional(),
  });
export type IntegracoesApiResponse = z.infer<
  typeof integracoesApiResponseSchema
>;

export const integracaoApiResponseSchema = integracaoSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    usuario: usuarioApiResponse,
  });
export type IntegracaoApiResponse = z.infer<typeof integracaoApiResponseSchema>;

export const integracaoFiltrosSchema = z.object({
  nome: z.string().optional(),
  status: z.string().optional(),
  id: z.string().optional(),
});
export type IntegracaoFiltros = z.infer<typeof integracaoFiltrosSchema>;

const integracaoFiltroSimplesChaves = integracaoSchema
  .pick({ nome: true })
  .keyof();
export const integracaoFiltroSimplesChavesObjeto = {
  [integracaoFiltroSimplesChaves.enum.nome]: 'Nome',
};
export const integracaoFiltroSimplesChavesOptions =
  integracaoFiltroSimplesChaves.options;

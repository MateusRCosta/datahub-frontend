import {
  usuarioApiResponse,
  usuarioBasicApiResponse,
} from '@/lib/schema/usuario.schema';
import z from 'zod';

export const provedorEnumSchema = z.enum({ UPCHAT: 'upchat' });
export type ProvedorEnum = z.infer<typeof provedorEnumSchema>;
export const upchatConfigSchema = z.object({
  url: z.httpUrl('Informe uma URL válida'),
  queueId: z.coerce
    .number('Informe uma fila válida')
    .int('A fila deve ser um número inteiro')
    .max(32767, 'A fila deve ser menor ou igual a 32767')
    .positive('A fila deve ser maior que zero'),
  apiKey: z
    .string()
    .min(1, 'A chave da API é obrigatória')
    .max(128, { message: 'A chave só pode ter 128 caracteres' }),
});
export type UpchatConfig = z.infer<typeof upchatConfigSchema>;
export const configSchema = z.union([upchatConfigSchema]);

export const integracaoCampanhaConfigDefaultValues: Record<
  ProvedorEnum,
  z.input<typeof configSchema>
> = {
  upchat: {
    url: '',
    queueId: '',
    apiKey: '',
  },
};

export const integracaoCampanhaSchema = z.object({
  id: z.number().int().positive(),
  nome: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  status: z.boolean(),
  provedor: provedorEnumSchema,
  config: configSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type IntegracaoCampanha = z.infer<typeof integracaoCampanhaSchema>;

export const integracaoCampanhaCriacaoSchema = integracaoCampanhaSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type IntegracaoCampanhaCriacao = z.infer<
  typeof integracaoCampanhaCriacaoSchema
>;

export const integracaoCampanhaEdicaoSchema = integracaoCampanhaSchema
  .omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial({
    nome: true,
    provedor: true,
    config: true,
  });
export type IntegracaoCampanhaEdicao = z.input<
  typeof integracaoCampanhaEdicaoSchema
>;

export const integracoesCampanhasApiResponseSchema = integracaoCampanhaSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    usuario: usuarioBasicApiResponse.optional(),
  });
export type IntegracoesCampanhasApiResponse = z.infer<
  typeof integracoesCampanhasApiResponseSchema
>;

export const integracaoCampanhaApiResponseSchema = integracaoCampanhaSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    usuario: usuarioApiResponse,
  });
export type IntegracaoCampanhaApiResponse = z.infer<
  typeof integracaoCampanhaApiResponseSchema
>;

export const integracaoCampanhaFiltrosSchema = z.object({
  nome: z.string().optional(),
  provedor: z.string().optional(),
  status: z.string().optional(),
  id: z.string().optional(),
});

export type IntegracaoCampanhaFiltros = z.infer<
  typeof integracaoCampanhaFiltrosSchema
>;

const integracaoCampanhaFiltroSimplesChaves = integracaoCampanhaSchema
  .pick({ nome: true, provedor: true })
  .keyof();
export const integracaoCampanhaFiltroSimplesChavesObjeto = {
  [integracaoCampanhaFiltroSimplesChaves.enum.nome]: 'Nome',
  [integracaoCampanhaFiltroSimplesChaves.enum.provedor]: 'Provedor',
};

export const integracaoCampanhaFiltroSimplesChavesOptions =
  integracaoCampanhaFiltroSimplesChaves.options;
export const integracaoCampanhaFiltrosSimplesSchema = z.object({
  filtrarPor: integracaoCampanhaFiltroSimplesChaves.optional(),
  valor: z.string().optional(),
});

export type IntegracaoCampanhaFiltrosSimples = z.infer<
  typeof integracaoCampanhaFiltrosSimplesSchema
>;

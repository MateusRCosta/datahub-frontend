import {
  baseDadosBasicApiResponse,
  camposDetailSchema,
  templateIntegracaoCampanhaApiResponse,
  templateIntegracaoCampanhaBasicApiResponse,
  usuarioBasicApiResponse,
  viewBasicApiResponse,
} from '@/common/schema/relacao.schema';
import z from 'zod';
import { STATUS_CAMPANHA } from '../types/campanha.types';

const varsSchema = z.record(z.string(), z.object({
  baseDadoId:z.number().int().optional(),
  nomeCampo: z.string()
}));
const statusEnumSchema = z.enum(STATUS_CAMPANHA);
export const campanhaSchema = z.object({
  id: z.number(),
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  status: statusEnumSchema,
  scheduledAt: z.date(),
  executedAt: z.date(),
  finishedAt: z.date(),
  templateId: z.number().int(),
  baseDadosId: z.number().int().optional(),
  viewId: z.number().int().optional(),
  usuarioId: z.number().int(),
  contatoCampo: z
    .string()
    .max(120, 'O contato campo deve ter no máximo 120 caracteres'),
  vars: varsSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
});

export type Campanha = z.infer<typeof campanhaSchema>;

export const campanhaResponseSchema = campanhaSchema
  .omit({
    viewId: true,
    baseDadosId: true,
    usuarioId: true,
    templateId: true,
    deletedAt: true,
  })
  .extend({
    usuario: usuarioBasicApiResponse,
    view: viewBasicApiResponse.optional(),
    template: templateIntegracaoCampanhaApiResponse,
    baseDeDados: baseDadosBasicApiResponse.optional(),
    campos: z.array(camposDetailSchema),
  });

export type CampanhaResponse = z.infer<typeof campanhaResponseSchema>;

export const campanhasResponseSchema = campanhaResponseSchema
  .omit({
    vars: true,
    contatoCampo: true,
    template: true,
    createdAt: true,
    updatedAt: true,
    executedAt: true,
    finishedAt: true,
  })
  .extend({
    template: templateIntegracaoCampanhaBasicApiResponse,
  });

export type CampanhasResponse = z.infer<typeof campanhasResponseSchema>;

export const campanhaFiltrosSchema = z.object({
  nome: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional(),
  templateId: z.string().optional(),
  viewId: z.string().optional(),
  baseDeDadoId: z.string().optional(),
  usuarioId: z.string().optional(),
});

export type CampanhaFiltros = z.infer<typeof campanhaFiltrosSchema>;

const campanhaFiltroSimplesChaves = campanhaSchema.pick({ nome: true }).keyof();
export const campanhaFiltroSimplesChavesObjeto = {
  [campanhaFiltroSimplesChaves.enum.nome]: 'Nome',
};

export const campanhaFiltroSimplesChavesOptions =
  campanhaFiltroSimplesChaves.options;
export const campanhaFiltrosSimplesSchema = z.object({
  filtrarPor: campanhaFiltroSimplesChaves.optional(),
  valor: z.string().optional(),
});

export type CampanhaFiltrosSimples = z.infer<
  typeof campanhaFiltrosSimplesSchema
>;

export const campanhaCreateSchema = campanhaSchema.pick({
  nome: true,
  scheduledAt: true,
  templateId: true,
  baseDadosId: true,
  contatoCampo: true,
  vars: true,
});

export type CampanhaCreateRequest = z.infer<typeof campanhaCreateSchema>;

export const campanhaUpdateRequest = campanhaSchema.pick({
  nome: true,
  scheduledAt: true,
  templateId: true,
  baseDadosId: true,
  contatoCampo: true,
  vars: true,
}).partial();

export type CampanhaUpdateRequest = z.infer<typeof campanhaUpdateRequest>;

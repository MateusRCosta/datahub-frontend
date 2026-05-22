import {
  usuarioApiResponse,
  usuarioBasicApiResponse,
} from '@/lib/schema/usuario.schema';
import z from 'zod';
import { upchatTemplateSchema } from './upchat.schema';
import { provedorEnumSchema } from '../../schema/integracao-campanha.schema';

export const configUnionSchema = z.union([upchatTemplateSchema]);
export const templateSchema = z.object({
  id: z.number().int().positive(),
  nome: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  config: configUnionSchema,
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type Template = z.infer<typeof templateSchema>;

export const templateCriacaoSchema = templateSchema
  .omit({
    id: true,
    nome: true,
    config: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    provedor: provedorEnumSchema,
  });
export type TemplateCriacao = z.infer<typeof templateCriacaoSchema>;

export const templateEdicaoSchema = templateSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .partial({
    nome: true,
    config: true,
  })
  .extend({
    provedor: provedorEnumSchema,
  });
export type TemplateEdicao = z.input<typeof templateEdicaoSchema>;

export const templatesApiResponseSchema = templateSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    usuario: usuarioBasicApiResponse.optional(),
  });
export type TemplatesApiResponse = z.infer<
  typeof templatesApiResponseSchema
>;

export const templateApiResponseSchema = templateSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    usuario: usuarioApiResponse,
  });
export type TemplateApiResponse = z.infer<
  typeof templateApiResponseSchema
>;

export const templateFiltrosSchema = z.object({
  nome: z.string().optional(),
  id: z.string().optional(),
});

export type TemplateFiltros = z.infer<typeof templateFiltrosSchema>;

const templateFiltroSimplesChaves = templateSchema
  .pick({ nome: true })
  .keyof();
export const templateFiltroSimplesChavesObjeto = {
  [templateFiltroSimplesChaves.enum.nome]: 'Nome',
};

export const templateFiltroSimplesChavesOptions =
  templateFiltroSimplesChaves.options;
export const templateFiltrosSimplesSchema = z.object({
  filtrarPor: templateFiltroSimplesChaves.optional(),
  valor: z.string().optional(),
});

export type TemplateFiltrosSimples = z.infer<
  typeof templateFiltrosSimplesSchema
>;

import { usuarioBasicApiResponse } from '@/lib/schema/usuario.schema';
import z from 'zod';
import { upchatTemplateSchema } from './upchat.schema';
import { ProvedorEnum, provedorEnumSchema } from '@/common/schema/provedor.schema';

export const configUnionSchema = z.union([upchatTemplateSchema]);

export const templateConfigDefaultValues: Record<
  ProvedorEnum,
  z.input<typeof configUnionSchema>
> = {
  upchat: {
    id: '',
    nome: '',
    tituloTemplate: '',
    mensagemTemplate: '',
    rodapeTemplate: '',
    botoes: [],
  },
};

export const templateSchema = z.object({
  id: z.number().int().positive(),
  nome: z
    .string()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  config: configUnionSchema,
  quantidadeVars: z
    .number()
    .max(1024, 'O número de variáveis aceitas é até 1024')
    .int()
    .positive(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type Template = z.infer<typeof templateSchema>;

export const templateCriacaoSchema = templateSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    provedor: provedorEnumSchema,
    integracaoCampanhaId: z.number().int().positive(),
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
    quantidadeVars: true,
  })
  .extend({
    provedor: provedorEnumSchema.optional(),
  });
export type TemplateEdicao = z.input<typeof templateEdicaoSchema>;

const integracaoCampanhaSchema = z.object({
  nome: z.string(),
  provedor: provedorEnumSchema,
});

export const templatesApiResponseSchema = templateSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    integracaoCampanha: integracaoCampanhaSchema,
  });
export type TemplatesApiResponse = z.infer<typeof templatesApiResponseSchema>;

export const templateApiResponseSchema = templateSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    integracaoCampanha: integracaoCampanhaSchema,
    usuario: usuarioBasicApiResponse,
  });
export type TemplateApiResponse = z.infer<typeof templateApiResponseSchema>;

export const templateFiltrosSchema = z.object({
  nome: z.string().optional(),
  provedor: z.string().optional(),
  id: z.string().optional(),
});

export type TemplateFiltros = z.infer<typeof templateFiltrosSchema>;

const templateFiltroSimplesChaves = templateSchema.pick({ nome: true }).keyof();
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

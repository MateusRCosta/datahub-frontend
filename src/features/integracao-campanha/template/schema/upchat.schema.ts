import z from 'zod';

export const tipoBotoesEnumSchema = z.enum({
  FLOW: 'flow',
  QUICK_REPLY: 'quickReply',
  PHONE_NUMBER: 'phoneNumber',
  URL: 'url',
});
export type TipoBotoesEnum = z.infer<typeof tipoBotoesEnumSchema>;

export const botaoBaseSchema = z.object({
  textoBotao: z.string().max(25),
});

export const botaoQuickReply = botaoBaseSchema;

export const botaoPhoneNumber = botaoBaseSchema.extend({
  numeroTelefone: z.string().max(20),
});

export const botaoUrl = botaoBaseSchema.extend({
  url: z.httpUrl().max(2000),
});

export const botaoFlow = botaoBaseSchema.extend({
  flowId: z.string().max(36),
});

export const botoesSchema = z.union([
  botaoFlow,
  botaoPhoneNumber,
  botaoQuickReply,
  botaoUrl,
]);

export const upchatTemplateSchema = z.object({
  id: z.number().max(65536),
  nome: z.string().max(200),
  tituloTemplate: z.string().max(60),
  mensagemTemplate: z.string().max(1024),
  rodapeTemplate: z.string().max(60),
  botoes: botoesSchema,
});

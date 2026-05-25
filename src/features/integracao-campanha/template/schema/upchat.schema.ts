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

export const botaoQuickReply = botaoBaseSchema.extend({
  tipo: z.literal(tipoBotoesEnumSchema.enum.QUICK_REPLY),
});

export const botaoPhoneNumber = botaoBaseSchema.extend({
  tipo: z.literal(tipoBotoesEnumSchema.enum.PHONE_NUMBER),
  numeroTelefone: z.string().max(20),
});

export const botaoUrl = botaoBaseSchema.extend({
  tipo: z.literal(tipoBotoesEnumSchema.enum.URL),
  url: z.httpUrl('Informe uma URL válida').max(2000),
});

export const botaoFlow = botaoBaseSchema.extend({
  tipo: z.literal(tipoBotoesEnumSchema.enum.FLOW),
  flowId: z.string().max(36),
});

export const botoesSchema = z.discriminatedUnion('tipo', [
  botaoFlow.strict(),
  botaoPhoneNumber.strict(),
  botaoUrl.strict(),
  botaoQuickReply.strict(),
]);

export const upchatTemplateSchema = z.object({
  id: z.coerce
    .number('Informe o ID do template')
    .int('O ID deve ser um número inteiro')
    .positive('O ID deve ser maior que zero')
    .max(65536),
  nome: z.string().max(200).optional(),
  tituloTemplate: z.string().max(60).optional(),
  mensagemTemplate: z.string().max(1024).optional(),
  rodapeTemplate: z.string().max(60).optional(),
  botoes: z
    .array(botoesSchema)
    .max(3, { message: 'O máximo de botões é 3' })
    .optional(),
});

export type UpchatTemplate = z.infer<typeof upchatTemplateSchema>;

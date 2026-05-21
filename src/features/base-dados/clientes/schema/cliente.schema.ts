import z from 'zod';

export const codigoEnumSchema = z.enum(['EMAIL_INVALIDO', 'TELEFONE_INVALIDO', 'REQUIRED', 'INVALID_DATE', 'INVALID_BOOLEAN', 'INVALID_NUMBER']);

export const validacaoSchema = z.object({
  cabecalho: z.string(),
  codigo: codigoEnumSchema,
  mensagem: z.string(),
});
export type Validacao = z.infer<typeof validacaoSchema>;

export const valoresDadosSchema = z.union([z.string().max(655336), z.number(), z.boolean()]);
export const clienteSchema = z.object({
  id: z.int().positive(),
  baseDadosId: z.int().positive(),
  hash: z.string().max(64),
  dados: z.record(z.string(), valoresDadosSchema),
  validacao: z.array(validacaoSchema),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});
export type Cliente = z.infer<typeof clienteSchema>;

export const clienteEdicaoSchema = clienteSchema.pick({
  dados: true,
});
export type ClienteEdicao = z.infer<typeof clienteEdicaoSchema>;


export const clientesResponseSchema = clienteSchema.pick({
  id: true,
  baseDadosId: true,
  dados: true,
  validacao: true,
});
export type ClientesResponse = z.infer<typeof clientesResponseSchema>;

export const clienteResponseSchema = clienteSchema.pick({
  id: true,
  baseDadosId: true,
  dados: true,
  validacao: true,
  createdAt: true,
  updatedAt: true
});
export type ClienteResponse = z.infer<typeof clienteResponseSchema>;

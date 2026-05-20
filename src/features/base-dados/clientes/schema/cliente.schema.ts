import z, { hash } from 'zod';

export const validacaoSchema = z.object({
  cabecalho: z.string(),
  codigo: z.string(),
  mensagem: z.string(),
});
export type Validacao = z.infer<typeof validacaoSchema>;

export const clienteSchema = z.object({
  id: z.int().positive(),
  baseDadosId: z.int().positive(),
  hash: z.string().max(64),
  dados: z.record(z.string(), z.unknown()),
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

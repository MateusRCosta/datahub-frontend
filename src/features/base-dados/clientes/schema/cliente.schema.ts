import z from 'zod';
import { Estrutura, Metadado } from '../../schema/base-dados.schema';

export const codigoEnumSchema = z.enum([
  'EMAIL_INVALIDO',
  'TELEFONE_INVALIDO',
  'REQUIRED',
  'INVALID_DATE',
  'INVALID_BOOLEAN',
  'INVALID_NUMBER',
]);

export const validacaoSchema = z.object({
  cabecalho: z.string(),
  codigo: codigoEnumSchema,
  mensagem: z.string(),
});
export type Validacao = z.infer<typeof validacaoSchema>;

export const valoresDadosSchema = z.union([
  z.string().max(655336),
  z.number(),
  z.boolean(),
]);
const valoresDadosEdicaoSchema = valoresDadosSchema.optional();
type ValorDadosEdicao = z.infer<typeof valoresDadosEdicaoSchema>;

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

export const clienteEdicaoSchema = z.object({
  dados: z.record(z.string(), valoresDadosEdicaoSchema),
});
export type ClienteEdicao = z.infer<typeof clienteEdicaoSchema>;

const valorVazioParaIndefinido = (value: unknown) => {
  if (value === null || value === '') return undefined;
  return value;
};

const campoTextoObrigatorio = (mensagem: string) =>
  z.preprocess(
    (value) => (value === null ? '' : value),
    z.string().trim().min(1, mensagem).max(655336),
  );

const campoTextoOpcional = () =>
  z.preprocess(
    valorVazioParaIndefinido,
    z.string().trim().max(655336).optional(),
  );

const campoNumeroObrigatorio = () =>
  z.preprocess(
    (value) => {
      if (value === null || value === '') return undefined;
      if (typeof value === 'string') return Number(value);
      return value;
    },
    z.number({ message: 'Informe um número válido' }),
  );

const campoNumeroOpcional = () =>
  z.preprocess(
    (value) => {
      if (value === null || value === '') return undefined;
      if (typeof value === 'string') return Number(value);
      return value;
    },
    z.number({ message: 'Informe um número válido' }).optional(),
  );

const campoBooleanoObrigatorio = () =>
  z.preprocess(
    (value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    },
    z.boolean({ message: 'Informe verdadeiro ou falso' }),
  );

const campoBooleanoOpcional = () =>
  z.preprocess(
    (value) => {
      if (value === null || value === '') return undefined;
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    },
    z.boolean({ message: 'Informe verdadeiro ou falso' }).optional(),
  );

const criaCampoObrigatorioSchema = (campo: Metadado) => {
  switch (campo.tipo) {
    case 'NUMERO':
      return campoNumeroObrigatorio();
    case 'BOOLEANO':
      return campoBooleanoObrigatorio();
    case 'EMAIL':
      return z.preprocess(
        (value) => (value === null ? '' : value),
        z
          .string()
          .trim()
          .min(1, 'Campo obrigatório')
          .max(655336)
          .email('Informe um e-mail válido'),
      );
    case 'UTC':
    case 'MM_DD_YYYY':
    case 'DD_MM_YYYY':
    case 'YYYY_MM_DD':
      return campoTextoObrigatorio('Informe uma data válida');
    case 'TELEFONE':
    case 'TEXTO':
      return campoTextoObrigatorio('Campo obrigatório');
  }
};

const criaCampoOpcionalSchema = (campo: Metadado) => {
  switch (campo.tipo) {
    case 'NUMERO':
      return campoNumeroOpcional();
    case 'BOOLEANO':
      return campoBooleanoOpcional();
    case 'EMAIL':
      return campoTextoOpcional().refine(
        (value) => value === undefined || z.email().safeParse(value).success,
        'Informe um e-mail válido',
      );
    case 'UTC':
    case 'MM_DD_YYYY':
    case 'DD_MM_YYYY':
    case 'YYYY_MM_DD':
    case 'TELEFONE':
    case 'TEXTO':
      return campoTextoOpcional();
  }
};

export const criaClienteEdicaoSchema = (estrutura: Estrutura) =>
  z.object({
    dados: z.object(
      estrutura.reduce<Record<string, z.ZodType<ValorDadosEdicao>>>(
        (acc, campo) => {
          acc[campo.cabecalho] = campo.obrigatorio
            ? criaCampoObrigatorioSchema(campo)
            : criaCampoOpcionalSchema(campo);
          return acc;
        },
        {},
      ),
    ),
  });

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
  updatedAt: true,
});
export type ClienteResponse = z.infer<typeof clienteResponseSchema>;

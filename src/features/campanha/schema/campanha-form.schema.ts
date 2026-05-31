import z from 'zod';
import { campanhaSchema } from './campanha.schema';

const varsRecordSchema = campanhaSchema.shape.vars;

const varItemSchema = z.object({
  variavel: z.string(),
  valor: z.string(),
});

const varsFormularioSchema = z
  .array(varItemSchema)
  .transform((value, ctx) => {
    const resultado: Record<string, string> = {};

    for (const item of value) {
      const variavel = item.variavel.trim();
      const valor = item.valor;

      if (!variavel && !valor) continue;

      if (!variavel) {
        ctx.addIssue({
          code: 'custom',
          message: 'Informe o nome da variável.',
        });
        return z.NEVER;
      }

      if (variavel in resultado) {
        ctx.addIssue({
          code: 'custom',
          message: `A variável "${variavel}" foi informada mais de uma vez.`,
        });
        return z.NEVER;
      }

      resultado[variavel] = valor;
    }

    const result = varsRecordSchema.safeParse(resultado);
    if (!result.success) {
      ctx.addIssue({
        code: 'custom',
        message: 'As variáveis devem ser pares de texto.',
      });
      return z.NEVER;
    }

    return result.data;
  });

const dataAgendamentoSchema = z
  .union([z.string().min(1, 'Agendamento obrigatório'), z.date()])
  .pipe(z.coerce.date())
  .refine((date) => date.getTime() > Date.now(), {
    message: 'O agendamento deve ser uma data futura.',
  });

const campanhaFonteDadosSchema = z
  .object({
    baseDadosId: z.number().int().positive().optional(),
    viewId: z.number().int().positive().optional(),
  })
  .superRefine((data, ctx) => {
    const temBaseDados = data.baseDadosId !== undefined;
    const temView = data.viewId !== undefined;

    if (temBaseDados === temView) {
      ctx.addIssue({
        code: 'custom',
        path: ['baseDadosId'],
        message:
          'Selecione exatamente uma fonte: visualização ou base de dados.',
      });
    }
  });

export const campanhaFormularioSchema = campanhaSchema
  .pick({
    nome: true,
    scheduledAt: true,
    templateId: true,
    baseDadosId: true,
    viewId: true,
    contatoCampo: true,
    vars: true,
  })
  .extend({
    scheduledAt: dataAgendamentoSchema,
    templateId: z.number().int().positive('Selecione um template.'),
    contatoCampo: campanhaSchema.shape.contatoCampo.min(
      1,
      'Informe o campo de contato.',
    ),
    vars: varsFormularioSchema,
  })
  .and(campanhaFonteDadosSchema);

export type CampanhaFormularioInput = z.input<typeof campanhaFormularioSchema>;
export type CampanhaFormulario = z.output<typeof campanhaFormularioSchema>;

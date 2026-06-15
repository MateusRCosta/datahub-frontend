import z from 'zod';
import { campanhaSchema } from './campanha.schema';

const varItemSchema = z.object({
  variavel: z.string(),
  valor: z.string(),
  baseDadosId: z.number().int().optional(),
});

const varsFormularioSchema = z.array(varItemSchema);

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
    contatoCampo: campanhaSchema.shape.contatoCampo,
    vars: varsFormularioSchema,
  })
  .and(campanhaFonteDadosSchema);

export type CampanhaFormularioInput = z.input<typeof campanhaFormularioSchema>;
export type CampanhaFormulario = z.output<typeof campanhaFormularioSchema>;

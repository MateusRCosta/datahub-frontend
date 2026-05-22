import z from 'zod';

export const permissoesSchema = z.enum([
  'GERENCIAR_BASE_DADOS',
  'GERENCIAR_CAMPANHAS',
  'GERENCIAR_INTEGRACOES',
  'GERENCIAR_VISUALIZACOES',
]);

export const usuarioSchema = z.object({
  id: z.number(),
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.email(),
  senha: z
    .string()
    .trim()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
    .max(255, { message: 'A senha deve ter no máximo 255 caracteres' })
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\:;<>./~`'"])/.test(
          value,
        ),
      {
        message:
          'A senha deve conter letras maiúsculas, minúsculas, números e um caractere especial',
      },
    ),
  ativo: z.boolean(),
  admin: z.boolean(),
  permissoes: permissoesSchema.array(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type Usuario = z.infer<typeof usuarioSchema>;

export const usuarioResponseSchema = usuarioSchema.omit({
  senha: true,
});

export type UsuarioResponse = z.infer<typeof usuarioResponseSchema>;

export const usuariosResponseSchema = usuarioSchema.omit({
  senha: true,
  createdAt: true,
  updatedAt: true,
});

export type UsuariosResponse = z.infer<typeof usuariosResponseSchema>;

export const usuarioFiltrosSchema = z.object({
  nome: z.string().optional(),
  email: z.string().optional(),
  ativo: z.boolean().optional(),
  admin: z.boolean().optional(),
});

export type UsuarioFiltros = z.infer<typeof usuarioFiltrosSchema>;

const usuarioFiltroSimplesChaves = usuarioSchema
  .pick({ nome: true, email: true })
  .keyof();
export const usuarioFiltroSimplesChavesObjeto = {
  [usuarioFiltroSimplesChaves.enum.nome]: 'Nome',
  [usuarioFiltroSimplesChaves.enum.email]: 'Email',
};

export const usuarioFiltroSimplesChavesOptions =
  usuarioFiltroSimplesChaves.options;
export const usuarioFiltrosSimplesSchema = z.object({
  filtrarPor: usuarioFiltroSimplesChaves.optional(),
  valor: z.string().optional(),
});

export type UsuarioFiltrosSimples = z.infer<typeof usuarioFiltrosSimplesSchema>;

const senhaValidator = z
  .string()
  .or(z.literal(''))
  .transform((val) => (val.trim() === '' ? undefined : val.trim()))
  .refine((val) => {
    if (val === undefined) return true;
    return val.length >= 8 && val.length <= 255;
  }, 'A senha deve ter entre 8 e 255 caracteres')
  .refine((val) => {
    if (val === undefined) return true;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\:;<>./~`'"])/.test(
      val,
    );
  }, 'A senha deve conter letras maiúsculas, minúsculas, números e um caractere especial');

export const usuarioCreateSchema = usuarioSchema.pick({
  nome: true,
  email: true,
  senha: true,
  admin: true,
  permissoes: true,
});

export type UsuarioCreateRequest = z.infer<typeof usuarioCreateSchema>;

export const usuarioUpdateRequest = usuarioSchema
  .pick({
    nome: true,
    admin: true,
    permissoes: true,
  })
  .extend({
    senha: senhaValidator,
  });

export type UsuarioUpdateRequest = z.infer<typeof usuarioUpdateRequest>;

export const usuarioUpdateRequestInput = usuarioUpdateRequest
  .omit({
    senha: true,
  })
  .extend({
    senha: senhaValidator,
  });

export type UsuarioUpdateRequestInput = z.input<
  typeof usuarioUpdateRequestInput
>;

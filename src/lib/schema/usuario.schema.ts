import z from 'zod';

export const usuarioApiResponse = z.object({
  id: z.int(),
  nome: z.string(),
});

export const usuarioBasicApiResponse = usuarioApiResponse.omit({
  id: true,
});

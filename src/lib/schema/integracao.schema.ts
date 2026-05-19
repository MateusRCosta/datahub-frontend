import z from 'zod';

export const integracaoApiResponse = z.object({
  id: z.int(),
  nome: z.string(),
});

export const integracaoBasicApiResponse = integracaoApiResponse.omit({
  id: true,
});

import { provedorEnumSchema } from './provedor.schema';
import z from 'zod';

export const basicApiResponse = z.object({
  nome: z.string(),
});
export const baseDadosBasicApiResponse = basicApiResponse;
export const viewBasicApiResponse = basicApiResponse;
export const integracaoCampanhaBasicApiResponse = basicApiResponse;
export const templateBasicApiResponse = basicApiResponse;
export const integracaoCampanhaApiResponse = basicApiResponse.extend({
  provedor: provedorEnumSchema,
});

export const templateIntegracaoCampanhaBasicApiResponse = templateBasicApiResponse.extend({
  integracaoCampanha: integracaoCampanhaApiResponse,
});

export const templateIntegracaoCampanhaApiResponse = templateIntegracaoCampanhaBasicApiResponse.extend({
    id: z.number()
})
export const integracaoApiResponse = z.object({
  id: z.int(),
  nome: z.string(),
});

export const integracaoBasicApiResponse = integracaoApiResponse.omit({
  id: true,
});

export const usuarioApiResponse = z.object({
  id: z.int(),
  nome: z.string(),
});

export const usuarioBasicApiResponse = usuarioApiResponse.omit({
  id: true,
});

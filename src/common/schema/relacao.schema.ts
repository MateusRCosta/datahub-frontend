import { provedorEnumSchema } from './provedor.schema';
import z from 'zod';

export const camposSchema = z.object({
  campo: z.string(),
  rotulo: z.string().optional(),
});
export const camposDetailSchema = camposSchema.extend({
  baseDadoId: z.number().int().optional(),
});

export const basicApiResponse = z.object({
  nome: z.string(),
});
export const baseDadosBasicApiResponse = basicApiResponse.extend({
  id: z.number().optional(),
  campos: z.array(camposSchema).optional(),
});
export const viewBasicApiResponse = basicApiResponse.extend({
  id: z.number().optional(),
  campos: z.array(camposSchema).optional(),
});
export const integracaoCampanhaBasicApiResponse = basicApiResponse;
export const templateBasicApiResponse = basicApiResponse;
export const integracaoCampanhaApiResponse = basicApiResponse.extend({
  provedor: provedorEnumSchema,
});

export const templateIntegracaoCampanhaBasicApiResponse =
  templateBasicApiResponse.extend({
    quantidadeVars: z.number(),
    integracaoCampanha: integracaoCampanhaApiResponse,
  });

export const templateIntegracaoCampanhaApiResponse =
  templateIntegracaoCampanhaBasicApiResponse.extend({
    id: z.number(),
  });
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

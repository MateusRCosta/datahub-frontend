import { enumSchema } from '@/features/base-dados/schema/base-dados.schema';
import {
  IntegracaoCriacao,
  IntegracaoMetodo,
  IntegracaoResponse,
  IntegracaoVariavel,
  IntegracaoVariavelIncremento,
  integracaoMetodoSchema,
} from '../schema/integracao.schema';

export const integracaoDefaultValues: IntegracaoCriacao = {
  nome: '',
  limitDeRequisicaoPorMin: 0,
  horaExecucao: 0,
  urlAuth: undefined,
  metodoAuth: 'POST',
  headersAuth: [],
  bodyAuth: '',
  responseAuth: [],
  variaveisAuth: [],
  urlRefresh: undefined,
  metodoRefresh: 'POST',
  headersRefresh: [],
  bodyRefresh: '',
  responseRefresh: [],
  variaveisRefresh: [],
  urlScrap: '',
  metodoScrap: 'GET',
  headersScrap: [],
  bodyScrap: '',
  responseScrap: [],
  variaveisScrap: [],
};

const criaResponse = (): IntegracaoResponse => ({
  nome: '',
  path: '',
  tipo: enumSchema.enum.TEXTO,
  identificador: false,
});

const criaIncremento = (): IntegracaoVariavelIncremento => ({
  incrementa: false,
  limiteIncrementa: undefined,
  limiteDataAtual: false,
  delimitador: false,
});

const normalizaBooleano = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  return false;
};

const nullableString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : value == null ? fallback : String(value);

const nullableArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? value : [];

const nullableUrl = (value: unknown): string | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  return typeof value === 'string' ? value : undefined;
};

const normalizaMetodo = (
  value: unknown,
  fallback: IntegracaoMetodo,
): IntegracaoMetodo => {
  const metodo =
    typeof value === 'string' ? value.toUpperCase() : String(value ?? '');
  return (integracaoMetodoSchema.options as readonly string[]).includes(metodo)
    ? (metodo as IntegracaoMetodo)
    : fallback;
};

function normalizaResponse(value: unknown): IntegracaoResponse {
  if (!value || typeof value !== 'object') return criaResponse();
  const item = value as Record<string, unknown>;
  const tipo = item.tipo;
  return {
    nome: nullableString(item.nome),
    path: nullableString(item.path),
    tipo:
      typeof tipo === 'string' &&
      (enumSchema.options as readonly string[]).includes(tipo)
        ? (tipo as IntegracaoResponse['tipo'])
        : enumSchema.enum.TEXTO,
    identificador: Boolean(item.identificador),
  };
}

function normalizaResponses(value: unknown): IntegracaoResponse[] {
  if (Array.isArray(value)) return value.map(normalizaResponse);
  if (value && typeof value === 'object') return [normalizaResponse(value)];
  return [];
}

function normalizaIncremento(value: unknown): IntegracaoVariavelIncremento {
  if (!value || typeof value !== 'object') return criaIncremento();
  const item = value as Record<string, unknown>;
  const limite = item.limiteIncrementa;
  return {
    incrementa: Boolean(item.incrementa),
    limiteIncrementa:
      limite === null || limite === undefined ? undefined : Number(limite),
    limiteDataAtual:
      item.limiteDataAtual === null ? false : Boolean(item.limiteDataAtual),
    delimitador: normalizaBooleano(item.delimitador),
  };
}

function normalizaVariavel(value: unknown): IntegracaoVariavel {
  if (!value || typeof value !== 'object') {
    return {
      nome: '',
      valor: '',
      tipo: enumSchema.enum.TEXTO,
      incremento: criaIncremento(),
    };
  }
  const item = value as Record<string, unknown>;
  const tipo = item.tipo;
  return {
    nome: nullableString(item.nome),
    valor: nullableString(item.valor),
    tipo:
      typeof tipo === 'string' &&
      (enumSchema.options as readonly string[]).includes(tipo)
        ? (tipo as IntegracaoVariavel['tipo'])
        : enumSchema.enum.TEXTO,
    incremento: item.incremento
      ? normalizaIncremento(item.incremento)
      : undefined,
  };
}

export function normalizaIntegracaoFormValues(
  values?: Partial<IntegracaoCriacao> | Record<string, unknown> | null,
): IntegracaoCriacao {
  const source = (values ?? {}) as Record<string, unknown>;

  return {
    nome: nullableString(source.nome, integracaoDefaultValues.nome),
    limitDeRequisicaoPorMin: Number(
      source.limitDeRequisicaoPorMin ??
        integracaoDefaultValues.limitDeRequisicaoPorMin,
    ),
    horaExecucao: Number(
      source.horaExecucao ?? integracaoDefaultValues.horaExecucao,
    ),
    urlAuth: nullableUrl(source.urlAuth),
    metodoAuth: normalizaMetodo(
      source.metodoAuth,
      integracaoDefaultValues.metodoAuth,
    ),
    headersAuth: nullableArray(source.headersAuth),
    bodyAuth: nullableString(source.bodyAuth ?? source.bodyRequestAuth),
    responseAuth: normalizaResponses(source.responseAuth),
    variaveisAuth: nullableArray(source.variaveisAuth).map(normalizaVariavel),
    urlRefresh: nullableUrl(source.urlRefresh),
    metodoRefresh: normalizaMetodo(
      source.metodoRefresh,
      integracaoDefaultValues.metodoRefresh,
    ),
    headersRefresh: nullableArray(source.headersRefresh),
    bodyRefresh: nullableString(
      source.bodyRefresh ?? source.bodyRequestRefresh,
    ),
    responseRefresh: normalizaResponses(source.responseRefresh),
    variaveisRefresh: nullableArray(source.variaveisRefresh).map(
      normalizaVariavel,
    ),
    urlScrap: nullableString(source.urlScrap, integracaoDefaultValues.urlScrap),
    metodoScrap: normalizaMetodo(
      source.metodoScrap,
      integracaoDefaultValues.metodoScrap,
    ),
    headersScrap: nullableArray(source.headersScrap),
    bodyScrap: nullableString(source.bodyScrap ?? source.bodyRequestScrap),
    responseScrap: normalizaResponses(source.responseScrap),
    variaveisScrap: nullableArray(source.variaveisScrap).map(normalizaVariavel),
  };
}

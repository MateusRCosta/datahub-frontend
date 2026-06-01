import { ApiResponseError } from '@/types/api.schema';
import { MAX_JOINS, MAX_NESTED_GROUP_FILTER } from '../../constants';
import { ErrorMapper } from '@/types/util.schema';


const VIEW_ERROR_MAPPERS: ErrorMapper[] = [
  {
    pattern: /A view permite no maximo \d+ joins/i,
    getMessage: () => `A visualização permite no máximo ${MAX_JOINS} conexões.`,
  },

  {
    pattern: /A view permite filtros com profundidade maxima de \d+/i,
    getMessage: () =>
      `A visualização permite filtros com profundidade máxima de ${MAX_NESTED_GROUP_FILTER}.`,
  },

  {
    pattern:
      /Base de dados (\d+) com joinIndex (\d+) nao foi declarada na view/i,
    getMessage: ([, baseDadosId]) =>
      `A base de dados #${baseDadosId} não está vinculada à visualização.`,
  },

  {
    pattern: /joinIndex (\d+) nao foi declarado na view/i,
    getMessage: ([, joinIndex]) =>
      `A conexão #${joinIndex} não foi encontrada na visualização.`,
  },

  {
    pattern: /Uma ou mais bases de dados da view nao foram encontradas/i,
    getMessage: () =>
      'Uma ou mais bases de dados da visualização não foram encontradas.',
  },

  {
    pattern: /Estrutura da base de dados (\d+) esta invalida/i,
    getMessage: ([, baseId]) =>
      `A estrutura da base de dados #${baseId} está inválida.`,
  },

  {
    pattern: /Tipo de join nao suportado: (.+)/i,
    getMessage: ([, tipo]) => `O tipo de conexão "${tipo}" não é suportado.`,
  },

  {
    pattern: /Operador de filtro nao suportado: (.+)/i,
    getMessage: ([, operador]) =>
      `O operador de filtro "${operador}" não é suportado.`,
  },

  {
    pattern: /Base de dados (\d+) nao foi carregada/i,
    getMessage: ([, baseDadosId]) =>
      `A base de dados #${baseDadosId} não pôde ser carregada.`,
  },

  {
    pattern: /Campo "(.+)" nao existe na base de dados (\d+)/i,
    getMessage: ([, nomeCampo]) => `O campo "${nomeCampo}" não foi encontrado.`,
  },

  {
    pattern: /Grupo de filtros nao pode ser vazio/i,
    getMessage: () => 'Adicione ao menos um filtro ao grupo.',
  },
  {
    pattern: /Internal server error/i,
    getMessage: () => 'Erro interno de servidor.',
  },
];

export function mapViewError(
  error: ApiResponseError | null | undefined,
): string {
  if (!error?.message) {
    return 'Ocorreu um erro inesperado.';
  }

  for (const mapper of VIEW_ERROR_MAPPERS) {
    const match = error.message.match(mapper.pattern);

    if (match) {
      return mapper.getMessage(match);
    }
  }

  return error.message;
}

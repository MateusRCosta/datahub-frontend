import { ApiResponseError } from '@/types/api.schema';
import { ErrorMapper } from '@/types/util.schema';

const CAMPANHA_ERROR_MAPPERS: ErrorMapper[] = [
  {
    pattern: /Informe ou uma base ou uma view/i,
    getMessage: () => 'Informe uma fonte de dados.',
  },
  {
    pattern: /Selecione exatamente uma fonte/i,
    getMessage: () =>
      'Selecione exatamente uma fonte: visualização ou base de dados.',
  },
  {
    pattern: /Informe ao menos um campo para atualizar/i,
    getMessage: () => 'Informe um campo para atualizar.',
  },
  {
    pattern: /Campanha so pode ser alterada quando estiver PENDENTE/i,
    getMessage: () => 'Campanha só pode ser alterada quando estiver pendente.',
  },
  {
    pattern: /scheduledAt nao pode ser anterior a data atual/i,
    getMessage: () => 'Agendamento não pode ser anterior à data atual.',
  },
  {
    pattern: /vars da campanha esta invalido/i,
    getMessage: () => 'Variáveis incorretas.',
  },
  {
    pattern: /O template informado nao foi encontrado/i,
    getMessage: () => 'O template informado não foi encontrado.',
  },
  {
    pattern: /A qtd de vars e maior do que o permitido pelo template/i,
    getMessage: () =>
      'A quantidade de variáveis é maior do que o permitido pelo template.',
  },
  {
    pattern: /Campo "(.+)" nao existe na base de dados/i,
    getMessage: ([, campo]) =>
      `O campo "${campo}" não existe na base de dados.`,
  },
  {
    pattern: /Campo "(.+)" nao existe na view/i,
    getMessage: ([, campo]) => `O campo "${campo}" não existe na visualização.`,
  },
  {
    pattern: /nao existe na base de dados/i,
    getMessage: () => 'O campo referenciado não existe na base de dados.',
  },
  {
    pattern: /nao existe na view/i,
    getMessage: () => 'O campo referenciado não existe na visualização.',
  },
  {
    pattern: /Internal server error/i,
    getMessage: () => 'Erro interno de servidor.',
  },
];

export function mapCampanhaError(
  error: ApiResponseError | null | undefined,
): string {
  if (!error?.message) {
    return 'Ocorreu um erro inesperado.';
  }

  for (const mapper of CAMPANHA_ERROR_MAPPERS) {
    const match = error.message.match(mapper.pattern);

    if (match) {
      return mapper.getMessage(match);
    }
  }

  return error.message;
}

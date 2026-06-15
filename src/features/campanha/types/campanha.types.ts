export enum STATUS_CAMPANHA {
  ENVIADA = 'enviada',
  EM_ENVIO = 'emEnvio',
  PAUSA = 'pausa',
  CANCELADA = 'cancelada',
  PENDENTE = 'pendente',
}

export const STATUS_CAMPANHA_LABEL: Record<STATUS_CAMPANHA, string> = {
  [STATUS_CAMPANHA.PENDENTE]: 'Pendente',
  [STATUS_CAMPANHA.EM_ENVIO]: 'Em envio',
  [STATUS_CAMPANHA.PAUSA]: 'Pausada',
  [STATUS_CAMPANHA.CANCELADA]: 'Cancelada',
  [STATUS_CAMPANHA.ENVIADA]: 'Enviada',
};

export const STATUS_CAMPANHA_OPTIONS = Object.values(STATUS_CAMPANHA).map(
  (status) => ({
    label: STATUS_CAMPANHA_LABEL[status],
    value: status,
  }),
);

export const STATUS_CAMPANHA_TRANSICOES: Record<
  STATUS_CAMPANHA,
  STATUS_CAMPANHA[]
> = {
  [STATUS_CAMPANHA.PENDENTE]: [],
  [STATUS_CAMPANHA.EM_ENVIO]: [
    STATUS_CAMPANHA.PAUSA,
    STATUS_CAMPANHA.CANCELADA,
  ],
  [STATUS_CAMPANHA.PAUSA]: [
    STATUS_CAMPANHA.EM_ENVIO,
    STATUS_CAMPANHA.CANCELADA,
  ],
  [STATUS_CAMPANHA.CANCELADA]: [],
  [STATUS_CAMPANHA.ENVIADA]: [],
};

export const CAMPANHA_STATUS_ALTERAVEL = [STATUS_CAMPANHA.PENDENTE] as const;

export type CamposSelecionaveis = {
  campo: string;
  rotulo?: string | undefined;
  baseDadosId?: number;
}[];

export function campanhaPodeEditar(status: STATUS_CAMPANHA) {
  return CAMPANHA_STATUS_ALTERAVEL.includes(
    status as (typeof CAMPANHA_STATUS_ALTERAVEL)[number],
  );
}

export function campanhaPodeExcluir(status: STATUS_CAMPANHA) {
  return campanhaPodeEditar(status);
}

export type DashboardResponse = {
  readonly generatedAt: string;
  readonly basesDados?: {
    readonly totalBases: number;
    readonly totalClientes: number;
  };
  readonly visualizacoes?: {
    readonly total: number;
  };
  readonly campanhas?: {
    readonly totalPorStatus: {
      readonly enviada: number;
      readonly emEnvio: number;
      readonly pausa: number;
      readonly cancelada: number;
      readonly pendente: number;
    };
  };
  readonly integracoes?: {
    readonly ativas: number;
    readonly inativas: number;
    readonly jobsPorStatus: {
      readonly PENDENTE: number;
      readonly ERRO: number;
    };
  };
  readonly usuarios?: {
    readonly ativos: number;
    readonly inativos: number;
  };
  readonly alertas?: readonly {
    readonly tipo: 'JOB_ERRO' | 'CAMPANHA_ENVIO_ERRO';
    readonly gravidade: 'erro' | 'aviso';
    readonly recursoId: number;
    readonly titulo: string;
    readonly ocorridoEm: string;
  }[];
};

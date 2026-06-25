'use client';

import Link from 'next/link';
import type { Route } from 'next';
import {
  AlertTriangle,
  Database,
  Eye,
  Mail,
  RefreshCw,
  ServerCog,
  Users,
} from 'lucide-react';
import { Cabecalho } from '@/components/layout/cabecalho';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RESOURCE_CONFIG } from '@/features/auth/config/resources';
import { formataDataUI } from '@/lib/utils';
import useRetornaDashboard from '../api/use-retorna-dashboard';

const metricClassName =
  'rounded-lg border bg-muted/30 p-4 flex items-center justify-between gap-3';

export function Dashboard() {
  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useRetornaDashboard();
  const dashboard = response?.data;

  if (isLoading && !dashboard) {
    return (
      <div
        className='flex flex-1 flex-col gap-6 p-6'
        aria-label='Carregando dashboard'
      >
        <Skeleton className='h-16 w-full' />
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className='h-40 w-full' />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className='flex flex-1 items-center justify-center p-6'>
        <Card className='w-full max-w-md text-center' role='alert'>
          <CardHeader>
            <CardTitle>
              <h1>Não foi possível carregar o dashboard</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => void refetch()}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasSection =
    dashboard.basesDados !== undefined ||
    dashboard.visualizacoes !== undefined ||
    dashboard.campanhas !== undefined ||
    dashboard.integracoes !== undefined ||
    dashboard.usuarios !== undefined ||
    dashboard.alertas !== undefined;

  const alertPath = (tipo: 'JOB_ERRO' | 'CAMPANHA_ATRASADA'): Route =>
    `/${
      tipo === 'JOB_ERRO'
        ? RESOURCE_CONFIG.integracoes.pathFront
        : RESOURCE_CONFIG.campanhas.pathFront
    }` as Route;

  return (
    <>
      <Cabecalho
        titulo='Dashboard'
        descricao={`Atualizado em ${formataDataUI(dashboard.generatedAt)}`}
        acoes={
          <Button
            variant='outline'
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label='Atualizar dashboard'
          >
            <RefreshCw className={isFetching ? 'animate-spin' : undefined} />
            Atualizar
          </Button>
        }
      />

      <div className='flex-1 overflow-y-auto p-6'>
        {!hasSection ? (
          <Card className='mx-auto max-w-xl text-center'>
            <CardHeader>
              <CardTitle>
                <h2>Nenhuma informação disponível</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className='text-muted-foreground'>
              Seu usuário não possui permissões habilitadas para o dashboard.
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4 lg:grid-cols-2'>
            {dashboard.basesDados && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Database aria-hidden='true' />
                    <h2>Bases de dados</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid gap-3 sm:grid-cols-2'>
                  <div className={metricClassName}>
                    <span>Total de bases</span>
                    <strong className='text-2xl'>
                      {dashboard.basesDados.totalBases}
                    </strong>
                  </div>
                  <div className={metricClassName}>
                    <span>Total de clientes</span>
                    <strong className='text-2xl'>
                      {dashboard.basesDados.totalClientes}
                    </strong>
                  </div>
                </CardContent>
              </Card>
            )}

            {dashboard.visualizacoes && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Eye aria-hidden='true' />
                    <h2>Visualizações</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={metricClassName}>
                    <span>Total de visualizações</span>
                    <strong className='text-2xl'>
                      {dashboard.visualizacoes.total}
                    </strong>
                  </div>
                </CardContent>
              </Card>
            )}

            {dashboard.campanhas && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Mail aria-hidden='true' />
                    <h2>Campanhas</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
                  {[
                    ['Pendentes', dashboard.campanhas.totalPorStatus.pendente],
                    ['Em envio', dashboard.campanhas.totalPorStatus.emEnvio],
                    ['Enviadas', dashboard.campanhas.totalPorStatus.enviada],
                    ['Pausadas', dashboard.campanhas.totalPorStatus.pausa],
                    [
                      'Canceladas',
                      dashboard.campanhas.totalPorStatus.cancelada,
                    ],
                  ].map(([label, value]) => (
                    <div className={metricClassName} key={label}>
                      <span>{label}</span>
                      <strong className='text-2xl'>{value}</strong>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {dashboard.integracoes && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <ServerCog aria-hidden='true' />
                    <h2>Integrações</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className='grid gap-3 sm:grid-cols-2'>
                  {[
                    ['Ativas', dashboard.integracoes.ativas],
                    ['Inativas', dashboard.integracoes.inativas],
                    [
                      'Jobs pendentes',
                      dashboard.integracoes.jobsPorStatus.PENDENTE,
                    ],
                    ['Jobs com erro', dashboard.integracoes.jobsPorStatus.ERRO],
                  ].map(([label, value]) => (
                    <div className={metricClassName} key={label}>
                      <span>{label}</span>
                      <strong className='text-2xl'>{value}</strong>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {dashboard.usuarios && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users aria-hidden='true' />
                    <h2>Usuários</h2>
                  </CardTitle>
                  <CardAction>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/${RESOURCE_CONFIG.usuarios.pathFront}`}>
                        Gerenciar usuários
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className='grid gap-3 sm:grid-cols-2'>
                  <div className={metricClassName}>
                    <span>Ativos</span>
                    <strong className='text-2xl'>
                      {dashboard.usuarios.ativos}
                    </strong>
                  </div>
                  <div className={metricClassName}>
                    <span>Inativos</span>
                    <strong className='text-2xl'>
                      {dashboard.usuarios.inativos}
                    </strong>
                  </div>
                </CardContent>
              </Card>
            )}

            {dashboard.alertas !== undefined && (
              <Card className='lg:col-span-2'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <AlertTriangle aria-hidden='true' />
                    <h2>Alertas</h2>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboard.alertas.length === 0 ? (
                    <p className='text-muted-foreground'>Nenhum alerta.</p>
                  ) : (
                    <ul className='space-y-2'>
                      {dashboard.alertas.map((alerta) => (
                        <li
                          key={`${alerta.tipo}-${alerta.recursoId}-${alerta.ocorridoEm}`}
                        >
                          <Link
                            href={alertPath(alerta.tipo)}
                            className='flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center'
                          >
                            <Badge
                              variant={
                                alerta.gravidade === 'erro'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className={
                                alerta.gravidade === 'aviso'
                                  ? 'bg-amber-200 text-amber-950 dark:bg-amber-800 dark:text-amber-50'
                                  : undefined
                              }
                            >
                              {alerta.gravidade === 'erro' ? 'Erro' : 'Aviso'}
                            </Badge>
                            <span className='min-w-0 flex-1 font-medium'>
                              {alerta.titulo}
                            </span>
                            <time
                              className='text-sm text-muted-foreground'
                              dateTime={alerta.ocorridoEm}
                            >
                              {formataDataUI(alerta.ocorridoEm)}
                            </time>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
}

import { Cabecalho } from '@/components/layout/cabecalho';
import { ProtectedPage } from '@/components/layout/route-guard';
import { getRolesParaRecurso } from '@/features/auth/config/resources';
import { IntegracaoTabela } from '@/features/integracao/componentes/integracao-tabela';

export default function IntegracoesPage() {
  return (
    <ProtectedPage roles={getRolesParaRecurso('integracoes')}>
      <Cabecalho
        titulo="Integrações de coletas"
        descricao="Gerencie as integrações usadas para coleta de dados"
      />
      <div className="flex flex-col w-full flex-1 min-h-0 gap-2 p-6">
        <IntegracaoTabela />
      </div>
    </ProtectedPage>
  );
}

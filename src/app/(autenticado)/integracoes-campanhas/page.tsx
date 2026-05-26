import { Cabecalho } from '@/components/layout/cabecalho';
import { ProtectedPage } from '@/components/layout/route-guard';
import { getRolesParaRecurso } from '@/features/auth/config/resources';
import { IntegracaoCampanhaTabela } from '@/features/integracao-campanha/componentes/integracao-campanha-tabela';

export default function IntegracoesCampanhasPage() {
  return (
    <ProtectedPage roles={getRolesParaRecurso('integracoesCampanha')}>
      <Cabecalho
        titulo='Integrações de campanhas'
        descricao='Gerencie as integrações que enviará as mensagens eventuais das campanhas'
      />
      <div className='flex flex-col w-full flex-1 min-h-0 gap-2 p-6'>
        <IntegracaoCampanhaTabela />
      </div>
    </ProtectedPage>
  );
}

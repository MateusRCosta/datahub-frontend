import { Cabecalho } from '@/components/layout/cabecalho';
import { ProtectedPage } from '@/components/layout/route-guard';
import { getRolesParaRecurso } from '@/features/auth/config/resources';
import { CampanhaTabela } from '@/features/campanha/componentes/campanha-tabela';

export default function CampanhasPage() {
  return (
    <ProtectedPage roles={getRolesParaRecurso('campanhas')}>
      <Cabecalho
        titulo='Campanhas'
        descricao='Gerencie campanhas agendadas e seus status'
      />
      <div className='flex flex-col w-full flex-1 min-h-0 gap-2 p-6'>
        <CampanhaTabela />
      </div>
    </ProtectedPage>
  );
}

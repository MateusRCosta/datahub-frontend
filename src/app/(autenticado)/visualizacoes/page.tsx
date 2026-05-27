import { Cabecalho } from '@/components/layout/cabecalho';
import { ProtectedPage } from '@/components/layout/route-guard';
import { getRolesParaRecurso } from '@/features/auth/config/resources';
import { ViewPagina } from '@/features/view/components/view-pagina';

export default function VisualizacoesPage() {
  return (
    <ProtectedPage roles={getRolesParaRecurso('views')}>
      <Cabecalho
        titulo='Visualizações'
        descricao='Construa consultas visuais às suas bases de dados'
      />
      <div className='flex flex-col w-full flex-1 min-h-0'>
        <ViewPagina />
      </div>
    </ProtectedPage>
  );
}

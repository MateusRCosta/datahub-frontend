import { Cabecalho } from '@/components/layout/cabecalho';
import { ProtectedPage } from '@/components/layout/route-guard';
import { getRolesParaRecurso } from '@/features/auth/config/resources';
import { TemplateTabela } from '@/features/integracao-campanha/template/componentes/template-tabela';

export default function TemplatesPage() {
  return (
    <ProtectedPage roles={getRolesParaRecurso('templates')}>
      <Cabecalho
        titulo='Templates'
        descricao='Gerencie os templates usados nas campanhas'
      />
      <div className='flex flex-col w-full flex-1 min-h-0 gap-2 p-6'>
        <TemplateTabela />
      </div>
    </ProtectedPage>
  );
}

import { Cabecalho } from '@/components/layout/cabecalho';
import { ProtectedPage } from '@/components/layout/route-guard';
import { getRolesParaRecurso } from '@/features/auth/config/resources';
import { BaseDadosTabela } from '@/features/base-dados/componentes/base-dados-tabela';

export default function UsuariosPage() {
  return (
    <ProtectedPage roles={getRolesParaRecurso('bases')}>
      <Cabecalho
        titulo="Bases de dados"
        descricao="Gerencie as bases de dados do sistema"
      />
      <div className="flex flex-col w-full flex-1 min-h-0 gap-2 p-6">
        <BaseDadosTabela />
      </div>
    </ProtectedPage>
  );
}

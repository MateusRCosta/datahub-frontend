import { Cabecalho } from "@/components/layout/cabecalho";
import { ProtectedPage } from "@/components/layout/route-guard";
import { getRolesParaRecurso } from "@/features/auth/config/resources";
import { UsuariosTable } from "@/features/usuario/componentes/usuario-table";

export default function UsuariosPage() {
    return (
        <ProtectedPage roles={getRolesParaRecurso("usuarios")}>
            <Cabecalho
                titulo="Usuários"
                descricao="Gerencie os usuários e suas permissões de acesso ao sistema."
            />
            <div className="flex flex-col w-full flex-1 min-h-0 gap-2 p-6">
                <UsuariosTable />
            </div>
        </ProtectedPage>
    );
}
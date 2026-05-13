"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { Me } from "../schema/me.schema";
import useRetornaMe from "../api/use-retorna-me";
import { getQueryClient } from "@/lib/query-client";
import { Role, ResourceName } from "../config/resources";
import { ApiResponse } from "@/types/api.schema";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextData {
    usuario: Me | null;
    setUsuario: (u: Me | null) => void;
    isLoading: boolean;
    isAdmin: boolean;
    temPermissao: (roles: Role | Role[] | null) => boolean;
    resolvePath: (resource: ResourceName) => string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const { data, isLoading } = useRetornaMe({ enabled: true });

    const usuario = data?.status === 200 ? data.data : null;
    const naoAutenticado = !isLoading && data?.status === 401;

    const setUsuarioManual = (novoUsuario: Me | null) => {
        const meResponse: ApiResponse<Me> = {
            status: 200,
            data: novoUsuario,
        };

        queryClient.setQueryData(['me'], meResponse);
    };

    const isAdmin = useMemo(() => {
        return usuario?.admin ?? false;
    }, [usuario]);

    const temPermissao = (roles: Role | Role[] | null) => {
        if (!usuario) return false;
        if (!roles || roles.length === 0) {
            if (usuario.admin) return true;
            return false;
        }

        const rolesArray = Array.isArray(roles) ? roles : [roles];
        return rolesArray.some(role => usuario.permissoes.includes(role));
    };

    const resolvePath = (resource: ResourceName): string => {
        return resource;
    };

    useEffect(() => {
        if (!naoAutenticado) return;
        if (pathname?.startsWith("/login")) return;
        router.replace("/login");
    }, [naoAutenticado, pathname, router]);

    return (
        <AuthContext.Provider value={{ usuario, isAdmin, temPermissao, resolvePath, isLoading, setUsuario: setUsuarioManual }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

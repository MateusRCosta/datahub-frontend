"use client";

import { useAuth } from "@/features/auth/provider/auth-provider";
import { Role } from "@/features/auth/schema/roles";
import { ReactNode } from "react";

interface GuardRoleProps {
    roles: Role | Role[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function GuardRole({ roles, children, fallback = null }: GuardRoleProps) {
    const { temPermissao, isLoading } = useAuth();

    if (isLoading) {
        return fallback;
    }

    if (!temPermissao(roles)) {
        return fallback;
    }

    return <>{children}</>;
}

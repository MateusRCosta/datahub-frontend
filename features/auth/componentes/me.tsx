"use-client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { AlteraSenha } from "./altera-senha";
import { useAuth } from "../provider/auth-provider";

interface MeProps {
    open: boolean;
    onOpenChange: () => void
}
export function Me({ open = false, onOpenChange }: MeProps) {
    const ehDesktop = useMediaQuery("(min-width: 768px)");
    const [openAlteraSenha, setOpenAlteraSenha] = useState(false);

    const { usuario, isLoading } = useAuth();

    const renderizaConteudo = () => {
        if (isLoading) {
            return (
                <>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3">
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </>
            );
        }

        if (usuario) {
            const campos = [
                { label: "Nome", value: usuario.nome },
                { label: "E-mail", value: usuario.email },
                { label: "Perfil", value: usuario.admin ? "Administrador" : "Usuário" },
                { label: "Permissões", value: usuario.permissoes.join(", ") || "Nenhuma" },
            ]

            return (
                <>
                    {campos.map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between px-4 py-3">
                            <span className="text-sm text-muted-foreground">{label}</span>
                            <span className="text-sm font-medium">{value}</span>
                        </div>
                    ))}
                </>
            );
        }
    }

    if (ehDesktop) {
        return (
            <>
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Usuario</DialogTitle>
                            <DialogDescription>Informações básicas do seu usuário no sistema Hotdata</DialogDescription>
                        </DialogHeader>
                        <div className="divide-y divide-border rounded-lg border">
                            {renderizaConteudo()}
                        </div>
                        <DialogFooter>
                            <div className="w-full h-full flex flex-row justify-between gap-2">
                                <Button variant={"default"} onClick={() => setOpenAlteraSenha(!openAlteraSenha)}>Alterar senha</Button>
                                <DialogClose asChild>
                                    <Button variant="outline">Sair</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <AlteraSenha open={openAlteraSenha} onOpenChange={() => setOpenAlteraSenha(!openAlteraSenha)} />
            </>
        );
    }

    return (
        <>
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <DrawerTitle>Usuario</DrawerTitle>
                            <DrawerDescription>Informações básicas do seu usuário no sistema Hotdata</DrawerDescription>
                        </DrawerHeader>
                        <div className="divide-y divide-border rounded-lg border">
                            {renderizaConteudo()}
                        </div>
                        <DrawerFooter>
                            <Button variant={"default"} onClick={() => setOpenAlteraSenha(!openAlteraSenha)}>Alterar senha</Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Sair</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
            <AlteraSenha open={openAlteraSenha} onOpenChange={() => setOpenAlteraSenha(!openAlteraSenha)} />
        </>
    );
}


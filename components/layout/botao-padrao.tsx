"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useAlteraPadrao from "@/api/use-altera-padrao";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ResourceName } from "@/features/auth/schema/roles";

interface Mensagens {
    naoEncontrado?: string;
    sucesso?: string;
    erroInterno?: string;
}

interface BotaoPadraoProps {
    id: string;
    path: ResourceName;
    padrao: boolean;
    nome: string;
    mensagens?: Mensagens;
}

export function BotaoPadrao({ id, path, padrao, nome, mensagens }: BotaoPadraoProps) {
    const { mutateAsync, isPending } = useAlteraPadrao({ path, id });

    // só outro pode assumir o padrão
    if (padrao) {
        return (
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex h-8 w-8 items-center justify-center">
                            <Star className="size-4 fill-amber-400 text-amber-400" />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                        <p>Formulário padrão atual</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    const handleClick = async () => {
        const resultado = await mutateAsync({ id, path });

        if (resultado.statusCode === 404) {
            toast.error(mensagens?.naoEncontrado ?? "Registro não encontrado.");
            return;
        }
        if (resultado.statusCode >= 500) {
            toast.error(mensagens?.erroInterno ?? "Erro interno, tente novamente mais tarde.");
            return;
        }

        toast.success(mensagens?.sucesso ?? `"${nome}" definido como padrão.`);
    };

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={handleClick}
                        className={cn(
                            "h-8 w-8 p-0 transition-all duration-200",
                            "text-muted-foreground/30 hover:text-amber-400"
                        )}
                    >
                        <Star className="size-4 fill-transparent transition-all duration-200 hover:fill-amber-400/20" />
                        <span className="sr-only">Definir como padrão</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p>Definir como padrão</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

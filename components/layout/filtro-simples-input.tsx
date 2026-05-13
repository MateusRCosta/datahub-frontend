"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Search, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { FormWrapper } from "@/components/layout/form";
import { useUrlFiltros } from "@/hooks/use-url-filtros";

type ChavesDoSchema<T extends z.ZodTypeAny> = Extract<keyof z.infer<T>, string>;

interface FiltroSimplesGenericoProps<TSchema extends z.ZodTypeAny> {
    schemaDaUrl: TSchema;
    chaveUrl: string;
    chavesOpcoes: ChavesDoSchema<TSchema>[];
    opcoesLabels: Record<string, string>;
}

interface FormGenericoData {
    filtrarPor: string;
    valor: string;
}

export function FiltroSimplesGenerico<TSchema extends z.ZodTypeAny>({
    schemaDaUrl,
    opcoesLabels,
    chaveUrl
}: FiltroSimplesGenericoProps<TSchema>) {
    const { filtros, setFiltros } = useUrlFiltros(schemaDaUrl, chaveUrl);
    const filtrosRecord = filtros as z.infer<TSchema>;

    const chavesValidas = Object.keys(opcoesLabels);
    const filtroAtivo = chavesValidas.find((chave) => filtrosRecord[chave as keyof typeof filtrosRecord]) || chavesValidas[0];

    const valorAtivo = filtrosRecord[filtroAtivo as keyof typeof filtrosRecord] ? String(filtrosRecord[filtroAtivo as keyof typeof filtrosRecord]) : "";

    const form = useForm<FormGenericoData>({
        values: {
            filtrarPor: String(filtroAtivo),
            valor: valorAtivo,
        },
    });

    const handleSubmit = (data: FormGenericoData) => {
        if (!data.filtrarPor) return;

        if (data.filtrarPor === null || data.filtrarPor === undefined) return;

        setFiltros({
            [data.filtrarPor]: data.valor
        });
    };

    const watchFiltrarPor = form.watch("filtrarPor");

    return (
        <FormWrapper form={form}>
            <div className="flex w-full max-w-sm items-center p-0 gap-0 overflow-hidden rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-none border-r bg-field-background dark:bg-input/30 px-3 text-xs font-medium tracking-wider hover:bg-muted">
                            {opcoesLabels[watchFiltrarPor]}
                            <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {Object.entries(opcoesLabels).map(([key, value]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => form.setValue("filtrarPor", key)}
                            >
                                {value}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex flex-1 items-center">
                    <Controller
                        control={form.control}
                        name="valor"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Buscar..."
                                className="border-none rounded-none bg-field-background dark:bg-input/30 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        )}
                    />
                    <Button type="button" onClick={form.handleSubmit(handleSubmit)} size="icon" variant="ghost" className="bg-field-background dark:bg-input/30 rounded-tl-none rounded-bl-none border-l" >
                        <Search className="h-4 w-4 opacity-50" />
                    </Button>
                </div>
            </div>
        </FormWrapper>
    );
}
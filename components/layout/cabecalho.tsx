import { ReactNode } from "react";

interface CabecalhoProps {
    titulo: string;
    descricao?: string;
    acoes?: ReactNode;
}

export function Cabecalho({ titulo, descricao, acoes }: CabecalhoProps) {
    return (
        <div className="flex justify-between items-start px-6 py-3 border-b dark:border-gray-500 gap-4">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">{titulo}</h1>
                {descricao && (
                    <p className="text-md text-gray-800 dark:text-gray-300">{descricao}</p>
                )}
            </div>
            {acoes && (
                <div className="flex items-center gap-2">
                    {acoes}
                </div>
            )}
        </div>
    );
}
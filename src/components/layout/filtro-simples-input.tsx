'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { ChevronDown, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { FormWrapper } from '@/components/layout/form';

type ChavesDoSchema<T extends z.ZodObject<z.ZodRawShape>> = Extract<
  keyof z.output<T>,
  string
>;

interface FiltroSimplesGenericoProps<
  TSchema extends z.ZodObject<z.ZodRawShape>,
> {
  chavesOpcoes: ChavesDoSchema<TSchema>[];
  opcoesLabels: Record<string, string>;
  filtros: z.output<TSchema>;
  setFiltros: (data: Partial<z.output<TSchema>>) => void;
}

interface FormGenericoData {
  filtrarPor: string;
  valor: string;
}

export function FiltroSimplesGenerico<
  TSchema extends z.ZodObject<z.ZodRawShape>,
>({
  chavesOpcoes,
  opcoesLabels,
  filtros,
  setFiltros,
}: FiltroSimplesGenericoProps<TSchema>) {
  const filtroAtivo =
    chavesOpcoes.find((chave) => filtros[chave]) || chavesOpcoes[0];

  const valorAtivo =
    filtroAtivo && filtros[filtroAtivo] ? String(filtros[filtroAtivo]) : '';

  const form = useForm<FormGenericoData>({
    values: {
      filtrarPor: String(filtroAtivo),
      valor: valorAtivo,
    },
  });

  const handleSubmit = (data: FormGenericoData) => {
    if (!data.filtrarPor) return;

    const filtrosSimplesVazios = Object.fromEntries(
      chavesOpcoes.map((chave) => [chave, undefined]),
    );

    setFiltros({
      ...filtrosSimplesVazios,
      [data.filtrarPor]: data.valor,
    } as Partial<z.output<TSchema>>);
  };

  const filtrarPor = useWatch({
    control: form.control,
    name: 'filtrarPor',
  });

  const labelFiltrarPor = filtrarPor ? opcoesLabels[filtrarPor] : '';

  return (
    <FormWrapper form={form}>
      <div className='flex w-full max-w-sm items-center gap-0 overflow-hidden rounded-lg border border-input bg-background p-0 focus-within:ring-2 focus-within:ring-ring'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='rounded-none border-r bg-field-background px-3 text-xs font-medium tracking-wider hover:bg-muted dark:bg-input/30'
            >
              {labelFiltrarPor}
              <ChevronDown className='ml-2 h-3 w-3 opacity-50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            {Object.entries(opcoesLabels).map(([key, value]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => form.setValue('filtrarPor', key)}
              >
                {value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='flex flex-1 items-center'>
          <Controller
            control={form.control}
            name='valor'
            render={({ field }) => (
              <Input
                {...field}
                placeholder='Buscar...'
                className='rounded-none border-none bg-field-background focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-input/30'
              />
            )}
          />
          <Button
            type='button'
            onClick={form.handleSubmit(handleSubmit)}
            size='icon'
            variant='ghost'
            className='rounded-bl-none rounded-tl-none border-l bg-field-background dark:bg-input/30'
          >
            <Search className='h-4 w-4 opacity-50' />
          </Button>
        </div>
      </div>
    </FormWrapper>
  );
}

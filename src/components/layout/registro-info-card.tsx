'use client';

import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type RegistroInfoCardProps = {
  titulo?: string;
  dados: Record<string, ReactNode>;
  className?: string;
};

export function RegistroInfoCard({
  titulo = 'Informações do registro',
  dados,
  className,
}: RegistroInfoCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={titulo}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            'hover:bg-accent transition-all duration-200 p-0.5 rounded-full cursor-help',
            className,
          )}
        >
          <Info className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="flex flex-1 flex-col w-fit gap-2">
        <div className="font-semibold text-md">{titulo}</div>
        <div className="flex-1 divide-y divide-border rounded-lg border">
          {Object.entries(dados).map(([nome, valor]) => (
            <div
              key={nome}
              className="flex items-center justify-between gap-4 px-2 py-1"
            >
              <span className="text-xs text-muted-foreground">{nome}:</span>
              <span className="text-xs font-medium">{valor ?? '--'}</span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

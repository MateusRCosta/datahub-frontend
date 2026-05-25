'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FieldGroup } from '@/components/ui/field';
import { useFormComponents } from '@/hooks/use-form-components';
import { ChevronDown } from 'lucide-react';
import { IntegracaoCriacao } from '../schema/integracao.schema';

export function IntegracaoBasicoForm() {
  const { Input } = useFormComponents<IntegracaoCriacao>();

  return (
    <Collapsible defaultOpen className="group rounded-md border bg-background">
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">Informações básicas</h3>
          <p className="text-xs text-muted-foreground">
            Nome, limites e horário de execução.
          </p>
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent forceMount className="space-y-4 border-t px-4 py-4">
        <FieldGroup className="gap-4">
          <Input
            name="nome"
            label="Nome"
            placeholder="Digite o nome da integração"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="limitDeRequisicaoPorMin"
              label="Limite de requisições por minuto"
              type="number"
              min={0}
              max={50}
            />
            <Input
              name="horaExecucao"
              label="Hora de execução"
              type="number"
              min={0}
              max={24}
            />
          </div>
        </FieldGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}

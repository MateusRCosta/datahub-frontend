'use client';

import { Plus, Trash2 } from 'lucide-react';
import {
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { InputGenerico, SelectGenerico } from '@/components/layout/form';
import {
  FieldValues,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { TipoBotoesEnum } from '../../schema/upchat.schema';

const tipoBotaoOptions: { label: string; value: TipoBotoesEnum }[] = [
  
  { label: 'Resposta rápida', value: 'quickReply' },
  { label: 'Telefone', value: 'phoneNumber' },
  { label: 'URL', value: 'url' },
  { label: 'Flow', value: 'flow' },
];

type BotaoFormValue = {
  tipo?: TipoBotoesEnum;
  textoBotao?: string;
  numeroTelefone?: string;
  url?: string;
  flowId?: string;
};

const getTipoBotao = (botao?: BotaoFormValue): TipoBotoesEnum => {
  if (botao?.tipo) return botao.tipo;
  if (botao?.numeroTelefone) return 'phoneNumber';
  if (botao?.url) return 'url';
  if (botao?.flowId) return 'flow';
  return 'quickReply';
};

const criaBotao = (tipo: TipoBotoesEnum): BotaoFormValue => {
  const base = { tipo, textoBotao: '' };

  if (tipo === 'phoneNumber') {
    return { ...base, numeroTelefone: '' };
  }

  if (tipo === 'url') {
    return { ...base, url: '' };
  }

  if (tipo === 'flow') {
    return { ...base, flowId: '' };
  }

  if (!tipo){
    return{
      ...base,
      tipo: 'quickReply'
    }
  }
  return base;
};

export function UpchatBotoesFieldGroup() {
  const { control } = useFormContext<FieldValues>();
  const { fields, append, remove, update } = useFieldArray<
    FieldValues,
    'config.botoes'
  >({
    control,
    name: 'config.botoes',
  });
  const botoes = useWatch({ control, name: 'config.botoes' });
  const botoesValues = Array.isArray(botoes)
    ? (botoes as BotaoFormValue[])
    : [];

  return (
    <FieldSet>
      <div className="flex items-center justify-between gap-3">
        <div>
          <FieldLegend>Botoes</FieldLegend>
          <FieldLabel className="text-xs text-muted-foreground font-normal">
            Até 3 botões por template.
          </FieldLabel>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(criaBotao('quickReply'))}
          disabled={fields.length >= 3}
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <FieldGroup className="gap-4">
        {fields.map((field, index) => {
          const tipo = getTipoBotao(botoesValues[index]);
          const prefixo = `config.botoes.${index}`;

          return (
            <div
              key={field.id}
              className="grid gap-3 rounded-md border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <SelectGenerico
                name={`${prefixo}.tipo`}
                label="Tipo"
                options={tipoBotaoOptions}
                onValueChange={(value) =>
                  update(index, criaBotao(value as TipoBotoesEnum))
                }
              />
              <InputGenerico
                name={`${prefixo}.textoBotao`}
                label="Texto do botao"
                maxLength={25}
                placeholder="Digite o texto"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end"
                onClick={() => remove(index)}
                aria-label="Remover botao"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {tipo === 'phoneNumber' && (
                <InputGenerico
                  name={`${prefixo}.numeroTelefone`}
                  label="Telefone"
                  maxLength={20}
                  placeholder="Digite o telefone"
                  className="md:col-span-2"
                />
              )}

              {tipo === 'url' && (
                <InputGenerico
                  name={`${prefixo}.url`}
                  label="URL"
                  maxLength={2000}
                  placeholder="https://exemplo.com"
                  className="md:col-span-2"
                />
              )}

              {tipo === 'flow' && (
                <InputGenerico
                  name={`${prefixo}.flowId`}
                  label="Flow ID"
                  maxLength={36}
                  placeholder="Digite o flow ID"
                  className="md:col-span-2"
                />
              )}
            </div>
          );
        })}
      </FieldGroup>
    </FieldSet>
  );
}

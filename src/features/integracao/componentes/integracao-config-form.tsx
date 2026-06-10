'use client';

import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  CheckboxGenerico,
  InputGenerico,
  SelectGenerico,
  JsonEditorGenerico,
} from '@/components/layout/form';
import { FieldGroup } from '@/components/ui/field';
import { enumSchema } from '@/features/base-dados/schema/base-dados.schema';
import { integracaoMetodoSchema } from '../schema/integracao.schema';

const metodoOptions = integracaoMetodoSchema.options.map((metodo) => ({
  label: metodo,
  value: metodo,
}));

const tipoOptions = enumSchema.options.map((tipo) => ({
  label: tipo,
  value: tipo,
}));

type SecaoIntegracao = 'Scrap' | 'Auth' | 'Refresh';

const secaoLabel: Record<SecaoIntegracao, string> = {
  Scrap: 'Coleta',
  Auth: 'Autenticação',
  Refresh: 'Refresh',
};

const secaoDescricao: Record<SecaoIntegracao, string> = {
  Scrap: 'Requisição principal para coletar dados.',
  Auth: 'Requisição usada para autenticar antes da coleta.',
  Refresh: 'Requisição usada para renovar credenciais.',
};

const criaHeader = () => ({ chave: '', valor: '' });
const criaResponse = () => ({
  nome: '',
  path: '',
  tipo: enumSchema.enum.TEXTO,
  identificador: false,
});
const criaVariavel = () => ({
  nome: '',
  valor: '',
  tipo: enumSchema.enum.TEXTO,
  incremento: {
    incrementa: false,
    limiteIncrementa: undefined,
    limiteDataAtual: false,
    delimitador: false,
  },
});

function HeadersFieldArray({ secao }: { secao: SecaoIntegracao }) {
  const { control } = useFormContext();
  const name = `headers${secao}` as const;
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <FieldGroup className='gap-3'>
      <div className='flex items-center justify-between gap-2'>
        <h4 className='text-sm font-medium'>Headers</h4>
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => append(criaHeader())}
        >
          <Plus className='h-4 w-4' />
          Adicionar
        </Button>
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className='grid gap-3 rounded-md border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]'
        >
          <InputGenerico name={`${name}.${index}.chave`} label='Chave' />
          <InputGenerico name={`${name}.${index}.valor`} label='Valor' />
          <Button
            type='button'
            size='icon'
            variant='ghost'
            className='self-end'
            onClick={() => remove(index)}
            aria-label='Remover header'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ))}
    </FieldGroup>
  );
}

function ResponsesFieldArray({ secao }: { secao: SecaoIntegracao }) {
  const { control } = useFormContext();
  const name = `response${secao}` as const;
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <FieldGroup className='gap-3'>
      <div className='flex items-center justify-between gap-2'>
        <h4 className='text-sm font-medium'>Resposta</h4>
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => append(criaResponse())}
        >
          <Plus className='h-4 w-4' />
          Adicionar
        </Button>
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className='grid gap-3 rounded-md border p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]'
        >
          <InputGenerico name={`${name}.${index}.nome`} label='Nome' />
          <InputGenerico name={`${name}.${index}.path`} label='Caminho' />
          <SelectGenerico
            name={`${name}.${index}.tipo`}
            label='Tipo'
            options={tipoOptions}
          />
          <Button
            type='button'
            size='icon'
            variant='ghost'
            className='self-end'
            onClick={() => remove(index)}
            aria-label='Remover response'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
          <CheckboxGenerico
            name={`${name}.${index}.identificador`}
            label='Identificador'
            className='w-4 self-center md:col-span-3'
          />
        </div>
      ))}
    </FieldGroup>
  );
}

function VariavelItem({
  secao,
  index,
  onRemove,
}: {
  secao: SecaoIntegracao;
  index: number;
  onRemove: () => void;
}) {
  const name = `variaveis${secao}` as const;
  const { watch } = useFormContext();
  const incrementa = watch(`${name}.${index}.incremento.incrementa`);

  return (
    <div className='space-y-3 rounded-md border p-3'>
      <div className='flex items-center justify-between gap-2'>
        <p className='text-xs font-medium text-muted-foreground'>
          Variável {index + 1}
        </p>
        <Button
          type='button'
          size='icon'
          variant='ghost'
          onClick={onRemove}
          aria-label='Remover variavel'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>

      <div className='grid gap-3 md:grid-cols-2 md:items-center'>
        <InputGenerico name={`${name}.${index}.nome`} label='Nome' />
        <InputGenerico name={`${name}.${index}.valor`} label='Valor' />
        <SelectGenerico
          name={`${name}.${index}.tipo`}
          label='Tipo'
          options={tipoOptions}
        />
        <CheckboxGenerico
          name={`${name}.${index}.incremento.incrementa`}
          label='Incremento automático'
        />
      </div>

      {incrementa ? (
        <div className='rounded-md border border-dashed bg-muted/20 p-3'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
            <div className='min-w-0 flex-1'>
              <InputGenerico
                name={`${name}.${index}.incremento.limiteIncrementa`}
                label='Limite máximo'
                type='number'
              />
            </div>
            <div className='flex flex-col gap-4 px-4 '>
              <CheckboxGenerico
                name={`${name}.${index}.incremento.delimitador`}
                label='Delimitador'
              />
              <CheckboxGenerico
                name={`${name}.${index}.incremento.limiteDataAtual`}
                label='Limitar pela data atual'
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VariaveisFieldArray({ secao }: { secao: SecaoIntegracao }) {
  const { control } = useFormContext();
  const name = `variaveis${secao}` as const;
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <FieldGroup className='gap-3'>
      <div className='flex items-center justify-between gap-2'>
        <div>
          <h4 className='text-sm font-medium'>Variáveis</h4>
          <p className='text-xs text-muted-foreground'>
            Parâmetros reutilizados na requisição desta seção.
          </p>
        </div>
        <Button
          type='button'
          size='sm'
          variant='outline'
          onClick={() => append(criaVariavel())}
        >
          <Plus className='h-4 w-4' />
          Adicionar
        </Button>
      </div>
      {fields.length === 0 ? (
        <p className='rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground'>
          Nenhuma variável adicionada.
        </p>
      ) : (
        fields.map((field, index) => (
          <VariavelItem
            key={field.id}
            secao={secao}
            index={index}
            onRemove={() => remove(index)}
          />
        ))
      )}
    </FieldGroup>
  );
}

function IntegracaoSecaoForm({
  secao,
  urlObrigatoria = false,
  defaultOpen = false,
}: {
  secao: SecaoIntegracao;
  urlObrigatoria?: boolean;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className='group rounded-md border bg-background'
    >
      <CollapsibleTrigger className='flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left'>
        <div className='min-w-0'>
          <h3 className='text-sm font-semibold'>{secaoLabel[secao]}</h3>
          <p className='text-xs text-muted-foreground'>
            {secaoDescricao[secao]}
          </p>
        </div>
        <ChevronDown className='h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180' />
      </CollapsibleTrigger>

      <CollapsibleContent
        forceMount
        className='space-y-5 border-t px-4 py-4 data-[state=closed]:hidden'
      >
        <div className='grid gap-4 md:grid-cols-2'>
          <InputGenerico
            name={`url${secao}`}
            label={urlObrigatoria ? 'URL' : 'URL opcional'}
            placeholder='https://api.exemplo.com'
          />
          <SelectGenerico
            name={`metodo${secao}`}
            label='Método'
            options={metodoOptions}
          />
        </div>
        <JsonEditorGenerico name={`body${secao}`} label='Corpo da requisição' height='220px' />
        <ResponsesFieldArray secao={secao} />
        <HeadersFieldArray secao={secao} />
        <VariaveisFieldArray secao={secao} />
      </CollapsibleContent>
    </Collapsible>
  );
}

export function IntegracaoConfigForm() {
  return (
    <FieldGroup className='gap-3'>
      <IntegracaoSecaoForm secao='Scrap' urlObrigatoria defaultOpen />
      <IntegracaoSecaoForm secao='Auth' />
      <IntegracaoSecaoForm secao='Refresh' />
    </FieldGroup>
  );
}

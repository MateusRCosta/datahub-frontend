'use client';

import { useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { TemplateTabela } from '@/features/integracao-campanha/template/componentes/template-tabela';
import { TemplatesApiResponse } from '@/features/integracao-campanha/template/schema/template.schema';
import { BaseDadosTabela } from '@/features/base-dados/componentes/base-dados-tabela';
import { BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { Button } from '@/components/ui/button';
import { useFormComponents } from '@/hooks/use-form-components';
import { ViewSelecaoTabela } from './view-selecao-tabela';
import { CampanhaFormularioInput } from '../schema/campanha-form.schema';
import { ViewsApiResponse } from '@/features/view/schema/view.schema';

interface CampanhaFormProps {
  templateNome: string;
  setTemplateNome: (nome: string) => void;
  viewNome: string;
  setViewNome: (nome: string) => void;
  baseDadosNome: string;
  setBaseDadosNome: (nome: string) => void;
  readOnly?: boolean;
}

export function CampanhaForm({
  templateNome,
  setTemplateNome,
  viewNome,
  setViewNome,
  baseDadosNome,
  setBaseDadosNome,
  readOnly = false,
}: CampanhaFormProps) {
  const form = useFormContext<CampanhaFormularioInput>();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'vars',
  });
  const { Input, InputSelecaoModal, DatePicker } =
    useFormComponents<CampanhaFormularioInput>();

  const selecionarTemplate = (template: TemplatesApiResponse) => {
    form.setValue('templateId', template.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTemplateNome(template.nome);
  };

  const selecionarView = (view: ViewsApiResponse) => {
    form.setValue('viewId', view.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('baseDadosId', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setViewNome(view.nome);
    setBaseDadosNome('');
  };

  const selecionarBaseDados = (baseDados: BasesDadosApiResponse) => {
    form.setValue('baseDadosId', baseDados.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('viewId', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setBaseDadosNome(baseDados.nome);
    setViewNome('');
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <h3 className='text-sm font-semibold'>Informações básicas</h3>
        <Input
          name='nome'
          label='Nome'
          placeholder='Digite o nome da campanha'
          disabled={readOnly}
        />
        <DatePicker name='scheduledAt' label='Agendamento' disabled={readOnly} />
        <InputSelecaoModal
          name='templateId'
          label='Template'
          nomeDisplay={templateNome}
          modalTitle='Selecionar template'
          disabled={readOnly}
          modalContent={(fecharModal) => (
            <TemplateTabela
              modoSelecao
              onSelecionar={(template) => {
                selecionarTemplate(template);
                fecharModal();
              }}
            />
          )}
        />
      </div>
      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-semibold'>Fonte de dados</h3>
          <p className='text-xs text-muted-foreground'>
            Selecione uma visualização ou uma base de dados.
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <InputSelecaoModal
            name='viewId'
            label='Visualização'
            nomeDisplay={viewNome}
            modalTitle='Selecionar visualização'
            disabled={readOnly}
            modalContent={(fecharModal) => (
              <ViewSelecaoTabela
                onSelecionar={(view) => {
                  selecionarView(view);
                  fecharModal();
                }}
              />
            )}
          />
          <InputSelecaoModal
            name='baseDadosId'
            label='Base de dados'
            nomeDisplay={baseDadosNome}
            modalTitle='Selecionar base de dados'
            disabled={readOnly}
            modalContent={(fecharModal) => (
              <BaseDadosTabela
                modoSelecao
                onSelecionar={(baseDados) => {
                  selecionarBaseDados(baseDados);
                  fecharModal();
                }}
              />
            )}
          />
        </div>
      </div>
      <div className='space-y-4'>
        <h3 className='text-sm font-semibold'>Envio</h3>
        <Input
          name='contatoCampo'
          label='Campo de contato'
          placeholder='Ex: telefone'
          disabled={readOnly}
        />
        <div className='space-y-3'>
          <div className='flex items-center justify-between gap-2'>
            <div>
              <p className='text-sm font-medium'>Variáveis</p>
              <p className='text-xs text-muted-foreground'>
                Adicione pares de variável e valor para o envio.
              </p>
            </div>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={readOnly}
              onClick={() => append({ variavel: '', valor: '' })}
            >
              <Plus className='h-4 w-4' />
              Adicionar
            </Button>
          </div>
          <div className='space-y-3'>
            {fields.length === 0 ? (
              <p className='rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground'>
                Nenhuma variável adicionada.
              </p>
            ) : (
              fields.map((field, index) => (
                <div
                  key={field.id}
                  className='grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]'
                >
                    <Input
                      name={`vars.${index}.variavel`}
                      label='Var'
                      placeholder='nome'
                      disabled={readOnly}
                    />
                    <Input
                      name={`vars.${index}.valor`}
                      label='Value'
                      placeholder='cliente_nome'
                      disabled={readOnly}
                    />
                    <div className='flex items-end'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        disabled={readOnly}
                        onClick={() => remove(index)}
                        aria-label='Remover variável'
                        className='shrink-0'
                    >
                      <Trash2 className='h-4 w-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

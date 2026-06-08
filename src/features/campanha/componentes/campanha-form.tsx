'use client';

import { useFormContext } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TemplateTabela } from '@/features/integracao-campanha/template/componentes/template-tabela';
import { TemplatesApiResponse } from '@/features/integracao-campanha/template/schema/template.schema';
import { BaseDadosTabela } from '@/features/base-dados/componentes/base-dados-tabela';
import { BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormComponents } from '@/hooks/use-form-components';
import { ViewSelecaoTabela } from '../../view/components/view-selecao-tabela';
import { CampanhaFormularioInput } from '../schema/campanha-form.schema';
import { ViewsCampanhaApiResponse } from '@/features/view/schema/view.schema';
import { CamposSelecionaveis } from '../types/campanha.types';
import { ProvedorEnum } from '@/common/schema/provedor.schema';

interface CampanhaFormProps {
  templateNome: string;
  setTemplateQtdVars: (vars: number) => void;
  templateQtdVars: number;
  setTemplateNome: (nome: string) => void;
  templateProvedor: ProvedorEnum;
  setTemplateProvedor: (provedor: ProvedorEnum) => void;
  viewNome: string;
  setViewNome: (nome: string) => void;
  baseDadosNome: string;
  setBaseDadosNome: (nome: string) => void;
  camposSelecionaveis: CamposSelecionaveis;
  readOnly?: boolean;
  setCamposSelecionaveis: (campos: CamposSelecionaveis) => void;
}

export function CampanhaForm({
  templateNome,
  setTemplateNome,
  templateQtdVars,
  setTemplateQtdVars,
  templateProvedor,
  setTemplateProvedor,
  viewNome,
  setViewNome,
  baseDadosNome,
  setBaseDadosNome,
  camposSelecionaveis,
  setCamposSelecionaveis,
  readOnly = false,
}: CampanhaFormProps) {
  const [valorBaseDadosPorLinha, setValorBaseDadosPorLinha] = useState<
    Record<string, boolean>
  >({});
  const form = useFormContext<CampanhaFormularioInput>();
  const contatoCampo = form.watch('contatoCampo');
  const vars = form.watch('vars');
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'vars',
  });

  const { Input, InputSelecaoModal, DatePicker, Select } =
    useFormComponents<CampanhaFormularioInput>();

  const appendVar = () => {
    if (fields.length > templateQtdVars - 1) return;
    if (templateProvedor === ProvedorEnum.UPCHAT) {
      append({ variavel: `${fields.length + 1}`, valor: '' });
      return;
    }
    append({ variavel: '', valor: '' });
  };

  const removeVar = (indexRemove: number) => {
    if (
      fields.length > 1 &&
      templateProvedor === ProvedorEnum.UPCHAT &&
      fields.length - 1 !== indexRemove
    ) {
      fields.forEach((field, index) => {
        if (index > indexRemove) {
          form.setValue(
            `vars.${index}.variavel`,
            `${Number(field.variavel) - 1}`,
            {
              shouldDirty: true,
              shouldValidate: true,
            },
          );
        }
      });
      remove(indexRemove);
      return;
    }
    remove(indexRemove);
  };

  const isValorDaFonteDados = (value: unknown): value is string =>
    typeof value === 'string' && value.startsWith('#');

  const camposSelecionaveisOptionsBase = useMemo(
    () =>
      camposSelecionaveis.map((campo) => ({
        label: campo.rotulo || campo.campo,
        value: campo.campo,
      })),
    [camposSelecionaveis],
  );

  const camposSelecionaveisOptions = useMemo(() => {
    if (
      !contatoCampo ||
      camposSelecionaveisOptionsBase.some(
        (option) => option.value === contatoCampo,
      )
    ) {
      return camposSelecionaveisOptionsBase;
    }

    return [
      ...camposSelecionaveisOptionsBase,
      { label: contatoCampo, value: contatoCampo },
    ];
  }, [camposSelecionaveisOptionsBase, contatoCampo]);

  const camposTokenOptionsBase = useMemo(
    () =>
      camposSelecionaveis.map((campo) => {
        const value = `#${campo.campo}`;

        return {
          label: campo.rotulo ? `${campo.rotulo} (${value})` : value,
          value,
        };
      }),
    [camposSelecionaveis],
  );

  const camposTokenOptions = useMemo(() => {
    const valoresFonteDados = (vars ?? [])
      .map((variavel) => variavel.valor)
      .filter(isValorDaFonteDados);
    const options = [...camposTokenOptionsBase];

    valoresFonteDados.forEach((value) => {
      if (options.some((option) => option.value === value)) return;
      options.push({ label: value, value });
    });

    return options;
  }, [camposTokenOptionsBase, vars]);

  const camposSelecionaveisDisabled =
    readOnly || camposSelecionaveisOptions.length === 0;

  const limparCamposEnvio = () => {
    form.setValue('contatoCampo', '', {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue(
      'vars',
      form.getValues('vars').map((variavel) => ({ ...variavel, valor: '' })),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const selecionarTemplate = (template: TemplatesApiResponse) => {
    form.setValue('templateId', template.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTemplateProvedor(template.integracaoCampanha.provedor);
    setTemplateQtdVars(template.quantidadeVars);
    setTemplateNome(template.nome);
  };

  const selecionarView = (view: ViewsCampanhaApiResponse) => {
    form.setValue('viewId', view.id, {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue('baseDadosId', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    limparCamposEnvio();
    setViewNome(view.nome);
    setCamposSelecionaveis(view.campos);
    setBaseDadosNome('');
  };

  const selecionarBaseDados = (baseDados: BasesDadosCampanhaApiResponse) => {
    form.setValue('baseDadosId', baseDados.id, {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue('viewId', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    limparCamposEnvio();
    setBaseDadosNome(baseDados.nome);
    setCamposSelecionaveis(baseDados.campos);
    setViewNome('');
  };

  const isBaseDadosCampanha = (
    baseDados: unknown,
  ): baseDados is BasesDadosCampanhaApiResponse =>
    typeof baseDados === 'object' && baseDados !== null && 'campos' in baseDados;

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
        <DatePicker
          name='scheduledAt'
          label='Agendamento'
          disabled={readOnly}
        />
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
                campos={true}
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
                campos={true}
                onSelecionar={(baseDados) => {
                  if (!isBaseDadosCampanha(baseDados)) return;
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
        <Select
          name='contatoCampo'
          label='Campo de contato'
          placeholder={
            camposSelecionaveisOptions.length > 0
              ? 'Selecione o campo de contato'
              : 'Selecione uma fonte de dados'
          }
          options={camposSelecionaveisOptions}
          disabled={camposSelecionaveisDisabled}
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
              onClick={appendVar}
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
                    label='Nome'
                    placeholder='nome'
                    disabled={
                      readOnly || templateProvedor === ProvedorEnum.UPCHAT
                    }
                  />
                  <div className='space-y-2'>
                    {(valorBaseDadosPorLinha[field.id] ??
                    isValorDaFonteDados(vars?.[index]?.valor)) ? (
                      <Select
                        name={`vars.${index}.valor`}
                        label='Valor'
                        placeholder={
                          camposTokenOptions.length > 0
                            ? 'Selecione o campo'
                            : 'Selecione uma fonte de dados'
                        }
                        options={camposTokenOptions}
                        disabled={camposSelecionaveisDisabled}
                      />
                    ) : (
                      <Input
                        name={`vars.${index}.valor`}
                        label='Valor'
                        placeholder='Digite um valor'
                        disabled={readOnly}
                      />
                    )}
                    <label className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <Checkbox
                        checked={
                          valorBaseDadosPorLinha[field.id] ??
                          isValorDaFonteDados(vars?.[index]?.valor)
                        }
                        disabled={readOnly || camposTokenOptions.length === 0}
                        onCheckedChange={(checked) => {
                          const isChecked = checked === true;

                          setValorBaseDadosPorLinha((current) => ({
                            ...current,
                            [field.id]: isChecked,
                          }));
                          form.setValue(`vars.${index}.valor`, '', {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />
                      Valor da fonte de dados
                    </label>
                  </div>
                  <div className='flex items-end'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      disabled={readOnly}
                      onClick={() => removeVar(index)}
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

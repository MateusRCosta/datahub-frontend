'use client';

import { useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
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
import { ProvedorEnum } from '@/common/schema/provedor.schema';
import { CampanhaResponse } from '../schema/campanha.schema';

interface CampanhaFormProps {
  campanhaInicial?: CampanhaResponse;
  readOnly?: boolean;
}

export function CampanhaForm({
  campanhaInicial,
  readOnly = false,
}: CampanhaFormProps) {
  const form = useFormContext<CampanhaFormularioInput>();
  const vars = form.watch('vars');

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'vars',
  });

  const {
    Input,
    InputSelecaoModal,
    DatePicker,
    Select: SelectGenerico,
  } = useFormComponents<CampanhaFormularioInput>();

  const [uiMeta, setUiMeta] = useState({
    template: {
      nome: campanhaInicial?.template?.nome ?? '',
      qtdVars: campanhaInicial?.template?.quantidadeVars ?? 0,
      provedor:
        campanhaInicial?.template?.integracaoCampanha?.provedor ??
        ProvedorEnum.UPCHAT,
    },
    viewNome: campanhaInicial?.view?.nome ?? '',
    baseDadosNome: campanhaInicial?.baseDeDados?.nome ?? '',
    camposSelecionaveis: campanhaInicial?.campos ?? [],
  });

  const [modoSelectPorLinha, setModoSelectPorLinha] = useState<
    Record<string, boolean>
  >({});

  const isValorDaFonteDados = (value: unknown): value is string =>
    typeof value === 'string' && value.startsWith('#');

  const camposSelecionaveisOptions = useMemo(
    () =>
      uiMeta.camposSelecionaveis.map((campo) => ({
        label: campo.rotulo ? `${campo.rotulo} (${campo.campo})` : campo.campo,
        value: campo.campo,
        baseDadosId: campo.baseDadosId,
      })),
    [uiMeta.camposSelecionaveis],
  );

  const camposTokenOptions = useMemo(
    () =>
      uiMeta.camposSelecionaveis.map((campo) => {
        const value = `#${campo.campo}`;
        return {
          label: campo.rotulo ? `${campo.rotulo} (${value})` : value,
          value,
          baseDadosId: campo.baseDadosId,
        };
      }),
    [uiMeta.camposSelecionaveis],
  );

  const camposSelecionaveisDisabled =
    readOnly || camposSelecionaveisOptions.length === 0;

  const limparCamposEnvio = () => {
    form.setValue(
      'contatoCampo',
      { valor: '', baseDadosId: undefined },
      { shouldDirty: true },
    );
    form.setValue(
      'vars',
      form.getValues('vars').map((variavel) => ({
        ...variavel,
        valor: '',
        baseDadosId: undefined,
      })),
      { shouldDirty: true, shouldValidate: true },
    );
    setModoSelectPorLinha({});
  };

  const appendVar = () => {
    if (fields.length > uiMeta.template.qtdVars - 1) return;
    if (uiMeta.template.provedor === ProvedorEnum.UPCHAT) {
      append({
        variavel: `${fields.length + 1}`,
        valor: '',
        baseDadosId: undefined,
      });
      return;
    }
    append({ variavel: '', valor: '', baseDadosId: undefined });
  };

  const removeVar = (indexRemove: number) => {
    if (
      fields.length > 1 &&
      uiMeta.template.provedor === ProvedorEnum.UPCHAT &&
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
    }
    remove(indexRemove);
  };

  // Funções semânticas para quando o usuário seleciona algo nos modais
  const handleSelecionarTemplate = (t: TemplatesApiResponse) => {
    form.setValue('templateId', t.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setUiMeta((prev) => ({
      ...prev,
      template: {
        nome: t.nome,
        qtdVars: t.quantidadeVars,
        provedor: t.integracaoCampanha.provedor,
      },
    }));
  };

  const handleSelecionarView = (view: ViewsCampanhaApiResponse) => {
    form.setValue('viewId', view.id, { shouldDirty: true });
    form.setValue('baseDadosId', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    limparCamposEnvio();
    setUiMeta((prev) => ({
      ...prev,
      viewNome: view.nome,
      baseDadosNome: '',
      camposSelecionaveis: view.campos,
    }));
  };

  const handleSelecionarBaseDados = (baseDados: unknown) => {
    const isBaseDados = (b: unknown): b is BasesDadosCampanhaApiResponse =>
      typeof b === 'object' && b !== null && 'campos' in b;
    if (!isBaseDados(baseDados)) return;

    form.setValue('baseDadosId', baseDados.id, { shouldDirty: true });
    form.setValue('viewId', undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    limparCamposEnvio();
    setUiMeta((prev) => ({
      ...prev,
      baseDadosNome: baseDados.nome,
      viewNome: '',
      camposSelecionaveis: baseDados.campos,
    }));
  };

  const handleToggleModoValor = (
    fieldId: string,
    index: number,
    isChecked: boolean,
  ) => {
    setModoSelectPorLinha((prev) => ({ ...prev, [fieldId]: isChecked }));
    form.setValue(`vars.${index}.valor`, '', {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(`vars.${index}.baseDadosId`, undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
        <DatePicker
          name='scheduledAt'
          label='Agendamento'
          disabled={readOnly}
        />

        <InputSelecaoModal
          name='templateId'
          label='Template'
          nomeDisplay={uiMeta.template.nome}
          modalTitle='Selecionar template'
          disabled={readOnly}
          modalContent={(fecharModal) => (
            <TemplateTabela
              modoSelecao
              onSelecionar={(t) => {
                handleSelecionarTemplate(t);
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
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <InputSelecaoModal
            name='viewId'
            label='Visualização'
            nomeDisplay={uiMeta.viewNome}
            modalTitle='Selecionar visualização'
            disabled={readOnly}
            modalContent={(fecharModal) => (
              <ViewSelecaoTabela
                campos={true}
                onSelecionar={(view) => {
                  handleSelecionarView(view);
                  fecharModal();
                }}
              />
            )}
          />
          <InputSelecaoModal
            name='baseDadosId'
            label='Base de dados'
            nomeDisplay={uiMeta.baseDadosNome}
            modalTitle='Selecionar base de dados'
            disabled={readOnly}
            modalContent={(fecharModal) => (
              <BaseDadosTabela
                modoSelecao
                campos={true}
                onSelecionar={(baseDados) => {
                  handleSelecionarBaseDados(baseDados);
                  fecharModal();
                }}
              />
            )}
          />
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-sm font-semibold'>Envio</h3>
        <SelectGenerico
          name='contatoCampo.valor'
          label='Campo de contato'
          placeholder='Selecione um campo'
          options={camposSelecionaveisOptions}
          disabled={camposSelecionaveisDisabled}
          onValueChange={(value, selectedOption) => {
            form.setValue(
              'contatoCampo',
              { valor: value, baseDadosId: selectedOption?.baseDadosId },
              { shouldDirty: true, shouldValidate: true },
            );
          }}
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
              <Plus className='h-4 w-4' /> Adicionar
            </Button>
          </div>

          <div className='space-y-3'>
            {fields.length === 0 ? (
              <p className='rounded-md border border-dashed px-3 py-4 text-center text-xs text-muted-foreground'>
                Nenhuma variável adicionada.
              </p>
            ) : (
              fields.map((field, index) => {
                const usaSelect =
                  modoSelectPorLinha[field.id] ??
                  isValorDaFonteDados(vars?.[index]?.valor);

                return (
                  <div
                    key={field.id}
                    className='grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]'
                  >
                    <Input
                      name={`vars.${index}.variavel`}
                      label='Nome'
                      placeholder='nome'
                      disabled={
                        readOnly ||
                        uiMeta.template.provedor === ProvedorEnum.UPCHAT
                      }
                    />

                    <div className='space-y-2'>
                      {usaSelect ? (
                        <SelectGenerico
                          name={`vars.${index}.valor`}
                          label='Valor'
                          placeholder={
                            camposTokenOptions.length > 0
                              ? 'Selecione o campo'
                              : 'Selecione uma fonte de dados'
                          }
                          options={camposTokenOptions}
                          disabled={camposSelecionaveisDisabled}
                          onValueChange={(_, selectedOption) => {
                            form.setValue(
                              `vars.${index}.baseDadosId`,
                              selectedOption?.baseDadosId,
                              {
                                shouldDirty: true,
                                shouldValidate: true,
                              },
                            );
                          }}
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
                          checked={usaSelect}
                          disabled={readOnly || camposTokenOptions.length === 0}
                          onCheckedChange={(checked) =>
                            handleToggleModoValor(
                              field.id,
                              index,
                              checked === true,
                            )
                          }
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
                        className='shrink-0'
                      >
                        <Trash2 className='h-4 w-4 text-destructive' />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

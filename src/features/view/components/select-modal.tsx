'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Metadado } from '@/features/base-dados/schema/base-dados.schema';
import { useFormComponents } from '@/hooks/use-form-components';
import {
  SelectCampo,
  SelectCamposForm,
  selectCamposFormSchema,
} from '../schema/view.schema';

type SelectModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (campos: SelectCampo[]) => void;
  baseDadosId: number;
  estrutura: Metadado[];
  selectedCampos: SelectCampo[];
};

export function SelectModal({
  open,
  onClose,
  onSave,
  baseDadosId,
  estrutura,
  selectedCampos,
}: SelectModalProps) {
  const { Input } = useFormComponents<SelectCamposForm>();

  const form = useForm<SelectCamposForm>({
    mode: 'onSubmit',
    resolver: zodResolver(selectCamposFormSchema),
    defaultValues: {
      campos: selectedCampos,
    },
  });

  const campos = useWatch({
    control: form.control,
    name: 'campos',
  });

  const toggle = (campo: string) => {
    const camposAtuais = form.getValues('campos');
    form.setValue(
      'campos',
      camposAtuais.some((item) => item.campo === campo)
        ? camposAtuais.filter((item) => item.campo !== campo)
        : [...camposAtuais, { campo, rotulo: campo }],
      { shouldDirty: true },
    );
  };

  const handleSave = (data: SelectCamposForm) => {
    onSave(data.campos);
    onClose();
  };

  return (
    <DialogCustom
      open={open}
      setOpen={(value) => {
        if (!value) onClose();
      }}
      isPending={false}
      descricao={<p>Selecione os campos e ajuste os rótulos exibidos.</p>}
      trigger={null}
      titulo={`Selecionar Campos da Base: ${baseDadosId}`}
      idForm='form-select-modal'
    >
      <FormProvider {...form}>
        <form
          id='form-select-modal'
          onSubmit={form.handleSubmit(handleSave)}
          className='flex flex-col gap-2 py-2'
        >
          {estrutura.map((metadado) => {
            const selecionadoIndex = campos.findIndex(
              (campo) => campo.campo === metadado.cabecalho,
            );
            const selecionado = selecionadoIndex >= 0;

            return (
              <div key={metadado.cabecalho} className='flex items-center gap-2 w-full'>
                <Checkbox
                  id={`campo-${metadado.cabecalho}`}
                  checked={selecionado}
                  onCheckedChange={() => toggle(metadado.cabecalho)}
                  className='mt-2'
                />
                <div className='flex flex-col gap-1 flex-1 min-w-0 self-center'>
                  <Label
                    htmlFor={`campo-${metadado.cabecalho}`}
                    className='flex cursor-pointer items-center'
                  >
                    <span>{metadado.rotulo ?? metadado.cabecalho}</span>
                    <span className='text-xs text-muted-foreground'>
                      ({metadado.cabecalho})
                    </span>
                  </Label>
                  {selecionado && (
                    <Input
                      name={`campos.${selecionadoIndex}.rotulo`}
                      placeholder={metadado.cabecalho}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </form>
      </FormProvider>
    </DialogCustom>
  );
}

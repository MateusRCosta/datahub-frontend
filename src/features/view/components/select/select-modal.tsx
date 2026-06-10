'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { useFormComponents } from '@/hooks/use-form-components';
import {
  SelectCampo,
  SelectCamposForm,
  selectCamposFormSchema,
} from '../../schema/view.schema';

type SelectModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (campos: SelectCampo[]) => void;
  baseDados: Pick<BasesDadosCampanhaApiResponse, 'campos' | 'id' | 'nome'>;
  selectedCampos: SelectCampo[];
};

export function SelectModal({
  open,
  onClose,
  onSave,
  baseDados,
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
    const rotulos = data.campos.map((c) => c.rotulo);

    const rotulosRepetidos = rotulos.filter(
      (rot, index) => rotulos.indexOf(rot) !== index,
    );

    if (rotulosRepetidos.length > 0) {
      data.campos.forEach((campo, index) => {
        if (rotulosRepetidos.includes(campo.rotulo)) {
          form.setError(`campos.${index}.rotulo`, {
            message: 'Rótulo duplicado',
          });
        }
      });
      return; 
    }

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
      titulo={`Selecionar Campos da Base: ${baseDados.nome}`}
      idForm='form-select-modal'
    >
      <FormProvider {...form}>
        <form
          id='form-select-modal'
          onSubmit={form.handleSubmit(handleSave)}
          className='flex flex-col gap-2 py-2'
        >
          {baseDados.campos.map((metadado) => {
            const selecionadoIndex = campos.findIndex(
              (campo) => campo.campo === metadado.campo,
            );
            const selecionado = selecionadoIndex >= 0;

            return (
              <div
                key={metadado.campo}
                className='flex items-center gap-2 w-full'
              >
                <Checkbox
                  id={`campo-${metadado.campo}`}
                  checked={selecionado}
                  onCheckedChange={() => toggle(metadado.campo)}
                  className='mt-2'
                />
                <div className='flex flex-col gap-1 flex-1 min-w-0 self-center'>
                  <Label
                    htmlFor={`campo-${metadado.campo}`}
                    className='flex cursor-pointer items-center'
                  >
                    <span>{metadado.rotulo ?? metadado.campo}</span>
                    <span className='text-xs text-muted-foreground'>
                      ({metadado.campo})
                    </span>
                  </Label>
                  {selecionado && (
                    <Input
                      name={`campos.${selecionadoIndex}.rotulo`}
                      placeholder={metadado.campo}
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

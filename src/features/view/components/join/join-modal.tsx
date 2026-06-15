'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { useFormComponents } from '@/hooks/use-form-components';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import {
  Join,
  joinsSchema,
  tipoJoinEnumSchema,
} from '../../schema/view.schema';
import { JoinComNome } from '../../types';
import { TIPO_JOIN_ENUM } from '../../types/enums';

type SelectOption = {
  label: string;
  value: string;
};

type JoinModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Join) => void;
  initialData: JoinComNome;
  from: { baseDadosId: number } | null;
  basesDados: BasesDadosCampanhaApiResponse[];
};

const tipoJoinOptions = Object.values(TIPO_JOIN_ENUM).map((v) => ({
  label: v.toUpperCase(),
  value: v,
}));

export function JoinModal({
  open,
  onClose,
  onSave,
  initialData,
  from,
  basesDados,
}: JoinModalProps) {
  const { Input, Select } = useFormComponents<Join>();

  const camposFromOptions = useMemo(() => {
    const campos =
      basesDados.find((baseDados) => baseDados.id === from?.baseDadosId)
        ?.campos ?? [];

    const options: SelectOption[] = campos.map((campo) => ({
      label: campo.rotulo ?? campo.campo,
      value: campo.campo,
    }));

    if (
      initialData.campoFrom &&
      !options.some((option) => option.value === initialData.campoFrom)
    ) {
      options.unshift({
        label: initialData.campoFrom,
        value: initialData.campoFrom,
      });
    }

    return options;
  }, [basesDados, from?.baseDadosId, initialData.campoFrom]);

  const camposJoinOptions = useMemo(() => {
    const campos =
      basesDados.find(
        (baseDados) => baseDados.id === initialData.baseDadosIdJoin,
      )?.campos ?? [];

    const options: SelectOption[] = campos.map((campo) => ({
      label: campo.rotulo ?? campo.campo,
      value: campo.campo,
    }));

    if (
      initialData.campoJoin &&
      !options.some((option) => option.value === initialData.campoJoin)
    ) {
      options.unshift({
        label: initialData.campoJoin,
        value: initialData.campoJoin,
      });
    }

    return options;
  }, [basesDados, initialData.baseDadosIdJoin, initialData.campoJoin]);

  const form = useForm<Join>({
    mode: 'onSubmit',
    resolver: zodResolver(joinsSchema),
    defaultValues: {
      baseDadosIdJoin: initialData.baseDadosIdJoin,
      campoFrom: initialData.campoFrom || '',
      campoJoin: initialData.campoJoin || '',
      tipo: initialData.tipo || tipoJoinEnumSchema.options[0],
    },
  });

  const onSubmit = (data: Join) => {
    onSave(data);
    form.reset();
    onClose();
  };

  return (
    <DialogCustom
      open={open}
      setOpen={(value) => {
        if (!value) onClose();
      }}
      isPending={false}
      descricao={<p>Configure os campos e o tipo do Join.</p>}
      trigger={null}
      titulo={`Configurar Junção: ${initialData.nome}`}
      idForm='form-join-modal'
    >
      <FormProvider {...form}>
        <form
          id='form-join-modal'
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'
        >
          <FieldGroup className='flex flex-col gap-4'>
            <Input name='baseDadosIdJoin' label='Base de Dados ID' disabled />
            <Select
              name='campoFrom'
              label='Campo da base de dados de referência'
              placeholder={
                camposFromOptions.length > 0
                  ? 'Selecione o campo'
                  : 'Nenhum campo disponível'
              }
              options={camposFromOptions}
              disabled={camposFromOptions.length === 0}
            />
            <Select
              name='campoJoin'
              label='Campo da base de dados da junção'
              placeholder={
                camposJoinOptions.length > 0
                  ? 'Selecione o campo'
                  : 'Nenhum campo disponível'
              }
              options={camposJoinOptions}
              disabled={camposJoinOptions.length === 0}
            />
            <Select name='tipo' label='Tipo' options={tipoJoinOptions} />
          </FieldGroup>
          <FieldError>{form.formState.errors.root?.message}</FieldError>
        </form>
      </FormProvider>
    </DialogCustom>
  );
}

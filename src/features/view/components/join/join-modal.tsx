'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { useFormComponents } from '@/hooks/use-form-components';
import {
  Join,
  joinsSchema,
  tipoJoinEnumSchema,
} from '../../schema/view.schema';
import { JoinComNome } from '../../types';
import { TIPO_JOIN_ENUM } from '../../types/enums';

type JoinModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Join) => void;
  initialData: Pick<JoinComNome, 'baseDadosIdJoin' | 'nome'>;
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
}: JoinModalProps) {
  const { Input, Select } = useFormComponents<Join>();

  const form = useForm<Join>({
    mode: 'onSubmit',
    resolver: zodResolver(joinsSchema),
    defaultValues: {
      baseDadosIdJoin: initialData.baseDadosIdJoin,
      campoFrom: '',
      campoJoin: '',
      tipo: tipoJoinEnumSchema.options[0],
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
      titulo='Configurar Join'
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
            <Input name='campoFrom' label='Campo From' placeholder='Ex: id' />
            <Input
              name='campoJoin'
              label='Campo Join'
              placeholder='Ex: base_dados_id'
            />
            <Select name='tipo' label='Tipo' options={tipoJoinOptions} />
          </FieldGroup>
          <FieldError>{form.formState.errors.root?.message}</FieldError>
        </form>
      </FormProvider>
    </DialogCustom>
  );
}

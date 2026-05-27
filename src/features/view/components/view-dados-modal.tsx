'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { FieldError, FieldGroup } from '@/components/ui/field';
import { useFormComponents } from '@/hooks/use-form-components';
import { ViewDados, viewDadosSchema } from '../schema/view.schema';

type ViewDadosModalProps = {
  open: boolean;
  onClose: () => void;
  titulo: string;
  descricao: string;
  isPending: boolean;
  initialValues: ViewDados;
  onSubmit: (data: ViewDados) => void;
};

export function ViewDadosModal({
  open,
  onClose,
  titulo,
  descricao,
  isPending,
  initialValues,
  onSubmit,
}: ViewDadosModalProps) {
  const { Input } = useFormComponents<ViewDados>();

  const form = useForm<ViewDados>({
    mode: 'onSubmit',
    resolver: zodResolver(viewDadosSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    if (open) form.reset(initialValues);
  }, [form, initialValues, open]);

  const handleSubmit = (data: ViewDados) => {
    onSubmit(data);
  };

  return (
    <DialogCustom
      open={open}
      setOpen={(value) => {
        if (!value) onClose();
      }}
      isPending={isPending}
      descricao={<p>{descricao}</p>}
      trigger={null}
      titulo={titulo}
      idForm='form-view-dados'
    >
      <FormProvider {...form}>
        <form
          id='form-view-dados'
          onSubmit={form.handleSubmit(handleSubmit)}
          className='flex flex-col gap-4'
        >
          <FieldGroup className='flex flex-col gap-4'>
            <Input
              name='nome'
              label='Nome'
              placeholder='Nome da visualização'
            />
            <Input
              name='descricao'
              label='Descrição'
              placeholder='Descrição da visualização'
            />
          </FieldGroup>
          <FieldError>{form.formState.errors.root?.message}</FieldError>
        </form>
      </FormProvider>
    </DialogCustom>
  );
}

'use client';

import { useFormContext } from 'react-hook-form';
import { TemplateCriacao } from '../schema/template.schema';
import { UpchatForm } from './provedores/upchat-form';
import { ProvedorEnum } from '@/common/schema/provedor.schema';

export function TemplateConfigForm() {
  const { watch } = useFormContext<TemplateCriacao>();
  const provedor = watch('provedor');

  const forms: Record<ProvedorEnum, React.ReactNode> = {
    upchat: <UpchatForm />,
  };

  return forms[provedor];
}

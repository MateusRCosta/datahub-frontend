'use client';

import { useFormContext } from 'react-hook-form';
import { ProvedorEnum } from '../../schema/integracao-campanha.schema';
import { TemplateCriacao } from '../schema/template.schema';
import { UpchatForm } from './provedores/upchat-form';

export function TemplateConfigForm() {
  const { watch } = useFormContext<TemplateCriacao>();
  const provedor = watch('provedor');

  const forms: Record<ProvedorEnum, React.ReactNode> = {
    upchat: <UpchatForm />,
  };

  return forms[provedor];
}

'use client';

import { useFormContext } from 'react-hook-form';
import {
  IntegracaoCampanhaCriacao,
  ProvedorEnum,
} from '../schema/integracao-campanha.schema';
import { UpchatForm } from './provedores/upchat-form';

export function IntegracaoCampanhaConfigForm() {
  const { watch } = useFormContext<IntegracaoCampanhaCriacao>();
  const provedor = watch('provedor');

  const forms: Record<ProvedorEnum, React.ReactNode> = {
    upchat: <UpchatForm />,
  };

  return forms[provedor];
}

'use client';

import { useFormContext } from 'react-hook-form';
import { IntegracaoCampanhaCriacao } from '../schema/integracao-campanha.schema';
import { UpchatForm } from './provedores/upchat-form';
import { ProvedorEnum } from '@/common/schema/provedor.schema';

export function IntegracaoCampanhaConfigForm() {
  const { watch } = useFormContext<IntegracaoCampanhaCriacao>();
  const provedor = watch('provedor');

  const forms: Record<ProvedorEnum, React.ReactNode> = {
    upchat: <UpchatForm />,
  };

  return forms[provedor];
}

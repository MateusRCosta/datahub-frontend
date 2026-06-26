'use client';

import { DialogCustom } from '@/components/layout/dialog-custom';
import { Button } from '@/components/ui/button';
import { Funnel } from 'lucide-react';
import { type BasesDadosCampanhaApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { GroupFilterConstrutor } from '../group/group-filter-construtor';
import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  type GroupFilter,
  type ViewCampanhaCriacao,
} from '../../schema/view.schema';
import { TIPO_FILTRO_ENUM } from '../../types/enums';

const filtrosEstaoValidos = (
  grupo: GroupFilter,
  basesDados: BasesDadosCampanhaApiResponse[],
): boolean =>
  grupo.groupFilter.every((item) => {
    if (item.type !== TIPO_FILTRO_ENUM.FILTER) {
      return filtrosEstaoValidos(item, basesDados);
    }

    const base = basesDados.find(
      (baseDados) => baseDados.id === item.filter.baseDadosId,
    );
    return Boolean(
      base?.campos.some((campo) => campo.campo === item.filter.campo),
    );
  });

type ViewFiltrosModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => Promise<boolean>;
  isPending: boolean;
  basesDados: BasesDadosCampanhaApiResponse[];
};

export function ViewFiltrosModal({
  open,
  onOpenChange,
  onSave,
  isPending,
  basesDados,
}: ViewFiltrosModalProps) {
  const { control, getValues, setValue } =
    useFormContext<ViewCampanhaCriacao>();
  const groupFilter = useWatch({ control, name: 'config.groupFilter' });
  const podeSalvar =
    groupFilter !== undefined && filtrosEstaoValidos(groupFilter, basesDados);
  const filtrosOriginais = useRef<
    ViewCampanhaCriacao['config']['groupFilter'] | null
  >(null);
  const salvando = useRef(false);

  useEffect(() => {
    if (open) {
      filtrosOriginais.current = structuredClone(
        getValues('config.groupFilter'),
      );
      salvando.current = false;
    }
  }, [getValues, open]);

  const handleOpenChange = (proximoOpen: boolean) => {
    if (!proximoOpen && !salvando.current && filtrosOriginais.current) {
      setValue('config.groupFilter', filtrosOriginais.current);
    }
    onOpenChange(proximoOpen);
  };

  return (
    <DialogCustom
      open={open}
      setOpen={handleOpenChange}
      isPending={isPending}
      descricao={<p>Configure os filtros da visualização.</p>}
      titulo='Filtros'
      idForm='form-filtros-view'
      disableSubmit={!podeSalvar}
      trigger={
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(true)}
          aria-label='Aplicar filtros'
          title='Aplicar filtros'
        >
          <Funnel aria-hidden='true' />
        </Button>
      }
    >
      <form
        id='form-filtros-view'
        onSubmit={async (event) => {
          event.preventDefault();
          if (!podeSalvar) return;
          if (!(await onSave())) return;
          salvando.current = true;
          onOpenChange(false);
        }}
      >
        <GroupFilterConstrutor basesDados={basesDados} />
      </form>
    </DialogCustom>
  );
}

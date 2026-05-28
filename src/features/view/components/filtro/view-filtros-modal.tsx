'use client';

import { DialogCustom } from '@/components/layout/dialog-custom';
import { Button } from '@/components/ui/button';
import { Funnel } from 'lucide-react';
import { type BasesDadosApiResponse } from '@/features/base-dados/schema/base-dados.schema';
import { GroupFilterConstrutor } from '../group/group-filter-construtor';

type ViewFiltrosModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basesDados: BasesDadosApiResponse[];
};

export function ViewFiltrosModal({
  open,
  onOpenChange,
  basesDados,
}: ViewFiltrosModalProps) {
  return (
    <DialogCustom
      open={open}
      setOpen={onOpenChange}
      isPending={false}
      descricao={<p>Configure os filtros da visualização.</p>}
      titulo='Filtros'
      temFooter={false}
      trigger={
        <Button
          type='button'
          variant='outline'
          onClick={() => onOpenChange(true)}
        >
          <Funnel aria-hidden='true' />
          Filtros
        </Button>
      }
    >
      <GroupFilterConstrutor basesDados={basesDados} />
    </DialogCustom>
  );
}

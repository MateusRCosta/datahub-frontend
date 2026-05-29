'use client';

import { useState } from 'react';
import { DialogCustom } from '@/components/layout/dialog-custom';
import { Button } from '@/components/ui/button';
import { Table2 } from 'lucide-react';
import { type ViewsApiResponse } from '../schema/view.schema';
import { ViewExecutaTabela } from './cliente/cliente-tabela';

type ViewExecutaModalProps = {
  selectedView: ViewsApiResponse | null;
  disabled: boolean;
};

export function ViewExecutaModal({
  selectedView,
  disabled,
}: ViewExecutaModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogCustom
      open={open}
      setOpen={setOpen}
      isPending={false}
      descricao={<p>Dados retornados pela visualização selecionada.</p>}
      titulo={selectedView ? `Visualização: ${selectedView.nome}` : 'Visualização'}
      temFooter={false}
      trigger={
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={() => setOpen(true)}
          disabled={disabled}
          aria-label='Executar visualização'
          title='Executar visualização'
        >
          <Table2 aria-hidden='true' />
        </Button>
      }
    >
      {selectedView && open ? (
        <ViewExecutaTabela key={selectedView.id} viewId={selectedView.id} />
      ) : null}
    </DialogCustom>
  );
}

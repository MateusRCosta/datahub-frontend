import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type ViewsApiResponse } from '../schema/view.schema';
import { BasesDadosApiResponse } from '../types';
import { ViewFiltrosModal } from './filtro/view-filtros-modal';
import { ViewExecutaModal } from './view-executa/view-executa-modal';
import { DialogDeleta } from '@/components/layout/dialog-deleta';

type ViewBarProps = {
  views: ViewsApiResponse[];
  selectedView: ViewsApiResponse | null;
  isPending: boolean;
  dadosModalOpen: boolean;
  onViewSelect: (view: ViewsApiResponse | null) => void;
  viewSelect?: ViewsApiResponse | null;
  onCreateView: () => void;
  onSaveView: () => void;
  filtrosModalOpen: boolean;
  setFiltrosModalOpen: (open: boolean) => void;
  basesDados: BasesDadosApiResponse[];
};

export function ViewBar({
  views,
  selectedView,
  isPending,
  dadosModalOpen,
  viewSelect,
  onViewSelect,
  onCreateView,
  onSaveView,
  basesDados,
  filtrosModalOpen,
  setFiltrosModalOpen,
}: ViewBarProps) {
  const [open, setOpen] = useState<boolean>(false);
  const hasSelectedView = Boolean(selectedView);
  const selectedViewId = selectedView ? String(selectedView.id) : 'nova';

  const viewOptions = useMemo(() => {
    const options = views.map((view) => ({
      label: view.nome,
      value: String(view.id),
    }));

    if (
      selectedView &&
      !options.some((option) => option.value === String(selectedView.id))
    ) {
      options.unshift({
        label: selectedView.nome,
        value: String(selectedView.id),
      });
    }

    return [{ label: 'Nova visualização', value: 'nova' }, ...options];
  }, [selectedView, views]);

  return (
    <div className='flex flex-col md:flex-row w-full gap-2 items-end'>
      <div className='flex flex-col gap-1 w-full'>
        <label className='text-xs font-normal'>Visualização existente</label>
        <Select
          value={selectedViewId}
          onValueChange={(id) => {
            if (id === 'nova') {
              onViewSelect(null);
              return;
            }

            const found = views.find((view) => String(view.id) === id);
            onViewSelect(found ?? null);
          }}
        >
          <SelectTrigger className='w-full bg-field-background dark:bg-input/30 text-sm'>
            <SelectValue placeholder='Selecione uma visualização' />
          </SelectTrigger>
          <SelectContent>
            {viewOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col md:flex-row gap-2 md:items-center w-full'>
        <div className='flex flex-col md:flex-row w-full items-center gap-2'>
          <Button
            type='button'
            onClick={onCreateView}
            disabled={isPending}
            className='w-full md:w-fit'
          >
            {hasSelectedView ? 'Editar visualização' : 'Criar visualização'}
          </Button>
          <div className='flex flex-row w-full gap-2'>
            <ViewFiltrosModal
              open={filtrosModalOpen}
              onOpenChange={setFiltrosModalOpen}
              basesDados={basesDados}
            />
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={onSaveView}
              disabled={isPending || !hasSelectedView}
              aria-label='Salvar visualizacao'
              title='Salvar visualizacao'
            >
              <Save aria-hidden='true' />
            </Button>
            <ViewExecutaModal
              selectedView={selectedView}
              disabled={isPending || dadosModalOpen || !hasSelectedView}
            />
            {viewSelect && (
              <>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => setOpen(!open)}
                  disabled={isPending || !hasSelectedView}
                  aria-label='Salvar visualizacao'
                  title='Salvar visualizacao'
                >
                  <Trash2 aria-hidden='true' className='text-destructive' />
                </Button>
                <DialogDeleta
                  id={viewSelect.id}
                  objeto='Visualização'
                  path='views'
                  nome={viewSelect.nome}
                  trigger={false}
                  open={open}
                  setOpen={setOpen}
                  onSuccess={() => onViewSelect(null)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

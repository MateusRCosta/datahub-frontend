import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { type ViewsApiResponse } from '../schema/view.schema';
import { ViewFiltrosModal } from './filtro/view-filtros-modal';
import { BasesDadosApiResponse } from '../types';
import { ViewExecutaModal } from './view-executa/view-executa-modal';

type ViewBarProps = {
  views: ViewsApiResponse[];
  selectedView: ViewsApiResponse | null;
  isPending: boolean;
  dadosModalOpen: boolean;
  onViewSelect: (view: ViewsApiResponse | null) => void;
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
  onViewSelect,
  onCreateView,
  onSaveView,
  basesDados,
  filtrosModalOpen,
  setFiltrosModalOpen,
}: ViewBarProps) {
  const hasSelectedView = Boolean(selectedView);
  const selectedViewId = selectedView ? String(selectedView.id) : '';

  return (
    <div className='flex flex-col w-full gap-1'>
      <Label htmlFor='view-selector' className='text-sm'>
        Visualização existente
      </Label>
      <div className='flex flex-col md:flex-row gap-2 md:items-center w-full'>
        <select
          id='view-selector'
          className='border rounded-md p-2 text-sm bg-field-background min-w-52'
          value={selectedViewId}
          onChange={(event) => {
            const id = event.target.value;
            const found = views.find((view) => String(view.id) === id);
            onViewSelect(found ?? null);
          }}
        >
          <option value='' className='bg-background/90'>
            Nova visualização
          </option>
          {views.map((view) => (
            <option
              key={view.id}
              value={String(view.id)}
              className='bg-background/90'
            >
              {view.nome}
            </option>
          ))}
        </select>
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
              aria-label='Salvar visualização'
              title='Salvar visualização'
            >
              <Save aria-hidden='true' />
            </Button>
            <ViewExecutaModal
              selectedView={selectedView}
              disabled={isPending || dadosModalOpen || !hasSelectedView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

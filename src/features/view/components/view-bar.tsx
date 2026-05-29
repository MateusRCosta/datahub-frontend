import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormComponents } from '@/hooks/use-form-components';
import { type ViewsApiResponse } from '../schema/view.schema';
import { BasesDadosApiResponse } from '../types';
import { ViewFiltrosModal } from './filtro/view-filtros-modal';
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
  const { Select } = useFormComponents();
  const { setValue } = useFormContext();
  const viewOptions = useMemo(
    () => [
      { label: 'Nova visualização', value: 'nova' },
      ...views.map((view) => ({
        label: view.nome,
        value: String(view.id),
      })),
    ],
    [views],
  );

  useEffect(() => {
    setValue('view-selector', selectedViewId || 'nova');
  }, [selectedViewId, setValue]);

  return (
    <div className='flex flex-col md:flex-row w-full gap-2 items-end'>
      <Select
        name='view-selector'
        label='Visualização existente'
        options={viewOptions}
        placeholder='Selecione uma visualização'
        onValueChange={(id) => {
          if (id === 'nova') {
            onViewSelect(null);
            return;
          }

          const found = views.find((view) => String(view.id) === id);
          onViewSelect(found ?? null);
        }}
      />
      <div className='flex flex-col md:flex-row gap-2 md:items-center w-full'>
        <div className='flex flex-col md:flex-row w-full items-center gap-2'>
          <Button
            type='button'
            onClick={onCreateView}
            disabled={isPending}
            className='w-full md:w-fit'
          >
            {hasSelectedView ? 'Editar visualizacao' : 'Criar visualizacao'}
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
          </div>
        </div>
      </div>
    </div>
  );
}

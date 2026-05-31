import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader } from 'lucide-react';
import { ReactNode } from 'react';

interface OrganizacaoDialogProps {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  isPending: boolean;
  descricao: ReactNode;
  trigger: ReactNode;
  titulo: string;
  idForm?: string;
  temFooter?: boolean;
  disableSubmit?: boolean;
}

export function DialogCustom({
  children,
  open,
  setOpen,
  descricao,
  isPending,
  trigger,
  titulo,
  idForm,
  temFooter = true,
  disableSubmit = false,
}: OrganizacaoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      {trigger}
      <DialogContent className='min-w-[90dvw] max-w-[90dvw] md:min-w-[85dvw] md:max-w-[85dvw] max-h-[90dvh] h-full overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription asChild>{descricao}</DialogDescription>
        </DialogHeader>
        <div className='flex-1 min-h-0 w-full flex flex-col overflow-hidden'>
          <div className='flex-1 min-h-0 overflow-y-auto'>{children}</div>
        </div>
        {temFooter && (
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={isPending} variant={'outline'}>
                {idForm ? 'Cancelar' : 'Fechar'}
              </Button>
            </DialogClose>
            {idForm && (
              <Button disabled={isPending || disableSubmit} type='submit' form={idForm}>
                {false && <Loader className='mr-2 h-4 w-4 animate-spin' />}
                Salvar
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

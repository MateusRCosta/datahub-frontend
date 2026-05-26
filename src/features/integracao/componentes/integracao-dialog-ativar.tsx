'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import useIntegracaoAtivar from '../api/use-integracao-ativar';
import { ArrowBigUp, Settings, Trash2 } from 'lucide-react';

type IntegracaoDialogAtivarProps = {
  id: number;
  nome: string;
};

export function IntegracaoDialogAtivar({
  id,
  nome,
}: IntegracaoDialogAtivarProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useIntegracaoAtivar(id);

  const handleAtivar = async () => {
    const resultado = await mutateAsync();

    if (resultado.status === 404) {
      toast.error('Integração não encontrada.');
      return;
    }

    if (resultado.status >= 500) {
      toast.error('Erro interno, tente novamente mais tarde.');
      return;
    }

    toast.success('Integração ativada com sucesso.');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <ArrowBigUp className='cursor-pointer text-verde mr-2 h-4 hover:text-verde/40 duration-200' />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ativar integração: {nome}</DialogTitle>
          <DialogDescription>
            Deseja ativar a integração? Múltiplas integrações ativadas ao mesmo
            tempo pode ocasionar lentidão ao seu serviço
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className='w-full h-full flex flex-row justify-between gap-2'>
            <DialogClose asChild>
              <Button variant='outline'>Cancelar</Button>
            </DialogClose>
            <Button onClick={handleAtivar} disabled={isPending}>
              Ativar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


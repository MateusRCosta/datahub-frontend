'use client';

import useDeleta from '@/common/use-deleta';
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
import { ResourceName } from '@/features/auth/config/resources';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Mensagens {
  naoEncontrado?: string;
  sucesso?: string;
  padrao?: string;
  erroInterno?: string;
  confirmacao?: React.ReactNode;
}

interface DialogDeletaProps {
  id: string | number;
  path: ResourceName;
  nome?: string;
  objeto: string;
  mensagens?: Mensagens;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onSuccess?: () => void;
  trigger?: boolean;
}

export function DialogDeleta({
  id,
  path,
  nome,
  mensagens,
  objeto,
  open: openControlado,
  setOpen: setOpenControlado,
  onSuccess,
  trigger = true,
}: DialogDeletaProps) {
  const [openInterno, setOpenInterno] = useState(false);

  const isOpen = trigger ? openInterno : openControlado;
  const setIsOpen = trigger ? setOpenInterno : setOpenControlado;

  const { mutateAsync, isPending } = useDeleta({ path, id });

  const handleDeleta = async () => {
    const resultado = await mutateAsync({ path, id });
    if (resultado.status === 404) {
      toast.error(mensagens?.naoEncontrado ?? 'Registro não encontrado.');
      return;
    }
    if (resultado.status >= 500) {
      toast.error(
        mensagens?.erroInterno ?? 'Erro interno, tente novamente mais tarde.',
      );
      return;
    }
    toast.success(mensagens?.sucesso ?? 'Excluído com sucesso.');
    onSuccess?.();
    setIsOpen?.(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {trigger && (
          <DialogTrigger asChild>
            <Trash2 className='cursor-pointer text-destructive mr-2 h-4 hover:text-destructive/40 duration-200' />
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {nome && `${objeto}: ${nome}`}
              {!nome && `${objeto}`}
            </DialogTitle>
            <DialogDescription>
              Após a exclusão, não será possível recuperar os dados.
            </DialogDescription>
          </DialogHeader>
          {mensagens?.confirmacao ?? (
            <p>
              Tem certeza que deseja excluir
              {nome ? <strong> {nome}</strong> : ''}?
            </p>
          )}
          <DialogFooter>
            <div className='w-full h-full flex flex-row justify-between gap-2'>
              <DialogClose asChild>
                <Button variant='outline'>Sair</Button>
              </DialogClose>
              <Button
                variant={'destructive'}
                onClick={() => handleDeleta()}
                disabled={isPending}
              >
                Excluir
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

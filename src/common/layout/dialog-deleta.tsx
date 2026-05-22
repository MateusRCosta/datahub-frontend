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
  id: string;
  path: ResourceName;
  nome: string;
  objeto: string;
  mensagens?: Mensagens;
}

export function DialogDeleta({
  id,
  path,
  nome,
  mensagens,
  objeto,
}: DialogDeletaProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleta({ path, id });

  const handleDeleta = async () => {
    const resultado = await mutateAsync({ id, path });
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
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Trash2 className="text-destructive mr-2 h-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {objeto}: {nome}
            </DialogTitle>
            <DialogDescription>
              Após a exclusão, não será possivel recuperar os dados.
            </DialogDescription>
          </DialogHeader>
          {mensagens?.confirmacao ?? (
            <p>
              Tem certeza que deseja excluir <strong>{nome}</strong>?
            </p>
          )}
          <DialogFooter>
            <div className="w-full h-full flex flex-row justify-between gap-2">
              <Button
                variant={'destructive'}
                onClick={() => handleDeleta()}
                disabled={isPending}
              >
                Excluir
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Sair</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

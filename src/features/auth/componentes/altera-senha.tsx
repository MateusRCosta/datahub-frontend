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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { AlteraSenha } from '../schema/altera-senha.schema';
import { alteraSenhaSchema } from '../schema/altera-senha.schema';
import { FieldError, FieldGroup } from '@/components/ui/field';
import useAlteraSenha from '../api/use-altera-senha';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { FormWrapper, InputGenerico } from '@/components/layout/form';

interface alteraSenhaProps {
  onOpenChange: () => void;
  open: boolean;
}
export function AlteraSenha({ onOpenChange, open = false }: alteraSenhaProps) {
  const form = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(alteraSenhaSchema),
    defaultValues: {
      senha: '',
      novaSenha: '',
      confirmaSenha: '',
    },
  });

  const { mutateAsync, isPending } = useAlteraSenha();

  const onSubmit = async (senhas: AlteraSenha) => {
    const response = await mutateAsync(senhas);

    if (response.status === 401) {
      toast.error('Sessão expirada, faça login novamente.');
      form.setError('root', {
        message: 'Sessão expirada, faça login novamente.',
      });
      return;
    }

    if (response.status === 403) {
      toast.error('Senha inválida, verifique e tente novamente.');
      form.setError('senha', {
        message: 'Senha inválida, verifique e tente novamente.',
      });
      return;
    }

    if (response.status === 400 || response.status >= 500) {
      toast.error('Erro interno, tente novamente mais tarde.');
      form.setError('root', {
        message: 'Erro interno, tente novamente mais tarde.',
      });
      return;
    }

    toast.success('Senha alterada com sucesso.');
    form.reset();
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
          <DialogDescription>
            Digite a sua senha antiga e a sua nova senha para poder alterar a
            senha
          </DialogDescription>
        </DialogHeader>
        <FormWrapper form={form} onSubmit={onSubmit} id="form-altera-senha">
          <FieldGroup>
            <InputGenerico name="senha" label="Senha atual" type="password" />
            <InputGenerico
              name="novaSenha"
              label="Nova senha"
              type="password"
            />
            <InputGenerico
              name="confirmaSenha"
              label="Confirma nova senha"
              type="password"
            />
          </FieldGroup>
          <FieldError>{form.formState.errors.root?.message}</FieldError>
        </FormWrapper>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>
              Sair
            </Button>
          </DialogClose>
          <Button form="form-altera-senha" type="submit" disabled={isPending}>
            {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Alterando...' : 'Alterar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

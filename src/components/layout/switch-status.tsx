import useAlteraStatusAtivo from '@/api/use-altera-status-ativo';
import { Switch } from '@/components/ui/switch';
import { ResourceName } from '@/features/auth/config/resources';
import { toast } from 'sonner';

interface Mensagens {
  naoEncontrado?: string;
  sucesso?: string;
  erroInterno?: string;
  padrao?: string;
}

interface SwitchStatusProps {
  id: string;
  path: ResourceName;
  status: boolean;
  mensagens?: Mensagens;
}

export function SwitchStatus({
  status,
  id,
  path,
  mensagens,
}: SwitchStatusProps) {
  const { mutateAsync, isPending } = useAlteraStatusAtivo({ path, id });

  const handleChange = async () => {
    const resultado = await mutateAsync({ status: !status, id, path });

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
    toast.success(mensagens?.sucesso ?? 'Status alterado com sucesso.');
  };

  return (
    <Switch checked={status} disabled={isPending} onClick={handleChange} />
  );
}

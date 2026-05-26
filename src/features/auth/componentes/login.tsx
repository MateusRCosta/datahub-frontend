'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';

import useFazLogin from '../api/use-faz-login';
import { loginSchema } from '../schema/login.schema';
import type { Login as LoginFormData } from '../schema/login.schema';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { FormWrapper, InputGenerico } from '@/components/layout/form';

export default function Login() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const { mutateAsync, isPending } = useFazLogin();

  const onSubmit = async (values: LoginFormData) => {
    const response = await mutateAsync(values);

    if (response.status === 401) {
      toast.error('Sessão expirada, faça login novamente.');
      form.setError('root', {
        message: 'Sessão expirada, faça login novamente.',
      });
      return;
    }

    if (response.status === 403) {
      toast.error('Usuário ou senha inválidos, verifique e tente novamente.');
      form.setError('root', {
        message: 'Usuário ou senha inválidos, verifique e tente novamente.',
      });
      return;
    }

    if (response.status === 400) {
      toast.error('Dados inválidos, verifique e tente novamente.');
      form.setError('root', {
        message: 'Dados inválidos, verifique e tente novamente.',
      });
      return;
    }

    if (response.status === 201) {
      router.push('/');
      return;
    }

    toast.error('Erro interno, tente novamente mais tarde.');
    form.setError('root', {
      message: 'Erro interno, tente novamente mais tarde.',
    });
    return;
  };

  return (
    <div className='mx-auto flex min-h-dvh min-w-dvw items-center justify-center'>
      <Card className='w-[90%] rounded-lg px-4 py-6 shadow-xl transition-shadow duration-200 hover:shadow-sm sm:w-[80%] md:w-[60%] lg:w-[40%]'>
        <CardHeader>
          <CardTitle>Acesso ao DataHub</CardTitle>
          <CardDescription>
            Acesse com as suas credenciais o sistema DataHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormWrapper
            form={form}
            onSubmit={(data) => onSubmit(data)}
            id='login-form'
          >
            <FieldGroup>
              <InputGenerico name='email' label='E-mail' type='text' />
              <InputGenerico name='senha' label='Senha' type='password' />
              <FieldError>{form.formState.errors.root?.message}</FieldError>
            </FieldGroup>
          </FormWrapper>
        </CardContent>
        <CardFooter>
          <Field orientation='horizontal'>
            <Button
              type='submit'
              form='login-form'
              size='lg'
              className='w-full'
              disabled={isPending}
            >
              {isPending ? 'Enviando...' : 'Enviar'}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}

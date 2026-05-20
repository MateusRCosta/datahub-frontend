// import { zodResolver } from '@hookform/resolvers/zod';
// import { useState, useEffect } from 'react';
// import { useForm, FormProvider } from 'react-hook-form';
// import { toast } from 'sonner';
// import { InputGenerico, SwitchGenerico } from '@/components/layout/form';
// import { FieldError, FieldGroup } from '@/components/ui/field';
// import { DialogTrigger } from '@/components/ui/dialog';
// import { Skeleton } from '@/components/ui/skeleton';
// import { PenBox } from 'lucide-react';
// import { formatarData } from '@/lib/util';
// import { DialogCustom } from '@/components/layout/dialog-custom';
// import { RegistroInfoCard } from '@/components/layout/registro-info-card';
// import {
//   UsuarioUpdateRequest,
//   usuarioUpdateRequestInput,
//   UsuarioUpdateRequestInput,
// } from '../schema';
// import useRetornaUsuario from '../api/use-retorna-cliente';
// import useEditaUsuario from '../api/use-edita-cliente';
// import { PermissoesSelector } from './permissoes-selector';

// interface UsuarioEditaProps {
//   id: string;
// }

// export function UsuarioEdita({ id }: UsuarioEditaProps) {
//   const [open, setOpen] = useState(false);
//   const { isLoading, isError, error, data } = useRetornaUsuario({
//     enabled: open,
//     id,
//   });

//   const form = useForm<
//     UsuarioUpdateRequestInput,
//     unknown,
//     UsuarioUpdateRequest
//   >({
//     mode: 'onSubmit',
//     resolver: zodResolver<
//       UsuarioUpdateRequestInput,
//       unknown,
//       UsuarioUpdateRequest
//     >(usuarioUpdateRequestInput),
//     defaultValues: {
//       nome: '',
//       senha: '',
//       admin: false,
//       permissoes: [],
//     },
//   });

//   const { reset } = form;

//   useEffect(() => {
//     if (data?.data) {
//       reset(
//         {
//           nome: data.data.nome,
//           senha: '',
//           admin: data.data.admin,
//           permissoes: data.data.permissoes ?? [],
//         },
//         { keepDefaultValues: false },
//       );
//     }
//   }, [data, reset]);

//   const { mutateAsync, isPending } = useEditaUsuario(id);

//   const onSubmit = async (formData: UsuarioUpdateRequest) => {
//     const response = await mutateAsync({ ...formData, id });
//     if (response.status !== 204) {
//       toast.error(
//         'Erro ao editar usuário, verifique os dados e tente novamente.',
//       );
//       form.setError('root', { message: 'Erro ao editar usuário...' });
//       return;
//     }

//     toast.success('Usuário editado com sucesso.');
//     form.reset();
//     setOpen(false);
//   };

//   return (
//     <DialogCustom
//       titulo={`Usuário: ${data?.data?.nome}`}
//       idForm="form-edita-usuario"
//       descricao={
//         <div className="flex w-full justify-between">
//           <span className="w-full">
//             Gerencie os dados e permissões do usuário
//           </span>
//           <div className="flex flex-1 w-full">
//             <RegistroInfoCard
//               dados={{
//                 ID: data?.data?.id,
//                 'Criado em': formatarData(data?.data?.createdAt),
//                 'Atualizado em': formatarData(data?.data?.updatedAt),
//               }}
//             />
//           </div>
//         </div>
//       }
//       open={open}
//       setOpen={setOpen}
//       trigger={
//         <DialogTrigger asChild>
//           <PenBox className="mr-2 h-4 cursor-pointer hover:text-primary transition-colors" />
//         </DialogTrigger>
//       }
//       isPending={isPending}
//     >
//       <FormProvider {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           id="form-edita-usuario"
//           className="flex flex-col gap-2 h-full"
//         >
//           <FieldGroup className="flex flex-col min-h-0 flex-1 gap-6">
//             {isError && (
//               <div className="text-red-500">
//                 Erro ao carregar usuário: {error?.message}
//               </div>
//             )}
//             {data && !isError && (
//               <>
//                 <div className="space-y-4">
//                   <h3 className="text-sm font-semibold">
//                     Informações de Acesso
//                   </h3>
//                   <InputGenerico
//                     name="nome"
//                     label="Nome Completo"
//                     type="text"
//                   />
//                   <InputGenerico
//                     name="senha"
//                     label="Alterar Senha"
//                     type="password"
//                     placeholder="Deixe em branco para manter a atual"
//                   />
//                   <InputGenerico
//                     name="email"
//                     label="E-mail"
//                     type="email"
//                     value={data.data?.email}
//                     disabled
//                   />
//                   <div className="flex flex-col space-x-2 gap-2">
//                     <SwitchGenerico name="admin" label="Administrador" />
//                   </div>
//                 </div>
//                 <div className="border-t pt-4">
//                   <h3 className="text-sm font-semibold mb-4">
//                     Permissões de Usuário
//                   </h3>
//                   <PermissoesSelector name="permissoes" />
//                 </div>
//               </>
//             )}
//             {isLoading && (
//               <>
//                 {[...Array(4)].map((_, index) => (
//                   <Skeleton key={index} className="h-12 w-full" />
//                 ))}
//               </>
//             )}
//           </FieldGroup>
//         </form>
//       </FormProvider>
//       <FieldError>{form.formState.errors.root?.message}</FieldError>
//     </DialogCustom>
//   );
// }

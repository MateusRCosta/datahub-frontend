import { useMutation } from '@tanstack/react-query';

import { apiRequest } from '@/lib/api-request';
import { ApiResponse } from '@/types/api.schema';

import { Login } from '../schema/login.schema';

const fazLogin = async ({
  email,
  senha,
}: Login): Promise<ApiResponse<null>> => {
  return apiRequest<null>({
    path: 'auth/login',
    method: 'POST',
    body: { email, senha },
  });
};

export default function useFazLogin() {
  return useMutation<ApiResponse<null>, Error, Login>({
    mutationKey: ['login'],
    mutationFn: fazLogin,
  });
}

import { useMutation } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api-request";
import { ApiResponse } from "@/types/api.schema";

import { AlteraSenha } from "../schema/altera-senha.schema";

const alteraSenha = async ({ senha, novaSenha }: AlteraSenha): Promise<ApiResponse<null>> => {
  return apiRequest<null>({
    path: "auth/altera-senha",
    method: "PATCH",
    body: { antigaSenha: senha, novaSenha },
  });
};

export default function useAlteraSenha() {
  return useMutation<ApiResponse<null>, Error, AlteraSenha>({
    mutationKey: ["alterar-senha"],
    mutationFn: alteraSenha,
  });
}

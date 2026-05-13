import { apiRequest } from "@/lib/api-request";
import { ApiResponse } from "@/types/api.schema";
import { useMutation } from "@tanstack/react-query";

const fazLogout = async (): Promise<ApiResponse<{ message?: string }>> => {
  return apiRequest<{ message?: string }>({
    path: "auth/logout",
    method: "POST",
    headers: "none"
  });
};

export default function useFazLogout() {
  return useMutation<ApiResponse<{ message?: string }>, Error>({
    mutationKey: ["Logout"],
    mutationFn: fazLogout,
  });
}

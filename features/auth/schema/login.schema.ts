import z from "zod";

export const loginSchema = z.object({
    email: z.string("É obrigatório informar o usuário").trim().min(1, "É obrigatório informar o usuário"),
    senha: z.string("É obrigatório informar a senha").trim().min(1, "É obrigatório informar a senha")
})

export type Login = z.infer<typeof loginSchema>;
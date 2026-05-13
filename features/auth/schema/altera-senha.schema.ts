import z from "zod";

export const alteraSenhaSchema = z.object({
    senha: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(100, "A senha deve ter no máximo 100 caracteres"),
    novaSenha: z.string()
        .trim()
        .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
        .max(100, { message: "A senha deve ter no máximo 100 caracteres" })
        .refine((value) => /[a-zA-Z0-9!@#$%^&*()_+=[\]{}|\\:;<>./~`'"]/.test(value), {
            message: "A senha deve conter letras, números e um caractere especial"
        }),
    confirmaSenha: z.string().min(1, "É obrigatório confirmar a senha."),
}).refine((data) => data.novaSenha === data.confirmaSenha, {
    message: "As senhas devem ser iguais",
    path: ["confirmaSenha"]
});

export type AlteraSenha = z.infer<typeof alteraSenhaSchema>;
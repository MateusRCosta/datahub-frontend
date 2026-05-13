import z from "zod";

export const meSchema = z.object({
    id: z.number().int(),
    email: z.email(),
    nome: z.string(),
    admin: z.boolean(),
    permissoes: z.array(z.string()),
});

export type Me = z.infer<typeof meSchema>;

import z from 'zod';

export const provedorEnumSchema = z.enum(['upchat']);
export type ProvedorEnum = z.infer<typeof provedorEnumSchema>;

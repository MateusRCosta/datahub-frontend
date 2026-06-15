import z from 'zod';

export enum ProvedorEnum {
  UPCHAT = 'upchat',
}
export const provedorEnumSchema = z.enum(ProvedorEnum);

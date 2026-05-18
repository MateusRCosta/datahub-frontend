import { z } from 'zod';

const ehCPFValido = (cpf: string) => {
  if (cpf.length !== 11) return false;
  // lógica de validação dos dígitos verificadores
  const calc = (mod: number) => {
    const sum = cpf
      .slice(0, mod - 1)
      .split('')
      .reduce((acc, digit, i) => acc + Number(digit) * (mod - i), 0);
    const rest = (sum * 10) % 11;
    return rest >= 10 ? 0 : rest;
  };
  return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
};

const ehCNPJValido = (cnpj: string) => {
  if (cnpj.length !== 14) return false;
  const calc = (mod: number) => {
    const weights = Array.from(
      { length: mod },
      (_, i) => (i % 8) + 2,
    ).reverse();
    const sum = cnpj
      .slice(0, mod)
      .split('')
      .reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return calc(12) === Number(cnpj[12]) && calc(13) === Number(cnpj[13]);
};

export const cpfSchema = z
  .string()
  .length(11, 'CPF deve ter 11 dígitos')
  .regex(/^\d+$/, 'CPF deve conter apenas números')
  .refine(ehCPFValido, 'CPF inválido');

export const cnpjSchema = z
  .string()
  .length(14, 'CNPJ deve ter 14 dígitos')
  .regex(/^\d+$/, 'CNPJ deve conter apenas números')
  .refine(ehCNPJValido, 'CNPJ inválido');

export const cpfOrCnpjSchema = z
  .string()
  .regex(/^\d+$/, 'Deve conter apenas números')
  .refine(
    (val) => ehCPFValido(val) || ehCNPJValido(val),
    'CPF ou CNPJ inválido',
  );

export type TableModal<T> = {
  modoSelecao?: boolean;
  onSelecionar?: (objeto: T) => void;
};

export const viaCepSchema = z.object({
  cep: z.string(),
  logradouro: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  localidade: z.string(),
  uf: z.string(),
  ibge: z.string(),
  gia: z.string(),
  ddd: z.string(),
  siafi: z.string(),
});

export type ViaCep = z.infer<typeof viaCepSchema>;

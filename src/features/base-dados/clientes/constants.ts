import { Validacao } from "./schema/cliente.schema";

export const retornaMensagemValidacao = (
  validacao: Validacao,
  valor: string | number | boolean | undefined,
) => {
  switch (validacao.codigo) {
    case 'INVALID_BOOLEAN':
      return `valor booleano "${valor}" não aceito`;
    case 'EMAIL_INVALIDO':
      return `e-mail inválido`;
    case 'INVALID_DATE':
      return `data inválida`;
    case 'INVALID_NUMBER':
      return `número inválido`;
    case 'TELEFONE_INVALIDO':
      return `telefone inválido`;
    case 'REQUIRED':
      return `valor é obrigatório`;
  }
};

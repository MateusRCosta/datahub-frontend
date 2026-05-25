'use client';

import { InputGenerico, TextAreaGenerico } from '@/components/layout/form';
import { UpchatBotoesFieldGroup } from './upchat-botoes-field-group';

export function UpchatForm() {
  return (
    <div className="grid gap-4">
      <InputGenerico
        name="config.id"
        label="ID do template"
        type="number"
        placeholder="Digite o ID do template"
      />
      <InputGenerico
        name="config.nome"
        label="Nome no provedor"
        placeholder="Digite o nome do template no provedor"
      />
      <InputGenerico
        name="config.tituloTemplate"
        label="Título"
        placeholder="Digite o título do template"
      />
      <TextAreaGenerico
        name="config.mensagemTemplate"
        label="Mensagem"
        placeholder="Digite a mensagem do template"
      />
      <InputGenerico
        name="config.rodapeTemplate"
        label="Rodapé"
        placeholder="Digite o rodapé do template"
      />
      <UpchatBotoesFieldGroup />
    </div>
  );
}

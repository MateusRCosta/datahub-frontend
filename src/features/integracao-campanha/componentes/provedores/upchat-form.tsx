'use client';

import { InputGenerico } from '@/components/layout/form';

export function UpchatForm() {
  return (
    <div className="grid gap-4">
      <InputGenerico
        name="config.url"
        label="URL"
        placeholder="https://api.upchat.example.com"
      />
      <InputGenerico
        name="config.queueId"
        label="Fila"
        type="number"
        placeholder="Digite o ID da fila"
      />
      <InputGenerico
        name="config.apiKey"
        label="Chave da API"
        placeholder="Digite a chave da API"
      />
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Columns } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';

type ColunaMetadado = {
  key: string;
  label: string;
};

interface SeletorColunasProps {
  colunas: ColunaMetadado[];
  colunasSelecionadas: string[];
  onChange: (colunas: string[]) => void;
}

export default function SeletorColunas({
  colunas,
  colunasSelecionadas,
  onChange,
}: SeletorColunasProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (key: string) =>
    colunasSelecionadas.includes(key.toLowerCase().trim());

  const toggleColuna = (key: string) => {
    const keyNorm = key.toLowerCase().trim();
    const novaSelecao = isSelected(keyNorm)
      ? colunasSelecionadas.filter((c) => c !== keyNorm)
      : [...colunasSelecionadas, keyNorm];
    onChange(novaSelecao);
  };

  return (
    <>
      <Button variant='outline' onClick={() => setOpen(true)}>
        <Columns className='w-3 h-auto' />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecione as colunas</DialogTitle>
            <DialogDescription>
              Escolha quais colunas deseja que apareçam na tela
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-2'>
            {colunas.map(({ key, label }) => (
              <label
                key={key}
                className='flex items-center gap-2 cursor-pointer'
              >
                <Checkbox
                  checked={isSelected(key)}
                  onCheckedChange={() => toggleColuna(key)}
                />
                {label}
              </label>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

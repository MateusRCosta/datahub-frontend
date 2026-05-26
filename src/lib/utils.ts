import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formataDataIso = (value: string): Date | null => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formataDataPadraoBrasil = (value: string): Date | null => {
  const match = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const parsed = new Date(`${year}-${month}-${day}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formataData = (valor: unknown): Date | null => {
  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : valor;
  }

  if (typeof valor !== 'string') {
    return null;
  }

  const trimmed = valor.trim();
  if (!trimmed) {
    return null;
  }

  return formataDataPadraoBrasil(trimmed) ?? formataDataIso(trimmed);
};

export const formataDataUI = (valor: unknown): string => {
  const data = formataData(valor);
  if (!data) return '--';

  const date = data.toLocaleDateString('pt-BR');
  const time = data.toLocaleTimeString('pt-BR');

  return `${date} ${time}`;
};

export function formatUTC(date: Date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');

  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}Z`;
}

export function getUTCTime(date: Date) {
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');

  return `${hh}:${min}:${ss}`;
}

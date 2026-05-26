'use client';

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from 'next-themes';
import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { cn } from '@/lib/utils';

type JsonEditorGenericoProps<TFieldValues extends FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  height?: string;
  className?: string;
};

function editorValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
}

export function JsonEditorGenerico<
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  label,
  height = '200px',
  className,
}: JsonEditorGenericoProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          {label && (
            <FieldLabel htmlFor={String(name)} className='font-normal text-xs'>
              {label}
            </FieldLabel>
          )}
          <div
            className={cn(
              'overflow-hidden rounded-md border bg-field-background',
              fieldState.invalid ? 'border-destructive' : 'border-input',
            )}
          >
            <CodeMirror
              id={String(name)}
              value={editorValue(value)}
              height={height}
              extensions={[json()]}
              onChange={onChange}
              theme={isDark ? oneDark : 'light'}
              className='text-sm'
            />
          </div>
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}

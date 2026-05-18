import {
  Controller,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

interface FormWrapperProps<
  T extends FieldValues,
  Y extends FieldValues,
> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T, unknown, Y>;
  onSubmit?: SubmitHandler<Y>;
  children: React.ReactNode;
}

export function FormWrapper<T extends FieldValues, Y extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...rest
}: FormWrapperProps<T, Y>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          if (onSubmit) {
            form.handleSubmit(onSubmit)(e);
          } else {
            e.preventDefault();
          }
        }}
        className={cn('flex flex-col gap-2', className)}
        {...rest}
      >
        {children}
      </form>
    </FormProvider>
  );
}
export function InputGenerico({
  name,
  label,
  ...rest
}: {
  name: string;
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange: fieldOnChange, ...field },
        fieldState,
      }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Input
            id={name}
            type={rest.type}
            {...field}
            {...rest}
            onChange={(e) => {
              const val = e.target.value;
              if (rest.type === 'number') {
                fieldOnChange(val === '' ? undefined : Number(val));
              } else {
                fieldOnChange(val);
              }
            }}
            className={cn(`bg-field-background`, rest.className)}
          />
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}

interface Option {
  label: string;
  value: string;
}

interface SelectGenericoProps {
  name: string;
  label: string;
  options: Option[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectGenerico({
  name,
  label,
  options,
  placeholder = 'Selecione...',
  disabled,
  onValueChange,
}: SelectGenericoProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => {
        const stringValue =
          value === null || value === undefined ? '' : String(value);

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
            <Select
              onValueChange={(val) => {
                let finalValue: unknown;
                if (val === 'true') {
                  finalValue = true;
                } else if (val === 'false') {
                  finalValue = false;
                } else if (val === 'todos') {
                  finalValue = undefined;
                } else {
                  finalValue = val;
                }
                onChange(finalValue);
                onValueChange?.(val);
              }}
              value={stringValue}
              disabled={disabled}
            >
              <SelectTrigger className="bg-field-background dark:bg-input/30">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        );
      }}
    />
  );
}

export function SwitchGenerico({
  name,
  label,
  disabled,
  className,
}: {
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn(label, className)}
        >
          {label && (
            <div className="space-y-0.5">
              <FieldLabel htmlFor={name} className="cursor-pointer">
                {label}
              </FieldLabel>
            </div>
          )}
          <Switch
            id={name}
            checked={!!value}
            onCheckedChange={onChange}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}

export function CheckboxGenerico({
  name,
  label,
  value: itemValue,
  disabled,
  className,
}: {
  name: string;
  label: string;
  value?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => {
        const isArray = Array.isArray(value);
        const isChecked = isArray ? value.includes(itemValue) : !!value;

        const handleChange = (checked: boolean | string) => {
          if (isArray && itemValue) {
            if (checked) {
              onChange([...value, itemValue]);
            } else {
              onChange(value.filter((v: string) => v !== itemValue));
            }
          } else {
            onChange(checked);
          }
        };

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={cn('flex flex-row items-center gap-2', className)}
          >
            <Checkbox
              id={`${name}-${itemValue || ''}`}
              checked={isChecked}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            <FieldLabel
              htmlFor={`${name}-${itemValue || ''}`}
              className="cursor-pointer text-xs text-foreground font-normal"
            >
              {label}
            </FieldLabel>
          </Field>
        );
      }}
    />
  );
}

interface InputSelecaoModalProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  nomeDisplay: string; // O nome que vai aparecer para o usuário
  modalTitle: string;
  modalContent: (fecharModal: () => void) => React.ReactNode; // Função que retorna a tabela
}

export function InputSelecaoModal({
  name,
  label,
  nomeDisplay,
  modalTitle,
  modalContent,
  ...rest
}: InputSelecaoModalProps) {
  const { control } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <div className="flex gap-2 w-full">
              <Input
                id={name}
                value={nomeDisplay || ''}
                readOnly
                onClick={() => setIsModalOpen(true)}
                placeholder="Clique para selecionar..."
                className={cn(
                  'bg-field-background cursor-pointer flex-1',
                  rest.className,
                )}
                {...rest}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(true)}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Modal que renderiza a Tabela apenas quando aberto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="min-w-[50dvw] max-w-[85dvw] md:min-w-[50dvw] md:max-w-[50dvw] max-h-[70dvh] md:max-h-[50dvh] h-full flex flex-col"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-full shrink-0 overflow-hidden p-2 overflow-y-auto">
            {modalContent(() => setIsModalOpen(false))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function TextAreaGenerico({
  name,
  label,
  containerClassName,
  ...rest
}: {
  name: string;
  label?: string;
  containerClassName?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={containerClassName}>
          {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
          <Textarea
            id={name}
            {...field}
            {...rest}
            className={cn(
              `bg-field-background dark:bg-input/30`,
              rest.className,
            )}
          />
          <FieldError>{fieldState.error?.message}</FieldError>
        </Field>
      )}
    />
  );
}

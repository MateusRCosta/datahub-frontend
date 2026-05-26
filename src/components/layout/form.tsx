import {
  Controller,
  FieldPath,
  FieldValues,
  FormProvider,
  SubmitHandler,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { cn, formatUTC, getUTCTime } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDownIcon, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

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
export function InputGenerico<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  ariaInvalid,
  ...rest
}: {
  name: FieldPath<TFieldValues>;
  label?: string;
  ariaInvalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange: fieldOnChange, value, ...field },
        fieldState,
      }) => {
        const isFileInput = rest.type === 'file';

        return (
          <Field data-invalid={ariaInvalid ?? fieldState.invalid}>
            {label && (
              <FieldLabel htmlFor={name} className='font-normal text-xs'>
                {label}
              </FieldLabel>
            )}
            <Input
              id={name}
              type={rest.type}
              {...field}
              {...(!isFileInput ? { value } : {})}
              {...rest}
              onChange={(e) => {
                const val = e.target.value;
                if (isFileInput) {
                  fieldOnChange(e.target.files?.[0]);
                } else if (rest.type === 'number') {
                  fieldOnChange(val === '' ? undefined : Number(val));
                } else {
                  fieldOnChange(val);
                }
                rest.onChange?.(e);
              }}
              className={cn(`bg-field-background text-sm`, rest.className)}
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        );
      }}
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
            {label && (
              <FieldLabel htmlFor={name} className='font-normal text-xs'>
                {label}
              </FieldLabel>
            )}
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
              <SelectTrigger className='bg-field-background dark:bg-input/30 text-sm'>
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

export function SwitchGenerico<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  disabled,
  ariaInvalid,
  className,
}: {
  name: FieldPath<TFieldValues>;
  ariaInvalid?: boolean;
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
          data-invalid={ariaInvalid ?? fieldState.invalid}
          className={cn(label, className)}
        >
          {label && (
            <div className='space-y-0.5'>
              <FieldLabel
                htmlFor={name}
                className='cursor-pointer font-normal text-xs'
              >
                {label}
              </FieldLabel>
            </div>
          )}
          <Switch
            id={name}
            checked={!!value}
            onCheckedChange={onChange}
            disabled={disabled}
            aria-invalid={ariaInvalid}
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
              className='cursor-pointer text-xs text-foreground font-normal'
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
            <div className='flex gap-2 w-full'>
              <Input
                id={name}
                value={nomeDisplay || ''}
                readOnly
                onClick={() => setIsModalOpen(true)}
                placeholder='Clique para selecionar...'
                className={cn(
                  'bg-field-background cursor-pointer flex-1',
                  rest.className,
                )}
                {...rest}
              />
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsModalOpen(true)}
              >
                <Search className='w-4 h-4' />
              </Button>
            </div>
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {/* Modal que renderiza a Tabela apenas quando aberto */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className='min-w-[50dvw] max-w-[85dvw] md:min-w-[50dvw] md:max-w-[50dvw] max-h-[70dvh] md:max-h-[50dvh] h-full flex flex-col'
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <div className='flex-1 h-full shrink-0 overflow-hidden p-2 overflow-y-auto'>
            {modalContent(() => setIsModalOpen(false))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { JsonEditorGenerico } from './json-editor-generico';

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

interface DatePickerTimeProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  containerClassName?: string;
  ariaInvalid?: boolean;
}

export function DatePickerTime<TFieldValues extends FieldValues = FieldValues>({
  name,
  label = 'Date',
  containerClassName,
  ariaInvalid,
}: DatePickerTimeProps<TFieldValues>) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const rawDate = field.value ? new Date(field.value) : undefined;
        const currentDate =
          rawDate && !isNaN(rawDate.getTime()) ? rawDate : undefined;

        const handleDateChange = (selectedDate?: Date) => {
          if (!selectedDate) {
            field.onChange(null);
            return;
          }

          const mergedDate = currentDate ? new Date(currentDate) : new Date();

          mergedDate.setUTCFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );

          field.onChange(mergedDate.toISOString());
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const [hours, minutes, seconds] = e.target.value.split(':');

          const mergedDate = currentDate ? new Date(currentDate) : new Date();

          mergedDate.setUTCHours(
            Number(hours),
            Number(minutes),
            Number(seconds ?? 0),
          );

          field.onChange(mergedDate.toISOString());
        };

        return (
          <FieldGroup className={`flex flex-row ${containerClassName ?? ''}`}>
            <Field data-invalid={ariaInvalid ?? fieldState.invalid}>
              {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-48 justify-between font-normal'
                  >
                    {currentDate
                      ? formatUTC(currentDate)
                      : 'Selecione uma data'}

                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className='w-auto overflow-hidden p-0'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={currentDate}
                    captionLayout='dropdown'
                    defaultMonth={currentDate}
                    onSelect={handleDateChange}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field
              data-invalid={ariaInvalid ?? fieldState.invalid}
              className='w-36'
            >
              <FieldLabel>Tempo</FieldLabel>

              <Input
                type='time'
                step='1'
                value={currentDate ? getUTCTime(currentDate) : ''}
                onChange={handleTimeChange}
                className='appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
              />

              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          </FieldGroup>
        );
      }}
    />
  );
}

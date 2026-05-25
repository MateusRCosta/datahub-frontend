import {
  DatePickerTime,
  InputGenerico,
  InputSelecaoModal,
  SelectGenerico,
  SwitchGenerico,
} from '@/components/layout/form';
import { FieldValues } from 'react-hook-form';

export function useFormComponents<T extends FieldValues>() {
  return {
    Input: InputGenerico<T>,
    InputSelecaoModal,
    Select: SelectGenerico,
    Switch: SwitchGenerico<T>,
    DatePicker: DatePickerTime<T>,
  };
}

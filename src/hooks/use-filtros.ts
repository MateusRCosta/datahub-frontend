import { useState, useCallback } from 'react';
import { z } from 'zod';

export function useFiltros<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
  defaultValues?: Partial<z.output<T>>,
) {
  const [filtros, setFiltrosRaw] = useState<z.output<T>>(() => {
    const result = schema.safeParse(defaultValues ?? {});
    return result.success ? result.data : ({} as z.output<T>);
  });

  const setFiltros = useCallback(
    (data: Partial<z.output<T>>) => {
      const merged = { ...filtros, ...data };

      // Strip empty/null/undefined values
      const cleaned = Object.fromEntries(
        Object.entries(merged).filter(
          ([, v]) => v !== undefined && v !== null && v !== '' && v !== 'todos',
        ),
      );

      const result = schema.safeParse(cleaned);
      if (result.success) setFiltrosRaw(result.data);
    },
    [filtros, schema],
  );

  const resetFiltros = useCallback(() => {
    const result = schema.safeParse(defaultValues ?? {});
    setFiltrosRaw(result.success ? result.data : ({} as z.output<T>));
  }, [schema, defaultValues]);

  return { filtros, setFiltros, resetFiltros };
}

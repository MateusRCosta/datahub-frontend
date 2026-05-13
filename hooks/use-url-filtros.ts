import { Route } from "next";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { z } from "zod";

export function useUrlFiltros<T extends z.ZodTypeAny>(schema: T, prefix: string = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filtros = useMemo(() => {
    const entries = Array.from(searchParams.entries())
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, value]) => {
        if (value === "true") return [key.slice(prefix.length), true];
        if (value === "false") return [key.slice(prefix.length), false];
        return [key.slice(prefix.length), value];
      });

    const params = Object.fromEntries(entries);
    const result = schema.safeParse(params);
    
    return result.success ? result.data : {} as z.infer<typeof schema>;
  }, [searchParams, schema, prefix]);

  const setFiltros = useCallback((data: object) => {
    const params = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      const prefixedKey = `${prefix}${key}`; 

      if (value === undefined || value === null || value === "" || value === "todos") {
        params.delete(prefixedKey);
      } else {
        params.set(prefixedKey, String(value));
      }
    });

    router.replace(`${pathname}?${params.toString()}` as Route, { scroll: false });
  }, [router, pathname,  prefix]);

  return { filtros, setFiltros };
}

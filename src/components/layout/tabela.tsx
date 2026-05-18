'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../ui/button';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  limit: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageLimitChange: (limit: number) => void;
  totalItens: number;
  onSelecionar?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  limit,
  pageCount,
  onPageChange,
  onPageLimitChange,
  totalItens,
  onSelecionar,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  function handlePrev() {
    if (page > 1) onPageChange?.(page - 1);
  }
  function handleNext() {
    if (page < pageCount) onPageChange?.(page + 1);
  }

  function handlePageSizeChange(newSize: number) {
    onPageLimitChange?.(newSize);
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-md border w-full h-full min-h-0">
      <div className="flex-1 min-h-0 overflow-auto">
        <Table>
          <TableHeader className="header">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onSelecionar?.(row.original)}
                  className={`${onSelecionar ? 'cursor-pointer' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t bg-muted/30 gap-3 md:gap-0">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          {typeof totalItens === 'number' && (
            <span className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {totalItens}
              </span>{' '}
              {totalItens === 1 ? 'item' : 'itens'}
            </span>
          )}

          <div className="hidden md:block w-px h-4 bg-border" />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handlePrev}
              disabled={page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-xs text-muted-foreground px-1">
              <span className="font-semibold text-foreground">
                {totalItens === 0 ? 1 : page}
              </span>
              /
              <span className="font-semibold text-foreground">
                {pageCount + 1}
              </span>
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleNext}
              disabled={page >= pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs text-muted-foreground">Por página</span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={n.toString()} className="text-xs">
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

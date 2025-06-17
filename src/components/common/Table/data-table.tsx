'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { Fragment, useState, useRef, useCallback } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '.';
import { cn } from '@/utils';
import { useIsMounted } from '@/hooks/useIsMounted';
interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  className?: string;
  tableClassName?: string;
  headerClass?: string;
  headerRowClass?: string;
  bodyClass?: string;
  rowClass?: string;
  cellClass?: string;
  stickyHeader?: boolean;
  hideHeader?: boolean;
  isRowEditing?: (row: TData) => boolean;
  renderRowExtra?: (row: Row<TData>) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  initialSort?: SortingState;
}

function DataTableInner<TData>(
  {
    columns,
    data,
    className,
    tableClassName,
    headerClass,
    headerRowClass,
    bodyClass,
    rowClass,
    cellClass,
    stickyHeader = false,
    hideHeader = false,
    isRowEditing,
    renderRowExtra,
    renderEmpty,
    initialSort = [],
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const isMounted = useIsMounted();

  const internalTableContainerRef = useRef<HTMLDivElement>(null);
  const setRefs = useCallback(
    (element: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
      (internalTableContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    },
    [ref],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
  });

  if (!isMounted) return null;

  const rows = table.getRowModel().rows;

  return (
    <div ref={setRefs} className={cn('overflow-auto', className)}>
      <Table className={tableClassName}>
        {!hideHeader && (
          <TableHeader className={headerClass}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(
                  {
                    'sticky top-px z-10 border bg-gray-100': stickyHeader,
                  },
                  headerRowClass,
                )}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        )}
        <TableBody className={bodyClass}>
          {rows.length ? (
            rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    {
                      'bg-red/10 hover:bg-red/10': isRowEditing && isRowEditing(row.original),
                    },
                    rowClass,
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn('font-medium', cellClass)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {renderRowExtra && renderRowExtra(row)}
              </Fragment>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              {renderEmpty ? (
                renderEmpty()
              ) : (
                <TableCell colSpan={columns.length} className={cn('text-center', cellClass)}>
                  No results.
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as (<TData>(
  props: DataTableProps<TData> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => JSX.Element) & { displayName: string };

DataTable.displayName = 'DataTable';

export type { DataTableProps };

'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Row,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { DataTableToolbar } from './data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './data-table-pagination';
import { LucideIcon } from 'lucide-react';

interface CustomRowProps<TData> {
  row: Row<TData>;
  customState: unknown;
  onClick?: (row: TData) => void;
}

const CustomRow = <TData,>({ row, customState, onClick }: CustomRowProps<TData>) => {
  const [state, setState] = React.useState(customState);

  return (
    <TableRow key={row.id}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id} onClick={() => onClick?.(cell.row.original)}>
          {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), state, setState })}
        </TableCell>
      ))}
    </TableRow>
  );
};

interface CustomFilterProps {
  className?: string;
  label?: string;
  [key: string]: unknown;
}

interface FilterWithItem {
  label: string;
  value: string;
  defaultValue?: string;
  icon?: LucideIcon;
  options: Array<{
    label: string;
    value: string;
  }>;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onClick?: (row: TData, event?: React.MouseEvent) => void;
  placeholder?: string;
  filterWith?: FilterWithItem | FilterWithItem[];
  statuses?: Array<{ label: string; value: string }>;
  defaultStatus?: string;
  customState?: unknown;
  search?: string;
  dateFilter?: boolean;
  customFilter?: Array<{
    filter: React.ComponentType<CustomFilterProps>;
    label: string;
    props?: Record<string, unknown>;
  }>;
  selectActions?: React.ReactNode | React.ReactNode[];
  onSelectionChange?: (selectedRows: TData[]) => void;
}

export function DataTable<TData>({
  columns,
  data,
  onClick,
  placeholder,
  filterWith,
  statuses = [],
  defaultStatus,
  customState,
  search,
  dateFilter,
  customFilter,
  selectActions,
  onSelectionChange,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getFilteredRowModel()
        .rows.filter((row) => rowSelection[row.id as string])
        .map((row) => row.original as TData);
      
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onSelectionChange]);

  return (
    <div className="space-y-2">
      <DataTableToolbar<TData>
        filterWith={filterWith}
        defaultStatus={defaultStatus}
        customFilter={customFilter}
        dateFilter={dateFilter}
        id={search}
        statuses={statuses}
        table={table}
        placeholder={placeholder}
        selectActions={selectActions}
      />
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row =>
                customState !== undefined ? (
                  <CustomRow<TData> 
                    key={row.id} 
                    row={row} 
                    customState={customState} 
                    onClick={onClick}
                  />
                ) : (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} onClick={(e) => onClick?.(cell.row.original, e)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

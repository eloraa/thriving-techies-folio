'use client';

import { Table } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-filter';
import { FilterItem } from './filter-item';
import { Button } from '@/components/ui/button';
import { XIcon, Blend, LucideIcon } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
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

interface CustomFilterProps {
  className?: string;
  label?: string;
  [key: string]: unknown;
}

interface CustomFilterItem {
  filter: React.ComponentType<CustomFilterProps>;
  label: string;
  props?: Record<string, unknown>;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  statuses?: FilterOption[];
  filterWith?: FilterWithItem | FilterWithItem[];
  defaultStatus?: string;
  placeholder?: string;
  id?: string;
  dateFilter?: boolean;
  customFilter?: CustomFilterItem[];
  selectActions?: React.ReactNode | React.ReactNode[];
}

export function DataTableToolbar<TData>({ table, statuses = [], filterWith, defaultStatus, placeholder, id, dateFilter, customFilter, selectActions }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getSelectedRowModel().rows.length;

  return (
    <div className="flex items-center justify-between gap-2 max-md:flex-col py-1">
      <div className="flex max-md:flex-col flex-wrap flex-1 items-center gap-2 max-md:space-y-2">
        <Input
          placeholder={placeholder}
          value={(table.getColumn(id || '')?.getFilterValue() as string) ?? ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => table.getColumn(id || '')?.setFilterValue(event.target.value)}
          className="h-9 bg-accent/15 rounded-full border-0 caret-red-500 ring-offset-2 ring-offset-background max-md:w-full w-[150px] lg:w-[250px]"
        />
        {statuses?.length > 0 && table.getColumn('status') && <DataTableFacetedFilter<TData> defaultValue={defaultStatus} column={table.getColumn('status')} title="Status" options={statuses} />}

        {filterWith && (
          <>
            {Array.isArray(filterWith)
              ? filterWith.map(
                  (item, index) =>
                    table.getColumn(item.value) && (
                      <DataTableFacetedFilter<TData>
                        key={index}
                        defaultValue={item.defaultValue}
                        column={table.getColumn(item.value)}
                        title={item.label}
                        icon={item.icon || Blend}
                        options={item.options}
                      />
                    )
                )
              : table.getColumn(filterWith.value) && (
                  <DataTableFacetedFilter<TData>
                    defaultValue={filterWith.defaultValue}
                    column={table.getColumn(filterWith.value)}
                    title={filterWith.label}
                    icon={filterWith.icon || Blend}
                    options={filterWith.options}
                  />
                )}
          </>
        )}

        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}

        {dateFilter && <FilterItem className="[&>*]:h-8" iconOnly={false} onChange={() => {}} defaultRange={undefined} overrideLabel="" checkbox={false} />}
        {customFilter &&
          customFilter.length > 0 &&
          customFilter.map((item, index) => <item.filter className="*:border-dashed border-dashed [&>*]:h-8" label={item.label} key={index} {...item.props} />)}
      </div>
      <div className="flex items-center gap-2 flex-col md:flex-row">
        {selectedRows > 0 && (
          <>
            <span className="text-sm text-muted-foreground">{selectedRows} selected</span>
            {Array.isArray(selectActions) ? selectActions.map((action, index) => <div key={index}>{action}</div>) : selectActions}
          </>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

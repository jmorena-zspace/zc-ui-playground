import { flexRender, RowData, Table as TanstackTable } from '@tanstack/react-table';
import clsx from 'clsx';
import { useCallback } from 'react';
import { TableColumnSize, TableRowSize } from './types';

type TableProps<T> = {
  table: TanstackTable<T>;
  rowMaxSize?: TableRowSize;
};

export const defaultCellClassName =
  'text-body-md font-medium text-text-default-primary';

export function Table<T extends RowData>({
  table,
  rowMaxSize = 'md',
}: TableProps<T>) {
  const getColumnMeta = useCallback(
    (id: string) => {
      const col = table.getColumn(id);
      return col?.columnDef?.meta ?? {};
    },
    [table]
  );

  const columnSizeToClass = useCallback((size?: TableColumnSize) => {
    switch (size) {
      case 'xs':
        return 'table-column-xs';
      case 'sm':
        return 'table-column-sm';
      case 'md':
        return 'table-column-md';
      case 'lg':
        return 'table-column-lg';
      case 'xl':
        return 'table-column-xl';
      case 'auto':
      default:
        return 'table-column-auto';
    }
  }, []);

  const rowSizeToClass = useCallback((size: TableRowSize) => {
    switch (size) {
      case 'sm':
        return 'table-row-sm';
      case 'md':
        return 'table-row-md';
      case 'lg':
        return 'table-row-lg';
      case 'xl':
        return 'table-row-xl';
      default:
        return undefined;
    }
  }, []);

  return (
    <div className="w-full overflow-x-auto bg-bg-surface-default rounded-sm border-default border-border-system-subtle shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-neutral-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={clsx(
                    'p-md bg-bg-surface-brand-subtle',
                    'text-body-md font-medium text-content-secondary',
                    'border-b-default border-border-system-subtle uppercase',
                    columnSizeToClass(getColumnMeta(header.column.id).size),
                    getColumnMeta(header.column.id).className
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border-system-subtle">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={clsx(
                'hover:bg-bg-action-secondary-hover transition-colors duration-150',
                rowSizeToClass(rowMaxSize)
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={clsx(
                    'p-md align-middle',
                    columnSizeToClass(getColumnMeta(cell.column.id).size),
                    getColumnMeta(cell.column.id).className
                  )}
                >
                  <div
                    className={clsx(defaultCellClassName, {
                      'whitespace-normal line-clamp-2 wrap-break-word':
                        getColumnMeta(cell.column.id).wrapText ?? true,
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

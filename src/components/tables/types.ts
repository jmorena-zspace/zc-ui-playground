import type { RowData } from '@tanstack/react-table';

type TableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';

export type TableRowSize = TableSize;
export type TableColumnSize = TableSize;

declare module '@tanstack/react-table' {
  // TanStack requires these generic placeholders on the merged interface.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    size?: TableColumnSize;
    wrapText?: boolean;
  }
}

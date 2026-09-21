import { AppLauncherButton } from '@components/buttons/app-launcher-button/app-launcher-button';
import { Link } from '@tanstack/react-router';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Lesson } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, useMemo } from 'react';
import { defaultCellClassName, Table } from '../table';

type LessonTableProps = {
  data: Lesson[];
};

export const LessonTable: FC<LessonTableProps> = ({ data }) => {

  const columns = useMemo<ColumnDef<Lesson>[]>(
    () => [
      {
        header: 'LESSON NAME',
        accessorKey: 'name',
        meta: { size: 'auto' },
        cell: ({ row }) => (
          <Link to="." className={clsx(defaultCellClassName, 'underline')}>
            {row.original.name}
          </Link>
        ),
      },
      {
        header: 'SUBJECT',
        accessorKey: 'subjects',
        meta: {
          size: 'lg',
        },
        cell: ({ getValue }) => (
          <span className={clsx(defaultCellClassName)}>
            {getValue() as string}
          </span>
        ),
      },
      {
        header: 'APPLICATION',
        id: 'application',
        accessorFn: (row) => row.apps,
        meta: { size: 'md' },
        cell: ({ row }) => {
          return (
            <div className="flex flex-col gap-xs">
              {row.original.apps.map((app) => (
                <div
                  className="flex items-center gap-xs"
                  key={`table-${row.original.id}-${app.name}`}
                >
                  <img
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    className="w-[20px] h-[20px] object-contain"
                  />
                  <span
                    className={clsx(
                      defaultCellClassName,
                      'line-clamp-2 wrap-break-word'
                    )}
                  >
                    {app.name}
                  </span>
                </div>
              ))}
            </div>
          );
        },
      },
      {
        header: 'LAUNCH CODE',
        id: 'launchCode',
        accessorFn: (row) => row.apps,
        meta: { size: 'xs', wrapText: false },
        cell: ({ row }) => {
          return (
            <div className="flex flex-col gap-xs w-fit">
              {row.original.apps.map((app) => (
                <AppLauncherButton
                  key={`table-${row.original.id}-${app.appLaunchCode}`}
                  iconUrl={app.iconUrl}
                  name={app.name}
                  launchCode={app.appLaunchCode}
                />
              ))}
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} rowMaxSize="md" />;
};

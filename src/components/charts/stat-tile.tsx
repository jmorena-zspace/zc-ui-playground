import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { FC } from 'react';

type StatTileProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
};

export const StatTile: FC<StatTileProps> = ({
  label,
  value,
  icon: Icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-md rounded-md border border-border-system-subtle bg-bg-surface-subtle p-md',
        className
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-bg-surface-strong text-content-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex flex-col">
        <span className="text-body-sm text-content-tertiary">{label}</span>
        <span className="text-display-xs font-display text-content-primary">
          {value}
        </span>
      </div>
    </div>
  );
};

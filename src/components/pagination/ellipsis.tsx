import clsx from 'clsx';
import { FC } from 'react';

export const Ellipsis: FC<{ className?: string }> = ({ className }) => {
  return (
    <span
      className={clsx(
        'cursor-default select-none bg-bg-surface-default',
        'px-sm h-8 flex items-center justify-center',
        'text-body-md',
        className
      )}
      aria-hidden="true"
    >
      …
    </span>
  );
};

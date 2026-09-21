import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

type PageCardProps = PropsWithChildren<{
  className?: string;
}>;

export const PageCard: FC<PageCardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'mx-md px-lg py-lg bg-bg-surface-default rounded-lg border-1 border-border-system-default',
        className
      )}
    >
      {children}
    </div>
  );
};

import clsx from 'clsx';
import { FC } from 'react';

export type LaunchCodeBadgeProps = {
  text: string;
  className?: string;
};

export const LaunchCodeBadge: FC<LaunchCodeBadgeProps> = ({
  text,
  className,
}) => {

  return (
    <span
      aria-label="Launch code"
      className={clsx(
        'inline-flex items-center',
        'px-xs py-xxs rounded-xs',
        'text-body-sm font-medium ',
        'bg-bg-surface-subtle text-content-tertiary',
        'border border-border-system-subtle',
        className
      )}
    >
      {text}
    </span>
  );
};

import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

export function ClearButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'text-content-status-negative text-body-md font-regular',
        'cursor-pointer hover:text-bg-surface-status-negative-strong',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

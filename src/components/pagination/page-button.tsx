import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';

type PageButtonProps = PropsWithChildren & {
  className?: string;
  isCurrentPage: boolean;
  onClick: () => void;
};

export const PageButton: FC<PageButtonProps> = ({
  className,
  isCurrentPage,
  onClick,
  children,
}) => {
  return (
    <button
      type="button"
      className={clsx(
        'flex items-center justify-center h-8 px-sm',
        'text-body-md cursor-pointer',
        {
          'bg-bg-surface-selected text-content-active font-bold': isCurrentPage,
          'bg-bg-surface-default hover:bg-bg-action-secondary-hover':
            !isCurrentPage,
        },
        className
      )}
      onClick={onClick}
      aria-current={isCurrentPage ? 'page' : undefined}
    >
      {children}
    </button>
  );
};

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { FC } from 'react';

type ChevronButtonProps = {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
  className?: string;
};

export const ChevronButton: FC<ChevronButtonProps> = ({
  direction,
  onClick,
  disabled = false,
  className,
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      className={clsx(
        'flex items-center justify-center h-8 px-sm bg-bg-surface-default',
        'hover:bg-bg-action-secondary-hover disabled:opacity-50',
        'cursor-pointer disabled:cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={
        direction === 'left'
          ? 'Previous page'
          : 'Next page'
      }
      aria-disabled={disabled}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

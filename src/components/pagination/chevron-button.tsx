import {
  faChevronLeft,
  faChevronRight,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const icon = direction === 'left' ? faChevronLeft : faChevronRight;

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
      <FontAwesomeIcon icon={icon} size="sm" />
    </button>
  );
};

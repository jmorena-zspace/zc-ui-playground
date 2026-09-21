import {
  faChevronLeft,
  faChevronRight,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
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
  const { t } = useTranslation();
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
          ? t(ARIA_LABELS.UI.PREVIOUS_PAGE)
          : t(ARIA_LABELS.UI.NEXT_PAGE)
      }
      aria-disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} size="sm" />
    </button>
  );
};

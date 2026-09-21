import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
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
  const { t } = useTranslation();

  return (
    <span
      aria-label={t(ARIA_LABELS.UI.LAUNCH_CODE)}
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

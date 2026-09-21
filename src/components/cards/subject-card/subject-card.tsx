import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import { Subject } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC, PropsWithChildren } from 'react';
import { Icon } from '../../icon/icon';

export type SubjectCardProps = PropsWithChildren & {
  subject: Subject;
  onClick: () => void;
};

export const SubjectCard: FC<SubjectCardProps> = ({
  subject: { name, iconUrl },
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        'flex group items-center',
        'flex-row gap-sm px-md py-sm',
        'md:flex-col md:justify-center md:gap-xs md:p-md md:h-[160px]',
        'bg-bg-surface-subtle rounded-md',
        'cursor-pointer transition-all',
        'hover:bg-bg-surface-hover focus:bg-bg-surface-hover'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <Icon
        src={iconUrl}
        alt={t(ARIA_LABELS.UI.SUBJECT_ICON_ALT, { name })}
        width={64}
        height={64}
      />
      <span
        className={clsx(
          'text-content-link-inline-default line-clamp-2 text-ellipsis',
          'text-body-lg font-medium',
          'md:text-center'
        )}
      >
        {name}
      </span>
    </div>
  );
};

import { Icon } from '@components/icon/icon';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import { Subject as SubjectType } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC } from 'react';

type SubjectProps = {
  subject: SubjectType;
  className?: string;
};

export const Subject: FC<SubjectProps> = ({ subject, className }) => {
  const { t } = useTranslation();

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-xxs',
        'px-xs py-xxs rounded-full',
        'text-body-sm font-medium text-content-tertiary',
        className
      )}
    >
      <Icon src={subject.iconUrl} alt={t(ARIA_LABELS.UI.SUBJECT_ICON_ALT, { name: subject.name })} width={12} height={12} />
      <span>{subject.name}</span>
    </span>
  );
};

import { Icon } from '@components/icon/icon';
import { Subject as SubjectType } from '@zcentral-v2/types';
import clsx from 'clsx';
import { FC } from 'react';

type SubjectProps = {
  subject: SubjectType;
  className?: string;
};

export const Subject: FC<SubjectProps> = ({ subject, className }) => {

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-xxs',
        'px-xs py-xxs rounded-full',
        'text-body-sm font-medium text-content-tertiary',
        className
      )}
    >
      <Icon src={subject.iconUrl} alt={`${subject.name} subject icon`} width={12} height={12} />
      <span>{subject.name}</span>
    </span>
  );
};

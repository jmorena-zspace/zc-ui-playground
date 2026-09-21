import { BookOpen, Rocket, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { FC } from 'react';

export enum ContentBadgeType {
  LESSON = 'lesson',
  APPLICATION = 'application',
}

export type ContentBadgeProps = {
  type: ContentBadgeType;
};

type BadgeConfig = {
  icon: LucideIcon;
  styles: string;
};

export const ContentBadge: FC<ContentBadgeProps> = ({ type }) => {
  const baseStyles = clsx(
    'inline-flex items-center gap-xxs',
    'px-xs py-xxs rounded-xs border',
    'text-body-sm font-medium '
  );

  const label: Record<ContentBadgeType, string> = {
    [ContentBadgeType.LESSON]: 'Lesson',
    [ContentBadgeType.APPLICATION]: 'Application',
  };

  const config: Record<ContentBadgeType, BadgeConfig> = {
    [ContentBadgeType.LESSON]: {
      icon: BookOpen,
      styles:
        'bg-special-label-lesson-bg text-special-label-lesson-text border-special-label-lesson-border',
    },
    [ContentBadgeType.APPLICATION]: {
      icon: Rocket,
      styles:
        'bg-special-label-application-bg text-special-label-application-text border-special-label-application-border',
    },
  };

  const { icon: Icon, styles } = config[type];

  return (
    <span className={clsx(baseStyles, styles)}>
      <Icon className="w-3 h-3" />
      {label[type]}
    </span>
  );
};

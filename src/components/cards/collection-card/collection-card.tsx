import { Accordion } from '@components/accordion';
import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import clsx from 'clsx';
import { ReactNode } from 'react';

export interface CollectionCardProps {
  title: string;
  lessonsCount: number;
  children: ReactNode;
}

export function CollectionCard({
  title,
  lessonsCount,
  children,
}: CollectionCardProps) {
  const { t } = useTranslation();
  return (
    <Accordion
      className={clsx(
        'border-border-system-subtle rounded-md border',
        'hover:border-border-system-subtle'
      )}
    >
      <Accordion.Title
        className={(isOpen) =>
          clsx(
            'flex items-center gap-xs p-md cursor-pointer',
            'bg-bg-surface-subtle hover:bg-bg-surface-hover',
            {
              'rounded-t-md border-b border-border-system-subtle': isOpen,
              'rounded-md': !isOpen,
            }
          )
        }
      >
        <h2 className="text-body-md text-content-primary font-medium">
          {title}
        </h2>
        <span className="text-body-sm text-content-primary font-regular">
          {t(PAGE_TEXTS.CATEGORY.COLLECTION_LESSONS_COUNT, {
            count: lessonsCount,
          })}
        </span>
      </Accordion.Title>
      <Accordion.Content>
        <div className="p-xs md:py-sm md:px-md">{children}</div>
      </Accordion.Content>
    </Accordion>
  );
}

import { Folder } from 'lucide-react';
import clsx from 'clsx';
import { FC, KeyboardEvent } from 'react';

export type RelatedCollectionCardProps = {
  name: string;
  lessonsCount: number;
  onClick?: () => void;
  className?: string;
};

/**
 * The same compact shell as LessonFileCard — icon on the left, name, a
 * right-aligned detail — but for a collection reference rather than a
 * downloadable file: a folder icon in place of a file-type icon, and the
 * lesson count in place of the row of download-format icons.
 *
 * Unlike LessonFileCard, the whole row is a single clickable target rather
 * than a group of several download links, so it is a `role="button"` rather
 * than a `role="group"`.
 */
export const RelatedCollectionCard: FC<RelatedCollectionCardProps> = ({
  name,
  lessonsCount,
  onClick,
  className,
}) => {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${name}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={clsx(
        'flex gap-xs items-center justify-center',
        'bg-bg-surface-subtle border border-border-system-subtle rounded-xs',
        'p-xxs cursor-pointer transition-colors',
        'hover:bg-bg-surface-hover focus-visible:bg-bg-surface-hover focus-visible:outline-none',
        className
      )}
    >
      <div className="flex gap-xxs items-center min-w-0 max-w-[66%]">
        <div className="flex items-center p-xxs shrink-0">
          <Folder className="w-3 h-3 text-content-tertiary" />
        </div>
        <p className="text-body-md font-medium leading-body-md text-content-secondary line-clamp-2 min-w-0">
          {name}
        </p>
      </div>

      <span
        className="shrink-0 ml-auto text-body-sm text-content-tertiary"
        aria-label={`${lessonsCount} ${lessonsCount === 1 ? 'lesson' : 'lessons'}`}
      >
        {`${lessonsCount} ${lessonsCount === 1 ? 'lesson' : 'lessons'}`}
      </span>
    </div>
  );
};

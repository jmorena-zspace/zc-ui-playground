import {
  File,
  FileText,
  FileType,
  Cloud,
  type LucideIcon,
} from 'lucide-react';
import { normalizeGoogleDocsUrl } from '@shared/utils';
import clsx from 'clsx';
import { FC } from 'react';

export type LessonFileLink = {
  url: string;
};

export type LessonFileCardProps = {
  name: string;
  link: LessonFileLink;
  className?: string;
};

type FileLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const FileLink: FC<FileLinkProps> = ({ href, label, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center h-4 text-content-link-action-default hover:text-content-link-action-hover transition-colors"
  >
    <Icon className="w-4 h-4" />
  </a>
);

export const LessonFileCard: FC<LessonFileCardProps> = ({
  name,
  link,
  className,
}) => {
  const docsBaseUrl = normalizeGoogleDocsUrl(link.url);

  return (
    <div
      role="group"
      aria-label={name}
      className={clsx(
        'flex gap-xs items-center justify-center',
        'bg-bg-surface-subtle border border-border-system-subtle rounded-xs',
        'p-xxs',
        className
      )}
    >
      <div className="flex gap-xxs items-center min-w-0 max-w-[66%]">
        <div className="flex items-center p-xxs shrink-0">
          <File className="w-3 h-3 text-content-tertiary" />
        </div>
        <p className="text-body-md font-medium leading-body-md text-content-secondary line-clamp-2 min-w-0">
          {name}
        </p>
      </div>

      <div
        className="flex gap-md items-center justify-end shrink-0 ml-auto"
        aria-label="Download options"
      >
        {docsBaseUrl ? (
          <>
            <FileLink
              href={`${docsBaseUrl}/copy`}
              label="Copy to Google Drive"
              icon={Cloud}
            />
            <FileLink
              href={`${docsBaseUrl}/export?format=docx`}
              label="Download as Word"
              icon={FileType}
            />
            <FileLink
              href={`${docsBaseUrl}/export?format=pdf`}
              label="Download as PDF"
              icon={FileText}
            />
          </>
        ) : (
          <FileLink
            href={link.url}
            label="Download as PDF"
            icon={FileText}
          />
        )}
      </div>
    </div>
  );
};

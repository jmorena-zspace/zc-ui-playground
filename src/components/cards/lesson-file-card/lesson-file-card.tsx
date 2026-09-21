import { faGoogleDrive } from '@awesome.me/kit-935ddc1468/icons/classic/brands';
import { faFile } from '@awesome.me/kit-935ddc1468/icons/classic/regular';
import {
  faFilePdf,
  faFileWord,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
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
  icon: IconDefinition;
};

const FileLink: FC<FileLinkProps> = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center h-4 text-content-link-action-default hover:text-content-link-action-hover transition-colors"
  >
    <FontAwesomeIcon icon={icon} className="w-4 h-4" />
  </a>
);

export const LessonFileCard: FC<LessonFileCardProps> = ({
  name,
  link,
  className,
}) => {
  const { t } = useTranslation();
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
          <FontAwesomeIcon
            icon={faFile}
            className="w-3 h-3 text-content-tertiary"
          />
        </div>
        <p className="text-body-md font-medium leading-body-md text-content-secondary line-clamp-2 min-w-0">
          {name}
        </p>
      </div>

      <div
        className="flex gap-md items-center justify-end shrink-0 ml-auto"
        aria-label={t(ARIA_LABELS.LESSONS.DOWNLOAD_OPTIONS_LIST)}
      >
        {docsBaseUrl ? (
          <>
            <FileLink
              href={`${docsBaseUrl}/copy`}
              label={t(ARIA_LABELS.LESSONS.DOWNLOAD_FROM_GOOGLE_DRIVE)}
              icon={faGoogleDrive}
            />
            <FileLink
              href={`${docsBaseUrl}/export?format=docx`}
              label={t(ARIA_LABELS.LESSONS.DOWNLOAD_WORD_FILE)}
              icon={faFileWord}
            />
            <FileLink
              href={`${docsBaseUrl}/export?format=pdf`}
              label={t(ARIA_LABELS.LESSONS.DOWNLOAD_PDF_FILE)}
              icon={faFilePdf}
            />
          </>
        ) : (
          <FileLink
            href={link.url}
            label={t(ARIA_LABELS.LESSONS.DOWNLOAD_PDF_FILE)}
            icon={faFilePdf}
          />
        )}
      </div>
    </div>
  );
};

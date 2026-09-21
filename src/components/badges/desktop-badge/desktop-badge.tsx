import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { FC } from 'react';

export const DesktopBadge: FC = () => {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center justify-center px-xs rounded-full bg-bg-accent-teal-subtle-pressed text-body-sm font-regular text-content-action-on-inverse-default">
      {t(PAGE_TEXTS.UI.DESKTOP_BADGE)}
    </span>
  );
};

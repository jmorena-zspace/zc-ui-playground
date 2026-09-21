import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { type FC } from 'react';

export const NotFoundError: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        {t(PAGE_TEXTS.UI.NOT_FOUND_ERROR_TITLE)}
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        {t(PAGE_TEXTS.UI.NOT_FOUND_ERROR_MESSAGE)}
      </p>
    </div>
  );
};

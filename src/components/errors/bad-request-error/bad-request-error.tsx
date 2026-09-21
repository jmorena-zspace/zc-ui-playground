import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { FC } from 'react';

export const BadRequestError: FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        {t(PAGE_TEXTS.UI.BAD_REQUEST_ERROR_TITLE)}
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        {t(PAGE_TEXTS.UI.BAD_REQUEST_ERROR_MESSAGE)}
      </p>
    </div>
  );
};

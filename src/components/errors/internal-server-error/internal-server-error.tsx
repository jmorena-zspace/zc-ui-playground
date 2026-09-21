import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { type FC } from 'react';

type InternalServerErrorProps = {
  message: string;
};

const isDevelopment = import.meta.env.DEV;

export const InternalServerError: FC<InternalServerErrorProps> = ({
  message,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        {t(PAGE_TEXTS.UI.INTERNAL_SERVER_ERROR_TITLE)}
      </h2>

      {isDevelopment && (
        <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
          {message}
        </p>
      )}

      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        {t(PAGE_TEXTS.UI.INTERNAL_SERVER_ERROR_MESSAGE)}
      </p>
    </div>
  );
};

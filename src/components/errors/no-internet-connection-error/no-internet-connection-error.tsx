import { faPlugCircleXmark } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { type FC } from 'react';

export const NoInternetConnectionError: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col text-center items-center justify-center gap-xl h-full">
      <div className="flex text-display-lg md:text-display-xl text-content-inverse-primary gap-sm">
        <FontAwesomeIcon icon={faPlugCircleXmark} />
        <h2 className="font-bold">
          {t(PAGE_TEXTS.UI.NO_INTERNET_CONNECTION_ERROR_TITLE)}
        </h2>
      </div>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        {t(PAGE_TEXTS.UI.NO_INTERNET_CONNECTION_ERROR_MESSAGE)}
      </p>
    </div>
  );
};

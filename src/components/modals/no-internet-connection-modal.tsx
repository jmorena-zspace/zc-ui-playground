import {
  faArrowRight,
  faPlugCircleXmark,
  faRefresh,
  faXmark,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { environment } from '@constants/environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import clsx from 'clsx';
import { FC, useCallback, useRef, useState } from 'react';
import { BlurredModal } from './blurred-modal';

export type NoInternetConnectionModalProps = {
  show: boolean;
  onClose: () => void;
  onRetry: () => Promise<void>;
};

export const NoInternetConnectionModal: FC<NoInternetConnectionModalProps> = ({
  show,
  onClose,
  onRetry,
}) => {
  const { t } = useTranslation();
  const [isRetrying, setIsRetrying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRetry = useCallback(async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, onRetry]);

  return (
    <BlurredModal
      dismissible={false}
      show={show}
      onClose={onClose}
      centered
      initialFocus={containerRef}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="flex flex-col gap-lg bg-bg-surface-default border border-border-system-subtle rounded-sm p-md shadow-lg outline-none"
      >
        <div className="flex items-center justify-between border-b border-border-system-subtle pb-md">
          <div className="flex items-center gap-sm">
            <FontAwesomeIcon
              icon={faPlugCircleXmark}
              className="text-content-primary text-[24px]"
            />
            <h2 className="text-body-lg font-bold text-content-primary">
              {t(PAGE_TEXTS.HOME.NO_INTERNET_CONNECTION_MODAL_TITLE)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn icon-btn-on-surface text-content-secondary"
            aria-label={t(ARIA_LABELS.UI.CLOSE_BUTTON)}
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-md text-body-md font-regular text-content-secondary text-center">
          <p>{t(PAGE_TEXTS.HOME.NO_INTERNET_CONNECTION_MODAL_MESSAGE_1)}</p>
          <p>{t(PAGE_TEXTS.HOME.NO_INTERNET_CONNECTION_MODAL_MESSAGE_2)}</p>
          <p>
            {t(PAGE_TEXTS.HOME.NO_INTERNET_CONNECTION_MODAL_MESSAGE_3)}
            <a
              href={environment.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-content-brand-default underline"
            >
              {t(PAGE_TEXTS.HOME.NO_INTERNET_CONNECTION_MODAL_MESSAGE_4)}
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center gap-lg">
          <BaseButton color="secondary" size="md" onClick={handleRetry}>
            <FontAwesomeIcon
              icon={faRefresh}
              className={clsx({ 'animate-spin': isRetrying })}
            />
            <span className="text-body-md font-medium ">
              {t(PAGE_TEXTS.HOME.RETRY_BUTTON)}
            </span>
          </BaseButton>
          <BaseButton color="primary" size="md" onClick={onClose}>
            <span className="text-body-md font-medium ">
              {t(PAGE_TEXTS.HOME.CONTINUE_OFFLINE_BUTTON)}
            </span>
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
          </BaseButton>
        </div>
      </div>
    </BlurredModal>
  );
};

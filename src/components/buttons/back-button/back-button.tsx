import { faArrowLeft } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import { FC } from 'react';

type BackButtonProps = {
  onBack?: () => void;
  alwaysShow?: boolean;
};

export const BackButton: FC<BackButtonProps> = ({
  onBack,
  alwaysShow = false,
}) => {
  const canGoBack = useCanGoBack();
  const router = useRouter();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBack) {
      return onBack();
    }

    router.history.back();
  };

  if (!canGoBack && !alwaysShow) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      type="button"
      aria-label={t(ARIA_LABELS.UI.BACK_BUTTON)}
      className="icon-btn icon-btn-on-surface text-content-primary"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
    </button>
  );
};

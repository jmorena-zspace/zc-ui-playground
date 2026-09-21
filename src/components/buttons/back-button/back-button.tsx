import { ArrowLeft } from 'lucide-react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
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
      aria-label="Back"
      className="icon-btn icon-btn-on-surface text-content-primary"
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
};

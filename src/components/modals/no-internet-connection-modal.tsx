import { ArrowRight, RefreshCw, Unplug, X } from 'lucide-react';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { environment } from '@constants/environment';
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
            <Unplug className="h-6 w-6 text-content-primary " />
            <h2 className="text-body-lg font-bold text-content-primary">
              You are offline
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn icon-btn-on-surface text-content-secondary"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-md text-body-md font-regular text-content-secondary text-center">
          <p>Some content needs a connection to load.</p>
          <p>Lessons you have already opened stay available.</p>
          <p>
            Launching an installed application still works.
            <a
              href={environment.supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-content-brand-default underline"
            >
              We will reconnect on its own once you are back.
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center gap-lg">
          <BaseButton color="secondary" size="md" onClick={handleRetry}>
            <RefreshCw className={clsx(
          'h-4 w-4',{ 'animate-spin': isRetrying })} />
            <span className="text-body-md font-medium ">
              Try again
            </span>
          </BaseButton>
          <BaseButton color="primary" size="md" onClick={onClose}>
            <span className="text-body-md font-medium ">
              Continue offline
            </span>
            <ArrowRight className="w-3 h-3" />
          </BaseButton>
        </div>
      </div>
    </BlurredModal>
  );
};

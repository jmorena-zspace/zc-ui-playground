import {
  faArrowRotateLeft,
  faArrowsRotate,
  faCircleCheck,
  faCircleXmark,
  faXmark,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDesktopNativeAppStore } from '@stores/desktop-native-app';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BlurredModal } from './blurred-modal';

type ScanState = 'scanning' | 'success' | 'error';

export type RescanContentModalProps = {
  show: boolean;
  onClose: () => void;
};

export const RescanContentModal: FC<RescanContentModalProps> = ({
  show,
  onClose,
}) => {
  const { refreshAvailability } = useDesktopNativeAppStore();
  const [scanState, setScanState] = useState<ScanState>('scanning');
  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScan = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setScanState('scanning');
    try {
      await refreshAvailability(controller.signal);
      setScanState('success');
    } catch {
      if (controller.signal.aborted) return;
      setScanState('error');
    }
  }, [refreshAvailability]);

  useEffect(() => {
    if (show) {
      startScan();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [show, startScan]);

  const handleClose = () => {
    abortControllerRef.current?.abort();
    onClose();
  };

  const closeButton = (
    <BaseButton
      color="secondary"
      size="md"
      onClick={handleClose}
      leftIcon={<FontAwesomeIcon icon={faXmark} />}
    >
      Rescan close
    </BaseButton>
  );

  return (
    <BlurredModal
      dismissible={scanState !== 'scanning'}
      show={show}
      onClose={handleClose}
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
              icon={faArrowsRotate}
              className="text-content-primary text-[24px]"
            />
            <h2 className="text-body-lg font-bold text-content-primary">
              Rescan modal title
            </h2>
          </div>
          {scanState !== 'scanning' && (
            <button
              type="button"
              onClick={handleClose}
              className="icon-btn icon-btn-on-surface text-content-secondary"
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
            </button>
          )}
        </div>

        {scanState === 'scanning' && (
          <>
            <p className="text-body-md font-regular text-content-secondary text-center">
              Rescan scanning message
            </p>

            <div className="flex flex-col gap-lg items-center">
              <div className="relative w-full h-4 rounded-full bg-bg-surface-brand-subtle overflow-hidden">
                <div className="absolute h-full rounded-full bg-bg-surface-brand-default animate-progress-indeterminate" />
              </div>
              {closeButton}
            </div>
          </>
        )}

        {scanState !== 'scanning' && (
          <>
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={scanState === 'success' ? faCircleCheck : faCircleXmark}
                className={clsx(
                  'text-[96px]',
                  scanState === 'success'
                    ? 'text-content-status-positive'
                    : 'text-content-status-negative'
                )}
              />
            </div>

            <p className="text-body-md font-regular text-content-secondary text-center">
              {scanState === 'success'
                ? 'Your content is up to date.'
                : 'We could not rescan your content.'}
            </p>

            <div className="flex gap-lg justify-center">
              {scanState === 'error' && closeButton}
              <BaseButton
                color="primary"
                size="md"
                onClick={scanState === 'success' ? handleClose : startScan}
                {...(scanState === 'error' && {
                  leftIcon: <FontAwesomeIcon icon={faArrowRotateLeft} />,
                })}
              >
                {scanState === 'success' ? 'Close' : 'Try again'}
              </BaseButton>
            </div>
          </>
        )}
      </div>
    </BlurredModal>
  );
};

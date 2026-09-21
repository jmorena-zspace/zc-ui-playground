import {
  faArrowRotateLeft,
  faCircleCheck,
  faCircleXmark,
  faDownload,
  faXmark,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BlurredModal } from './blurred-modal';

type SyncState = 'syncing' | 'success' | 'error';

const OFFLINE_STATUS_QUERY_KEY = ['offlineSearch', 'status'] as const;

export type PrepareOfflineModalProps = {
  show: boolean;
  onClose: () => void;
};

export const PrepareOfflineModal: FC<PrepareOfflineModalProps> = ({
  show,
  onClose,
}) => {
  const [syncState, setSyncState] = useState<SyncState>('syncing');
  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { refetch } = useQuery({
    queryKey: OFFLINE_STATUS_QUERY_KEY,
    queryFn: async () => {
      const api = window.zSpaceAPI?.offlineSearch;
      if (!api) return null;
      return api.getStatus();
    },
    enabled: false,
  });

  const startSync = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSyncState('syncing');
    try {
      if (!window.zSpaceAPI?.offlineSearch)
        throw new Error('Offline search API not found');
      await window.zSpaceAPI.offlineSearch.sync();
      if (controller.signal.aborted) return;
      await refetch();
      if (controller.signal.aborted) return;
      setSyncState('success');
    } catch {
      if (controller.signal.aborted) return;
      setSyncState('error');
    }
  }, [refetch]);

  useEffect(() => {
    if (show) {
      startSync();
    }

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [show, startSync]);

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
      Offline cache close
    </BaseButton>
  );

  return (
    <BlurredModal
      dismissible={syncState !== 'syncing'}
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
              icon={faDownload}
              className="text-content-primary text-[24px]"
            />
            <h2 className="text-body-lg font-bold text-content-primary">
              Offline cache modal title
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="icon-btn icon-btn-on-surface text-content-secondary"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        </div>

        {syncState === 'syncing' && (
          <>
            <p className="text-body-md font-regular text-content-secondary text-center">
              Offline cache downloading message
            </p>

            <div className="flex flex-col gap-lg items-center">
              <div className="relative w-full h-4 rounded-full bg-bg-surface-brand-subtle overflow-hidden">
                <div className="absolute h-full rounded-full bg-bg-surface-brand-default animate-progress-indeterminate" />
              </div>
              {closeButton}
            </div>
          </>
        )}

        {syncState !== 'syncing' && (
          <>
            <div className="flex justify-center">
              <FontAwesomeIcon
                icon={syncState === 'success' ? faCircleCheck : faCircleXmark}
                className={clsx(
                  'text-[96px]',
                  syncState === 'success'
                    ? 'text-content-status-positive'
                    : 'text-content-status-negative'
                )}
              />
            </div>

            <p className="text-body-md font-regular text-content-secondary text-center">
              {syncState === 'success'
                ? 'Your content is ready to use offline.'
                : 'We could not prepare your content for offline use.'}
            </p>

            <div className="flex gap-lg justify-center">
              {syncState === 'error' && closeButton}
              <BaseButton
                color="primary"
                size="md"
                onClick={syncState === 'success' ? handleClose : startSync}
                leftIcon={
                  syncState === 'error' ? (
                    <FontAwesomeIcon icon={faArrowRotateLeft} />
                  ) : undefined
                }
              >
                {syncState === 'success' ? 'Close' : 'Try again'}
              </BaseButton>
            </div>
          </>
        )}
      </div>
    </BlurredModal>
  );
};

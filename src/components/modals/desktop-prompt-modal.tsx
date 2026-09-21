import {
  faArrowUpRightFromSquare,
  faPlugCircleXmark,
  faXmark,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { BaseButton } from '@components/buttons/base-button/base-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDeepLink } from '@hooks/deep-link';
import { useDesktopNativeAppStore } from '@stores/desktop-native-app';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BlurredModal } from './blurred-modal';

const SHOW_DELAY_MS = 1000;

export const DesktopPromptModal: FC = () => {
  const { launchZcentralDesktopApp } = useDeepLink();
  const { isDesktopNativeApp } = useDesktopNativeAppStore();
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onClose = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    if (isDesktopNativeApp) return;

    const timer = setTimeout(() => setShow(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isDesktopNativeApp]);

  if (isDesktopNativeApp) {
    return null;
  }

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
              Desktop prompt modal title
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="icon-btn icon-btn-on-surface text-content-secondary"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
          </button>
        </div>

        <p className="text-body-md font-regular text-content-secondary text-center">
          Desktop prompt modal description
        </p>

        <div className="flex flex-col items-center gap-lg">
          <BaseButton
            color="primary"
            size="md"
            onClick={launchZcentralDesktopApp}
          >
            <span className="text-body-md font-medium ">
              Launch zcentral desktop
            </span>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              className="w-3 h-3"
            />
          </BaseButton>

          <button
            type="button"
            onClick={onClose}
            className="text-body-md font-medium text-content-primary underline hover:text-content-link-action-hover transition-colors duration-200 cursor-pointer"
          >
            Desktop prompt modal continue in browser
          </button>
        </div>
      </div>
    </BlurredModal>
  );
};

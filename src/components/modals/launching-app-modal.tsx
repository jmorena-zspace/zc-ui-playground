import { faXmark } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDesktopNativeAppStore } from '@stores/desktop-native-app';
import { Spinner } from '@components/ui/spinner';
import { FC, useEffect, useRef } from 'react';
import { BlurredModal } from './blurred-modal';

const AUTO_CLOSE_MS = 15_000;

export const LaunchingAppModal: FC = () => {
  const launchedContent = useDesktopNativeAppStore((s) => s.launchedContent);
  const clearLaunchedContent = useDesktopNativeAppStore(
    (s) => s.clearLaunchedContent
  );
  const show = !!launchedContent;
  const contentName = launchedContent?.contentName ?? '';

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearRef = useRef(clearLaunchedContent);
  clearRef.current = clearLaunchedContent;

  useEffect(() => {
    if (!show) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    timerRef.current = setTimeout(() => clearRef.current(), AUTO_CLOSE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show]);

  return (
    <BlurredModal
      show={show}
      onClose={clearLaunchedContent}
      centered
      initialFocus={containerRef}
    >
      <div
        ref={containerRef}
        tabIndex={-1}
        className="relative flex flex-col items-center gap-lg p-lg w-[420px] mx-auto bg-bg-surface-default border border-border-system-subtle rounded-lg shadow-lg outline-none"
      >
        <button
          type="button"
          onClick={clearLaunchedContent}
          className="absolute top-sm right-sm icon-btn icon-btn-on-surface text-content-secondary"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="w-3 h-3" />
        </button>

        <Spinner className="size-[68px]" />

        <p className="font-body text-body-md font-regular text-content-secondary text-center">
          Launching content
        </p>
      </div>
    </BlurredModal>
  );
};

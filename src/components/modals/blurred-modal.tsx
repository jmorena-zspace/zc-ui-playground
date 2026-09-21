import clsx from 'clsx';
import { Dialog, VisuallyHidden } from 'radix-ui';
import { BREAKPOINTS } from '@zcentral-v2/constants';
import { FC, PropsWithChildren, RefObject } from 'react';

const isMobile = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia(`(min-width: ${BREAKPOINTS.MD}px)`).matches;

export type BlurredModalProps = PropsWithChildren<{
  show: boolean;
  onClose: () => void;
  size?: string;
  dismissible?: boolean;
  centered?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  ariaLabel?: string;
}>;

export const BlurredModal: FC<BlurredModalProps> = ({
  show,
  onClose,
  size = 'xl',
  dismissible = true,
  centered = false,
  initialFocus,
  ariaLabel = 'Dialog',
  children,
}) => {
  // BlurredModal content is hidden on mobile (hidden md:block). Rendering the
  // Radix Dialog anyway would set pointer-events:none on <body>, blocking all
  // touch interaction since no visible content receives pointer events.
  if (isMobile()) return null;

  return (
    <Dialog.Root open={show} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(
            'fixed inset-0 z-20 hidden md:block bg-bg-overlay-modal',
            'data-[state=open]:animate-modal-backdrop',
            'data-[state=closed]:animate-modal-backdrop-exit'
          )}
        />
        <Dialog.Content
          aria-describedby={undefined}
          className={clsx(
            'fixed z-20 hidden md:block left-1/2 -translate-x-1/2 w-full outline-none',
            'data-[state=open]:animate-modal-content',
            'data-[state=closed]:animate-modal-content-exit',
            {
              'top-1/2 -translate-y-1/2': centered,
              'top-[150px] 4xl:top-[300px]': !centered,
              'max-w-[640px]': size === 'xl',
              'max-w-[800px] 4xl:max-w-[960px]': size === '2xl',
            }
          )}
          onOpenAutoFocus={(e) => {
            if (initialFocus?.current) {
              e.preventDefault();
              initialFocus.current.focus();
            }
          }}
          onInteractOutside={(e) => {
            if (!dismissible) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
          }}
        >
          <VisuallyHidden.Root asChild>
            <Dialog.Title>{ariaLabel}</Dialog.Title>
          </VisuallyHidden.Root>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

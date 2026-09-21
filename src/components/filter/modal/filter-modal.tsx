import {
  faCheck,
  faXmark,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { Dialog, VisuallyHidden } from 'radix-ui';
import { PropsWithChildren, ReactNode } from 'react';

export type FilterModalProps = PropsWithChildren<{
  show: boolean;
  onClose: () => void;
  header?: ReactNode;
  hasFiltersApplied?: boolean;
}>;

export function FilterModal({
  show,
  onClose,
  children,
  header,
  hasFiltersApplied,
}: FilterModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={show} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-20 md:hidden p-sm bg-bg-surface-default flex flex-col gap-md outline-none overflow-y-auto data-[state=open]:animate-filter-modal-enter data-[state=closed]:animate-filter-modal-exit"
        >
          <VisuallyHidden.Root asChild>
            <Dialog.Title>{t(PAGE_TEXTS.UI.FILTER)}</Dialog.Title>
          </VisuallyHidden.Root>
          <div className="flex items-center gap-md">
            {header}
            <button
              type="button"
              aria-label={t(ARIA_LABELS.UI.CLOSE_BUTTON)}
              onClick={onClose}
              className="flex items-center justify-center p-xs rounded-full hover:bg-bg-action-tertiary-hover transition-colors cursor-pointer shrink-0"
            >
              <FontAwesomeIcon
                icon={hasFiltersApplied ? faCheck : faXmark}
                className="h-4 w-4 text-content-secondary"
              />
            </button>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

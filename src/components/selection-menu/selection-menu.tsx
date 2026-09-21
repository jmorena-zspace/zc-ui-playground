import { BaseButton } from '@components/buttons/base-button/base-button';
import { CircleCheck, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FC } from 'react';

export type SelectionMenuProps = {
  /** Number of selected items. The menu renders nothing at zero. */
  count: number;
  /** Disables "select all" once everything is already selected. */
  allSelected?: boolean;
  onAddToClass: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

export const SelectionMenu: FC<SelectionMenuProps> = ({
  count,
  allSelected = false,
  onAddToClass,
  onSelectAll,
  onDeselectAll,
}) => {
  return (
    // AnimatePresence keeps the bar mounted long enough to animate out;
    // unmounting on `count === 0` would make it vanish instantly.
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          key="selection-menu"
          role="toolbar"
          aria-label="Selection actions"
          className="fixed bottom-xl left-1/2 z-10"
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 16, x: '-50%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-md rounded-full border border-border-system-subtle bg-bg-surface-strong px-md py-xs shadow-lg">
            <span
              aria-live="polite"
              className="whitespace-nowrap text-body-md font-medium text-content-primary"
            >
              {`${count} selected`}
            </span>

            <span
              aria-hidden="true"
              className="h-4 w-px bg-border-system-subtle"
            />

            <BaseButton
              color="primary"
              size="xs"
              className="whitespace-nowrap"
              onClick={onAddToClass}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add to class
            </BaseButton>

            <BaseButton
              color="secondary"
              size="xs"
              className="whitespace-nowrap"
              onClick={onSelectAll}
              disabled={allSelected}
              leftIcon={<CircleCheck className="h-4 w-4" />}
            >
              Select all
            </BaseButton>

            <BaseButton
              color="secondary"
              size="xs"
              className="whitespace-nowrap"
              onClick={onDeselectAll}
              leftIcon={<X className="h-4 w-4" />}
            >
              Deselect
            </BaseButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

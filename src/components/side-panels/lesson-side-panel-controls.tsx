import { Maximize2, X } from 'lucide-react';
import { FC } from 'react';
import { LessonWindowTab } from './lesson-param';

type LessonSidePanelControlsProps = {
  onClose: () => void;
  /** When given, a maximize button sits to the left of close. */
  onMaximize?: (tab?: LessonWindowTab) => void;
};

/**
 * Absolutely positioned so `top-0 right-0` lands level with the title's top
 * edge in whichever branch renders it (loading, error, loaded) — each one
 * puts this inside its own padded `relative` box.
 */
export const LessonSidePanelControls: FC<LessonSidePanelControlsProps> = ({
  onClose,
  onMaximize,
}) => (
  <div className="absolute right-0 top-0 z-1 flex items-center text-content-primary">
    {onMaximize && (
      <button
        type="button"
        onClick={() => onMaximize()}
        aria-label="Maximize"
        className="icon-btn icon-btn-on-surface"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
    )}
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="icon-btn icon-btn-on-surface"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
);

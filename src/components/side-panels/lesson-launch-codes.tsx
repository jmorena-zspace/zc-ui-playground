import { LaunchCodeBadge } from '@components/badges/launch-code-badge';
import clsx from 'clsx';
import { Copy } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';

/**
 * Click-to-copy launch codes, meant to sit inline right after a lesson name.
 */
export const LessonLaunchCodes: FC<{ codes: string[] }> = ({ codes }) => {
  if (codes.length === 0) return null;
  return (
    // Plain inline siblings of the title text, not a flex row: an inline-flex
    // button is an atomic inline box, so it flows in the wrapped title's line
    // box like a word and lands right after wherever the text ends.
    <span className="inline-flex flex-wrap items-center gap-xxs align-middle">
      {codes.map((code) => (
        <button
          key={code}
          type="button"
          aria-label="Copy launch code"
          onClick={() => toast('Copied to clipboard')}
          className="group/copy ml-xs inline-flex cursor-pointer items-center gap-xxs align-middle"
        >
          <LaunchCodeBadge text={code} />
          <Copy
            className={clsx(
              'h-3 w-3 shrink-0 text-content-tertiary',
              'opacity-0 -translate-x-1 transition-all duration-200 ease-out',
              'group-hover/copy:opacity-100 group-hover/copy:translate-x-0'
            )}
          />
        </button>
      ))}
    </span>
  );
};

import { AnimatedTitle } from '@components/animated-title';
import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { FC } from 'react';

export type CollectionFolderIcon = {
  icon: LucideIcon;
  from: string;
  to: string;
};

export type CollectionFolderCardProps = {
  name: string;
  count: number;
  countLabel?: string;
  icons: CollectionFolderIcon[];
  onClick?: () => void;
  className?: string;
};

// Final (open) position for each of the 3 peeking tiles, in px/deg from the
// card's own top-left — not deltas. The tiles sit at `bottom-6` before any
// transform (fully behind the front panel, height 74px), so each one needs
// enough negative Y to clear the front panel's top edge and actually poke
// out above the card, not just shift within it.
const OPEN = [
  { x: '-58px', y: '-76px', r: '-9deg' },
  { x: '0px', y: '-94px', r: '0deg' },
  { x: '58px', y: '-74px', r: '9deg' },
];

/**
 * A folder standing in for a collection: the front panel tips open on hover
 * or keyboard focus, and its first 3 contents rise up from behind it.
 * Ported from the "Peek Folders" concept, minus the manila tab, and
 * re-proportioned to the wide/short card shape used elsewhere in this app
 * rather than the original's near-square one.
 */
export const CollectionFolderCard: FC<CollectionFolderCardProps> = ({
  name,
  count,
  countLabel = 'collections',
  icons,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${name}`}
      className={clsx(
        'group/card relative block h-[150px] w-full cursor-pointer rounded-md p-0 text-left outline-none',
        '[perspective:1100px]',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          'absolute inset-x-1 -top-2 bottom-2 rounded-md border border-b-0 border-border-system-subtle bg-bg-surface-strong',
          'transition-transform duration-300 ease-out',
          'group-hover/card:-translate-y-2 group-focus-visible/card:-translate-y-2'
        )}
      />

      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        {icons.slice(0, 3).map(({ icon: Icon, from, to }, i) => (
          <span
            key={i}
            style={
              {
                '--x': OPEN[i].x,
                '--y': OPEN[i].y,
                '--r': OPEN[i].r,
                transitionDelay: `${i * 60}ms`,
                backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
              } as React.CSSProperties
            }
            className={clsx(
              'absolute bottom-6 left-1/2 -ml-[52px] flex h-[74px] w-[104px] items-center justify-center rounded-sm shadow-lg',
              'transition-transform duration-500 ease-out',
              '[transform:translate(0,10px)_rotate(0deg)_scale(.86)]',
              'group-hover/card:[transform:translate(var(--x),var(--y))_rotate(var(--r))_scale(1)]',
              'group-focus-visible/card:[transform:translate(var(--x),var(--y))_rotate(var(--r))_scale(1)]'
            )}
          >
            <Icon className="h-6 w-6 text-neutral-white" />
          </span>
        ))}
      </span>

      <span
        className={clsx(
          'absolute inset-0 flex origin-bottom flex-col items-center justify-center gap-xxs rounded-md p-md text-center',
          'border border-border-system-subtle bg-bg-surface-subtle',
          'transition-[transform,box-shadow] duration-300 ease-out',
          '[transform:translateY(0)_rotateX(0deg)]',
          'group-hover/card:shadow-lg group-hover/card:[transform:translateY(6px)_rotateX(-8deg)]',
          'group-focus-visible/card:shadow-lg group-focus-visible/card:[transform:translateY(6px)_rotateX(-8deg)]',
          'group-focus-visible/card:ring-2 group-focus-visible/card:ring-border-system-strong'
        )}
      >
        <AnimatedTitle
          as="span"
          showIcon={false}
          hoverGroup="group/card"
          className="line-clamp-1 wrap-break-word text-body-lg font-medium text-content-primary"
        >
          {name}
        </AnimatedTitle>
        <span className="text-body-sm text-content-tertiary">
          {`${count} ${countLabel}`}
        </span>
      </span>
    </button>
  );
};

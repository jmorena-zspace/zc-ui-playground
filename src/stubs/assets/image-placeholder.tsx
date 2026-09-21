import type { FC } from 'react';

/**
 * Stand-in for `@assets/image-placeholder`, shown by cards whose content
 * item has no `imageUrl`. Draws in `currentColor`, so callers control it
 * with a text utility (lesson-card passes `text-content-tertiary`).
 */
export const ImagePlaceholder: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect width="96" height="96" fill="currentColor" opacity="0.12" />
    <circle cx="36" cy="36" r="8" fill="currentColor" opacity="0.5" />
    <path
      d="M16 74l20-22 14 16 12-12 18 18z"
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
);

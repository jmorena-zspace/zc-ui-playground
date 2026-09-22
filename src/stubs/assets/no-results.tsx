import type { FC } from 'react';

/** Stand-in for `@assets/no-results` — drawn in currentColor. */
export const NoResultsIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="27"
      cy="27"
      r="16"
      stroke="currentColor"
      strokeWidth="3"
      opacity="0.6"
    />
    <path
      d="M39 39l14 14"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M21 27h12"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

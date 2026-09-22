import type * as React from 'react';

/**
 * Stand-in for `@shared/utils`. Only what the ported components have needed
 * so far — add the rest as you bring more components over.
 */

// The real module hand-rolls clsx + tailwind-merge; shadcn's `cn` package is
// the same composition, so re-export it rather than duplicating the logic.
export { cn } from 'cn';

/**
 * Google Docs/Drive share links open in an editor by default; the real util
 * rewrites them to a preview URL so a lesson file opens read-only.
 */
export function normalizeGoogleDocsUrl(url: string): string {
  const match = url.match(
    /^(https:\/\/docs\.google\.com\/[^/]+\/d\/[^/]+)(\/.*)?$/
  );
  return match ? `${match[1]}/preview` : url;
}

/**
 * Roving-focus helpers for arrow-key navigation inside a list. The real module
 * shares these between the filter inputs and ArrowNavigableContainer; the
 * behaviour is simple enough to reproduce faithfully.
 *
 * Items opt in with `data-nav-item`. Elements matching IGNORE_SELECTOR keep
 * their own arrow-key behaviour (typing in a field, changing a select).
 */
export const IGNORE_SELECTOR = 'input, textarea, select, [contenteditable]';

/** Moves focus one item along inside `container`. Returns true if it moved. */
export function navigateArrow(
  container: HTMLElement,
  key: 'ArrowDown' | 'ArrowUp' | string
): boolean {
  const items = [
    ...container.querySelectorAll<HTMLElement>('[data-nav-item]'),
  ].filter((el) => !el.hasAttribute('disabled'));
  if (items.length === 0) return false;

  const current = items.indexOf(document.activeElement as HTMLElement);
  const step = key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0;
  if (step === 0) return false;

  // Wraps, so holding an arrow cycles rather than dead-ending.
  const next = current < 0 ? 0 : (current + step + items.length) % items.length;
  items[next].focus();
  return true;
}

/** Keydown handler form of `navigateArrow`, for use straight on a listbox. */
export function handleArrowNavigation(
  event: React.KeyboardEvent<HTMLElement>
): void {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  const target = event.target as HTMLElement;
  if (target.matches(IGNORE_SELECTOR)) return;
  if (navigateArrow(event.currentTarget, event.key)) {
    event.preventDefault();
    event.stopPropagation();
  }
}

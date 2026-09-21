/**
 * Stand-in for `@shared/utils`. Only what the ported components have needed
 * so far — add the rest as you bring more components over.
 */

// The real module hand-rolls clsx + tailwind-merge; shadcn's `cn` package is
// the same composition, so re-export it rather than duplicating the logic.
export { cn } from 'cn';

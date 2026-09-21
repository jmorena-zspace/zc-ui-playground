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

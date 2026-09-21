/**
 * Stand-in for the private `@zcentral-v2/i18n` package.
 *
 * The real package resolves dotted key constants against locale bundles.
 * Here the constants hold the English copy directly and `t` only does
 * `{{var}}` interpolation — no locale files, no async init.
 *
 * Keys the playground has not needed yet are NOT an error: the constant
 * objects are wrapped in a proxy that turns any unknown path into a
 * humanized fallback (`PAGE_TEXTS.UI.ROWS_PER_PAGE` -> "Rows per page").
 * So a component pulled over from the source project renders readable
 * text immediately, and you only write real copy for the strings you
 * care about.
 */

type Interpolations = Record<string, string | number | undefined>;

/** `UI.SOME_LONG_KEY` -> `"Some long key"`. */
function humanize(path: string): string {
  const leaf = path.split('.').pop() ?? '';
  const words = leaf.replace(/_/g, ' ').toLowerCase().trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function withFallback<T extends object>(source: T, path: string[] = []): T {
  return new Proxy(source, {
    get(target, prop) {
      if (typeof prop === 'symbol') {
        if (prop === Symbol.toPrimitive) return () => humanize(path.join('.'));
        return Reflect.get(target, prop);
      }
      if (prop === 'toString') return () => humanize(path.join('.'));

      const next = [...path, prop];
      const value = Reflect.get(target, prop);

      if (typeof value === 'string') return value;
      if (value && typeof value === 'object') {
        return withFallback(value as object, next);
      }
      // Unknown key: hand back a proxy that stringifies to readable text.
      return withFallback({}, next);
    },
  }) as T;
}

export const PAGE_TEXTS = withFallback({
  UI: {
    FAILED_TO_LAUNCH_CONTENT_MESSAGE: 'Failed to launch content',
    LAUNCH_IN_APP: 'Launch in {{appName}}',
    APP_NOT_INSTALLED: '{{appName}} not installed',
  },
  LESSONS: {
    LESSON_BADGE: 'Lesson',
  },
  APPLICATIONS: {
    APPLICATION_BADGE: 'Application',
  },
});

export const ARIA_LABELS = withFallback({
  UI: {
    OPEN_DETAILS: 'Open details for {{name}}',
    APPLICATION_ICON_ALT: '{{name}} icon',
    LESSON_IMAGE_ALT: 'Cover image for {{name}}',
    LAUNCH_IN_APPLICATION_BUTTON: 'Launch {{lessonName}} in {{appName}}',
    LAUNCH_CODE: 'Launch code',
    SUBJECT_ICON_ALT: '{{name}} subject icon',
    SELECT_ITEM: 'Select {{name}}',
  },
});

function translate(key: unknown, interpolations?: Interpolations): string {
  const template = String(key ?? '');
  if (!interpolations) return template;

  return template.replace(/\{\{(\w+)\}\}/g, (match, name: string) => {
    const value = interpolations[name];
    return value == null ? match : String(value);
  });
}

export function useTranslation() {
  return { t: translate, i18n: { language: 'en-US' } };
}

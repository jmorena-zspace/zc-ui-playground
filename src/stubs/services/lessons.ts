/**
 * Stand-in for `@services/lessons`. The real module hits the API, falling
 * back to an offline cache; here it resolves out of the fixtures after a
 * short delay so the side panel's loading skeleton is actually visible.
 */
import { contentItems } from '@fixtures/content-items';
import type { Lesson } from '@zcentral-v2/types';

const LATENCY_MS = 400;

/** Mirrors the real signature: resolves the lesson, or rejects like a 404. */
export function getLessonByIdOfflineAware(
  id: string,
  signal?: AbortSignal
): Promise<{ lesson: Lesson; isOffline: boolean }> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const lesson = contentItems.find((item) => item.id === id) as
        | Lesson
        | undefined;

      if (!lesson) {
        // Shaped like the axios error the real service surfaces, so the
        // panel's `isNotFoundError` check still recognises it.
        reject(Object.assign(new Error('Not found'), {
          response: { status: 404 },
        }));
        return;
      }

      resolve({ lesson, isOffline: false });
    }, LATENCY_MS);

    signal?.addEventListener('abort', () => clearTimeout(timer));
  });
}

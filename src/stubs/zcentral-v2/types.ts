/**
 * Stand-in for the private `@zcentral-v2/types` package.
 *
 * The shapes here were reverse-engineered from how the components in
 * src/components actually use them, so they are deliberately permissive:
 * anything a component never reads is simply absent. Replace this file
 * wholesale once the real package is installable — the alias in
 * vite.config.ts is the only thing pointing at it.
 */

export enum ContentPlatform {
  WEB = 'web',
  DESKTOP = 'desktop',
}

export enum ContentType {
  LESSON = 'lesson',
  APPLICATION = 'application',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type Subject = {
  id: string;
  name: string;
  iconUrl?: string | null;
};

/** An application a lesson can be launched into. */
export type LessonApplication = {
  id: string;
  name: string;
  /** Not nullable: lesson-card feeds this straight to an <img src>. */
  iconUrl?: string;
  /** Short code shown in the badge beside the app name, e.g. "FL". */
  appLaunchCode: string;
  /** Present when the app can deep-link straight to this lesson. */
  deepLinkingLaunchCode?: string | null;
  platform: ContentPlatform;
};

/** A lesson or application as it appears in lists, cards and search results. */
export type ContentItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
  subjects: Subject[];
  apps?: LessonApplication[];
  type?: ContentType;
};

export type LessonFile = {
  id: string;
  name: string;
  fileUrl: string;
};

/** A lesson with the extra detail the side panel renders. */
export type Lesson = ContentItem & {
  /** Required here, unlike on ContentItem: the side panel maps it unguarded. */
  apps: LessonApplication[];
  summary?: string;
  lessonPlans?: LessonFile[];
  supportingFiles?: LessonFile[];
};

export type RecentlyLaunchedApp = {
  id: string;
  name: string;
  iconUrl?: string | null;
  appLaunchCode: string;
  platform: ContentPlatform;
};

export type SpotlightShortcutSetResult = {
  ok: boolean;
  accelerator?: string;
  reason?: string;
};

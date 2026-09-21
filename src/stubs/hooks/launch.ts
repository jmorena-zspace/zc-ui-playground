import type {
  ContentItem,
  LessonApplication,
  RecentlyLaunchedApp,
} from '@zcentral-v2/types';
import { ContentPlatform } from '@zcentral-v2/types';

/**
 * Fake `@hooks/launch`. Same surface as the real hook
 * (`canLaunchLesson`, `launchLesson`, `canLaunchApplication`,
 * `launchApplication`) so the components consuming it stay untouched.
 *
 * The real hook asks the desktop native app whether an application is
 * installed. Here that answer is this constant: web apps always launch,
 * desktop apps only when the native shell is present. Flip it to `true`
 * to see every launch button in its enabled state.
 */
const SIMULATE_DESKTOP_NATIVE_APP = false;

type Launchable = Pick<LessonApplication, 'name' | 'platform'>;

function canLaunch(app?: Launchable): boolean {
  if (!app) return false;
  if (app.platform === ContentPlatform.WEB) return true;
  return SIMULATE_DESKTOP_NATIVE_APP;
}

function fakeLaunch(label: string): Promise<void> {
  console.info(`[playground] launch requested: ${label}`);
  return new Promise((resolve) => setTimeout(resolve, 250));
}

export function useLaunch() {
  return {
    canLaunchLesson: (_lesson: ContentItem, app: LessonApplication) =>
      canLaunch(app),
    launchLesson: (lesson: ContentItem, app: LessonApplication) =>
      fakeLaunch(`${lesson.name} in ${app.name}`),
    canLaunchApplication: (app: Launchable) => canLaunch(app),
    launchApplication: (app: RecentlyLaunchedApp | Launchable) =>
      fakeLaunch(app.name),
  };
}

import { useLaunch } from '@hooks/launch';
import { useRecentlyLaunchedApps } from '@hooks/recently-launched-apps';
import { useDesktopNativeAppStore } from '@stores/desktop-native-app';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { RecentlyLaunchedApp } from '@zcentral-v2/types';
import { FC, useCallback } from 'react';
import { toast } from 'sonner';
import { RecentlyLaunchedAppItem } from './recently-launched-app-item';
import { RecentlyLaunchedAppSkeleton } from './recently-launched-app-skeleton';

export const RecentlyLaunchedApps: FC = () => {
  const { t } = useTranslation();
  const { isDesktopNativeApp } = useDesktopNativeAppStore();
  const { apps: availableApps, isSyncing } = useRecentlyLaunchedApps();
  const { launchApplication } = useLaunch();

  const handleLaunch = useCallback(
    (app: RecentlyLaunchedApp) => {
      launchApplication(app).catch((error) => {
        toast.error(t(PAGE_TEXTS.UI.FAILED_TO_LAUNCH_CONTENT_MESSAGE));
        console.error('Failed to launch content:', error);
      });
    },
    [launchApplication, t]
  );

  if (!isDesktopNativeApp || availableApps.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label={t(ARIA_LABELS.HOME.RECENTLY_LAUNCHED_APPS)}
      className="flex list-none flex-wrap items-start justify-center gap-xxl"
    >
      {availableApps.map((app) => (
        <li key={app.id}>
          {isSyncing ? (
            <RecentlyLaunchedAppSkeleton app={app} />
          ) : (
            <RecentlyLaunchedAppItem app={app} onLaunch={handleLaunch} />
          )}
        </li>
      ))}
    </ul>
  );
};

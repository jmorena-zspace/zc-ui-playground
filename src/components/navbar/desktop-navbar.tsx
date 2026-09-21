import { ZCentralLogo } from '@assets/zcentral-logo';
import {
  faCircleQuestion,
  faCog,
} from '@awesome.me/kit-935ddc1468/icons/classic/regular';
import { DesktopBadge } from '@components/badges/desktop-badge';
import { NoInternetConnectionBadge } from '@components/badges/internet-connection-badge';
import { SearchTrigger } from '@components/inputs';
import { LanguageSwitcher } from '@components/language-switcher';
import { GlobalSearchModal } from '@components/modals';
import { NoInternetConnectionModal } from '@components/modals/no-internet-connection-modal';
import { mainContainer } from '@constants/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useInternetConnection } from '@hooks/internet-connection';
import { useSpotlightShortcut } from '@hooks/spotlight-shortcut';
import { useDesktopNativeAppStore } from '@stores/desktop-native-app';
import { useInternetConnectionStore } from '@stores/internet-connection';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import { matchesAccelerator } from '@zcentral-v2/utils';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const DesktopNavbar: FC = () => {
  const { t } = useTranslation();
  const matchRoute = useMatchRoute();
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const { isDesktopNativeApp } = useDesktopNativeAppStore();
  const { checkConnection } = useInternetConnection();

  const {
    isOnline,
    hasNotifiedOffline,
    setHasNotifiedOffline,
    showNoInternetConnectionModal,
    setShowNoInternetConnectionModal,
  } = useInternetConnectionStore();
  const isHomeRoute = matchRoute({ to: '/' });

  const shouldAutomaticallyShowModal = !isOnline && !hasNotifiedOffline;

  const handleCloseNoInternetConnectionModal = () => {
    setShowNoInternetConnectionModal(false);
    setHasNotifiedOffline(true);
  };

  const handleRetry = async () => {
    const online = await checkConnection();
    if (online) {
      setShowNoInternetConnectionModal(false);
      setHasNotifiedOffline(true);
    } else {
      toast.error(t(PAGE_TEXTS.HOME.FAILED_TO_RECONNECT_MESSAGE));
    }
  };

  const openGlobalSearch = () => setIsGlobalSearchOpen(true);
  const closeGlobalSearch = () => setIsGlobalSearchOpen(false);

  const spotlightShortcut = useSpotlightShortcut();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHomeRoute) return;
      if (!matchesAccelerator(event, spotlightShortcut)) return;
      event.preventDefault();
      setIsGlobalSearchOpen((prev) => !prev);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isHomeRoute, spotlightShortcut]);

  return (
    <>
      <nav
        className="hidden bg-transparent md:block"
        aria-label={t(ARIA_LABELS.UI.NAVIGATION)}
      >
        <div
          className={clsx(mainContainer, 'flex items-center px-lg pt-md pb-xl')}
        >
          {!isHomeRoute && (
            <div className="flex items-center gap-xs">
              <Link to="/" className="group">
                <ZCentralLogo clickable />
              </Link>
              {isDesktopNativeApp && <DesktopBadge />}
              {isDesktopNativeApp && !isOnline && (
                <NoInternetConnectionBadge
                  onClick={() => setShowNoInternetConnectionModal(true)}
                />
              )}
            </div>
          )}
          <div className="flex flex-1 justify-end items-center gap-xs min-h-9">
            {!isHomeRoute && (
              <SearchTrigger onClick={openGlobalSearch} variant="secondary" />
            )}

            <div className="flex items-center">
              <LanguageSwitcher />
              <Link
                to="/settings"
                className="icon-btn icon-btn-on-dark text-content-action-on-primary-default"
                aria-label={t(ARIA_LABELS.UI.SETTINGS)}
              >
                <FontAwesomeIcon className="h-4 w-4" icon={faCog} />
              </Link>
              <Link
                to="/help"
                className="icon-btn icon-btn-on-dark text-content-action-on-primary-default"
                aria-label={t(ARIA_LABELS.UI.HELP_PAGE)}
              >
                <FontAwesomeIcon icon={faCircleQuestion} />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <GlobalSearchModal
        show={isGlobalSearchOpen}
        onClose={closeGlobalSearch}
      />
      {isDesktopNativeApp && (
        <NoInternetConnectionModal
          show={shouldAutomaticallyShowModal || showNoInternetConnectionModal}
          onClose={handleCloseNoInternetConnectionModal}
          onRetry={handleRetry}
        />
      )}
    </>
  );
};

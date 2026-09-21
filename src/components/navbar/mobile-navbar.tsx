import { ZCentralLogo } from '@assets/zcentral-logo';
import {
  faCircleQuestion,
  faCog,
} from '@awesome.me/kit-935ddc1468/icons/classic/regular';
import {
  faMagnifyingGlass,
  faXmark,
} from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { LanguageSwitcher } from '@components/language-switcher';
import { mainContainer } from '@constants/theme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalSearch } from '@hooks/global-search';
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { SearchInput } from '../inputs/search-input';

export const MobileNavbar: FC = () => {
  const { t } = useTranslation();
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const { search, onSearchChange, onKeyDown, inputErrorMessage } =
    useGlobalSearch({
      performSearch: false,
      onEnterKeyDownHandler: (query) => {
        setSearchOpen(false);
        navigate({ to: '/search', search: { q: query } });
      },
    });

  const isHomeRoute = matchRoute({ to: '/' });

  const navbarButtonClassname =
    'icon-btn icon-btn-on-dark text-content-action-on-primary-default';

  const animatedSearchIconClassname =
    'absolute h-4 w-4 inset-0 m-auto transition-all duration-300 ease-out';

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  return (
    <nav
      className="bg-transparent md:hidden"
      aria-label={t(ARIA_LABELS.UI.NAVIGATION)}
    >
      <div className={clsx(mainContainer, 'flex flex-col px-md pt-xs pb-md')}>
        <div className="flex flex-1 items-center">
          {!isHomeRoute && (
            <Link to="/" className="group">
              <ZCentralLogo clickable className="h-4 w-auto" />
            </Link>
          )}
          <div className="flex flex-1 justify-end items-center gap-xxs">
            {!isHomeRoute && (
              <button
                className={clsx(navbarButtonClassname, 'relative w-8 h-8')}
                aria-label={
                  searchOpen
                    ? t(ARIA_LABELS.UI.CLOSE_GLOBAL_SEARCH)
                    : t(ARIA_LABELS.UI.GLOBAL_SEARCH_BUTTON)
                }
                onClick={toggleSearch}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className={clsx(animatedSearchIconClassname, {
                    'opacity-0 scale-50 rotate-90': searchOpen,
                    'opacity-100 scale-100 rotate-0': !searchOpen,
                  })}
                />
                <FontAwesomeIcon
                  icon={faXmark}
                  className={clsx(animatedSearchIconClassname, {
                    'opacity-100 scale-100 rotate-0': searchOpen,
                    'opacity-0 scale-50 -rotate-90': !searchOpen,
                  })}
                />
              </button>
            )}
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
        {!isHomeRoute && (
          <div
            className={clsx('grid transition-all duration-300 ease-out', {
              'grid-rows-[1fr] mt-xs': searchOpen,
              'grid-rows-[0fr]': !searchOpen,
            })}
          >
            <div
              className={clsx('overflow-hidden px-lg', {
                invisible: !searchOpen,
              })}
              aria-hidden={!searchOpen}
            >
              <SearchInput
                variant="secondary"
                value={search}
                onChange={onSearchChange}
                onKeyDown={onKeyDown}
                errorMessage={inputErrorMessage}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

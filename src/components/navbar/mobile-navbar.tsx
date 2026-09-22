import { CircleHelp, Search, Settings, X } from 'lucide-react';
import { ZCentralLogo } from '@assets/zcentral-logo';
import { LanguageSwitcher } from '@components/language-switcher';
import { mainContainer } from '@constants/theme';
import { useGlobalSearch } from '@hooks/global-search';
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { SearchInput } from '../inputs/search-input';

export const MobileNavbar: FC = () => {
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
      aria-label="Navigation"
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
                    ? 'Close global search'
                    : 'Global search button'
                }
                onClick={toggleSearch}
              >
                <Search className={clsx(
          'h-4 w-4',animatedSearchIconClassname, {
                    'opacity-0 scale-50 rotate-90': searchOpen,
                    'opacity-100 scale-100 rotate-0': !searchOpen,
                  })} />
                <X className={clsx(
          'h-4 w-4',animatedSearchIconClassname, {
                    'opacity-100 scale-100 rotate-0': searchOpen,
                    'opacity-0 scale-50 -rotate-90': !searchOpen,
                  })} />
              </button>
            )}
            <LanguageSwitcher />
            <Link
              to="/settings"
              className="icon-btn icon-btn-on-dark text-content-action-on-primary-default"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <Link
              to="/help"
              className="icon-btn icon-btn-on-dark text-content-action-on-primary-default"
              aria-label="Help page"
            >
              <CircleHelp className="h-4 w-4" />
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

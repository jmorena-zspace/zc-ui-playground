import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import clsx from 'clsx';
import { CSSProperties, FC, useEffect, useRef, useState } from 'react';

type IconProp = LucideIcon;

export type Tab = {
  label: string;
  to: string;
  icon: IconProp;
  activeIcon?: IconProp;
};

export type TabBarProps = {
  tabs: Tab[];
  'aria-label'?: string;
};

const baseTabBarStyles =
  'relative flex flex-nowrap gap-lg text-body-md font-medium text-center border-b border-border-system-subtle overflow-x-auto scrollbar-hide';

const baseTabStyles =
  'inline-flex items-center gap-xs px-0 py-xs text-body-md font-medium bg-transparent border-b border-transparent transition-colors cursor-pointer focus:outline-none whitespace-nowrap';

const activeTabStyles = 'text-content-active';
const inactiveTabStyles =
  'text-content-tertiary hover:text-content-active focus-visible:text-content-active';

const activeTabIndicatorBaseStyles =
  'absolute bottom-0 h-[2px] bg-content-active left-[var(--indicator-left)] w-[var(--indicator-width)]';

const activeTabIndicatorAnimatedStyles = 'transition-all duration-300 ease-out';

export const TabBar: FC<TabBarProps> = ({ tabs, 'aria-label': ariaLabel }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [activeTabIndicatorLeft, setActiveTabIndicatorLeft] = useState(0);
  const [activeTabIndicatorWidth, setActiveTabIndicatorWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const activeTabIndex = tabs.findIndex((tab) =>
    location.pathname.startsWith(tab.to)
  );

  const tabLinkRef = (tab: Tab, el: HTMLAnchorElement | null) => {
    if (el) {
      tabRefs.current.set(tab.to, el);
    } else {
      tabRefs.current.delete(tab.to);
    }
  };

  useEffect(() => {
    const activeTab = tabs[activeTabIndex];
    if (activeTab) {
      const tabElement = tabRefs.current.get(activeTab.to);
      const container = containerRef.current;
      if (tabElement && container) {
        const containerRect = container.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();
        setActiveTabIndicatorLeft(
          tabRect.left - containerRect.left + container.scrollLeft
        );
        setActiveTabIndicatorWidth(tabRect.width);

        if (!shouldAnimate) {
          requestAnimationFrame(() => {
            setShouldAnimate(true);
          });
        }
      }
    }
  }, [activeTabIndex, tabs, shouldAnimate]);

  return (
    <div
      ref={containerRef}
      className={baseTabBarStyles}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.to);
        const Icon = tab.icon;
        const ActiveIcon = tab.activeIcon;

        return (
          <Link
            role="tab"
            aria-selected={isActive}
            key={tab.label}
            to={tab.to}
            ref={(el) => tabLinkRef(tab, el)}
            className={clsx(baseTabStyles, {
              [activeTabStyles]: isActive,
              [inactiveTabStyles]: !isActive,
            })}
            onClick={(e) => {
              if (isActive) {
                e.preventDefault();
                return;
              }
            }}
          >
            {ActiveIcon ? (
              <span className="relative w-4 h-4 inline-flex items-center justify-center">
                <Icon
                  className={clsx(
                    'absolute transition-all duration-300 ease-out',
                    isActive ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                  )}
                />
                <ActiveIcon
                  className={clsx(
                    'absolute transition-all duration-300 ease-out',
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  )}
                />
              </span>
            ) : (
              <Icon className="w-4 h-4" />
            )}
            <span>{tab.label}</span>
          </Link>
        );
      })}
      <span
        className={clsx(activeTabIndicatorBaseStyles, {
          [activeTabIndicatorAnimatedStyles]: shouldAnimate,
        })}
        style={
          {
            '--indicator-left': `${activeTabIndicatorLeft}px`,
            '--indicator-width': `${activeTabIndicatorWidth}px`,
          } as CSSProperties
        }
      />
    </div>
  );
};

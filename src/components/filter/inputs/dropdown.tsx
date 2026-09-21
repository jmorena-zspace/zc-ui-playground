import { ArrowNavigableContainer } from '@components/ui/arrow-navigable-container';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from '@components/ui/popover';
import clsx from 'clsx';
import {
  createContext,
  KeyboardEvent,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
} from 'react';

type FilterDropdownVariant = 'menu' | 'default';

const FilterDropdownContext = createContext<FilterDropdownVariant>('default');

type FilterDropdownProps = PropsWithChildren<{
  renderTrigger: (isOpen: boolean) => ReactElement;
  fixedSection?: ReactNode;
  align?: 'start' | 'end';
  variant?: FilterDropdownVariant;
}>;

function FilterDropdownTrigger({
  renderTrigger,
}: {
  renderTrigger: (isOpen: boolean) => ReactElement;
}) {
  const ctx = usePopoverContext();
  return (
    <PopoverTrigger asChild>{renderTrigger(ctx?.open ?? false)}</PopoverTrigger>
  );
}

function FilterDropdownContent({
  children,
  fixedSection,
  variant,
  align,
}: {
  children: ReactNode;
  fixedSection?: ReactNode;
  variant: FilterDropdownVariant;
  align: 'start' | 'end';
}) {
  const popover = usePopoverContext();
  const roleProps = variant === 'menu' ? { role: 'menu' as const } : {};

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== 'Tab') return;

      const target = e.target as HTMLElement;
      if (target.matches('input')) return;

      e.preventDefault();
      popover?.close();
    },
    [popover]
  );

  return (
    <PopoverContent align={align} {...roleProps} onKeyDown={handleKeyDown}>
      <ArrowNavigableContainer
        className={clsx('px-sm pt-sm max-h-[400px] overflow-y-auto', {
          'pb-0': !!fixedSection,
          'pb-sm': !fixedSection,
        })}
      >
        {children}
      </ArrowNavigableContainer>
      {fixedSection && (
        <div className="sticky bottom-0 mt-xs pt-xxs flex justify-end bg-bg-surface-default p-xs">
          {fixedSection}
        </div>
      )}
    </PopoverContent>
  );
}

function FilterDropdown({
  children,
  renderTrigger,
  fixedSection,
  align = 'start',
  variant = 'default',
}: FilterDropdownProps) {
  return (
    <FilterDropdownContext.Provider value={variant}>
      <Popover>
        <FilterDropdownTrigger renderTrigger={renderTrigger} />
        <FilterDropdownContent
          align={align}
          fixedSection={fixedSection}
          variant={variant}
        >
          {children}
        </FilterDropdownContent>
      </Popover>
    </FilterDropdownContext.Provider>
  );
}

type FilterDropdownItemProps = {
  children: ReactNode;
  onClick?: () => void;
  checked?: boolean;
  exclusive?: boolean;
  first?: boolean;
};

function FilterDropdownItem({
  children,
  onClick,
  checked,
  exclusive = false,
  first = false,
}: FilterDropdownItemProps) {
  const variant = useContext(FilterDropdownContext);

  let itemRole: string | undefined;
  if (variant === 'menu') {
    if (checked !== undefined) {
      itemRole = exclusive ? 'menuitemradio' : 'menuitemcheckbox';
    } else {
      itemRole = 'menuitem';
    }
  }

  return (
    <button
      type="button"
      role={itemRole}
      aria-checked={checked !== undefined ? checked : undefined}
      tabIndex={first ? 0 : -1}
      data-nav-item
      data-dropdown-item
      className={clsx(
        'flex w-full items-center gap-xs cursor-pointer',
        'p-xs hover:bg-bg-surface-hover rounded-xs',
        'outline-none focus-visible:bg-bg-surface-hover'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type FilterDropdownSectionProps = {
  children: ReactNode;
  align?: 'start' | 'end';
};

function FilterDropdownSection({
  children,
  align,
}: FilterDropdownSectionProps) {
  return (
    <div
      className={clsx('p-xs', {
        'flex justify-end': align === 'end',
      })}
    >
      {children}
    </div>
  );
}

FilterDropdown.Item = FilterDropdownItem;
FilterDropdown.Section = FilterDropdownSection;

export { FilterDropdown };

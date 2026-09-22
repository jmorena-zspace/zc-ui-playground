import { Search } from 'lucide-react';
import { Spinner } from '@components/ui/spinner';
import { MAX_SEARCH_QUERY_LENGTH } from '@zcentral-v2/search';
import clsx from 'clsx';
import { InputHTMLAttributes, KeyboardEvent, useState } from 'react';
import { SearchVariant, searchInputTheme } from './theme';

type SearchInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onKeyDown'
> & {
  variant?: SearchVariant;
  isLoading?: boolean;
  showEscHint?: boolean;
  errorMessage?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

// Matches `KeyboardShortcut`'s `sm` depth so the two chip styles align.
const ESC_HINT_DEPTH = 2;

function EscKeyHint({
  className,
  pressed,
}: {
  className?: string;
  pressed?: boolean;
}) {
  const style = pressed
    ? { boxShadow: 'none', transform: `translateY(${ESC_HINT_DEPTH}px)` }
    : { boxShadow: `0 ${ESC_HINT_DEPTH}px 0 0 rgba(0, 0, 0, 0.18)` };
  return (
    <span style={{ paddingBottom: ESC_HINT_DEPTH }}>
      <kbd
        className={clsx(
          'inline-flex items-center justify-center px-1.5 py-0.5 text-body-sm font-medium border rounded transition-[transform,box-shadow] duration-75',
          className
        )}
        style={style}
      >
        ESC
      </kbd>
    </span>
  );
}

export function SearchInput({
  value,
  onChange,
  onKeyDown,
  errorMessage,
  variant = 'primary',
  isLoading = false,
  showEscHint = false,
  inputRef,
}: SearchInputProps) {
  const variantStyles = searchInputTheme.variant[variant];
  const [escPressed, setEscPressed] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') setEscPressed(true);
    onKeyDown?.(event);
  };
  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') setEscPressed(false);
  };

  return (
    <div className="flex flex-col gap-xxs w-full">
      <div className={clsx(searchInputTheme.base, variantStyles.container)}>
        <div className={clsx(searchInputTheme.inner, variantStyles.inner)}>
          <Search className={clsx(searchInputTheme.icon, variantStyles.icon)} />
          <input
            ref={inputRef}
            type="search"
            aria-label="Search input"
            className={clsx(searchInputTheme.input, variantStyles.input)}
            placeholder="Search lessons and applications"
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onBlur={() => setEscPressed(false)}
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            enterKeyHint="search"
          />
          {errorMessage && (
            <span
              role="alert"
              aria-live="polite"
              className={clsx(searchInputTheme.error, variantStyles.error)}
            >
              {errorMessage}
            </span>
          )}
          <div className="flex items-center gap-xs shrink-0">
            {isLoading && (
              <Spinner className="size-4 text-content-primary pointer-events-none" />
            )}
            {showEscHint && (
              <EscKeyHint
                className={variantStyles.escHint}
                pressed={escPressed}
              />
            )}
          </div>
        </div>
      </div>
      {errorMessage && (
        <div className="md:hidden flex items-center justify-center">
          <span
            role="alert"
            aria-live="polite"
            className="text-body-md italic text-content-action-on-primary-default font-regular"
          >
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
}

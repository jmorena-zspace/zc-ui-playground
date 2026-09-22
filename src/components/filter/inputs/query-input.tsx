import { Search, X } from 'lucide-react';
import clsx from 'clsx';
import {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useState,
} from 'react';

export function useFilterQuery() {
  const [input, setInput] = useState('');
  return {
    input,
    query: input.trim(),
    onChange: (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    clear: () => setInput(''),
  };
}

type FilterQueryInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'value'
> & {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
};

export function FilterQueryInput({
  value,
  onChange,
  onClear,
}: FilterQueryInputProps) {
  const hasValue = typeof value === 'string' && value.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'ArrowDown' ||
      e.key === 'ArrowUp' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.key === 'PageDown' ||
      e.key === 'PageUp'
    ) {
      e.stopPropagation();
      if (e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }

    if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete') {
      e.stopPropagation();
      if (e.nativeEvent.stopImmediatePropagation) {
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  };

  const handleClear = () => {
    onClear?.();
  };

  return (
    <div
      role="none"
      className={clsx(
        'relative w-full h-9 rounded-sm border transition-all',
        'border-border-input-default focus-within:border-border-input-active text-body-md'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Search className="text-content-placeholder pointer-events-none absolute left-sm top-1/2 -translate-y-1/2" />
      <input
        aria-label="Query input"
        type="text"
        className={clsx(
          'w-full h-full py-xxs pl-[42px]',
          'rounded-md border-none outline-none',
          'bg-transparent placeholder:text-content-tertiary',
          'text-content-primary text-ellipsis font-regular',
          'overflow-hidden whitespace-nowrap',
          { 'pr-[36px]': hasValue, 'pr-sm': !hasValue }
        )}
        placeholder="Search"
        name="query"
        onKeyDown={handleKeyDown}
        value={value}
        onChange={onChange}
      />
      {hasValue && (
        <button
          type="button"
          className="icon-btn icon-btn-on-surface absolute right-xs top-1/2 -translate-y-1/2 p-xxs! text-content-primary"
          onClick={handleClear}
          tabIndex={-1}
        >
          <X className="text-body-sm" />
        </button>
      )}
    </div>
  );
}

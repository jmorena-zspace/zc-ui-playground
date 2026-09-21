import { faMagnifyingGlass } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { KeyboardShortcut } from '@components/ui/keyboard-shortcut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePressedKeys } from '@hooks/pressed-keys';
import { useSpotlightShortcut } from '@hooks/spotlight-shortcut';
import clsx from 'clsx';
import { SearchVariant, searchInputTheme } from './theme';

type SearchTriggerProps = {
  onClick: () => void;
  variant?: SearchVariant;
  className?: string;
};

export function SearchTrigger({
  onClick,
  variant = 'primary',
  className,
}: SearchTriggerProps) {
  const accelerator = useSpotlightShortcut();
  const pressedTokens = usePressedKeys();
  const variantStyles = searchInputTheme.variant[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group w-64 border transition-all focus:outline-none',
        variantStyles.container,
        'hover:search-active-glow cursor-pointer',
        className
      )}
    >
      <div className={clsx(searchInputTheme.inner, variantStyles.inner)}>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className={clsx(searchInputTheme.icon, variantStyles.icon)}
        />
        <span
          className={clsx(
            'flex-1 min-w-0 text-left text-body-md font-regular truncate',
            variantStyles.input
          )}
        >
          Search short placeholder
        </span>
        <KeyboardShortcut
          accelerator={accelerator}
          size="sm"
          tone={variant === 'secondary' ? 'on-primary' : 'default'}
          pressedTokens={pressedTokens}
        />
      </div>
    </button>
  );
}

import {
  formatAcceleratorForDisplay,
  isMacPlatform,
  isMacSymbol,
  parseAccelerator,
} from '@zcentral-v2/utils';
import clsx from 'clsx';
import { FC, Fragment, useMemo } from 'react';

export type KeyboardShortcutSize = 'sm' | 'md' | 'lg';
export type KeyboardShortcutTone = 'default' | 'on-primary';

type KeyboardShortcutProps = {
  accelerator: string;
  size?: KeyboardShortcutSize;
  tone?: KeyboardShortcutTone;
  className?: string;
  /**
   * Set of canonical Electron-accelerator tokens (e.g. `'CommandOrControl'`,
   * `'Shift'`, `'P'`) that are currently physically held. Chips whose token
   * is in the set render with a "pressed" visual.
   */
  pressedTokens?: ReadonlySet<string>;
};

const chipBySize: Record<KeyboardShortcutSize, string> = {
  sm: 'px-1.5 py-0.5 text-body-sm',
  md: 'min-w-[2rem] h-8 px-1.5 text-body-sm',
  lg: 'min-w-[2.5rem] h-10 px-xs text-body-md font-bold',
};

// Bottom-shadow depth (px) that simulates a physical key. On press the
// shadow collapses and the chip translates down by the same amount.
const chipDepthBySize: Record<KeyboardShortcutSize, number> = {
  sm: 2,
  md: 2,
  lg: 3,
};

const chipByTone: Record<KeyboardShortcutTone, string> = {
  default:
    'text-content-primary bg-bg-surface-subtle border border-border-system-subtle',
  'on-primary':
    'text-content-action-on-primary-default border border-border-action-secondary-default',
};

const separatorByTone: Record<KeyboardShortcutTone, string> = {
  default: 'text-content-tertiary',
  'on-primary': 'text-content-action-on-primary-default',
};

const macSymbolScaleBySize: Record<KeyboardShortcutSize, string> = {
  sm: 'scale-150',
  md: 'scale-125',
  lg: 'scale-125',
};

export const KeyboardShortcut: FC<KeyboardShortcutProps> = ({
  accelerator,
  size = 'md',
  tone = 'default',
  className,
  pressedTokens,
}) => {
  const mac = isMacPlatform();
  const { tokens, canonicalTokens } = useMemo(() => {
    const display = formatAcceleratorForDisplay(
      accelerator,
      mac ? 'mac' : 'other'
    );
    // Parallel arrays — display strings for rendering, canonical tokens for
    // matching against `pressedTokens` (which uses Electron names, not glyphs).
    const parsed = parseAccelerator(accelerator);
    const canonical = parsed
      ? [...parsed.modifiers, ...(parsed.key ? [parsed.key] : [])]
      : [];
    return { tokens: display, canonicalTokens: canonical };
  }, [accelerator, mac]);

  if (tokens.length === 0) return null;

  const depth = chipDepthBySize[size];
  // Reserve depth in the wrapper so the press translation doesn't shift siblings.
  const chipWrapperStyle = { paddingBottom: depth };
  const chipRestingStyle = {
    boxShadow: `0 ${depth}px 0 0 rgba(0, 0, 0, 0.18)`,
  };
  const chipPressedStyle = {
    boxShadow: 'none',
    transform: `translateY(${depth}px)`,
  };

  const chipBase =
    'inline-flex items-center justify-center rounded font-medium transition-[transform,box-shadow] duration-75 will-change-transform';
  const separatorClass = clsx(
    'text-body-sm font-medium',
    separatorByTone[tone]
  );
  const scaleClass = macSymbolScaleBySize[size];

  return (
    <span
      className={clsx('inline-flex items-center gap-xxs', className)}
      style={chipWrapperStyle}
    >
      {tokens.map((token, index) => {
        const canonical = canonicalTokens[index];
        const isPressed = canonical
          ? pressedTokens?.has(canonical) ?? false
          : false;
        const chipClass = clsx(
          chipBase,
          chipBySize[size],
          chipByTone[tone]
        );
        return (
          <Fragment key={`${token}-${index}`}>
            {index > 0 && <span className={separatorClass}>+</span>}
            <kbd
              className={chipClass}
              style={isPressed ? chipPressedStyle : chipRestingStyle}
            >
              {mac && isMacSymbol(token) ? (
                <span className={clsx('inline-block', scaleClass)}>
                  {token}
                </span>
              ) : (
                token
              )}
            </kbd>
          </Fragment>
        );
      })}
    </span>
  );
};

import { ArrowRight, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';

type AnimatedTitleProps = {
  children: ReactNode;
  showIcon?: boolean;
  icon?: LucideIcon;
  animated?: boolean;
  className?: string;
  /**
   * CSS utility class that sets the underline color via `background-image`.
   * Defaults to `"animated-underline-brand"` (brand purple).
   * Pass `"animated-underline-on-brand"` for light-on-dark surfaces.
   */
  underlineColorClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  /**
   * When undefined, the component creates its own `group` class and
   * reacts to hover on itself. Pass `"group/card"` to react to an
   * ancestor card's hover instead.
   *
   * Only `"group/card"` is currently supported as an external group.
   */
  hoverGroup?: 'group/card';
};

export const AnimatedTitle: FC<AnimatedTitleProps> = ({
  children,
  showIcon = true,
  icon: Icon = ArrowRight,
  animated = true,
  className,
  underlineColorClassName = 'animated-underline-brand',
  as: Component = 'h1',
  hoverGroup,
}) => {
  const isOwnHoverGroup = hoverGroup === undefined;

  return (
    <Component
      className={clsx(
        { group: isOwnHoverGroup },
        className
      )}
    >
      <span
        className={clsx('animated-underline', underlineColorClassName, {
          'group-hover:bg-size-[100%_2px]': animated && isOwnHoverGroup,
          'group-hover/card:bg-size-[100%_2px] group-focus-visible/card:bg-size-[100%_2px] group-has-[:focus-visible]/card:bg-size-[100%_2px]':
            animated && hoverGroup === 'group/card',
        })}
      >
        {children}
      </span>
      {showIcon && (
        <Icon
          className={clsx(
            'ml-xs w-3 h-3 opacity-0 -translate-x-2',
            'transition-all duration-300 ease-out delay-300',
            { 'group-hover:opacity-100 group-hover:translate-x-0': isOwnHoverGroup },
            {
              'group-hover/card:opacity-100 group-hover/card:translate-x-0 group-focus-visible/card:opacity-100 group-has-[:focus-visible]/card:opacity-100 group-focus-visible/card:translate-x-0 group-has-[:focus-visible]/card:translate-x-0':
                hoverGroup === 'group/card',
            }
          )}
        />
      )}
    </Component>
  );
};

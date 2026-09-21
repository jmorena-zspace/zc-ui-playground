import clsx from 'clsx';
import { ButtonHTMLAttributes, FC, PropsWithChildren, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { theme } from './theme';

export type BaseButtonProps = PropsWithChildren &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: 'primary' | 'secondary' | 'filter';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullSized?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    active?: boolean;
  };

export const BaseButton: FC<BaseButtonProps> = ({
  children,
  color = 'primary',
  size = 'sm',
  fullSized = false,
  className,
  leftIcon,
  rightIcon,
  active = false,
  ...buttonProps
}) => {
  return (
    <button
      className={clsx(
        twMerge(theme.base, className),
        theme.size[size],
        theme.color(active)[color],
        { 'w-full': fullSized }
      )}
      {...buttonProps}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
};

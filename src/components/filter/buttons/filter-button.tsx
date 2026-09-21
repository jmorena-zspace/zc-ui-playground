import clsx from 'clsx';
import { FC } from 'react';
import {
  BaseButton,
  BaseButtonProps,
} from '../../buttons/base-button/base-button';

export const FilterButton: FC<BaseButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <BaseButton
      color="filter"
      size="xs"
      className={clsx('rounded-sm', className)}
      data-dropdown-trigger
      {...props}
    >
      {children}
    </BaseButton>
  );
};

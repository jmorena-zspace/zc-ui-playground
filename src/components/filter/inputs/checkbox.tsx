import clsx from 'clsx';

type FilterCheckboxProps = {
  checked: boolean;
  /** Some, but not all, of this row's descendants are selected. */
  partial?: boolean;
  label: string;
  className?: string;
};

export function FilterCheckbox({
  checked,
  partial = false,
  label,
  className,
}: FilterCheckboxProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className={clsx('filter-checkbox', className, {
          'filter-checkbox-checked': checked,
          'filter-checkbox-partial': !checked && partial,
        })}
      />
      <span
        className={clsx(
          'text-body-md font-regular text-content-primary cursor-pointer text-left',
          className
        )}
      >
        {label}
      </span>
    </>
  );
}

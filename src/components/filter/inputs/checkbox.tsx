import clsx from 'clsx';

type FilterCheckboxProps = {
  checked: boolean;
  label: string;
  className?: string;
};

export function FilterCheckbox({
  checked,
  label,
  className,
}: FilterCheckboxProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className={clsx('filter-checkbox', className, {
          'filter-checkbox-checked': checked,
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

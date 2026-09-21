import clsx from 'clsx';

type FilterRadioProps = {
  checked: boolean;
  label: string;
  className?: string;
};

export function FilterRadio({
  checked,
  label,
  className,
}: FilterRadioProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className={clsx('filter-radio', className, {
          'filter-radio-checked': checked,
        })}
      />
      <span
        className={clsx(
          'text-body-md font-regular text-content-primary cursor-pointer',
          className
        )}
      >
        {label}
      </span>
    </>
  );
}

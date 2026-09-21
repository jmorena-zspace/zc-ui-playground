import { Accordion } from '@components/accordion';
import { ReactNode } from 'react';

type FilterAccordionProps = {
  title: string;
  appliedCount?: number;
  children: ReactNode;
};

export function FilterAccordion({
  title,
  appliedCount,
  children,
}: FilterAccordionProps) {
  return (
    <Accordion className="md:hidden">
      <Accordion.Title
        className="pb-xxs border-b-default border-border-system-subtle text-content-primary text-body-md font-regular"
        arrowPosition="left"
      >
        <span>{title}</span>
        {!!appliedCount && <span> ({appliedCount})</span>}
      </Accordion.Title>
      <Accordion.Content className="flex flex-col gap-sm pt-sm">
        {children}
      </Accordion.Content>
    </Accordion>
  );
}

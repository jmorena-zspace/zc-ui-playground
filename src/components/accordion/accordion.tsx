import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

type AccordionContextValue = {
  isOpen: boolean;
  toggle: () => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      'Accordion compound components must be used within an Accordion component'
    );
  }
  return context;
};

type AccordionProps = PropsWithChildren<{
  defaultOpen?: boolean;
  className?: string;
}>;

type AccordionTitleProps = PropsWithChildren<{
  className?: string | ((isOpen: boolean) => string);
  arrowPosition?: 'left' | 'right';
}>;

type AccordionContentProps = PropsWithChildren<{
  className?: string;
}>;

function Accordion({
  children,
  defaultOpen = false,
  className,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div className={clsx('w-full', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionTitle({
  children,
  className,
  arrowPosition = 'right',
}: AccordionTitleProps) {
  const { isOpen, toggle } = useAccordionContext();

  const accordionClassName =
    typeof className === 'function' ? className(isOpen) : className;

  const arrowIcon = (
    <ChevronDown className={clsx(
        'transition-transform duration-300 ease-out text-content-primary',
        {
          'rotate-180': isOpen,
        }
      )} />
  );

  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(
        'flex w-full items-center gap-xs cursor-pointer',
        accordionClassName
      )}
      aria-expanded={isOpen}
    >
      {arrowPosition === 'left' && arrowIcon}
      {children}
      {arrowPosition === 'right' && arrowIcon}
    </button>
  );
}

function AccordionContent({ children, className }: AccordionContentProps) {
  const { isOpen } = useAccordionContext();

  return (
    <div
      className={clsx('grid transition-all duration-300 ease-out', {
        'grid-rows-[1fr] opacity-100 visible': isOpen,
        'grid-rows-[0fr] opacity-0 invisible': !isOpen,
      })}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="overflow-hidden">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

Accordion.Title = AccordionTitle;
Accordion.Content = AccordionContent;

export { Accordion };
